# UpdateEquipmentDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**mark** | **string** | Equipment mark/tag from drawings | [optional] [default to undefined]
**name** | **string** |  | [optional] [default to undefined]
**description** | **string** |  | [optional] [default to undefined]
**type** | **string** | Equipment type (Air Handler, VAV Box, etc.) | [optional] [default to undefined]
**manufacturer** | **string** |  | [optional] [default to undefined]
**model** | **string** |  | [optional] [default to undefined]
**serialNumber** | **string** |  | [optional] [default to undefined]
**uniformatCode** | **string** | UniFormat classification code | [optional] [default to undefined]
**masterformatCode** | **string** | MasterFormat classification code | [optional] [default to undefined]
**omniclassNumber** | **string** | OmniClass classification number | [optional] [default to undefined]
**notes** | **string** |  | [optional] [default to undefined]
**metadata** | **object** | Custom metadata fields | [optional] [default to undefined]
**projectId** | **string** |  | [optional] [default to undefined]
**locationId** | **string** |  | [optional] [default to undefined]
**status** | **string** | Equipment status | [optional] [default to undefined]

## Example

```typescript
import { UpdateEquipmentDto } from '@usasset/api-client';

const instance: UpdateEquipmentDto = {
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
    status,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
