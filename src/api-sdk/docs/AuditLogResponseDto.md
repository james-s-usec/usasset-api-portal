# AuditLogResponseDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**logs** | [**Array&lt;AuditLogEntryDto&gt;**](AuditLogEntryDto.md) | List of audit log entries | [default to undefined]
**pagination** | [**AuditLogPaginationDto**](AuditLogPaginationDto.md) | Pagination information | [default to undefined]

## Example

```typescript
import { AuditLogResponseDto } from '@usasset/api-client';

const instance: AuditLogResponseDto = {
    logs,
    pagination,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
