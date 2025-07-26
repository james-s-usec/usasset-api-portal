# ProjectsApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**projectsControllerCreate**](#projectscontrollercreate) | **POST** /projects | Create a new project|
|[**projectsControllerFindAll**](#projectscontrollerfindall) | **GET** /projects | Get all projects (deprecated - use /projects/paginated instead)|
|[**projectsControllerFindOne**](#projectscontrollerfindone) | **GET** /projects/{id} | Get project by id|
|[**projectsControllerFindPaginated**](#projectscontrollerfindpaginated) | **GET** /projects/paginated | Get paginated projects with search and sort|
|[**projectsControllerGetStats**](#projectscontrollergetstats) | **GET** /projects/stats | Get project statistics|
|[**projectsControllerRemove**](#projectscontrollerremove) | **DELETE** /projects/{id} | Delete project|
|[**projectsControllerUpdate**](#projectscontrollerupdate) | **PATCH** /projects/{id} | Update project|

# **projectsControllerCreate**
> ProjectsControllerCreate200Response projectsControllerCreate(createProjectDto)

Creates a new project. Requires create:project permission.

### Example

```typescript
import {
    ProjectsApi,
    Configuration,
    CreateProjectDto
} from '@usasset/api-client';

const configuration = new Configuration();
const apiInstance = new ProjectsApi(configuration);

let createProjectDto: CreateProjectDto; //

const { status, data } = await apiInstance.projectsControllerCreate(
    createProjectDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createProjectDto** | **CreateProjectDto**|  | |


### Return type

**ProjectsControllerCreate200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Project created successfully |  -  |
|**403** | Missing required permission: create:project |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **projectsControllerFindAll**
> projectsControllerFindAll()

Returns all projects. Requires view:project permission.

### Example

```typescript
import {
    ProjectsApi,
    Configuration
} from '@usasset/api-client';

const configuration = new Configuration();
const apiInstance = new ProjectsApi(configuration);

const { status, data } = await apiInstance.projectsControllerFindAll();
```

### Parameters
This endpoint does not have any parameters.


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
|**200** | Returns all projects |  -  |
|**403** | Missing required permission: view:project |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **projectsControllerFindOne**
> projectsControllerFindOne()

Returns a specific project by ID. Requires view:project permission.

### Example

```typescript
import {
    ProjectsApi,
    Configuration
} from '@usasset/api-client';

const configuration = new Configuration();
const apiInstance = new ProjectsApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.projectsControllerFindOne(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


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
|**200** | Returns the project |  -  |
|**403** | Missing required permission: view:project |  -  |
|**404** | Project not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **projectsControllerFindPaginated**
> ProjectsControllerFindPaginated200Response projectsControllerFindPaginated()

Returns paginated projects with optional search and sorting. Requires view:project permission.

### Example

```typescript
import {
    ProjectsApi,
    Configuration
} from '@usasset/api-client';

const configuration = new Configuration();
const apiInstance = new ProjectsApi(configuration);

let page: number; //Page number for pagination (optional) (default to 1)
let limit: number; //Number of items per page (optional) (default to 10)
let search: string; //Search term to filter projects by name (optional) (default to undefined)
let sortBy: 'name' | 'createdAt'; //Sort field (optional) (default to 'createdAt')
let sortOrder: 'asc' | 'desc'; //Sort order (optional) (default to 'desc')

const { status, data } = await apiInstance.projectsControllerFindPaginated(
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
| **page** | [**number**] | Page number for pagination | (optional) defaults to 1|
| **limit** | [**number**] | Number of items per page | (optional) defaults to 10|
| **search** | [**string**] | Search term to filter projects by name | (optional) defaults to undefined|
| **sortBy** | [**&#39;name&#39; | &#39;createdAt&#39;**]**Array<&#39;name&#39; &#124; &#39;createdAt&#39;>** | Sort field | (optional) defaults to 'createdAt'|
| **sortOrder** | [**&#39;asc&#39; | &#39;desc&#39;**]**Array<&#39;asc&#39; &#124; &#39;desc&#39;>** | Sort order | (optional) defaults to 'desc'|


### Return type

**ProjectsControllerFindPaginated200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Returns paginated projects |  -  |
|**403** | Missing required permission: view:project |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **projectsControllerGetStats**
> ProjectsControllerGetStats200Response projectsControllerGetStats()

Returns project statistics including counts and recent activity. Requires view:project permission.

### Example

```typescript
import {
    ProjectsApi,
    Configuration
} from '@usasset/api-client';

const configuration = new Configuration();
const apiInstance = new ProjectsApi(configuration);

const { status, data } = await apiInstance.projectsControllerGetStats();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**ProjectsControllerGetStats200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Returns project statistics |  -  |
|**403** | Missing required permission: view:project |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **projectsControllerRemove**
> projectsControllerRemove()

Deletes a project by ID. Requires delete:project permission.

### Example

```typescript
import {
    ProjectsApi,
    Configuration
} from '@usasset/api-client';

const configuration = new Configuration();
const apiInstance = new ProjectsApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.projectsControllerRemove(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


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
|**204** | Project deleted successfully |  -  |
|**403** | Missing required permission: delete:project |  -  |
|**404** | Project not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **projectsControllerUpdate**
> projectsControllerUpdate(updateProjectDto)

Updates a project by ID. Requires edit:project permission.

### Example

```typescript
import {
    ProjectsApi,
    Configuration,
    UpdateProjectDto
} from '@usasset/api-client';

const configuration = new Configuration();
const apiInstance = new ProjectsApi(configuration);

let id: string; // (default to undefined)
let updateProjectDto: UpdateProjectDto; //

const { status, data } = await apiInstance.projectsControllerUpdate(
    id,
    updateProjectDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateProjectDto** | **UpdateProjectDto**|  | |
| **id** | [**string**] |  | defaults to undefined|


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
|**200** | Project updated successfully |  -  |
|**403** | Missing required permission: edit:project |  -  |
|**404** | Project not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

