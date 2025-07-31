# CreateEquipmentDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**mark** | **string** | Equipment mark/tag from drawings | [default to undefined]
**name** | **string** |  | [default to undefined]
**description** | **string** |  | [optional] [default to undefined]
**type** | **string** | Equipment type (Air Handler, VAV Box, etc.) | [default to undefined]
**manufacturer** | **string** |  | [optional] [default to undefined]
**model** | **string** |  | [optional] [default to undefined]
**serialNumber** | **string** |  | [optional] [default to undefined]
**uniformatCode** | **string** | UniFormat classification code | [optional] [default to undefined]
**masterformatCode** | **string** | MasterFormat classification code | [optional] [default to undefined]
**omniclassNumber** | **string** | OmniClass classification number | [optional] [default to undefined]
**notes** | **string** |  | [optional] [default to undefined]
**metadata** | **object** | Custom metadata fields | [optional] [default to undefined]
**projectId** | **string** |  | [default to undefined]
**locationId** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { CreateEquipmentDto } from '@usasset/api-client';

const instance: CreateEquipmentDto = {
    mark,
    name,
    description,
    type,
    manufacturer,
    model,
    serialNumber,
    uniformatCode,
    masterformatCode,
    omniclassNumber,
    notes,
    metadata,
    projectId,
    locationId,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
