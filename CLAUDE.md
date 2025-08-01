# CLAUDE.md - USAsset API Portal

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Start

### Project Overview
This is the Vite-based frontend portal for the USAsset API Service. It connects to the backend API service located at `../usasset-api-service`.

### Development Commands
```bash
npm run dev           # Start Vite dev server
npm run build         # Build for production
npm run preview       # Preview production build
npm run lint          # Run ESLint

# Docker development
docker-compose up portal-dev              # Development server with hot reload
docker-compose --profile production up    # Test production build locally
```

### API Integration
The portal uses the auto-generated TypeScript SDK from the API service. See the [SDK Integration SOP](../usasset-api-service/docs/sops/sdk-vite-integration.md) for setup details.

## Azure Deployment Information

### U.S. Engineering Production Deployment (LIVE)
- **Account**: james.swanson@usengineering.com
- **Subscription**: Azure-CSP-Sandbox (544f8f60-d8ff-406b-adef-77fc16e86aac)
- **Portal URL**: https://salmon-field-08d82e40f.2.azurestaticapps.net
- **API URL**: https://useng-usasset-api.lemonforest-4e4757f3.eastus.azurecontainerapps.io
- **Resource Group**: useng-usasset-api-rg
- **Static Web App**: useng-usasset-portal
- **Region**: East US 2
- **Status**: ✅ **DEPLOYED** (August 1, 2025)

### Demo Environment (Legacy)
- **Portal URL**: https://thankful-mud-0d3112f0f.2.azurestaticapps.net
- **API URL**: https://ca-usasset-api.yellowforest-928e9b23.eastus.azurecontainerapps.io
- **Resource Group**: usasset-demo

### Deployment Target: Azure Static Web Apps
The portal is deployed to Azure Static Web Apps for optimal performance and cost efficiency.

### Why Static Web Apps?
- **Cost**: Free tier includes 100GB bandwidth/month
- **Performance**: Global CDN with edge locations
- **Simplicity**: No containers to manage
- **Features**: PR previews, custom domains, SSL included

### Environment Variables
```bash
# Development (.env.local)
VITE_API_URL=http://localhost:3000
VITE_AZURE_AD_CLIENT_ID=development-client-id
VITE_AZURE_AD_TENANT_ID=development-tenant-id

# U.S. Engineering Production
VITE_API_URL=https://useng-usasset-api.lemonforest-4e4757f3.eastus.azurecontainerapps.io
VITE_AZURE_AD_CLIENT_ID=<production-client-id>
VITE_AZURE_AD_TENANT_ID=8c54d37e-75b4-4799-9cda-db77000f1944

# Demo Environment (Legacy)
VITE_API_URL=https://ca-usasset-api.yellowforest-928e9b23.eastus.azurecontainerapps.io
VITE_AZURE_AD_CLIENT_ID=<demo-client-id>
VITE_AZURE_AD_TENANT_ID=<demo-tenant-id>
```

### Deployment Commands

#### U.S. Engineering Production
```bash
# Create Static Web App (COMPLETED)
az staticwebapp create \
  --name "useng-usasset-portal" \
  --resource-group "useng-usasset-api-rg" \
  --location "eastus2" \
  --sku Free

# Manual deployment using SWA CLI
npm run build
npx @azure/static-web-apps-cli deploy ./dist \
  --deployment-token "<deployment-token>" \
  --env production

# Set environment variables
az staticwebapp appsettings set \
  --name "useng-usasset-portal" \
  --resource-group "useng-usasset-api-rg" \
  --setting-names \
    "VITE_API_URL=https://useng-usasset-api.lemonforest-4e4757f3.eastus.azurecontainerapps.io"

# View deployment status
az staticwebapp show \
  --name "useng-usasset-portal" \
  --resource-group "useng-usasset-api-rg"
```

#### Get Deployment Token
```bash
# Get deployment token for manual deployments
az staticwebapp secrets list \
  --name "useng-usasset-portal" \
  --resource-group "useng-usasset-api-rg" \
  --query "properties.apiKey" -o tsv
```

## Architecture & Code Standards

### Architecture Overview
- **Framework**: Vite + React + TypeScript
- **State Management**: TBD (Context API / Zustand / Redux Toolkit)
- **UI Library**: TBD (Material-UI / Ant Design / Tailwind)
- **API Client**: Auto-generated TypeScript SDK from OpenAPI spec
- **Authentication**: JWT with Azure AD integration

### Critical Code Quality Rules
- **NO `any` types** - TypeScript strict mode enabled
- **Explicit types required** for all function parameters and returns
- **Component structure**: Functional components with hooks
- **File organization**: Feature-based folder structure
- **Run `npm run lint` before committing**

## API Integration

### SDK Location
The API client SDK is imported from the adjacent API service project:
```typescript
import { AuthenticationApi, UsersApi, ProjectsApi } from '@usasset/api-client';
```

### Authentication Flow
1. User logs in via Azure AD or credentials
2. Portal receives JWT token from API
3. Token stored in localStorage/sessionStorage
4. Token sent with all API requests via SDK configuration

### Response Handling
All API responses follow the standardized format from the backend service.

## Key Features

### 🚨 **CRITICAL: Project-Scoped Authentication**

**Unlike typical authentication systems, USAsset requires a PROJECT ID for login:**

```json
{
  "email": "user@example.com",
  "password": "password",
  "projectId": "86b3ee96-4c01-448a-a34d-53b63e03acba"  // REQUIRED!
}
```

**Without projectId, you get 400 Bad Request. The projectId must be:**
- A valid UUID format
- A project that exists in the database
- A project the user has been assigned a role in

**If user lacks project access: 401 "No access to this project"**

### Authentication System (✅ WORKING)
- ✅ **Project-scoped login** - User selects project from dropdown
- ✅ **JWT token management** - Project-scoped tokens
- ✅ **Dashboard integration** - Shows user role and permissions
- ✅ **Protected routes** with React Router
- 🚧 **Azure AD SSO integration** - To Be Implemented
- 🚧 **Auto-refresh token logic** - To Be Implemented

### RBAC Integration
- Role-based UI components
- Permission-based feature toggles
- Project context management
- User role visualization

### UI Components (To Be Implemented)
- Login/Logout flow
- User management interface
- Project management dashboard
- Location/Asset management
- RBAC administration panel
- Audit log viewer

## Environment Configuration

### Development
```env
VITE_API_URL=http://localhost:3000
VITE_AZURE_AD_CLIENT_ID=development-client-id
VITE_AZURE_AD_TENANT_ID=development-tenant-id
```

### Production
Environment variables set via Azure Container App configuration, sourced from Key Vault.

## Development Workflow

1. **Start API service** in adjacent directory
2. **Install dependencies**: `npm install`
3. **Link SDK**: `npm link @usasset/api-client`
4. **Start dev server**: `npm run dev`
5. **Make changes** following React/TypeScript patterns
6. **Run checks**: `npm run lint`
7. **Build**: `npm run build`
8. **Test**: Manual testing + future unit/integration tests

## Local Development with Docker

### Development Setup
```bash
# Start portal with hot reload
docker-compose up portal-dev

# Portal runs on http://localhost:5173
# API should be running on http://localhost:3000
```

### Production Build Testing
```bash
# Test production build locally
docker-compose --profile production up portal-prod

# Serves static build on http://localhost:3001
```

### Docker Configuration
- `Dockerfile.dev`: Development server with hot reload
- `Dockerfile.production`: Nginx production build (for testing only)
- Static Web Apps handles production hosting

## Documentation Structure

```
docs/                  # Portal-specific documentation
├── components/        # Component documentation
├── features/          # Feature guides
├── deployment/        # Azure deployment guides
└── api-integration/   # SDK usage examples
```

## Related Documentation
- [API Service CLAUDE.md](../usasset-api-service/CLAUDE.md)
- [SDK Integration SOP](../usasset-api-service/docs/sops/sdk-vite-integration.md)
- [API Authentication Guide](../usasset-api-service/docs/guides/authentication/README.md)
- [RBAC Quick Reference](../usasset-api-service/docs/guides/rbac/quick-reference.md)

## Need Help?

- **API Documentation**: Check Swagger UI at API URL + `/api`
- **SDK Documentation**: See `../usasset-api-service/api-client/generated/docs/`
- **Azure Deployment**: See deployment guides in both repos
- **Authentication Issues**: Check API service auth guides

## TODO: Portal-Specific Items
- [x] Create Docker setup for local development
- [x] Create Static Web App configuration
- [x] Deploy to U.S. Engineering Azure environment
- [x] Configure API CORS for portal domain
- [x] Set up manual deployment process
- [ ] Configure GitHub Actions for auto-deployment
- [ ] Implement core UI components
- [ ] Add unit/integration tests
- [ ] Create component documentation
- [ ] Set up Storybook for component development

## Deployment Summary

### ✅ Current Deployment Status (August 1, 2025)
**U.S. Engineering Portal is LIVE and operational:**
- **Portal**: https://salmon-field-08d82e40f.2.azurestaticapps.net
- **API**: https://useng-usasset-api.lemonforest-4e4757f3.eastus.azurecontainerapps.io
- **Build Size**: 296.17 kB
- **CORS**: Configured for portal domain
- **Deployment Method**: Manual via SWA CLI

### Manual Deployment Steps (COMPLETED):
1. ✅ Create Azure Static Web App (`useng-usasset-portal`)
2. ✅ Build portal with production API URL
3. ✅ Deploy using SWA CLI with deployment token
4. ✅ Configure environment variables in Azure
5. ✅ Update API CORS settings to allow portal domain
6. ✅ Test portal accessibility and API connection

### Future: GitHub Actions Deployment
To set up automatic deployments:
1. Add GitHub repository integration
2. Configure GitHub Actions workflow
3. Set AZURE_STATIC_WEB_APPS_API_TOKEN secret

### Key Differences from Container Apps:
- No Docker images in production (SWA builds from source)
- No container registry needed
- Automatic PR preview environments
- Built-in CDN and SSL
- Zero to minimal monthly cost (Free tier)

### Deployment Tokens & Keys
- **SWA Deployment Token**: Stored for future manual deployments
- **Resource Group**: useng-usasset-api-rg
- **Static Web App Name**: useng-usasset-portal

### 🧪 **Test Login Instructions** (✅ VERIFIED WORKING)

**Portal URL**: https://salmon-field-08d82e40f.2.azurestaticapps.net

#### Azure AD Authentication (✅ PRODUCTION READY)
**Login Process:**
1. Click **"Azure AD"** → **"Sign in with Microsoft"**
2. Enter **U.S. Engineering credentials**: `james.swanson@usengineering.com`
3. Complete Microsoft authentication (may require email verification)
4. Automatically redirected to dashboard with Microsoft identity

**Azure AD Configuration:**
- **Client ID**: `a6d15feb-fe60-444a-a240-0d18b9979abe` (stored in Key Vault)
- **Tenant ID**: `8c54d37e-75b4-4799-9cda-db77000f1944` (U.S. Engineering)
- **Redirect URI**: `https://salmon-field-08d82e40f.2.azurestaticapps.net/auth/callback`

#### Username/Password Authentication
**Login Process:**
1. Select **Project**: "Construction Site Alpha" (or other available projects)
2. Enter **Email**: `super@test.com`
3. Enter **Password**: `ChangeMe123!`
4. Click **Login**

**Available Test Users:**
- **Super User**: `super@test.com` / `ChangeMe123!` (All roles, all projects)
- **Admin**: `admin@usasset.com` / `ChangeMe123` (Project admin role)
- **Manager**: `manager@usasset.com` / `ChangeMe123` (Project manager role)
- **Engineer**: `engineer@usasset.com` / `ChangeMe123` (Engineer role)
- **Viewer**: `viewer@usasset.com` / `ChangeMe123` (Read-only role)

**Available Projects:**
- Construction Site Alpha (`86b3ee96-4c01-448a-a34d-53b63e03acba`)
- Renovation Project Beta (`bf97c79f-1158-4666-b5cf-bdfeacc9a7b0`)
- Infrastructure Project Gamma (`dc7b058a-c797-4ea2-a536-24fd36194f1b`)

**Expected Result**: Dashboard shows user info, role, and 27 permissions