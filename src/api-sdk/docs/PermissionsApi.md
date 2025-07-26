# PermissionsApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**permissionsControllerCheckPermission**](#permissionscontrollercheckpermission) | **GET** /permissions/check/{permission} | Check specific permission|
|[**permissionsControllerGetMyPermissions**](#permissionscontrollergetmypermissions) | **GET** /permissions/my-permissions | Get my permissions|
|[**permissionsControllerGetPermissionMatrix**](#permissionscontrollergetpermissionmatrix) | **GET** /permissions/matrix | Get permission matrix|
|[**permissionsControllerGetRoleDetails**](#permissionscontrollergetroledetails) | **GET** /permissions/roles/{roleName} | Get role details|
|[**permissionsControllerListAllPermissions**](#permissionscontrollerlistallpermissions) | **GET** /permissions | List all permissions|

# **permissionsControllerCheckPermission**
> PermissionCheckResultDto permissionsControllerCheckPermission()

Check if the current user has a specific permission in their active project.

### Example

```typescript
import {
    PermissionsApi,
    Configuration
} from '@usasset/api-client';

const configuration = new Configuration();
const apiInstance = new PermissionsApi(configuration);

let permission: string; //Permission to check (e.g., \"edit:asset\") (default to undefined)

const { status, data } = await apiInstance.permissionsControllerCheckPermission(
    permission
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **permission** | [**string**] | Permission to check (e.g., \&quot;edit:asset\&quot;) | defaults to undefined|


### Return type

**PermissionCheckResultDto**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Permission check result |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **permissionsControllerGetMyPermissions**
> MyPermissionsDto permissionsControllerGetMyPermissions()

Get the current user\'s permissions in their active project context.

### Example

```typescript
import {
    PermissionsApi,
    Configuration
} from '@usasset/api-client';

const configuration = new Configuration();
const apiInstance = new PermissionsApi(configuration);

const { status, data } = await apiInstance.permissionsControllerGetMyPermissions();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**MyPermissionsDto**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successfully retrieved permissions |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **permissionsControllerGetPermissionMatrix**
> PermissionMatrixDto permissionsControllerGetPermissionMatrix()

Get a matrix showing all roles and their permissions for easy visualization.

### Example

```typescript
import {
    PermissionsApi,
    Configuration
} from '@usasset/api-client';

const configuration = new Configuration();
const apiInstance = new PermissionsApi(configuration);

const { status, data } = await apiInstance.permissionsControllerGetPermissionMatrix();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**PermissionMatrixDto**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successfully retrieved permission matrix |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **permissionsControllerGetRoleDetails**
> RoleDetailsDto permissionsControllerGetRoleDetails()

Get detailed information about a specific role including all its permissions.

### Example

```typescript
import {
    PermissionsApi,
    Configuration
} from '@usasset/api-client';

const configuration = new Configuration();
const apiInstance = new PermissionsApi(configuration);

let roleName: string; //Role name (e.g., \"project_admin\") (default to undefined)

const { status, data } = await apiInstance.permissionsControllerGetRoleDetails(
    roleName
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **roleName** | [**string**] | Role name (e.g., \&quot;project_admin\&quot;) | defaults to undefined|


### Return type

**RoleDetailsDto**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successfully retrieved role details |  -  |
|**404** | Role not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **permissionsControllerListAllPermissions**
> Array<PermissionDto> permissionsControllerListAllPermissions()

Get all available permissions in the system grouped by resource.

### Example

```typescript
import {
    PermissionsApi,
    Configuration
} from '@usasset/api-client';

const configuration = new Configuration();
const apiInstance = new PermissionsApi(configuration);

const { status, data } = await apiInstance.permissionsControllerListAllPermissions();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<PermissionDto>**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successfully retrieved permissions |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

