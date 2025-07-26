# MyPermissionsDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**userId** | **string** | User ID | [default to undefined]
**projectId** | **object** | Active project ID | [optional] [default to undefined]
**projectCode** | **object** | Project code | [optional] [default to undefined]
**projectName** | **object** | Project name | [optional] [default to undefined]
**roles** | **Array&lt;string&gt;** | List of role names assigned to the user | [default to undefined]
**permissions** | **Array&lt;string&gt;** | List of permissions available to the user | [default to undefined]
**issuedAt** | **string** | Timestamp when this permission set was issued | [default to undefined]

## Example

```typescript
import { MyPermissionsDto } from '@usasset/api-client';

const instance: MyPermissionsDto = {
    userId,
    projectId,
    projectCode,
    projectName,
    roles,
    permissions,
    issuedAt,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
