# ProjectUsersResponseDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**project** | [**ProjectInfoDto**](ProjectInfoDto.md) | Project information | [default to undefined]
**users** | **Array&lt;object&gt;** | List of users in the project with their roles | [default to undefined]
**totalUsers** | **number** | Total number of users in the project | [default to undefined]

## Example

```typescript
import { ProjectUsersResponseDto } from '@usasset/api-client';

const instance: ProjectUsersResponseDto = {
    project,
    users,
    totalUsers,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
