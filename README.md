# USAsset API Portal

Frontend portal for the USAsset API Service built with React, TypeScript, and Vite.

## 🚀 Deployment Status

- **Portal URL**: https://thankful-mud-0d3112f0f.2.azurestaticapps.net
- **API URL**: https://ca-usasset-api.yellowforest-928e9b23.eastus.azurecontainerapps.io
- **Deployment**: Azure Static Web Apps

## 🛠️ Local Development

### Prerequisites
- Node.js 20+
- Docker (optional)
- API service running locally or accessible

### Quick Start

```bash
# Install dependencies
npm install

# Link API SDK from adjacent project
npm link @usasset/api-client

# Start development server
npm run dev
```

### Docker Development

```bash
# Start with hot reload
docker-compose up portal-dev

# Test production build
docker-compose --profile production up portal-prod
```

## 📚 Documentation

- [Static Web App Deployment Guide](./deployment/azure/static-web-app-deployment.md)
- [Azure AD Setup](./deployment/azure/azure-ad-setup.md)
- [API SDK Integration](../usasset-api-service/docs/sops/sdk-vite-integration.md)

## 🏗️ Architecture

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: CSS (TBD: Tailwind/Material-UI)
- **State Management**: TBD (Context/Zustand/Redux)
- **API Client**: Auto-generated TypeScript SDK
- **Deployment**: Azure Static Web Apps with GitHub Actions

## 🔧 Configuration

Environment variables:
- `VITE_API_URL`: Backend API URL
- `VITE_AZURE_AD_CLIENT_ID`: Azure AD client ID (optional)
- `VITE_AZURE_AD_TENANT_ID`: Azure AD tenant ID (optional)

## 📈 Monitoring

- GitHub Actions: https://github.com/james-s-usec/usasset-api-portal/actions
- Application Insights: Integrated with API service monitoring

---

*Deployed: July 25, 2025*
*Updated: Fixed API URL configuration*