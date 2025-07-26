# AuditLogPaginationDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**total** | **number** | Total number of audit log entries | [default to undefined]
**page** | **number** | Current page number | [default to undefined]
**limit** | **number** | Number of items per page | [default to undefined]
**totalPages** | **number** | Total number of pages | [default to undefined]

## Example

```typescript
import { AuditLogPaginationDto } from '@usasset/api-client';

const instance: AuditLogPaginationDto = {
    total,
    page,
    limit,
    totalPages,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
