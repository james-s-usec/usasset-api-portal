#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const BACKEND_PATH = path.join(__dirname, '../../usasset-api-service');
const FRONTEND_SDK_PATH = path.join(__dirname, '../src/api-sdk');

console.log('🔧 Generating API SDK for frontend...');

// Step 1: Generate OpenAPI spec in backend
console.log('📋 Generating OpenAPI spec in backend...');
execSync('npm run openapi:generate-spec', {
  cwd: BACKEND_PATH,
  stdio: 'inherit'
});

// Step 2: Copy OpenAPI spec to frontend
const openApiPath = path.join(BACKEND_PATH, 'openapi.json');
const targetPath = path.join(FRONTEND_SDK_PATH, 'openapi.json');
console.log('📁 Copying OpenAPI spec to frontend...');
fs.copyFileSync(openApiPath, targetPath);

// Step 3: Generate TypeScript SDK
console.log('🚀 Generating TypeScript SDK...');
execSync(`npx @openapitools/openapi-generator-cli generate \
  -i openapi.json \
  -g typescript-axios \
  -o . \
  --additional-properties=supportsES6=true,withSeparateModelsAndApi=false,npmName=@usasset/api-client,npmVersion=1.0.0`, {
  cwd: FRONTEND_SDK_PATH,
  stdio: 'inherit'
});

// Step 4: Fix package.json for ES modules
console.log('📦 Fixing package.json for ES modules...');
const packageJsonPath = path.join(FRONTEND_SDK_PATH, 'package.json');
const packageJson = {
  "name": "@usasset/api-client",
  "version": "1.0.0",
  "description": "USAsset API TypeScript client SDK",
  "type": "module",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "prepare": "npm run build"
  },
  "keywords": [
    "api",
    "client",
    "sdk",
    "typescript",
    "usasset"
  ],
  "author": "",
  "license": "MIT",
  "dependencies": {
    "axios": "^1.6.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/node": "^20.0.0"
  },
  "files": [
    "dist/**/*",
    "README.md"
  ],
  "repository": {
    "type": "git",
    "url": ""
  }
};
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

// Step 5: Fix tsconfig.json for ES modules
console.log('⚙️ Fixing tsconfig.json for ES modules...');
const tsconfigPath = path.join(FRONTEND_SDK_PATH, 'tsconfig.json');
const tsconfig = {
  "compilerOptions": {
    "target": "es2020",
    "module": "esnext",
    "lib": ["es2020"],
    "declaration": true,
    "outDir": "./dist",
    "rootDir": "./",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node"
  },
  "include": [
    "**/*.ts"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "docs"
  ]
};
fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2));

// Step 6: Build the SDK
console.log('🔨 Building SDK...');
execSync('npm install && npm run build', {
  cwd: FRONTEND_SDK_PATH,
  stdio: 'inherit'
});

// Clean up
fs.unlinkSync(targetPath);

console.log('✅ API SDK generated successfully!');