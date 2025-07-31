# EquipmentApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**equipmentControllerBulkCreate**](#equipmentcontrollerbulkcreate) | **POST** /equipment/bulk | Create multiple equipment records|
|[**equipmentControllerCreate**](#equipmentcontrollercreate) | **POST** /equipment | Create new equipment|
|[**equipmentControllerFindAll**](#equipmentcontrollerfindall) | **GET** /equipment | Get all equipment|
|[**equipmentControllerFindByLocation**](#equipmentcontrollerfindbylocation) | **GET** /equipment/location/{locationId} | Get equipment by location|
|[**equipmentControllerFindByProject**](#equipmentcontrollerfindbyproject) | **GET** /equipment/project/{projectId} | Get equipment by project|
|[**equipmentControllerFindOne**](#equipmentcontrollerfindone) | **GET** /equipment/{id} | Get equipment by id|
|[**equipmentControllerFindPaginated**](#equipmentcontrollerfindpaginated) | **GET** /equipment/paginated | Get paginated equipment list|
|[**equipmentControllerGetStats**](#equipmentcontrollergetstats) | **GET** /equipment/stats | Get equipment statistics|
|[**equipmentControllerRemove**](#equipmentcontrollerremove) | **DELETE** /equipment/{id} | Delete equipment|
|[**equipmentControllerUpdate**](#equipmentcontrollerupdate) | **PATCH** /equipment/{id} | Update equipment|

# **equipmentControllerBulkCreate**
> EquipmentControllerFindAll200Response equipmentControllerBulkCreate(createEquipmentDto)


### Example

```typescript
import {
    EquipmentApi,
    Configuration
} from '@usasset/api-client';

const configuration = new Configuration();
const apiInstance = new EquipmentApi(configuration);

let createEquipmentDto: Array<CreateEquipmentDto>; //

const { status, data } = await apiInstance.equipmentControllerBulkCreate(
    createEquipmentDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createEquipmentDto** | **Array<CreateEquipmentDto>**|  | |


### Return type

**EquipmentControllerFindAll200Response**

### Authorization

[api-key](../README.md#api-key), [bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Equipment records created successfully |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **equipmentControllerCreate**
> EquipmentControllerFindAll200Response equipmentControllerCreate(createEquipmentDto)


### Example

```typescript
import {
    EquipmentApi,
    Configuration,
    CreateEquipmentDto
} from '@usasset/api-client';

const configuration = new Configuration();
const apiInstance = new EquipmentApi(configuration);

let createEquipmentDto: CreateEquipmentDto; //

const { status, data } = await apiInstance.equipmentControllerCreate(
    createEquipmentDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createEquipmentDto** | **CreateEquipmentDto**|  | |


### Return type

**EquipmentControllerFindAll200Response**

### Authorization

[api-key](../README.md#api-key), [bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Equipment created successfully |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **equipmentControllerFindAll**
> EquipmentControllerFindAll200Response equipmentControllerFindAll()


### Example

```typescript
import {
    EquipmentApi,
    Configuration
} from '@usasset/api-client';

const configuration = new Configuration();
const apiInstance = new EquipmentApi(configuration);

const { status, data } = await apiInstance.equipmentControllerFindAll();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**EquipmentControllerFindAll200Response**

### Authorization

[api-key](../README.md#api-key), [bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | List of all equipment |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **equipmentControllerFindByLocation**
> EquipmentControllerFindAll200Response equipmentControllerFindByLocation()


### Example

```typescript
import {
    EquipmentApi,
    Configuration
} from '@usasset/api-client';

const configuration = new Configuration();
const apiInstance = new EquipmentApi(configuration);

let locationId: string; // (default to undefined)

const { status, data } = await apiInstance.equipmentControllerFindByLocation(
    locationId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **locationId** | [**string**] |  | defaults to undefined|


### Return type

**EquipmentControllerFindAll200Response**

### Authorization

[api-key](../README.md#api-key), [bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | List of equipment in location |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **equipmentControllerFindByProject**
> EquipmentControllerFindAll200Response equipmentControllerFindByProject()


### Example

```typescript
import {
    EquipmentApi,
    Configuration
} from '@usasset/api-client';

const configuration = new Configuration();
const apiInstance = new EquipmentApi(configuration);

let projectId: string; // (default to undefined)

const { status, data } = await apiInstance.equipmentControllerFindByProject(
    projectId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **projectId** | [**string**] |  | defaults to undefined|


### Return type

**EquipmentControllerFindAll200Response**

### Authorization

[api-key](../README.md#api-key), [bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | List of equipment in project |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **equipmentControllerFindOne**
> EquipmentControllerFindAll200Response equipmentControllerFindOne()


### Example

```typescript
import {
    EquipmentApi,
    Configuration
} from '@usasset/api-client';

const configuration = new Configuration();
const apiInstance = new EquipmentApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.equipmentControllerFindOne(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

**EquipmentControllerFindAll200Response**

### Authorization

[api-key](../README.md#api-key), [bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Equipment details |  -  |
|**404** | Equipment not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **equipmentControllerFindPaginated**
> EquipmentControllerFindPaginated200Response equipmentControllerFindPaginated()


### Example

```typescript
import {
    EquipmentApi,
    Configuration
} from '@usasset/api-client';

const configuration = new Configuration();
const apiInstance = new EquipmentApi(configuration);

let page: number; // (optional) (default to 1)
let limit: number; // (optional) (default to 10)
let search: string; //Search by name or mark (optional) (default to undefined)
let status: string; //Filter by status (optional) (default to undefined)
let type: string; //Filter by equipment type (optional) (default to undefined)
let locationId: string; //Filter by location (optional) (default to undefined)
let sortBy: 'mark' | 'name' | 'type' | 'status' | 'createdAt' | 'updatedAt'; //Field to sort by (optional) (default to 'mark')
let sortOrder: 'asc' | 'desc'; //Sort order (optional) (default to 'asc')

const { status, data } = await apiInstance.equipmentControllerFindPaginated(
    page,
    limit,
    search,
    status,
    type,
    locationId,
    sortBy,
    sortOrder
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **page** | [**number**] |  | (optional) defaults to 1|
| **limit** | [**number**] |  | (optional) defaults to 10|
| **search** | [**string**] | Search by name or mark | (optional) defaults to undefined|
| **status** | [**string**] | Filter by status | (optional) defaults to undefined|
| **type** | [**string**] | Filter by equipment type | (optional) defaults to undefined|
| **locationId** | [**string**] | Filter by location | (optional) defaults to undefined|
| **sortBy** | [**&#39;mark&#39; | &#39;name&#39; | &#39;type&#39; | &#39;status&#39; | &#39;createdAt&#39; | &#39;updatedAt&#39;**]**Array<&#39;mark&#39; &#124; &#39;name&#39; &#124; &#39;type&#39; &#124; &#39;status&#39; &#124; &#39;createdAt&#39; &#124; &#39;updatedAt&#39;>** | Field to sort by | (optional) defaults to 'mark'|
| **sortOrder** | [**&#39;asc&#39; | &#39;desc&#39;**]**Array<&#39;asc&#39; &#124; &#39;desc&#39;>** | Sort order | (optional) defaults to 'asc'|


### Return type

**EquipmentControllerFindPaginated200Response**

### Authorization

[api-key](../README.md#api-key), [bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Paginated list of equipment |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **equipmentControllerGetStats**
> equipmentControllerGetStats()


### Example

```typescript
import {
    EquipmentApi,
    Configuration
} from '@usasset/api-client';

const configuration = new Configuration();
const apiInstance = new EquipmentApi(configuration);

let projectId: string; // (optional) (default to undefined)

const { status, data } = await apiInstance.equipmentControllerGetStats(
    projectId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **projectId** | [**string**] |  | (optional) defaults to undefined|


### Return type

void (empty response body)

### Authorization

[api-key](../README.md#api-key), [bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Equipment statistics |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **equipmentControllerRemove**
> equipmentControllerRemove()


### Example

```typescript
import {
    EquipmentApi,
    Configuration
} from '@usasset/api-client';

const configuration = new Configuration();
const apiInstance = new EquipmentApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.equipmentControllerRemove(
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

[api-key](../README.md#api-key), [bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**204** | Equipment deleted successfully |  -  |
|**404** | Equipment not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **equipmentControllerUpdate**
> EquipmentControllerFindAll200Response equipmentControllerUpdate(updateEquipmentDto)


### Example

```typescript
import {
    EquipmentApi,
    Configuration,
    UpdateEquipmentDto
} from '@usasset/api-client';

const configuration = new Configuration();
const apiInstance = new EquipmentApi(configuration);

let id: string; // (default to undefined)
let updateEquipmentDto: UpdateEquipmentDto; //

const { status, data } = await apiInstance.equipmentControllerUpdate(
    id,
    updateEquipmentDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateEquipmentDto** | **UpdateEquipmentDto**|  | |
| **id** | [**string**] |  | defaults to undefined|


### Return type

**EquipmentControllerFindAll200Response**

### Authorization

[api-key](../README.md#api-key), [bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Equipment updated successfully |  -  |
|**404** | Equipment not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

