# Portal Documentation Standards

## Documentation Organization
- **deployment/**: Azure Static Web Apps deployment guides
- **password-implementation-*.md**: Authentication implementation docs
- **ADD-CORS-TO-API.md**: API integration configuration
- **AUTHENTICATION_FIX.md**: Authentication troubleshooting

## Documentation Types
- **Deployment guides**: Step-by-step Azure SWA deployment
- **Authentication docs**: Multi-auth system documentation
- **Integration guides**: API service connection and CORS setup
- **Troubleshooting**: Common issues and solutions
- **Implementation plans**: Feature development roadmaps

## Writing Standards
- **Frontend-focused**: Document React/TypeScript patterns
- **User-centric**: Include UI screenshots and user flows
- **Integration-heavy**: Emphasize API service connection
- **Azure-specific**: Document Azure AD and SWA specifics
- **Actionable**: Include specific commands and configuration

## Portal-Specific Patterns
- **Component documentation**: Document React component APIs
- **Hook documentation**: Custom hook usage and examples
- **Context documentation**: State management patterns
- **Authentication flows**: Multi-auth system workflows
- **Build configuration**: Vite and deployment setup

## Generated Documentation
- **API client docs**: `src/api-sdk/docs/` (auto-generated from service)
- **Build reports**: Build analysis and bundle information
- **Type definitions**: Generated TypeScript definitions

## Documentation Commands
```bash
npm run build           # Generate production build
npm run typecheck       # TypeScript validation
npm run lint           # Code quality checks
```

## Content Guidelines
- **React examples**: Include JSX and TypeScript examples
- **Environment setup**: Document required environment variables
- **API integration**: Show service connection patterns
- **Authentication**: Document all three auth methods (JWT, API Key, Azure AD)
- **Deployment**: Azure-specific deployment procedures

## File Naming
- Use kebab-case: `azure-ad-integration-guide.md`
- Be specific: `portal-authentication-troubleshooting.md`
- Include technology: `react-component-patterns.md`
- Version when needed: `api-client-migration-v2.md`

## Frontend Documentation Focus
- **Component props**: Document component interfaces
- **State patterns**: Context and hook usage
- **Routing**: Client-side routing configuration
- **Styling**: CSS and styling conventions
- **Performance**: Bundle size and optimization

## Integration Documentation
- **API client**: Generated client usage patterns
- **CORS setup**: Cross-origin configuration
- **Authentication**: Token handling and storage
- **Environment**: Development vs production configuration