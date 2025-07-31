# Portal Deployment Guide

## Azure Static Web Apps
- **Service**: Azure Static Web Apps (SWA)
- **URL**: https://thankful-mud-0d3112f0f.2.azurestaticapps.net
- **Build**: Vite production build from `dist/` directory
- **Region**: East US (matches API service)

## Deployment Configuration
- **staticwebapp.config.json**: SWA-specific configuration
- **Build command**: `npm run build` (TypeScript + Vite)
- **Output directory**: `dist/`
- **Routing**: Client-side routing with fallback to index.html

## Environment Variables
```bash
# Required for portal functionality
VITE_API_URL                # API service base URL
VITE_AZURE_CLIENT_ID        # Azure AD application ID  
VITE_AZURE_TENANT_ID        # Azure AD tenant ID
VITE_AZURE_REDIRECT_URI     # OAuth callback URL
```

## Deployment Scripts
- **deploy-portal.sh**: Full deployment to Azure SWA
- **update-portal.sh**: Update existing deployment
- **configure-github-secrets.sh**: Setup GitHub Actions secrets

## Build Process
1. **TypeScript compilation**: `tsc -b`
2. **Vite build**: Bundle and optimize for production
3. **Asset optimization**: Minification, tree-shaking
4. **Output**: Static files in `dist/` directory

## API Integration
- **CORS configuration**: API service allows portal origin
- **Authentication**: JWT tokens, API keys, Azure AD
- **API client**: Generated TypeScript client from service OpenAPI
- **Base URL**: Configurable via `VITE_API_URL` environment variable

## SWA Configuration (`staticwebapp.config.json`)
- **Routes**: Client-side routing configuration
- **Authentication**: Azure AD integration settings
- **Headers**: Security headers and CORS
- **Fallback routes**: SPA fallback handling

## Pre-Deployment Checklist
- [ ] Build successful: `npm run build`
- [ ] TypeScript check: `npm run typecheck`  
- [ ] Linting clean: `npm run lint`
- [ ] Environment variables configured
- [ ] API service CORS updated for portal domain
- [ ] Azure AD app registration configured

## Monitoring & Troubleshooting
- **Azure portal**: Static Web Apps dashboard
- **Build logs**: GitHub Actions deployment logs
- **Runtime logs**: Browser developer tools
- **API connectivity**: Network tab for API requests

## Local Development
- **Dev server**: `npm run dev` (Vite dev server)
- **Hot reload**: Automatic reload on file changes
- **API proxy**: Configure proxy for local API development
- **Environment**: Use `.env.local` for local overrides