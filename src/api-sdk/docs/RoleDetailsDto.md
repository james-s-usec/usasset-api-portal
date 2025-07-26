# RoleDetailsDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** | Unique identifier of the role | [default to undefined]
**name** | **string** | System name of the role | [default to undefined]
**displayName** | **string** | Human-readable name of the role | [default to undefined]
**description** | **object** | Description of the role and its purpose | [optional] [default to undefined]
**isSystem** | **boolean** | Whether this is a system-defined role | [default to undefined]
**permissions** | [**Array&lt;PermissionDto&gt;**](PermissionDto.md) | List of all permissions granted by this role | [default to undefined]
**permissionsByResource** | **{ [key: string]: Array&lt;PermissionDto&gt;; }** | Permissions grouped by resource for easy visualization | [default to undefined]
**totalPermissions** | **number** | Total number of permissions this role grants | [default to undefined]
**totalUsers** | **number** | Total number of users assigned this role across all projects | [default to undefined]

## Example

```typescript
import { RoleDetailsDto } from '@usasset/api-client';

const instance: RoleDetailsDto = {
    id,
    name,
    displayName,
    description,
    isSystem,
    permissions,
    permissionsByResource,
    totalPermissions,
    totalUsers,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
