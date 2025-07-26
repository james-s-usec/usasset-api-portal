# PermissionDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** | Unique identifier of the permission | [default to undefined]
**action** | **string** | Action part of the permission | [default to undefined]
**resource** | **string** | Resource part of the permission | [default to undefined]
**description** | **object** | Human-readable description of what this permission allows | [optional] [default to undefined]
**permissionString** | **string** | Full permission string in action:resource format | [default to undefined]

## Example

```typescript
import { PermissionDto } from '@usasset/api-client';

const instance: PermissionDto = {
    id,
    action,
    resource,
    description,
    permissionString,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
