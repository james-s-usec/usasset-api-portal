# UserStatsDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**totalUsers** | **number** | Total number of users | [default to undefined]
**usersWithProjects** | **number** | Number of users with at least one project | [default to undefined]
**averageProjectsPerUser** | **number** | Average number of projects per user | [default to undefined]
**recentUsers** | **number** | Number of users created in the last 30 days | [default to undefined]

## Example

```typescript
import { UserStatsDto } from '@usasset/api-client';

const instance: UserStatsDto = {
    totalUsers,
    usersWithProjects,
    averageProjectsPerUser,
    recentUsers,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
