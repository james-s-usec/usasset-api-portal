# LocationsApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**locationsControllerCreate**](#locationscontrollercreate) | **POST** /projects/{projectId}/locations | Create a new location in a project|
|[**locationsControllerFindAll**](#locationscontrollerfindall) | **GET** /projects/{projectId}/locations | Get all locations in a project (deprecated - use /paginated instead)|
|[**locationsControllerFindOne**](#locationscontrollerfindone) | **GET** /projects/{projectId}/locations/{id} | Get location by id|
|[**locationsControllerFindPaginated**](#locationscontrollerfindpaginated) | **GET** /projects/{projectId}/locations/paginated | Get paginated locations with search and sort|
|[**locationsControllerRemove**](#locationscontrollerremove) | **DELETE** /projects/{projectId}/locations/{id} | Delete location|
|[**locationsControllerUpdate**](#locationscontrollerupdate) | **PATCH** /projects/{projectId}/locations/{id} | Update location|

# **locationsControllerCreate**
> LocationsControllerCreate200Response locationsControllerCreate(createLocationDto)

Creates a new location within the specified project. Requires create:location permission.

### Example

```typescript
import {
    LocationsApi,
    Configuration,
    CreateLocationDto
} from '@usasset/api-client';

const configuration = new Configuration();
const apiInstance = new LocationsApi(configuration);

let projectId: string; //Project ID (default to undefined)
let createLocationDto: CreateLocationDto; //

const { status, data } = await apiInstance.locationsControllerCreate(
    projectId,
    createLocationDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createLocationDto** | **CreateLocationDto**|  | |
| **projectId** | [**string**] | Project ID | defaults to undefined|


### Return type

**LocationsControllerCreate200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Location created successfully |  -  |
|**403** | Missing required permission: create:location |  -  |
|**404** | Project not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **locationsControllerFindAll**
> locationsControllerFindAll()

Returns all locations within the specified project. Requires view:location permission.

### Example

```typescript
import {
    LocationsApi,
    Configuration
} from '@usasset/api-client';

const configuration = new Configuration();
const apiInstance = new LocationsApi(configuration);

let projectId: string; //Project ID (default to undefined)

const { status, data } = await apiInstance.locationsControllerFindAll(
    projectId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **projectId** | [**string**] | Project ID | defaults to undefined|


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
|**200** | Returns all locations in the project |  -  |
|**403** | Missing required permission: view:location |  -  |
|**404** | Project not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **locationsControllerFindOne**
> locationsControllerFindOne()

Returns a specific location by ID within the specified project. Requires view:location permission.

### Example

```typescript
import {
    LocationsApi,
    Configuration
} from '@usasset/api-client';

const configuration = new Configuration();
const apiInstance = new LocationsApi(configuration);

let projectId: string; //Project ID (default to undefined)
let id: string; //Location ID (default to undefined)

const { status, data } = await apiInstance.locationsControllerFindOne(
    projectId,
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **projectId** | [**string**] | Project ID | defaults to undefined|
| **id** | [**string**] | Location ID | defaults to undefined|


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
|**200** | Returns the location |  -  |
|**403** | Missing required permission: view:location |  -  |
|**404** | Location or project not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **locationsControllerFindPaginated**
> LocationsControllerFindPaginated200Response locationsControllerFindPaginated()

Returns paginated locations within the specified project with optional search and sorting. Requires view:location permission.

### Example

```typescript
import {
    LocationsApi,
    Configuration
} from '@usasset/api-client';

const configuration = new Configuration();
const apiInstance = new LocationsApi(configuration);

let projectId: string; //Project ID (default to undefined)
let page: number; //Page number for pagination (optional) (default to 1)
let limit: number; //Number of items per page (optional) (default to 10)
let search: string; //Search term to filter locations by name (optional) (default to undefined)
let sortBy: 'name' | 'id'; //Sort field (optional) (default to 'name')
let sortOrder: 'asc' | 'desc'; //Sort order (optional) (default to 'asc')

const { status, data } = await apiInstance.locationsControllerFindPaginated(
    projectId,
    page,
    limit,
    search,
    sortBy,
    sortOrder
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **projectId** | [**string**] | Project ID | defaults to undefined|
| **page** | [**number**] | Page number for pagination | (optional) defaults to 1|
| **limit** | [**number**] | Number of items per page | (optional) defaults to 10|
| **search** | [**string**] | Search term to filter locations by name | (optional) defaults to undefined|
| **sortBy** | [**&#39;name&#39; | &#39;id&#39;**]**Array<&#39;name&#39; &#124; &#39;id&#39;>** | Sort field | (optional) defaults to 'name'|
| **sortOrder** | [**&#39;asc&#39; | &#39;desc&#39;**]**Array<&#39;asc&#39; &#124; &#39;desc&#39;>** | Sort order | (optional) defaults to 'asc'|


### Return type

**LocationsControllerFindPaginated200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Returns paginated locations |  -  |
|**403** | Missing required permission: view:location |  -  |
|**404** | Project not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **locationsControllerRemove**
> locationsControllerRemove()

Deletes a location by ID within the specified project. Requires delete:location permission.

### Example

```typescript
import {
    LocationsApi,
    Configuration
} from '@usasset/api-client';

const configuration = new Configuration();
const apiInstance = new LocationsApi(configuration);

let projectId: string; //Project ID (default to undefined)
let id: string; //Location ID (default to undefined)

const { status, data } = await apiInstance.locationsControllerRemove(
    projectId,
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **projectId** | [**string**] | Project ID | defaults to undefined|
| **id** | [**string**] | Location ID | defaults to undefined|


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
|**204** | Location deleted successfully |  -  |
|**403** | Missing required permission: delete:location |  -  |
|**404** | Location or project not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **locationsControllerUpdate**
> locationsControllerUpdate(updateLocationDto)

Updates a location by ID within the specified project. Requires edit:location permission.

### Example

```typescript
import {
    LocationsApi,
    Configuration,
    UpdateLocationDto
} from '@usasset/api-client';

const configuration = new Configuration();
const apiInstance = new LocationsApi(configuration);

let projectId: string; //Project ID (default to undefined)
let id: string; //Location ID (default to undefined)
let updateLocationDto: UpdateLocationDto; //

const { status, data } = await apiInstance.locationsControllerUpdate(
    projectId,
    id,
    updateLocationDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateLocationDto** | **UpdateLocationDto**|  | |
| **projectId** | [**string**] | Project ID | defaults to undefined|
| **id** | [**string**] | Location ID | defaults to undefined|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Location updated successfully |  -  |
|**403** | Missing required permission: edit:location |  -  |
|**404** | Location or project not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

