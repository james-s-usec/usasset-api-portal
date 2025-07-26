# UserWithRolesDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**user** | [**UserInfoDto**](UserInfoDto.md) | User information | [default to undefined]
**roles** | **Array&lt;object&gt;** | List of roles assigned to the user in this project | [default to undefined]
**totalRoles** | **number** | Total number of roles assigned to the user | [default to undefined]

## Example

```typescript
import { UserWithRolesDto } from '@usasset/api-client';

const instance: UserWithRolesDto = {
    user,
    roles,
    totalRoles,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
