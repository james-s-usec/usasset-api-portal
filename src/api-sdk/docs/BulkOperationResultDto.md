# BulkOperationResultDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**totalOperations** | **number** | Total number of operations attempted | [default to undefined]
**successCount** | **number** | Number of successful operations | [default to undefined]
**failureCount** | **number** | Number of failed operations | [default to undefined]
**results** | [**Array&lt;BulkOperationItemResultDto&gt;**](BulkOperationItemResultDto.md) | Detailed results for each operation | [default to undefined]

## Example

```typescript
import { BulkOperationResultDto } from '@usasset/api-client';

const instance: BulkOperationResultDto = {
    totalOperations,
    successCount,
    failureCount,
    results,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
