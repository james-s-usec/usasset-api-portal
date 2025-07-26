# PermissionMatrixDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**roles** | [**{ [key: string]: PermissionMatrixDtoRolesValue; }**](PermissionMatrixDtoRolesValue.md) | Map of role names to their permission information | [default to undefined]
**resources** | **Array&lt;string&gt;** | List of all unique resources in the system | [default to undefined]
**actions** | **Array&lt;string&gt;** | List of all unique actions in the system | [default to undefined]

## Example

```typescript
import { PermissionMatrixDto } from '@usasset/api-client';

const instance: PermissionMatrixDto = {
    roles,
    resources,
    actions,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
