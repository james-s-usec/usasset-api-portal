# Azure AD Authentication Fix - Detailed Technical Steps

## Current Problem
The Azure AD login flow requires a project ID to generate a JWT token with permissions, but:
1. Users don't have a project selected when they first log in
2. The default project ID `00000000-0000-0000-0000-000000000000` doesn't exist in the database
3. We're currently hardcoding a project ID which is not a sustainable solution

## Root Cause Analysis
```typescript
// Current flow in auth.service.ts (backend)
async loginWithAzureAdCallback(authCode, redirectUri, projectId?, codeVerifier?) {
  const effectiveProjectId = projectId || '00000000-0000-0000-0000-000000000000';
  // This default UUID doesn't exist, causing no permissions to be loaded
  // JWT token gets created with empty permissions array
  // Profile endpoint fails because user has no permissions
}
```

## Solution Architecture

### Option 1: Two-Stage Authentication (Recommended)
1. **Stage 1**: Azure AD login returns a "session token" without project context
2. **Stage 2**: User selects project, exchanges session token for project-scoped JWT

### Option 2: Default Project Assignment
1. Auto-assign users to a default project on first login
2. Allow project switching after authentication

### Option 3: Project-less Authentication
1. Modify backend to support authentication without project context
2. Only require project ID for project-specific operations

## Detailed Implementation Steps

### Backend Changes (usasset-api-service)

#### 1. Create Session Token Service
```typescript
// src/auth/session-token.service.ts
@Injectable()
export class SessionTokenService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private redisService: RedisService // for session storage
  ) {}

  async createSessionToken(userId: string, email: string): Promise<string> {
    const sessionId = uuidv4();
    const payload = {
      sessionId,
      userId,
      email,
      type: 'session',
      exp: Math.floor(Date.now() / 1000) + (15 * 60) // 15 min expiry
    };
    
    // Store session in Redis
    await this.redisService.set(
      `session:${sessionId}`,
      JSON.stringify({ userId, email }),
      15 * 60 // TTL
    );
    
    return this.jwtService.sign(payload);
  }

  async validateSessionToken(token: string): Promise<SessionPayload> {
    const payload = this.jwtService.verify(token);
    if (payload.type !== 'session') {
      throw new UnauthorizedException('Invalid token type');
    }
    
    const session = await this.redisService.get(`session:${payload.sessionId}`);
    if (!session) {
      throw new UnauthorizedException('Session expired');
    }
    
    return payload;
  }
}
```

#### 2. Modify Auth Controller
```typescript
// src/auth/auth.controller.ts

@Post('azure/callback')
async azureCallback(@Body() dto: AzureCallbackDto) {
  // Exchange code for tokens
  const tokens = await this.authService.exchangeCodeForTokens(dto.code, dto.redirectUri);
  const userInfo = this.authService.extractUserInfoFromIdToken(tokens.id_token);
  const user = await this.usersService.findOrCreateByEmail(userInfo.email, userInfo.name);
  
  // Return session token instead of project-scoped JWT
  const sessionToken = await this.sessionTokenService.createSessionToken(user.id, user.email);
  
  return {
    sessionToken,
    requiresProjectSelection: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name
    }
  };
}

@Post('select-project')
@UseGuards(SessionTokenGuard) // New guard for session tokens
async selectProject(
  @CurrentUser() session: SessionPayload,
  @Body() dto: SelectProjectDto
) {
  // Verify user has access to project
  const hasAccess = await this.roleService.userHasProjectAccess(session.userId, dto.projectId);
  if (!hasAccess) {
    throw new ForbiddenException('No access to project');
  }
  
  // Generate project-scoped JWT
  const accessToken = await this.authService.generateToken(session.userId, dto.projectId);
  
  // Invalidate session token
  await this.redisService.del(`session:${session.sessionId}`);
  
  return { accessToken };
}

@Get('user-projects')
@UseGuards(SessionTokenGuard)
async getUserProjects(@CurrentUser() session: SessionPayload) {
  return this.projectService.findUserProjects(session.userId);
}
```

#### 3. Create Session Token Guard
```typescript
// src/auth/guards/session-token.guard.ts
@Injectable()
export class SessionTokenGuard implements CanActivate {
  constructor(private sessionTokenService: SessionTokenService) {}
  
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    
    if (!token) {
      throw new UnauthorizedException('Session token required');
    }
    
    try {
      const payload = await this.sessionTokenService.validateSessionToken(token);
      request.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid session token');
    }
  }
}
```

#### 4. Update FlexibleAuthGuard
```typescript
// src/auth/guards/flexible-auth.guard.ts
// Add support for session tokens in the auth flow
async canActivate(context: ExecutionContext): Promise<boolean> {
  const request = context.switchToHttp().getRequest();
  const authHeader = request.headers.authorization;
  
  // Check for session token first
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    try {
      const decoded = this.jwtService.decode(token);
      if (decoded?.type === 'session') {
        // This is a session token, only allow specific endpoints
        const allowedPaths = ['/auth/user-projects', '/auth/select-project'];
        if (!allowedPaths.includes(request.path)) {
          throw new UnauthorizedException('Session token not valid for this endpoint');
        }
        return true;
      }
    } catch {}
  }
  
  // Continue with existing auth logic...
}
```

### Frontend Changes (usasset-api-portal)

#### 1. Create Project Selection Component
```typescript
// src/components/ProjectSelector.tsx
import { useState, useEffect } from 'react';
import { authApi } from '../services/api-client';

interface Project {
  id: string;
  name: string;
  role: string;
}

interface ProjectSelectorProps {
  sessionToken: string;
  onProjectSelected: (accessToken: string) => Promise<void>;
}

export function ProjectSelector({ sessionToken, onProjectSelected }: ProjectSelectorProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<string>('');
  
  useEffect(() => {
    fetchUserProjects();
  }, []);
  
  const fetchUserProjects = async () => {
    try {
      // Configure API client to use session token
      const response = await authApi.authControllerGetUserProjects({
        headers: {
          Authorization: `Bearer ${sessionToken}`
        }
      });
      setProjects(response.data.data || []);
      
      // Auto-select if only one project
      if (response.data.data?.length === 1) {
        setSelectedProject(response.data.data[0].id);
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSelectProject = async () => {
    if (!selectedProject) return;
    
    try {
      const response = await authApi.authControllerSelectProject({
        projectId: selectedProject
      }, {
        headers: {
          Authorization: `Bearer ${sessionToken}`
        }
      });
      
      if (response.data.data?.accessToken) {
        await onProjectSelected(response.data.data.accessToken);
      }
    } catch (error) {
      console.error('Failed to select project:', error);
    }
  };
  
  if (loading) {
    return <div>Loading your projects...</div>;
  }
  
  if (projects.length === 0) {
    return (
      <div>
        <h3>No Projects Found</h3>
        <p>You don't have access to any projects. Please contact an administrator.</p>
      </div>
    );
  }
  
  return (
    <div style={{ 
      maxWidth: '400px', 
      margin: '50px auto', 
      padding: '20px',
      border: '1px solid #ddd',
      borderRadius: '8px'
    }}>
      <h2>Select a Project</h2>
      <p>Choose which project you want to work with:</p>
      
      <select 
        value={selectedProject} 
        onChange={(e) => setSelectedProject(e.target.value)}
        style={{ 
          width: '100%', 
          padding: '10px', 
          marginBottom: '20px',
          fontSize: '16px'
        }}
      >
        <option value="">-- Select a Project --</option>
        {projects.map(project => (
          <option key={project.id} value={project.id}>
            {project.name} ({project.role})
          </option>
        ))}
      </select>
      
      <button 
        onClick={handleSelectProject}
        disabled={!selectedProject}
        style={{
          width: '100%',
          padding: '10px',
          backgroundColor: selectedProject ? '#007bff' : '#ccc',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          fontSize: '16px',
          cursor: selectedProject ? 'pointer' : 'not-allowed'
        }}
      >
        Continue
      </button>
    </div>
  );
}
```

#### 2. Update Azure AD Callback
```typescript
// src/components/AzureADCallback.tsx
export const AzureADCallback = ({ onLoginSuccess }: AzureADCallbackProps): React.JSX.Element => {
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(true);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [requiresProjectSelection, setRequiresProjectSelection] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async (): Promise<void> => {
      try {
        // ... existing code to get auth code ...
        
        const apiResponse = await authApi.authControllerAzureCallback({
          code: authCode,
          redirectUri: import.meta.env.VITE_AZURE_AD_REDIRECT_URI || `${window.location.origin}/auth/callback`
          // NO projectId - backend will return session token
        });

        if (apiResponse.data.data?.requiresProjectSelection) {
          // Store session token and show project selector
          setSessionToken(apiResponse.data.data.sessionToken);
          setRequiresProjectSelection(true);
          setProcessing(false);
        } else if (apiResponse.data.data?.accessToken) {
          // Backward compatibility - if backend returns access token directly
          await onLoginSuccess(apiResponse.data.data.accessToken);
          navigate('/');
        }
      } catch (error: any) {
        // ... error handling ...
      }
    };

    handleCallback();
  }, [onLoginSuccess, navigate]);
  
  const handleProjectSelected = async (accessToken: string) => {
    await onLoginSuccess(accessToken);
    navigate('/');
  };
  
  if (requiresProjectSelection && sessionToken) {
    return (
      <ProjectSelector 
        sessionToken={sessionToken} 
        onProjectSelected={handleProjectSelected}
      />
    );
  }
  
  // ... existing loading/error UI ...
};
```

#### 3. Add Project Switcher for Authenticated Users
```typescript
// src/components/ProjectSwitcher.tsx
import { useState } from 'react';
import { authApi, clearAuth } from '../services/api-client';

interface ProjectSwitcherProps {
  currentProjectId: string;
  currentProjectName: string;
  onProjectSwitch: () => void;
}

export function ProjectSwitcher({ 
  currentProjectId, 
  currentProjectName, 
  onProjectSwitch 
}: ProjectSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  
  const handleSwitchProject = async (projectId: string) => {
    try {
      // Clear current auth
      clearAuth();
      
      // Get new token for selected project
      // This would require a new endpoint that allows project switching
      const response = await authApi.authControllerSwitchProject({
        projectId
      });
      
      if (response.data.data?.accessToken) {
        localStorage.setItem('authToken', response.data.data.accessToken);
        onProjectSwitch();
      }
    } catch (error) {
      console.error('Failed to switch project:', error);
    }
  };
  
  // ... UI implementation ...
}
```

### Database Changes

#### 1. Create Default Project (Option 2)
```sql
-- Create a default project for new users
INSERT INTO "Project" (id, name, "createdAt", "updatedAt", "deletedAt")
VALUES ('00000000-0000-0000-0000-000000000001', 'Default Project', NOW(), NOW(), NULL);

-- Update backend to use this ID instead of all zeros
```

#### 2. Add Session Storage (Redis)
```yaml
# docker-compose.yml
services:
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
```

### Testing Strategy

1. **Unit Tests**
   - Test session token creation/validation
   - Test project selection logic
   - Test guard behavior with different token types

2. **Integration Tests**
   ```typescript
   // Test the full flow
   it('should complete Azure AD login with project selection', async () => {
     // 1. Call Azure callback
     const { sessionToken } = await authApi.azureCallback({ code: 'test' });
     
     // 2. Get user projects with session token
     const projects = await authApi.getUserProjects(sessionToken);
     expect(projects).toHaveLength(1);
     
     // 3. Select project
     const { accessToken } = await authApi.selectProject({
       projectId: projects[0].id,
       sessionToken
     });
     
     // 4. Verify can access protected endpoints
     const profile = await authApi.getProfile(accessToken);
     expect(profile.permissions).not.toBeEmpty();
   });
   ```

3. **Manual Testing Checklist**
   - [ ] Azure AD login redirects correctly
   - [ ] Session token is returned without project
   - [ ] Project list loads for user
   - [ ] Can select project and get access token
   - [ ] Access token has correct permissions
   - [ ] Can access protected endpoints
   - [ ] Project switcher works for authenticated users
   - [ ] Session tokens expire after 15 minutes
   - [ ] Cannot reuse session token after project selection

### Rollback Plan
If issues arise:
1. Revert to hardcoded project ID temporarily
2. Deploy hotfix with known working project ID
3. Implement proper fix in next release

### Environment Variables Needed
```bash
# Backend (.env)
REDIS_URL=redis://localhost:6379
SESSION_TOKEN_SECRET=different-from-jwt-secret
SESSION_TOKEN_EXPIRY=15m

# Frontend (.env)
VITE_ENABLE_PROJECT_SELECTION=true
```

### Migration Path
1. Deploy backend changes with backward compatibility
2. Deploy frontend with feature flag
3. Test with select users
4. Enable for all users
5. Remove backward compatibility code

## Alternative Quick Fix (Temporary)
If you need a quick fix while implementing the proper solution:

```typescript
// In backend auth.service.ts
async loginWithAzureAdCallback(...) {
  // Quick fix: Find any project the user has access to
  const userProjects = await this.projectService.findUserProjects(user.id);
  const effectiveProjectId = projectId || userProjects[0]?.id || await this.createDefaultProject(user.id);
  
  // Continue with existing logic...
}

private async createDefaultProject(userId: string): Promise<string> {
  // Auto-create a personal project for the user
  const project = await this.projectService.create({
    name: `Personal Project`,
    ownerId: userId
  });
  
  // Assign user as project admin
  await this.roleService.assignRole({
    userId,
    projectId: project.id,
    roleId: 'project_admin'
  });
  
  return project.id;
}
```

This ensures every user has at least one project they can access.