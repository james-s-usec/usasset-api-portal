# RoleDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** | Unique identifier of the role | [default to undefined]
**name** | **string** | System name of the role | [default to undefined]
**displayName** | **string** | Human-readable name of the role | [default to undefined]
**description** | **object** | Description of the role and its purpose | [optional] [default to undefined]
**permissions** | **Array&lt;string&gt;** | List of permissions granted by this role | [default to undefined]
**userCount** | **number** | Number of users currently assigned this role | [default to undefined]

## Example

```typescript
import { RoleDto } from '@usasset/api-client';

const instance: RoleDto = {
    id,
    name,
    displayName,
    description,
    permissions,
    userCount,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
