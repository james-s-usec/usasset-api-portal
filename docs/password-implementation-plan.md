# Password Authentication Implementation Plan

## Overview
The backend currently has a critical security vulnerability: it accepts ANY password for JWT authentication because the User model lacks a password field and the verification logic is commented out. This plan addresses implementing proper password authentication.

## Current State Analysis (Based on Actual Codebase)

### Issues Identified
1. **No password field** in User model (`prisma/schema.prisma` lines 10-21)
2. **Commented-out password verification** in auth service (`src/auth/auth.service.ts` lines 94-98)
3. **Any password accepted** during JWT login
4. **CreateUserDto missing password field** (`src/users/dto/create-user.dto.ts`)
5. **Seed scripts don't include passwords** (`prisma/seed.ts`)

### Good News - Already Available
- ✅ **bcrypt is already installed** (package.json lines 78, 82)
- ✅ **Comprehensive RBAC system** already implemented
- ✅ **JWT infrastructure** working properly
- ✅ **Azure AD authentication** working and unaffected
- ✅ **API key authentication** working and unaffected

### Files Requiring Changes
- `prisma/schema.prisma` - Add password field to User model
- `src/auth/auth.service.ts` - Uncomment and implement password verification
- `src/users/dto/create-user.dto.ts` - Add password field and validation
- `src/users/users.service.ts` - Add password hashing to user creation
- `prisma/seed.ts` - Add password hashing to seed data
- Migration files - Database schema changes

## Implementation Steps

### Phase 1: Database Schema & Migration

#### 1.1 Update Prisma Schema
**File**: `prisma/schema.prisma` (lines 10-21)

**Current**:
```prisma
model User {
  id        String            @id @default(uuid())
  email     String            @unique
  name      String
  createdAt DateTime          @default(now())
  projects  Project[]
  userRoles UserProjectRole[]
  
  // Audit log relations
  auditLogsAsUser     RoleAuditLog[] @relation("AuditLogUser")
  auditLogsAsPerformer RoleAuditLog[] @relation("AuditLogPerformedBy")
}
```

**Updated**:
```prisma
model User {
  id        String            @id @default(uuid())
  email     String            @unique
  name      String
  password  String            // NEW: Add password field
  createdAt DateTime          @default(now())
  updatedAt DateTime          @updatedAt // NEW: Add updatedAt for better tracking
  projects  Project[]
  userRoles UserProjectRole[]
  
  // Audit log relations
  auditLogsAsUser     RoleAuditLog[] @relation("AuditLogUser")
  auditLogsAsPerformer RoleAuditLog[] @relation("AuditLogPerformedBy")
}
```

#### 1.2 Create Migration (Proper Non-Interactive SOP)

**Step 1: Create Migration in Development (Interactive) Environment**
On your local development machine where interactive prompts work:
```bash
# Update schema.prisma first, then create migration
npx prisma migrate dev --name add-user-password-field
```

**Step 2: Handle Data Loss Warning Interactively**
When prompted about potential data loss, review and accept if safe. This creates the migration files in `prisma/migrations/`.

**Step 3: Customize Migration SQL for Existing Users**
Edit the generated migration file `prisma/migrations/[timestamp]_add_user_password_field/migration.sql`:
```sql
-- CreateTable or AlterTable statements (auto-generated)
ALTER TABLE "User" ADD COLUMN "password" TEXT;
ALTER TABLE "User" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CUSTOM: Set temporary password for existing users 
-- Bcrypt hash of "ChangeMe123!" with salt rounds 12
UPDATE "User" SET "password" = '$2b$12$LnP8E9qQu8FrGhHrTzFz6Ok3yU7NpQ9cKxV2MhJfEqNrSz5BvCd8m' WHERE "password" IS NULL;

-- CUSTOM: Make password column NOT NULL after setting defaults
ALTER TABLE "User" ALTER COLUMN "password" SET NOT NULL;
```

**Step 4: Deploy to Non-Interactive Environments**
For testing, staging, and production (CI/CD environments):
```bash
# This command works in non-interactive environments
npx prisma migrate deploy
```

**Step 5: Verify Migration Applied**
```bash
# Check migration status
npx prisma migrate status
```

#### 1.3 Proper Non-Interactive Migration Workflow
According to Prisma best practices:

1. **Development**: Use `npx prisma migrate dev` (interactive) to create migration files
2. **CI/CD/Production**: Use `npx prisma migrate deploy` (non-interactive) to apply migrations
3. **Migration files** are committed to source control and deployed automatically
4. **Never use** `prisma migrate dev` in CI/CD - it's designed for interactive development only
5. **Safety**: `prisma migrate deploy` has advisory locking to prevent concurrent migrations

### Phase 2: Password Hashing Infrastructure

#### 2.1 Install Dependencies
```bash
npm install bcrypt
npm install --save-dev @types/bcrypt
```

#### 2.2 Create Password Utility Service
**File**: `src/common/utils/password.util.ts`
```typescript
import * as bcrypt from 'bcrypt';

export class PasswordUtil {
  private static readonly SALT_ROUNDS = 12;

  static async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  static async verify(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  static validatePassword(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    return { valid: errors.length === 0, errors };
  }
}
```

### Phase 3: Update Authentication Service

#### 3.1 Update Auth Service
**File**: `src/auth/auth.service.ts` (lines 70-118)

**Current broken code** (lines 94-98):
```typescript
// Note: In production, verify password with bcrypt
// const isPasswordValid = await bcrypt.compare(password, user.password);
// if (!isPasswordValid) {
//   throw new UnauthorizedException('Invalid credentials');
// }
```

**Step 1: Add bcrypt import** (add to top of file after existing imports):
```typescript
import * as bcrypt from 'bcrypt';
```

**Step 2: Replace lines 94-98** with actual password verification:
```typescript
// CRITICAL SECURITY FIX: Verify password with bcrypt
if (!user.password) {
  throw new UnauthorizedException('Invalid credentials');
}

const isPasswordValid = await bcrypt.compare(password, user.password);
if (!isPasswordValid) {
  throw new UnauthorizedException('Invalid credentials');
}
```

**Complete Updated login Method** (lines 70-118):
```typescript
async login(
  email: string, 
  password: string, 
  projectId: string
): Promise<TokenPair> {
  try {
    // Validate inputs
    if (!email || !password || !projectId) {
      throw new BadRequestException('Email, password, and projectId are required');
    }

    if (!isUUID(projectId)) {
      throw new BadRequestException('Invalid projectId format');
    }

    // Find user
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // CRITICAL SECURITY FIX: Verify password with bcrypt
    if (!user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate token for the project (existing logic)
    return await this.generateToken(user.id, projectId);

  } catch (error) {
    this.logger.error({
      msg: 'Login failed',
      email,
      projectId,
      error: error instanceof Error ? error.message : String(error),
    });

    if (error instanceof BadRequestException ||
        error instanceof UnauthorizedException) {
      throw error;
    }

    throw new UnauthorizedException('Authentication failed');
  }
}
```

#### 3.2 Update DTOs
**File**: `src/modules/auth/dto/login.dto.ts`
```typescript
import { IsEmail, IsString, MinLength, Matches } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @IsString({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @IsOptional()
  @IsUUID('4', { message: 'Project ID must be a valid UUID' })
  projectId?: string;
}
```

### Phase 4: Update User Management

#### 4.1 Update CreateUserDto
**File**: `src/users/dto/create-user.dto.ts` (currently lines 4-14)

**Current**:
```typescript
export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  name!: string;
}
```

**Updated**:
```typescript
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ 
    example: 'SecurePass123!',
    description: 'Password must be at least 8 characters with uppercase, lowercase, and number'
  })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
  })
  password!: string;
}
```

#### 4.2 Update Users Service
**File**: `src/users/users.service.ts` 

**Step 1: Add bcrypt import** (add to top after existing imports):
```typescript
import * as bcrypt from 'bcrypt';
```

**Step 2: Update create method** (currently lines 37-46):

**Current**:
```typescript
async create(createUserDto: CreateUserDto): Promise<User> {
  this.logger.info({ email: createUserDto.email }, 'Creating new user');
  
  const existingUser = await this.usersRepository.findByEmail(createUserDto.email);
  if (existingUser) {
    throw new ConflictException('User with this email already exists');
  }
  
  return this.usersRepository.create(createUserDto);
}
```

**Updated**:
```typescript
async create(createUserDto: CreateUserDto): Promise<User> {
  this.logger.info({ email: createUserDto.email }, 'Creating new user');
  
  const existingUser = await this.usersRepository.findByEmail(createUserDto.email);
  if (existingUser) {
    throw new ConflictException('User with this email already exists');
  }
  
  // Hash password before storing
  const saltRounds = 12;
  const hashedPassword = await bcrypt.hash(createUserDto.password, saltRounds);
  
  return this.usersRepository.create({
    ...createUserDto,
    password: hashedPassword
  });
}
```

#### 4.3 Update Users Repository
**File**: `src/users/users.repository.ts`

The repository's create method should handle the hashed password from the service. No changes needed if it just passes data through to Prisma.

### Phase 5: Update Seed Data

#### 5.1 Update Seed Script
**File**: `prisma/seed.ts` (currently lines 32-39)

**Step 1: Add bcrypt import** (add to top after existing imports):
```typescript
import * as bcrypt from 'bcrypt';
```

**Step 2: Update seedBasicData function** (currently lines 28-56):

**Current**:
```typescript
async function seedBasicData(): Promise<void> {
  console.log('🌱 Seeding basic data...');
  
  // Create a demo user if not exists
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {}, // Don't update if exists
    create: {
      email: 'demo@example.com',
      name: 'Demo User',
    },
  });
  
  // ... rest of function
}
```

**Updated**:
```typescript
async function seedBasicData(): Promise<void> {
  console.log('🌱 Seeding basic data...');
  
  // Hash default password for demo users
  const defaultPassword = await bcrypt.hash('ChangeMe123!', 12);
  
  // Create a demo user if not exists
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {}, // Don't update if exists
    create: {
      email: 'demo@example.com',
      name: 'Demo User',
      password: defaultPassword,
    },
  });
  
  // Create additional demo users with proper passwords
  const additionalUsers = [
    {
      email: 'admin@example.com',
      name: 'System Administrator',
      password: defaultPassword
    },
    {
      email: 'manager@example.com', 
      name: 'Project Manager',
      password: defaultPassword
    },
    {
      email: 'engineer@example.com',
      name: 'Project Engineer', 
      password: defaultPassword
    },
    {
      email: 'viewer@example.com',
      name: 'Project Viewer',
      password: defaultPassword
    }
  ];

  for (const userData of additionalUsers) {
    await prisma.user.upsert({
      where: { email: userData.email },
      update: {}, // Don't update existing users to preserve their passwords
      create: userData
    });
  }
  
  // ... continue with existing project creation logic
}
```

**Step 3: Update console output** to warn about default passwords:
```typescript
console.log('✅ Basic data seeded:', { 
  user: demoUser.email, 
  project: project.name,
  note: 'All demo users created with password: ChangeMe123!' 
});
```

### Phase 6: Migration Strategy for Existing Users

#### 6.1 Data Migration Script
**File**: `scripts/migrate-user-passwords.ts`
```typescript
import { PrismaClient } from '@prisma/client';
import { PasswordUtil } from '../src/common/utils/password.util';

const prisma = new PrismaClient();

async function migratePasswords() {
  const tempPassword = await PasswordUtil.hash('ChangeMe123!');
  
  // Update all existing users without passwords
  await prisma.user.updateMany({
    where: {
      password: null // or however we identify users without passwords
    },
    data: {
      password: tempPassword
    }
  });
  
  console.log('✅ All existing users have been assigned temporary passwords');
  console.log('🔔 Users should be notified to change their passwords on next login');
}

migratePasswords()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

### Phase 7: Frontend Updates

#### 7.1 Update Login Form Validation
- Add password strength indicators
- Update validation messages
- Add "forgot password" flow (future enhancement)

#### 7.2 Update Test Data
- Update `auth-test-page.html` with valid passwords
- Update any test scripts with correct credentials

### Phase 8: Security Enhancements

#### 8.1 Add Rate Limiting
- Implement login attempt rate limiting
- Add account lockout after failed attempts

#### 8.2 Add Password Reset Flow
- Create password reset endpoints
- Implement secure token-based reset process

## Deployment Strategy

### Development Environment
1. Run migration to add password field
2. Run password migration script for existing users
3. Update seed data with hashed passwords
4. Test login flow with new authentication

### Azure Production Environment
1. **Backup database** before migration
2. Run migration during maintenance window
3. Run password migration script
4. Update environment variables if needed
5. Notify users about password requirements

## Testing & Verification Plan

### API Endpoints Impact Analysis

#### No Changes Required for Endpoints
- **Login endpoint**: `POST /v1/auth/login` - same signature, just fixes validation
- **User creation**: `POST /v1/users` - same endpoint, updated DTO validation
- **Azure AD endpoints**: `POST /v1/auth/azure/*` - completely unchanged
- **All other endpoints**: No changes needed

#### Swagger/OpenAPI Updates
After implementing password changes, regenerate documentation:
```bash
npm run openapi:generate-spec          # Update openapi.json
npm run openapi:generate-client        # Regenerate TypeScript SDK
npm run openapi:generate-postman       # Update Postman collection
```

### Step-by-Step Testing Protocol

#### Phase 1: Basic Verification (After Schema Migration)
```bash
# 1. Verify migration applied
npx prisma migrate status

# 2. Check User table structure
npm run console -- azure:query:test --query 02-table-structures

# 3. Verify demo users have passwords
psql "$DATABASE_URL" -c "SELECT email, length(password) as pw_length FROM \"User\" LIMIT 5;"
```

#### Phase 2: Authentication Testing

**Test 1: API Key Authentication (Should Still Work)**
```bash
# Get API key from environment or Key Vault
API_KEY="test-key-123"  # or from: az keyvault secret show --vault-name usasset-api --name api-key-1 --query value -o tsv

# Test health endpoint (public)
curl -i https://ca-usasset-api.yellowforest-928e9b23.eastus.azurecontainerapps.io/v1/health

# Test protected endpoint with API key
curl -i -H "x-api-key: $API_KEY" \
  https://ca-usasset-api.yellowforest-928e9b23.eastus.azurecontainerapps.io/v1/users
```

**Test 2: JWT Authentication (The Critical Fix)**
```bash
# Test with correct password (should work)
curl -X POST https://ca-usasset-api.yellowforest-928e9b23.eastus.azurecontainerapps.io/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@example.com",
    "password": "ChangeMe123!",
    "projectId": "335395d6-b489-4a32-bda2-aecfe7726d8f"
  }'

# Test with wrong password (should fail)  
curl -X POST https://ca-usasset-api.yellowforest-928e9b23.eastus.azurecontainerapps.io/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@example.com", 
    "password": "wrongpassword",
    "projectId": "335395d6-b489-4a32-bda2-aecfe7726d8f"
  }'

# Test with ANY random password (should fail - this currently passes!)
curl -X POST https://ca-usasset-api.yellowforest-928e9b23.eastus.azurecontainerapps.io/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@example.com",
    "password": "literally-anything",
    "projectId": "335395d6-b489-4a32-bda2-aecfe7726d8f"
  }'
```

**Test 3: User Creation with Password Validation**
```bash
# Test valid password (should work)
curl -X POST https://ca-usasset-api.yellowforest-928e9b23.eastus.azurecontainerapps.io/v1/users \
  -H "Content-Type: application/json" \
  -H "x-api-key: $API_KEY" \
  -d '{
    "email": "newuser@example.com",
    "name": "New User",
    "password": "SecurePass123!"
  }'

# Test weak password (should fail)
curl -X POST https://ca-usasset-api.yellowforest-828e9b23.eastus.azurecontainerapps.io/v1/users \
  -H "Content-Type: application/json" \
  -H "x-api-key: $API_KEY" \
  -d '{
    "email": "newuser2@example.com",
    "name": "New User 2", 
    "password": "weak"
  }'
```

**Test 4: Azure AD (Should Be Unchanged)**
```bash
# Azure AD should work exactly as before
# Test the auth callback endpoint manually through browser flow
```

#### Phase 3: Frontend Portal Testing

**Update Frontend Test Page**
The existing `auth-test-page.html` needs password updates:
```html
<!-- Update JWT test section with correct password -->
<input type="password" id="jwtPassword" value="ChangeMe123!" placeholder="Password">
```

**Frontend Integration Testing**
1. Test login form with correct/incorrect passwords
2. Verify error messages show properly
3. Test user registration form validation
4. Ensure Azure AD flow still works

#### Phase 4: Automated Testing

**Update Newman/Postman Tests**
After regenerating Postman collection:
```bash
# Update environment with correct passwords
# Edit collections/postman-environment.json
{
  "demoPassword": "ChangeMe123!",
  "validPassword": "SecurePass123!"
}

# Run automated API tests
npm run test:newman:report
```

**CLI Command Testing**
```bash
# Test user creation via CLI
npm run console -- users:create --email "clitest@example.com" --name "CLI Test User" 

# Test role assignment
npm run console -- rbac:assign --user "clitest@example.com" --project "demo-project-id" --role "viewer"

# Test permission checking  
npm run console -- rbac:check --user-email "clitest@example.com" --project-id "demo-project-id" --permission "view:project"
```

### Expected Results

#### Before Fix (Current Broken State)
```bash
# This currently WORKS but shouldn't:
curl -X POST .../v1/auth/login -d '{"email":"demo@example.com","password":"ANY_RANDOM_STRING","projectId":"..."}'
# Returns: 200 OK with valid JWT token
```

#### After Fix (Secure State)  
```bash
# Correct password - should work:
curl -X POST .../v1/auth/login -d '{"email":"demo@example.com","password":"ChangeMe123!","projectId":"..."}'
# Returns: 200 OK with valid JWT token

# Wrong password - should fail:
curl -X POST .../v1/auth/login -d '{"email":"demo@example.com","password":"wrongpassword","projectId":"..."}'  
# Returns: 401 Unauthorized {"message":"Invalid credentials"}
```

### Verification Checklist

#### ✅ Security Verification
- [ ] Wrong passwords return 401 Unauthorized
- [ ] Correct passwords return valid JWT tokens  
- [ ] Password hashes stored in database (never plaintext)
- [ ] User creation requires strong passwords
- [ ] API key authentication still works
- [ ] Azure AD authentication still works

#### ✅ Functional Verification  
- [ ] JWT tokens work for protected endpoints
- [ ] User registration with password validation works
- [ ] Existing users can login with temporary password
- [ ] CLI commands work with new user creation
- [ ] Swagger documentation reflects password requirements

#### ✅ Data Integrity
- [ ] All existing users have password hashes  
- [ ] No plaintext passwords in database
- [ ] Migration completed without data loss
- [ ] RBAC permissions unchanged

### Rollback Testing Plan

If issues are found:
```bash
# 1. Check what can be rolled back safely
npx prisma migrate status

# 2. If needed, rollback to previous migration
# (Requires manual intervention - backup/restore database)

# 3. Verify rollback worked
curl -X POST .../v1/auth/login -d '{"email":"demo@example.com","password":"any","projectId":"..."}'
# Should work again if rolled back
```

### Performance Impact Testing

```bash
# Test login performance with bcrypt hashing
time curl -X POST .../v1/auth/login -d '{...}'

# Should be under 200ms for bcrypt with 12 salt rounds
# If too slow, consider reducing salt rounds to 10
```

## Security Considerations

### Password Storage
- ✅ Use bcrypt with salt rounds = 12
- ✅ Never store plaintext passwords
- ✅ Validate password strength

### Authentication Flow
- ✅ Proper error messages without revealing user existence
- ✅ Rate limiting on login attempts
- ✅ Secure session management

### Migration Safety
- ✅ Backup before migration
- ✅ Rollback plan if issues occur
- ✅ Temporary passwords for existing users

## Implementation Timeline

### Phase 1-2: Schema & Infrastructure (1-2 hours)
- Database migration
- Password utilities
- Dependency installation

### Phase 3-4: Authentication Logic (2-3 hours)
- Update auth service
- Update user management
- DTO validation

### Phase 5-6: Data Migration (1-2 hours)
- Seed script updates
- Existing user migration
- Testing

### Phase 7-8: Frontend & Security (2-3 hours)
- Frontend validation updates
- Security enhancements
- Comprehensive testing

**Total Estimated Time: 6-10 hours**

## Risk Mitigation

### High Priority Risks
1. **Breaking existing Azure AD authentication** → Test Azure AD flow thoroughly
2. **Data loss during migration** → Mandatory database backup
3. **Locking out existing users** → Provide temporary passwords and communication plan

### Rollback Plan
1. Revert database migration if major issues
2. Temporarily disable password validation if needed
3. Communication plan for affected users

## Success Criteria

### Functional Requirements
- ✅ JWT authentication requires valid password
- ✅ Password hashing works correctly
- ✅ All existing auth methods continue working
- ✅ User registration includes password validation

### Security Requirements
- ✅ No plaintext passwords in database
- ✅ Strong password requirements enforced
- ✅ Proper error handling for invalid credentials
- ✅ Rate limiting prevents brute force attacks

### Operational Requirements
- ✅ Existing users can login with temporary passwords
- ✅ New users must set strong passwords
- ✅ Database migration completes successfully
- ✅ No service downtime during deployment