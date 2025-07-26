# UsersApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**usersControllerCreate**](#userscontrollercreate) | **POST** /users | Create a new user|
|[**usersControllerCreateBulk**](#userscontrollercreatebulk) | **POST** /users/bulk | Create multiple users|
|[**usersControllerFindAll**](#userscontrollerfindall) | **GET** /users | Get all users (deprecated - use /users/paginated instead)|
|[**usersControllerFindOne**](#userscontrollerfindone) | **GET** /users/{id} | Get user by id|
|[**usersControllerFindPaginated**](#userscontrollerfindpaginated) | **GET** /users/paginated | Get paginated users with search and sort|
|[**usersControllerGetStats**](#userscontrollergetstats) | **GET** /users/stats | Get user statistics|
|[**usersControllerRemove**](#userscontrollerremove) | **DELETE** /users/{id} | Delete user|
|[**usersControllerUpdate**](#userscontrollerupdate) | **PATCH** /users/{id} | Update user|

# **usersControllerCreate**
> UsersControllerCreate200Response usersControllerCreate(createUserDto)

Creates a new user. Requires create:user permission. Typically restricted to project_admin role.

### Example

```typescript
import {
    UsersApi,
    Configuration,
    CreateUserDto
} from '@usasset/api-client';

const configuration = new Configuration();
const apiInstance = new UsersApi(configuration);

let createUserDto: CreateUserDto; //

const { status, data } = await apiInstance.usersControllerCreate(
    createUserDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createUserDto** | **CreateUserDto**|  | |


### Return type

**UsersControllerCreate200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | User created successfully |  -  |
|**403** | Missing required permission: create:user |  -  |
|**409** | User with email already exists |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **usersControllerCreateBulk**
> Array<object> usersControllerCreateBulk(requestBody)

Creates multiple users in a single operation. Requires create:user permission. Typically restricted to project_admin role.

### Example

```typescript
import {
    UsersApi,
    Configuration
} from '@usasset/api-client';

const configuration = new Configuration();
const apiInstance = new UsersApi(configuration);

let requestBody: Array<string>; //

const { status, data } = await apiInstance.usersControllerCreateBulk(
    requestBody
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **requestBody** | **Array<string>**|  | |


### Return type

**Array<object>**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Users created successfully |  -  |
|**403** | Missing required permission: create:user |  -  |
|**409** | One or more emails already exist |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **usersControllerFindAll**
> usersControllerFindAll()

Returns all users. Requires view:user permission.

### Example

```typescript
import {
    UsersApi,
    Configuration
} from '@usasset/api-client';

const configuration = new Configuration();
const apiInstance = new UsersApi(configuration);

const { status, data } = await apiInstance.usersControllerFindAll();
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
|**200** | Returns all users |  -  |
|**403** | Missing required permission: view:user |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **usersControllerFindOne**
> usersControllerFindOne()

Returns a specific user by ID. Requires view:user permission.

### Example

```typescript
import {
    UsersApi,
    Configuration
} from '@usasset/api-client';

const configuration = new Configuration();
const apiInstance = new UsersApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.usersControllerFindOne(
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
|**200** | Returns the user |  -  |
|**403** | Missing required permission: view:user |  -  |
|**404** | User not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **usersControllerFindPaginated**
> UsersControllerFindPaginated200Response usersControllerFindPaginated()

Returns paginated users with optional search and sorting. Requires view:user permission.

### Example

```typescript
import {
    UsersApi,
    Configuration
} from '@usasset/api-client';

const configuration = new Configuration();
const apiInstance = new UsersApi(configuration);

let page: number; // (optional) (default to 1)
let limit: number; // (optional) (default to 10)
let search: string; //Search by name or email (optional) (default to undefined)
let sortBy: 'id' | 'name' | 'email' | 'createdAt'; // (optional) (default to 'id')
let sortOrder: 'asc' | 'desc'; // (optional) (default to 'asc')

const { status, data } = await apiInstance.usersControllerFindPaginated(
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
| **page** | [**number**] |  | (optional) defaults to 1|
| **limit** | [**number**] |  | (optional) defaults to 10|
| **search** | [**string**] | Search by name or email | (optional) defaults to undefined|
| **sortBy** | [**&#39;id&#39; | &#39;name&#39; | &#39;email&#39; | &#39;createdAt&#39;**]**Array<&#39;id&#39; &#124; &#39;name&#39; &#124; &#39;email&#39; &#124; &#39;createdAt&#39;>** |  | (optional) defaults to 'id'|
| **sortOrder** | [**&#39;asc&#39; | &#39;desc&#39;**]**Array<&#39;asc&#39; &#124; &#39;desc&#39;>** |  | (optional) defaults to 'asc'|


### Return type

**UsersControllerFindPaginated200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Returns paginated users |  -  |
|**403** | Missing required permission: view:user |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **usersControllerGetStats**
> UsersControllerGetStats200Response usersControllerGetStats()

Returns user statistics including counts and recent activity. Requires view:user permission.

### Example

```typescript
import {
    UsersApi,
    Configuration
} from '@usasset/api-client';

const configuration = new Configuration();
const apiInstance = new UsersApi(configuration);

const { status, data } = await apiInstance.usersControllerGetStats();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**UsersControllerGetStats200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Returns user statistics |  -  |
|**403** | Missing required permission: view:user |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **usersControllerRemove**
> usersControllerRemove()

Deletes a user by ID. Requires delete:user permission. Typically restricted to project_admin role.

### Example

```typescript
import {
    UsersApi,
    Configuration
} from '@usasset/api-client';

const configuration = new Configuration();
const apiInstance = new UsersApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.usersControllerRemove(
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
|**204** | User deleted successfully |  -  |
|**403** | Missing required permission: delete:user |  -  |
|**404** | User not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **usersControllerUpdate**
> usersControllerUpdate(updateUserDto)

Updates a user by ID. Requires edit:user permission. Typically restricted to project_admin role.

### Example

```typescript
import {
    UsersApi,
    Configuration,
    UpdateUserDto
} from '@usasset/api-client';

const configuration = new Configuration();
const apiInstance = new UsersApi(configuration);

let id: string; // (default to undefined)
let updateUserDto: UpdateUserDto; //

const { status, data } = await apiInstance.usersControllerUpdate(
    id,
    updateUserDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateUserDto** | **UpdateUserDto**|  | |
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
|**200** | User updated successfully |  -  |
|**403** | Missing required permission: edit:user |  -  |
|**404** | User not found |  -  |
|**409** | Email already in use |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

