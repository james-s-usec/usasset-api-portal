# Portal Frontend Architecture Guide

## Technology Stack
- **React 19**: Modern React with hooks and concurrent features
- **TypeScript**: Strict typing throughout application
- **Vite**: Build tool and dev server (ESM-first)
- **Axios**: HTTP client for API communication
- **React Router**: Client-side routing
- **Azure MSAL**: Microsoft authentication library

## Architecture Pattern
- **Component-based**: Functional components with hooks
- **Context providers**: Global state management (Auth, Debug)
- **Custom hooks**: Reusable logic abstraction
- **Service layer**: API communication abstraction
- **Type-safe API**: Generated client from OpenAPI spec

## Directory Structure
```
src/
├── components/        # Reusable UI components
├── contexts/         # React context providers
├── hooks/           # Custom React hooks
├── pages/           # Route-level page components
├── services/        # API and business logic
├── utils/           # Utility functions
├── types/           # TypeScript type definitions
├── config/          # Configuration files
└── api-sdk/         # Generated API client
```

## Component Conventions
- **Functional components**: Use function declarations
- **TypeScript interfaces**: Define props with interfaces
- **JSX.Element**: Use explicit JSX.Element return type
- **Props destructuring**: Destructure props in function signature
- **Event handlers**: Use arrow functions for inline handlers

## State Management
- **AuthContext**: Authentication state, user data, tokens
- **DebugContext**: Development debugging information
- **Local state**: useState for component-specific state
- **Custom hooks**: Extract reusable stateful logic

## API Integration
- **Generated client**: Use `api-sdk/` generated from service OpenAPI
- **Service layer**: Wrap API calls in `services/` directory
- **Error handling**: Centralized error handling with toast notifications
- **Authentication**: Automatic token/API key injection via axios config

## Authentication System
- **Multi-auth support**: JWT, API Key, Azure AD
- **AuthContext**: Centralized authentication state management  
- **Storage utilities**: Secure token/credential storage
- **Route protection**: Authentication-aware routing

## Development Patterns
- **Import organization**: External libs → Internal modules → Types
- **File naming**: PascalCase for components, camelCase for utilities
- **CSS modules**: Component-scoped styling
- **Environment config**: Use `import.meta.env` for Vite variables

## Build & Deployment
- **Vite build**: `npm run build` - TypeScript + Vite production build
- **Azure SWA**: Static Web App deployment target
- **Environment variables**: `VITE_*` prefix for client-side variables
- **CORS**: Configured for API service communication