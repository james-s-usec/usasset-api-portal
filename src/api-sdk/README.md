# USAsset API Client SDK

TypeScript client SDK for the USAsset API, automatically generated from the OpenAPI specification.

## Installation

```bash
npm install @usasset/api-client
```

## Usage

### Basic Setup

```typescript
import { Configuration, UsersApi, HealthApi } from '@usasset/api-client';

// Configure the API client
const config = new Configuration({
  basePath: 'http://localhost:3000',
  apiKey: 'your-api-key-here'
});

// Create API instances
const usersApi = new UsersApi(config);
const healthApi = new HealthApi(config);
```

### API Key Authentication

The USAsset API uses API key authentication. You can provide your API key in two ways:

#### Option 1: In Configuration
```typescript
const config = new Configuration({
  basePath: 'http://localhost:3000',
  apiKey: 'your-api-key-here'
});
```

#### Option 2: Per Request
```typescript
const config = new Configuration({
  basePath: 'http://localhost:3000'
});

// Pass API key in request headers
const response = await usersApi.usersControllerFindAll({
  headers: {
    'x-api-key': 'your-api-key-here'
  }
});
```

### Examples

#### Health Check
```typescript
import { HealthApi } from '@usasset/api-client';

const healthApi = new HealthApi(config);

try {
  const response = await healthApi.healthControllerCheck();
  console.log('API Status:', response.data);
} catch (error) {
  console.error('Health check failed:', error);
}
```

#### User Management
```typescript
import { UsersApi, CreateUserDto } from '@usasset/api-client';

const usersApi = new UsersApi(config);

// Create a user
const createUserDto: CreateUserDto = {
  email: 'user@example.com',
  name: 'John Doe'
};

try {
  const response = await usersApi.usersControllerCreate(createUserDto);
  console.log('Created user:', response.data);
} catch (error) {
  console.error('Failed to create user:', error);
}

// Get all users with pagination
try {
  const response = await usersApi.usersControllerFindPaginated({
    page: 1,
    limit: 10,
    search: 'john'
  });
  console.log('Users:', response.data);
} catch (error) {
  console.error('Failed to fetch users:', error);
}

// Get user by ID
try {
  const response = await usersApi.usersControllerFindOne(1);
  console.log('User:', response.data);
} catch (error) {
  console.error('Failed to fetch user:', error);
}

// Update user
try {
  const response = await usersApi.usersControllerUpdate(1, {
    name: 'John Smith'
  });
  console.log('Updated user:', response.data);
} catch (error) {
  console.error('Failed to update user:', error);
}
```

### Response Format

All API responses follow a standardized format:

#### Success Response
```typescript
{
  success: true,
  data: T, // Your actual data
  timestamp: string,
  path: string
}
```

#### Error Response
```typescript
{
  success: false,
  error: string,
  statusCode: number,
  timestamp: string,
  path: string
}
```

#### Paginated Response
```typescript
{
  success: true,
  data: {
    items: T[],
    meta: {
      page: number,
      limit: number,
      total: number,
      totalPages: number,
      hasNextPage: boolean,
      hasPreviousPage: boolean
    }
  },
  timestamp: string,
  path: string
}
```

### Error Handling

The client will throw errors for HTTP error responses. You can catch and handle them:

```typescript
import { AxiosError } from 'axios';

try {
  const response = await usersApi.usersControllerFindOne(999);
} catch (error) {
  if (error instanceof AxiosError) {
    // Handle API errors
    console.error('API Error:', error.response?.data);
    console.error('Status:', error.response?.status);
  } else {
    // Handle other errors
    console.error('Unexpected error:', error);
  }
}
```

### TypeScript Support

This client is written in TypeScript and provides full type safety:

- All API methods are typed
- Request/response DTOs are typed
- Enum values are typed
- Error responses are typed

## API Reference

For complete API documentation, visit the Swagger UI at: `http://localhost:3000/api`

## Support

For issues and questions, please refer to the main USAsset API repository.