# PermissionCheckResultDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**hasPermission** | **boolean** | Whether the user has the requested permission | [default to undefined]
**permission** | **string** | The permission that was checked | [default to undefined]
**userId** | **string** | User ID that was checked | [default to undefined]
**projectId** | **object** | Project ID where the permission was checked | [optional] [default to undefined]

## Example

```typescript
import { PermissionCheckResultDto } from '@usasset/api-client';

const instance: PermissionCheckResultDto = {
    hasPermission,
    permission,
    userId,
    projectId,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
