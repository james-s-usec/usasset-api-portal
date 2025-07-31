# StorageFileDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** | Unique identifier for the file | [default to undefined]
**fileName** | **string** | Original file name | [default to undefined]
**size** | **number** | File size in bytes | [default to undefined]
**contentType** | **string** | MIME type of the file | [default to undefined]
**uploadedAt** | **string** | Date when the file was uploaded | [default to undefined]
**metadata** | **object** | Optional metadata associated with the file | [optional] [default to undefined]

## Example

```typescript
import { StorageFileDto } from '@usasset/api-client';

const instance: StorageFileDto = {
    id,
    fileName,
    size,
    contentType,
    uploadedAt,
    metadata,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
