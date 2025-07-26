# RoleManagementApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**rolesControllerAssignRole**](#rolescontrollerassignrole) | **POST** /projects/{projectId}/roles/users/{userId} | Assign role to user|
|[**rolesControllerBatchAssignRole**](#rolescontrollerbatchassignrole) | **POST** /projects/{projectId}/roles/batch-assign | Batch assign roles|
|[**rolesControllerGetRoleAuditLog**](#rolescontrollergetroleauditlog) | **GET** /projects/{projectId}/roles/audit | Get role assignment audit log|
|[**rolesControllerGetUserRoles**](#rolescontrollergetuserroles) | **GET** /projects/{projectId}/roles/users/{userId} | Get user roles in project|
|[**rolesControllerListProjectUsers**](#rolescontrollerlistprojectusers) | **GET** /projects/{projectId}/roles/users | List users in project|
|[**rolesControllerListRoles**](#rolescontrollerlistroles) | **GET** /projects/{projectId}/roles | List all available roles|
|[**rolesControllerRemoveRole**](#rolescontrollerremoverole) | **DELETE** /projects/{projectId}/roles/users/{userId}/roles/{roleName} | Remove role from user|

# **rolesControllerAssignRole**
> rolesControllerAssignRole(assignRoleDto)

Assign a role to a user in this project. Requires edit:user permission.

### Example

```typescript
import {
    RoleManagementApi,
    Configuration,
    AssignRoleDto
} from '@usasset/api-client';

const configuration = new Configuration();
const apiInstance = new RoleManagementApi(configuration);

let projectId: string; //Project ID (UUID) (default to undefined)
let userId: string; //User ID (UUID) (default to undefined)
let assignRoleDto: AssignRoleDto; //

const { status, data } = await apiInstance.rolesControllerAssignRole(
    projectId,
    userId,
    assignRoleDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **assignRoleDto** | **AssignRoleDto**|  | |
| **projectId** | [**string**] | Project ID (UUID) | defaults to undefined|
| **userId** | [**string**] | User ID (UUID) | defaults to undefined|


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
|**201** | Role assigned successfully |  -  |
|**400** | Invalid input |  -  |
|**403** | Insufficient permissions |  -  |
|**404** | User, project, or role not found |  -  |
|**409** | Role already assigned |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **rolesControllerBatchAssignRole**
> BulkOperationResultDto rolesControllerBatchAssignRole(bulkAssignRoleDto)

Assign the same role to multiple users. Requires admin:system permission.

### Example

```typescript
import {
    RoleManagementApi,
    Configuration,
    BulkAssignRoleDto
} from '@usasset/api-client';

const configuration = new Configuration();
const apiInstance = new RoleManagementApi(configuration);

let projectId: string; //Project ID (UUID) (default to undefined)
let bulkAssignRoleDto: BulkAssignRoleDto; //

const { status, data } = await apiInstance.rolesControllerBatchAssignRole(
    projectId,
    bulkAssignRoleDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **bulkAssignRoleDto** | **BulkAssignRoleDto**|  | |
| **projectId** | [**string**] | Project ID (UUID) | defaults to undefined|


### Return type

**BulkOperationResultDto**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Batch assignment completed |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **rolesControllerGetRoleAuditLog**
> AuditLogResponseDto rolesControllerGetRoleAuditLog()

Retrieve audit log of role assignments and removals for this project.

### Example

```typescript
import {
    RoleManagementApi,
    Configuration
} from '@usasset/api-client';

const configuration = new Configuration();
const apiInstance = new RoleManagementApi(configuration);

let projectId: string; //Project ID (UUID) (default to undefined)
let userId: string; //Filter by user ID (optional) (default to undefined)
let performedBy: string; //Filter by admin who performed action (optional) (default to undefined)
let limit: number; //Results per page (default: 50) (optional) (default to undefined)
let page: number; //Page number (default: 1) (optional) (default to undefined)

const { status, data } = await apiInstance.rolesControllerGetRoleAuditLog(
    projectId,
    userId,
    performedBy,
    limit,
    page
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **projectId** | [**string**] | Project ID (UUID) | defaults to undefined|
| **userId** | [**string**] | Filter by user ID | (optional) defaults to undefined|
| **performedBy** | [**string**] | Filter by admin who performed action | (optional) defaults to undefined|
| **limit** | [**number**] | Results per page (default: 50) | (optional) defaults to undefined|
| **page** | [**number**] | Page number (default: 1) | (optional) defaults to undefined|


### Return type

**AuditLogResponseDto**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successfully retrieved audit log |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **rolesControllerGetUserRoles**
> UserWithRolesDto rolesControllerGetUserRoles()

Get all roles assigned to a specific user in this project.

### Example

```typescript
import {
    RoleManagementApi,
    Configuration
} from '@usasset/api-client';

const configuration = new Configuration();
const apiInstance = new RoleManagementApi(configuration);

let projectId: string; //Project ID (UUID) (default to undefined)
let userId: string; //User ID (UUID) (default to undefined)

const { status, data } = await apiInstance.rolesControllerGetUserRoles(
    projectId,
    userId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **projectId** | [**string**] | Project ID (UUID) | defaults to undefined|
| **userId** | [**string**] | User ID (UUID) | defaults to undefined|


### Return type

**UserWithRolesDto**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successfully retrieved user roles |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **rolesControllerListProjectUsers**
> ProjectUsersResponseDto rolesControllerListProjectUsers()

Get all users in this project with their assigned roles.

### Example

```typescript
import {
    RoleManagementApi,
    Configuration
} from '@usasset/api-client';

const configuration = new Configuration();
const apiInstance = new RoleManagementApi(configuration);

let projectId: string; //Project ID (UUID) (default to undefined)

const { status, data } = await apiInstance.rolesControllerListProjectUsers(
    projectId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **projectId** | [**string**] | Project ID (UUID) | defaults to undefined|


### Return type

**ProjectUsersResponseDto**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successfully retrieved project users |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **rolesControllerListRoles**
> Array<RoleDto> rolesControllerListRoles()

Get all roles available in the system with their permissions.

### Example

```typescript
import {
    RoleManagementApi,
    Configuration
} from '@usasset/api-client';

const configuration = new Configuration();
const apiInstance = new RoleManagementApi(configuration);

let projectId: string; //Project ID (UUID) (default to undefined)

const { status, data } = await apiInstance.rolesControllerListRoles(
    projectId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **projectId** | [**string**] | Project ID (UUID) | defaults to undefined|


### Return type

**Array<RoleDto>**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successfully retrieved roles |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **rolesControllerRemoveRole**
> rolesControllerRemoveRole()

Remove a role from a user in this project. Requires edit:user permission.

### Example

```typescript
import {
    RoleManagementApi,
    Configuration
} from '@usasset/api-client';

const configuration = new Configuration();
const apiInstance = new RoleManagementApi(configuration);

let projectId: string; //Project ID (UUID) (default to undefined)
let userId: string; //User ID (UUID) (default to undefined)
let roleName: string; //Role name to remove (default to undefined)
let reason: string; //Reason for removal (optional) (default to undefined)

const { status, data } = await apiInstance.rolesControllerRemoveRole(
    projectId,
    userId,
    roleName,
    reason
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **projectId** | [**string**] | Project ID (UUID) | defaults to undefined|
| **userId** | [**string**] | User ID (UUID) | defaults to undefined|
| **roleName** | [**string**] | Role name to remove | defaults to undefined|
| **reason** | [**string**] | Reason for removal | (optional) defaults to undefined|


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
|**200** | Role removed successfully |  -  |
|**400** | Invalid input |  -  |
|**403** | Insufficient permissions |  -  |
|**404** | Role assignment not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

