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

### Deployment Target: Azure Static Web Apps
The portal is deployed to Azure Static Web Apps for optimal performance and cost efficiency.

### Quick Reference
- **Deployment Type**: Azure Static Web Apps (not Container Apps)
- **Portal URL**: Will be `https://<app-name>.azurestaticapps.net` (or custom domain)
- **API URL**: https://ca-usasset-api.yellowforest-928e9b23.eastus.azurecontainerapps.io
- **Resource Group**: usasset-demo
- **GitHub Integration**: Automatic deployments via GitHub Actions

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

# Production (set in GitHub Actions or SWA settings)
VITE_API_URL=https://ca-usasset-api.yellowforest-928e9b23.eastus.azurecontainerapps.io
VITE_AZURE_AD_CLIENT_ID=<production-client-id>
VITE_AZURE_AD_TENANT_ID=<production-tenant-id>
```

### Deployment Commands
```bash
# Create Static Web App
az staticwebapp create \
  --name swa-usasset-portal \
  --resource-group usasset-demo \
  --sku Free

# Manual deployment (if needed)
npm run build
az staticwebapp deploy \
  --app-name swa-usasset-portal \
  --output-location dist

# View deployment status
az staticwebapp show \
  --name swa-usasset-portal \
  --resource-group usasset-demo
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

### Authentication System
- Azure AD SSO integration
- JWT token management
- Auto-refresh token logic
- Protected routes with React Router

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
- [ ] Push to GitHub and connect to Azure
- [ ] Configure GitHub Actions for auto-deployment
- [ ] Implement core UI components
- [ ] Add unit/integration tests
- [ ] Create component documentation
- [ ] Set up Storybook for component development

## Deployment Summary

### Minimum Steps to Deploy:
1. Push code to GitHub repository
2. Create Azure Static Web App with GitHub integration
3. Configure environment variables
4. Update API CORS settings
5. Done! Automatic deployments on push to main

### Key Differences from Container Apps:
- No Docker images in production (SWA builds from source)
- No container registry needed
- Automatic PR preview environments
- Built-in CDN and SSL
- Zero to minimal monthly cost (Free tier)