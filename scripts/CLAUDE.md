# Portal Scripts & Automation

## Script Categories
- **Azure deployment**: Azure Static Web Apps deployment
- **Development tools**: Dev environment and utilities
- **API integration**: API client generation and synchronization

## Key Scripts
- **dev-service.sh**: Development server management
- **generate-api-sdk.js**: Sync API client from service project

## Azure Scripts (`azure/`)
- **deploy-portal.sh**: Deploy portal to Azure Static Web Apps
- **update-portal.sh**: Update existing SWA deployment  
- **configure-github-secrets.sh**: Setup GitHub Actions secrets

## API Client Generation
- **generate-api-sdk.js**: Generates TypeScript client from service OpenAPI spec
- **Process**: 
  1. Generate OpenAPI spec in service project
  2. Copy spec to portal
  3. Generate TypeScript client using OpenAPI Generator
  4. Configure for ES modules and Vite compatibility

## Development Scripts
- **dev-service.sh**: Start development server with proper configuration
- **Environment setup**: Configure local development environment
- **Hot reload**: Vite-powered development with instant updates

## Script Conventions
- **Node.js scripts**: Use Node.js for cross-platform compatibility
- **Error handling**: Proper exit codes and error messages
- **Logging**: Clear console output with operation status
- **ES modules**: All scripts compatible with ES module system

## Common Patterns
```javascript
// Node.js script template for portal
#!/usr/bin/env node
const { execSync } = require('child_process');
const path = require('path');

console.log('🔧 Starting portal operation...');

try {
  // Script logic here
  console.log('✅ Operation completed successfully');
} catch (error) {
  console.error('❌ Operation failed:', error.message);
  process.exit(1);
}
```

## API Synchronization
- **Automatic sync**: Scripts sync with service project API changes
- **Type safety**: Generated client ensures type safety with API
- **Version consistency**: Client stays in sync with service versions

## Azure Integration
- **SWA CLI**: Use Azure Static Web Apps CLI for local development
- **GitHub Actions**: Automated deployment via GitHub integration
- **Environment management**: Handle multiple environments (dev, staging, prod)

## Best Practices
- **Idempotent**: Safe to run multiple times
- **Environment aware**: Detect and handle different environments
- **Dependency checks**: Verify required tools and permissions
- **Cleanup**: Proper cleanup of temporary files and resources