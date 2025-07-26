# ApiPaginatedResponseDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**success** | **boolean** | Indicates if the request was successful | [default to undefined]
**data** | **object** | Paginated data with items and metadata | [default to undefined]
**message** | **string** | Optional message | [optional] [default to undefined]
**timestamp** | **string** | Timestamp of the response | [default to undefined]
**path** | **string** | Request path | [default to undefined]

## Example

```typescript
import { ApiPaginatedResponseDto } from '@usasset/api-client';

const instance: ApiPaginatedResponseDto = {
    success,
    data,
    message,
    timestamp,
    path,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
