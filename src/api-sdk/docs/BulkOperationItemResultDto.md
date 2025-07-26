# BulkOperationItemResultDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**userId** | **string** | User ID | [default to undefined]
**projectId** | **string** | Project ID | [default to undefined]
**success** | **boolean** | Whether the operation succeeded | [default to undefined]
**error** | **string** | Error message if the operation failed | [optional] [default to undefined]

## Example

```typescript
import { BulkOperationItemResultDto } from '@usasset/api-client';

const instance: BulkOperationItemResultDto = {
    userId,
    projectId,
    success,
    error,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
