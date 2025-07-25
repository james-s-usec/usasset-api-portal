# PROMPT: Add CORS to USAsset API Service

## Context
The portal at `https://thankful-mud-0d3112f0f.2.azurestaticapps.net` cannot connect to the API at `https://ca-usasset-api.yellowforest-928e9b23.eastus.azurecontainerapps.io` due to CORS being blocked.

The API currently has `ALLOWED_ORIGINS=*` environment variable but isn't sending CORS headers.

## Required Changes

Navigate to the API service project at: `/home/swansonj/projects/usasset-api-service`

### 1. Add CORS to main.ts

Update `src/main.ts` to enable CORS:

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS
  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['*'];
      
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return callback(null, true);
      
      // Allow all origins if '*' is set
      if (allowedOrigins.includes('*')) {
        return callback(null, true);
      }
      
      // Check if origin is in allowed list
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      
      callback(new Error('Not allowed by CORS'), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key'],
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
}
bootstrap();
```

### 2. Install CORS package (if needed)

```bash
cd /home/swansonj/projects/usasset-api-service
npm install @nestjs/platform-express
```

### 3. Test locally

```bash
# Start API locally
npm run start:dev

# Test CORS in another terminal
curl -i -H "Origin: https://thankful-mud-0d3112f0f.2.azurestaticapps.net" \
  http://localhost:3000/v1/health

# Should see:
# Access-Control-Allow-Origin: https://thankful-mud-0d3112f0f.2.azurestaticapps.net
```

### 4. Deploy to Azure

```bash
# Commit changes
git add src/main.ts
git commit -m "Add CORS support for portal integration"
git push

# Update container app (if needed)
az containerapp update \
  --name ca-usasset-api \
  --resource-group usasset-demo \
  --set-env-vars "ALLOWED_ORIGINS=https://thankful-mud-0d3112f0f.2.azurestaticapps.net"
```

### 5. Verify Fix

After deployment, test:
```bash
curl -i -H "Origin: https://thankful-mud-0d3112f0f.2.azurestaticapps.net" \
  https://ca-usasset-api.yellowforest-928e9b23.eastus.azurecontainerapps.io/v1/health
```

Should return headers like:
```
Access-Control-Allow-Origin: https://thankful-mud-0d3112f0f.2.azurestaticapps.net
Access-Control-Allow-Credentials: true
```

## Expected Result

After this fix:
1. Portal loads successfully
2. Connection status shows "● Connected" in green
3. No CORS errors in browser console
4. API calls work from the portal

## Quick Test Command

```bash
# After deployment, test from portal URL
curl -i -H "Origin: https://thankful-mud-0d3112f0f.2.azurestaticapps.net" \
  https://ca-usasset-api.yellowforest-928e9b23.eastus.azurecontainerapps.io/v1/health | grep -i "access-control"
```

---

This is the missing piece - the API code needs to actually implement CORS middleware!