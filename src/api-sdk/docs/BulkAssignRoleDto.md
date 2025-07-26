# BulkAssignRoleDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**roleName** | **string** | Name of the role to assign to all users | [default to undefined]
**assignments** | [**Array&lt;UserAssignmentDto&gt;**](UserAssignmentDto.md) | List of users to assign the role to | [default to undefined]
**reason** | **string** | Optional reason for the bulk role assignment | [optional] [default to undefined]

## Example

```typescript
import { BulkAssignRoleDto } from '@usasset/api-client';

const instance: BulkAssignRoleDto = {
    roleName,
    assignments,
    reason,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
