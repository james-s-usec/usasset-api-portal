# Password Authentication Implementation - Phase Plan

## Overview
This document breaks down the password authentication implementation into logical phases, separating service (backend) and portal (frontend) work. Each phase includes specific instructions, testing steps, and deliverables.

---

## 🏗️ PHASE 1: Service Database Schema Migration
**Duration:** 1-2 hours  
**Target:** Backend service only  
**Goal:** Add password field to database without breaking existing functionality

### Phase 1A: Development Environment Schema Update

#### Instructions (Local Development)
1. **Update Prisma Schema**
   ```bash
   cd /home/swansonj/projects/usasset-api-service
   ```
   
   Edit `prisma/schema.prisma` lines 10-21:
   ```prisma
   model User {
     id        String            @id @default(uuid())
     email     String            @unique
     name      String
     password  String            // NEW: Add this line
     createdAt DateTime          @default(now())
     updatedAt DateTime          @updatedAt // NEW: Add this line
     projects  Project[]
     userRoles UserProjectRole[]
     
     // Audit log relations
     auditLogsAsUser     RoleAuditLog[] @relation("AuditLogUser")
     auditLogsAsPerformer RoleAuditLog[] @relation("AuditLogPerformedBy")
   }
   ```

2. **Create Migration Interactively**
   ```bash
   # This only works in interactive environment (local dev)
   npx prisma migrate dev --name add-user-password-field
   ```

3. **Customize Migration SQL**
   Edit the generated file `prisma/migrations/[timestamp]_add_user_password_field/migration.sql`:
   ```sql
   -- Auto-generated ALTER statements
   ALTER TABLE "User" ADD COLUMN "password" TEXT;
   ALTER TABLE "User" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

   -- CUSTOM: Set temporary password for existing users 
   -- Bcrypt hash of "ChangeMe123!" with salt rounds 12
   UPDATE "User" SET "password" = '$2b$12$LnP8E9qQu8FrGhHrTzFz6Ok3yU7NpQ9cKxV2MhJfEqNrSz5BvCd8m' WHERE "password" IS NULL;

   -- CUSTOM: Make password column NOT NULL after setting defaults
   ALTER TABLE "User" ALTER COLUMN "password" SET NOT NULL;
   ```

4. **Test Migration Locally**
   ```bash
   # Migration should already be applied from step 2
   npx prisma migrate status
   
   # Verify User table structure
   npm run console -- azure:query:test --query 02-table-structures
   ```

#### Deliverables
- [ ] Updated `prisma/schema.prisma` with password field
- [ ] Migration file with custom password seeding
- [ ] Local database successfully migrated
- [ ] Existing users have temporary password hashes

### Phase 1B: Production Environment Deployment

#### Instructions (Azure/Production)
1. **Commit Migration Files**
   ```bash
   git add prisma/schema.prisma
   git add prisma/migrations/
   git commit -m "feat: Add password field to User model with migration"
   git push
   ```

2. **Deploy to Azure Container Apps**
   ```bash
   ./scripts/azure/azure-deploy-cli.sh update
   ```

3. **Apply Migration in Production**
   ```bash
   # This runs automatically during container startup
   # Or manually via:
   az containerapp exec -n ca-usasset-api -g usasset-demo -- npx prisma migrate deploy
   ```

4. **Verify Production Migration**
   ```bash
   # Check migration status
   npm run console -- azure:verify --show-users
   
   # Verify password hashes exist
   CONNECTION_STRING=$(az keyvault secret show --vault-name usasset-api --name database-connection-string --query value -o tsv)
   psql "$CONNECTION_STRING" -c "SELECT email, length(password) as pw_length FROM \"User\" LIMIT 5;"
   ```

#### Success Criteria
- [ ] Migration applied successfully in production
- [ ] All existing users have password hashes (length = 60)
- [ ] No data loss occurred
- [ ] API still responds to existing endpoints

---

## 🔐 PHASE 2: Service Authentication Logic Implementation
**Duration:** 2-3 hours  
**Target:** Backend service only  
**Goal:** Fix password verification and user creation

### Phase 2A: Update Authentication Service

#### Instructions
1. **Update Auth Service**
   Edit `src/auth/auth.service.ts`:
   
   **Add bcrypt import** (line 17):
   ```typescript
   import * as bcrypt from 'bcrypt';
   ```
   
   **Replace lines 94-98** with:
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

2. **Update User DTO**
   Edit `src/users/dto/create-user.dto.ts`:
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

3. **Update Users Service**
   Edit `src/users/users.service.ts`:
   
   **Add bcrypt import**:
   ```typescript
   import * as bcrypt from 'bcrypt';
   ```
   
   **Update create method** (lines 37-46):
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

#### Testing Phase 2A
```bash
# Test 1: Verify build succeeds
npm run build

# Test 2: Verify linting passes
npm run lint

# Test 3: Start development server
npm run start:dev

# Test 4: Test login with correct password (should work)
curl -X POST http://localhost:3009/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@example.com",
    "password": "ChangeMe123!",
    "projectId": "335395d6-b489-4a32-bda2-aecfe7726d8f"
  }'

# Test 5: Test login with wrong password (should fail)
curl -X POST http://localhost:3009/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@example.com",
    "password": "wrongpassword",
    "projectId": "335395d6-b489-4a32-bda2-aecfe7726d8f"
  }'
```

#### Deliverables
- [ ] Auth service with proper password verification
- [ ] User DTO with password validation
- [ ] Users service with password hashing
- [ ] Local testing confirms password validation works

### Phase 2B: Update Seed Data

#### Instructions
1. **Update Seed Script**
   Edit `prisma/seed.ts`:
   
   **Add bcrypt import**:
   ```typescript
   import * as bcrypt from 'bcrypt';
   ```
   
   **Update seedBasicData function** (lines 28-56):
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
     
     console.log('✅ Basic data seeded:', { 
       user: demoUser.email, 
       project: project.name,
       note: 'All demo users created with password: ChangeMe123!' 
     });
   }
   ```

2. **Test Seed Script**
   ```bash
   # Run seed script locally
   npm run prisma:seed
   ```

#### Deliverables
- [ ] Updated seed script with password hashing
- [ ] Multiple demo users with proper passwords
- [ ] Seed script runs successfully

---

## 📚 PHASE 3: Service API Documentation Update
**Duration:** 30 minutes  
**Target:** Backend service only  
**Goal:** Update OpenAPI spec and generate new SDK

### Instructions
1. **Regenerate API Documentation**
   ```bash
   # Update OpenAPI spec to reflect password requirements
   npm run openapi:generate-spec
   
   # Regenerate TypeScript client SDK
   npm run openapi:generate-client
   
   # Update Postman collection
   npm run openapi:generate-postman
   ```

2. **Verify Documentation**
   ```bash
   # Start server and check Swagger UI
   npm run start:dev
   # Visit: http://localhost:3009/api
   # Verify: User creation endpoint shows password field
   # Verify: Password validation rules are documented
   ```

3. **Test Generated SDK**
   ```bash
   # Test the generated client
   npm run openapi:client:example
   ```

#### Deliverables
- [ ] Updated `openapi.json` with password requirements
- [ ] Regenerated TypeScript SDK in `api-client/generated/`
- [ ] Updated Postman collection with password fields
- [ ] Swagger UI shows password validation requirements

---

## 🚀 PHASE 4: Service Production Deployment
**Duration:** 1 hour  
**Target:** Backend service only  
**Goal:** Deploy authentication fixes to production

### Instructions
1. **Final Local Testing**
   ```bash
   # Run all tests
   npm run test
   npm run lint
   npm run build:full
   
   # Test authentication flows
   ./test-auth-sequence.js  # Update this script with correct passwords
   ```

2. **Commit and Deploy**
   ```bash
   git add .
   git commit -m "feat: Implement secure password authentication with bcrypt verification

   - Add password verification to auth service
   - Update user creation with password validation
   - Add password hashing to seed data
   - Update API documentation
   
   🔒 SECURITY FIX: JWT authentication now requires valid passwords"
   
   git push
   
   # Deploy to Azure
   ./scripts/azure/azure-deploy-cli.sh update
   ```

3. **Production Verification**
   ```bash
   # Test API key authentication (should still work)
   API_KEY=$(az keyvault secret show --vault-name usasset-api --name api-key-1 --query value -o tsv)
   curl -H "x-api-key: $API_KEY" https://ca-usasset-api.yellowforest-928e9b23.eastus.azurecontainerapps.io/v1/users

   # Test JWT with correct password (should work)
   curl -X POST https://ca-usasset-api.yellowforest-928e9b23.eastus.azurecontainerapps.io/v1/auth/login \
     -H "Content-Type: application/json" \
     -d '{
       "email": "demo@example.com",
       "password": "ChangeMe123!",
       "projectId": "335395d6-b489-4a32-bda2-aecfe7726d8f"
     }'

   # Test JWT with wrong password (should fail)
   curl -X POST https://ca-usasset-api.yellowforest-928e9b23.eastus.azurecontainerapps.io/v1/auth/login \
     -H "Content-Type: application/json" \
     -d '{
       "email": "demo@example.com",
       "password": "wrongpassword",
       "projectId": "335395d6-b489-4a32-bda2-aecfe7726d8f"
     }'

   # Test Azure AD (should still work)
   # Manual browser test of Azure AD flow
   ```

#### Success Criteria
- [ ] Production deployment successful
- [ ] API key authentication still works
- [ ] JWT authentication requires correct passwords
- [ ] Wrong passwords return 401 Unauthorized
- [ ] Azure AD authentication unchanged
- [ ] All existing functionality preserved

---

## 🖥️ PHASE 5: Portal Frontend Updates
**Duration:** 1-2 hours  
**Target:** Frontend portal only  
**Goal:** Update frontend to use new password requirements

### Phase 5A: Update Test Page

#### Instructions
1. **Update Auth Test Page**
   Edit `auth-test-page.html`:
   
   **Update JWT test section**:
   ```html
   <!-- Update password input with correct default -->
   <input type="password" id="jwtPassword" value="ChangeMe123!" placeholder="Enter password">
   ```
   
   **Update test credentials**:
   ```javascript
   // Update demo credentials
   const demoCredentials = {
     email: 'demo@example.com',
     password: 'ChangeMe123!',  // Updated from any random value
     projectId: '335395d6-b489-4a32-bda2-aecfe7726d8f'
   };
   ```

2. **Test Frontend Changes**
   ```bash
   # Open test page in browser
   open auth-test-page.html
   
   # Test all three auth methods:
   # 1. API Key (should work unchanged)
   # 2. JWT with correct password (should work)
   # 3. JWT with wrong password (should fail)
   # 4. Azure AD (should work unchanged)
   ```

#### Deliverables
- [ ] Updated test page with correct default passwords
- [ ] All auth methods work correctly in test page
- [ ] Debug logs show proper request/response

### Phase 5B: Update Login Components

#### Instructions
1. **Update Login Forms**
   Check if any React components need password validation updates:
   
   ```bash
   cd /home/swansonj/projects/usasset-api-portal
   
   # Search for any hardcoded login forms
   grep -r "password" src/components/ src/pages/
   ```

2. **Update API Client Usage**
   If using the generated SDK, update imports:
   ```typescript
   // The regenerated SDK should now include password validation
   import { UsersApi, CreateUserDto } from '../services/api-client';
   
   // User creation now requires password
   const newUser: CreateUserDto = {
     email: 'user@example.com',
     name: 'User Name',
     password: 'SecurePass123!'  // Now required
   };
   ```

3. **Update Environment Variables**
   If needed, update any test credentials in environment files:
   ```bash
   # Update any .env files or test configurations
   # Replace hardcoded test passwords with "ChangeMe123!"
   ```

#### Testing Phase 5B
```bash
# Test portal login functionality
# 1. Start development server
npm run dev

# 2. Navigate to login page
# 3. Test login with correct credentials
# 4. Test login with incorrect credentials
# 5. Verify error messages display properly
```

#### Deliverables
- [ ] Login components work with new password requirements
- [ ] Error messages display for invalid passwords
- [ ] User registration includes password validation
- [ ] API client uses updated SDK

---

## 🧪 PHASE 6: Comprehensive Testing
**Duration:** 1-2 hours  
**Target:** Both service and portal  
**Goal:** End-to-end verification of password authentication

### Phase 6A: Automated Testing

#### Instructions
1. **Update Postman Environment**
   Edit `collections/postman-environment.json`:
   ```json
   {
     "demoPassword": "ChangeMe123!",
     "validPassword": "SecurePass123!",
     "invalidPassword": "wrongpassword"
   }
   ```

2. **Run Automated Tests**
   ```bash
   cd /home/swansonj/projects/usasset-api-service
   
   # Run Newman tests with updated passwords
   npm run test:newman:report
   
   # Check test results
   open collections/newman-report.html
   ```

3. **CLI Command Testing**
   ```bash
   # Test user creation via CLI (may need password option added)
   npm run console -- users:create --email "testuser@example.com" --name "Test User"
   
   # Test authentication flows
   npm run console -- rbac:check --user-email "demo@example.com" --project-id "335395d6-b489-4a32-bda2-aecfe7726d8f" --permission "view:project"
   ```

#### Deliverables
- [ ] Newman tests pass with new password requirements
- [ ] CLI commands work correctly
- [ ] Test reports show all authentication methods functioning

### Phase 6B: Security Verification

#### Instructions
1. **Security Test Suite**
   ```bash
   # Test 1: Verify password hashes in database
   psql "$DATABASE_URL" -c "SELECT email, length(password), substring(password, 1, 7) as hash_prefix FROM \"User\" LIMIT 5;"
   # Should show: length=60, hash_prefix='$2b$12$'
   
   # Test 2: Verify authentication endpoints
   # API Key (should work)
   curl -H "x-api-key: test-key-123" http://localhost:3009/v1/users
   
   # JWT with correct password (should work)
   curl -X POST http://localhost:3009/v1/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"demo@example.com","password":"ChangeMe123!","projectId":"335395d6-b489-4a32-bda2-aecfe7726d8f"}'
   
   # JWT with wrong password (should fail with 401)
   curl -X POST http://localhost:3009/v1/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"demo@example.com","password":"wrongpassword","projectId":"335395d6-b489-4a32-bda2-aecfe7726d8f"}'
   
   # Test 3: User creation with weak password (should fail)
   curl -X POST http://localhost:3009/v1/users \
     -H "Content-Type: application/json" \
     -H "x-api-key: test-key-123" \
     -d '{"email":"weak@example.com","name":"Weak User","password":"123"}'
   ```

2. **Performance Testing**
   ```bash
   # Test login performance with bcrypt
   time curl -X POST http://localhost:3009/v1/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"demo@example.com","password":"ChangeMe123!","projectId":"335395d6-b489-4a32-bda2-aecfe7726d8f"}'
   # Should complete in < 200ms
   ```

#### Success Criteria
- [ ] No plaintext passwords in database
- [ ] Password hashes are bcrypt format ($2b$12$...)
- [ ] Wrong passwords return 401 Unauthorized
- [ ] Weak passwords rejected during user creation
- [ ] Login performance acceptable (< 200ms)
- [ ] All three auth methods working correctly

---

## 📋 FINAL VERIFICATION CHECKLIST

### Security Verification
- [ ] ❌ **BEFORE**: `curl -d '{"password":"anything"}' /login` returns 200 OK
- [ ] ✅ **AFTER**: `curl -d '{"password":"anything"}' /login` returns 401 Unauthorized
- [ ] ✅ **AFTER**: `curl -d '{"password":"ChangeMe123!"}' /login` returns 200 OK + JWT
- [ ] ✅ Database contains only bcrypt password hashes (no plaintext)
- [ ] ✅ User creation requires strong passwords
- [ ] ✅ API key authentication unchanged
- [ ] ✅ Azure AD authentication unchanged

### Functional Verification
- [ ] ✅ JWT tokens work for protected endpoints
- [ ] ✅ User registration validates password strength
- [ ] ✅ Existing users can login with temporary password
- [ ] ✅ CLI commands work correctly
- [ ] ✅ Swagger documentation shows password requirements
- [ ] ✅ Frontend portal login/registration works
- [ ] ✅ Test page shows all auth methods working

### Documentation & Deployment
- [ ] ✅ OpenAPI spec updated
- [ ] ✅ TypeScript SDK regenerated
- [ ] ✅ Postman collection updated
- [ ] ✅ Production deployment successful
- [ ] ✅ Newman automated tests pass
- [ ] ✅ No breaking changes to existing API consumers

---

## 🚨 Rollback Plan

If critical issues are discovered:

1. **Immediate Rollback**
   ```bash
   # Revert to previous container image
   ./scripts/azure/azure-deploy-cli.sh rollback
   ```

2. **Database Rollback** (if needed)
   ```bash
   # Restore from backup (requires manual intervention)
   # Or temporarily disable password validation in code
   ```

3. **Verify Rollback**
   ```bash
   # Test that old behavior is restored
   curl -X POST .../v1/auth/login -d '{"email":"demo@example.com","password":"any","projectId":"..."}'
   # Should return 200 OK if rolled back successfully
   ```

## 📈 Success Metrics

- **Security**: Zero successful logins with incorrect passwords
- **Functionality**: 100% of existing auth methods still working
- **Performance**: Login response time < 200ms
- **Compatibility**: No breaking changes for API consumers
- **Testing**: All automated tests passing

This phase-based approach ensures systematic implementation with clear verification at each step, minimizing risk and providing clear rollback points if issues arise.