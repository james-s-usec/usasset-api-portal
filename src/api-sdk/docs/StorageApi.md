# StorageApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**storageControllerDeleteFile**](#storagecontrollerdeletefile) | **DELETE** /storage/{id} | Delete a file from storage|
|[**storageControllerDownloadFile**](#storagecontrollerdownloadfile) | **GET** /storage/{id}/download | Download a file from storage|
|[**storageControllerGetFileMetadata**](#storagecontrollergetfilemetadata) | **GET** /storage/{id}/metadata | Get file metadata without downloading|
|[**storageControllerGetFileUrl**](#storagecontrollergetfileurl) | **GET** /storage/{id}/url | Get a presigned URL for direct file access|
|[**storageControllerListFiles**](#storagecontrollerlistfiles) | **GET** /storage/files | List files by project ID (query param)|
|[**storageControllerListProjectFiles**](#storagecontrollerlistprojectfiles) | **GET** /storage/project/{projectId} | List all files in a project|
|[**storageControllerUploadFile**](#storagecontrolleruploadfile) | **POST** /storage/upload | Upload a file to storage|

# **storageControllerDeleteFile**
> StorageControllerUploadFile200Response storageControllerDeleteFile()


### Example

```typescript
import {
    StorageApi,
    Configuration
} from '@usasset/api-client';

const configuration = new Configuration();
const apiInstance = new StorageApi(configuration);

let id: string; //File ID (default to undefined)

const { status, data } = await apiInstance.storageControllerDeleteFile(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | File ID | defaults to undefined|


### Return type

**StorageControllerUploadFile200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | File deleted successfully |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **storageControllerDownloadFile**
> storageControllerDownloadFile()


### Example

```typescript
import {
    StorageApi,
    Configuration
} from '@usasset/api-client';

const configuration = new Configuration();
const apiInstance = new StorageApi(configuration);

let id: string; //File ID (default to undefined)

const { status, data } = await apiInstance.storageControllerDownloadFile(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | File ID | defaults to undefined|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **storageControllerGetFileMetadata**
> StorageControllerUploadFile200Response storageControllerGetFileMetadata()


### Example

```typescript
import {
    StorageApi,
    Configuration
} from '@usasset/api-client';

const configuration = new Configuration();
const apiInstance = new StorageApi(configuration);

let id: string; //File ID (default to undefined)

const { status, data } = await apiInstance.storageControllerGetFileMetadata(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | File ID | defaults to undefined|


### Return type

**StorageControllerUploadFile200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful response |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **storageControllerGetFileUrl**
> StorageControllerGetFileUrl200Response storageControllerGetFileUrl()


### Example

```typescript
import {
    StorageApi,
    Configuration
} from '@usasset/api-client';

const configuration = new Configuration();
const apiInstance = new StorageApi(configuration);

let id: string; //File ID (default to undefined)

const { status, data } = await apiInstance.storageControllerGetFileUrl(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | File ID | defaults to undefined|


### Return type

**StorageControllerGetFileUrl200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | File URL retrieved successfully |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **storageControllerListFiles**
> StorageControllerUploadFile200Response storageControllerListFiles()


### Example

```typescript
import {
    StorageApi,
    Configuration
} from '@usasset/api-client';

const configuration = new Configuration();
const apiInstance = new StorageApi(configuration);

let projectId: string; //The project ID to list files for (default to undefined)
let page: number; // (optional) (default to 1)
let limit: number; // (optional) (default to 10)

const { status, data } = await apiInstance.storageControllerListFiles(
    projectId,
    page,
    limit
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **projectId** | [**string**] | The project ID to list files for | defaults to undefined|
| **page** | [**number**] |  | (optional) defaults to 1|
| **limit** | [**number**] |  | (optional) defaults to 10|


### Return type

**StorageControllerUploadFile200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Files retrieved successfully |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **storageControllerListProjectFiles**
> StorageControllerUploadFile200Response storageControllerListProjectFiles()


### Example

```typescript
import {
    StorageApi,
    Configuration
} from '@usasset/api-client';

const configuration = new Configuration();
const apiInstance = new StorageApi(configuration);

let projectId: string; //Project ID (default to undefined)
let page: number; // (optional) (default to 1)
let limit: number; // (optional) (default to 10)

const { status, data } = await apiInstance.storageControllerListProjectFiles(
    projectId,
    page,
    limit
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **projectId** | [**string**] | Project ID | defaults to undefined|
| **page** | [**number**] |  | (optional) defaults to 1|
| **limit** | [**number**] |  | (optional) defaults to 10|


### Return type

**StorageControllerUploadFile200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Files retrieved successfully |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **storageControllerUploadFile**
> StorageControllerUploadFile200Response storageControllerUploadFile()


### Example

```typescript
import {
    StorageApi,
    Configuration
} from '@usasset/api-client';

const configuration = new Configuration();
const apiInstance = new StorageApi(configuration);

let projectId: string; //The project ID to associate the file with (default to undefined)
let metadata: object; //Optional metadata to store with the file (optional) (default to undefined)

const { status, data } = await apiInstance.storageControllerUploadFile(
    projectId,
    metadata
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **projectId** | [**string**] | The project ID to associate the file with | defaults to undefined|
| **metadata** | **object** | Optional metadata to store with the file | (optional) defaults to undefined|


### Return type

**StorageControllerUploadFile200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: multipart/form-data
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | File uploaded successfully |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

