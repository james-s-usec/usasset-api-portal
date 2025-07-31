# EquipmentDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** |  | [default to undefined]
**mark** | **string** | Equipment mark from drawings | [default to undefined]
**name** | **string** |  | [default to undefined]
**description** | **object** |  | [optional] [default to undefined]
**type** | **string** |  | [default to undefined]
**manufacturer** | **object** |  | [optional] [default to undefined]
**model** | **object** |  | [optional] [default to undefined]
**serialNumber** | **object** |  | [optional] [default to undefined]
**uniformatCode** | **object** |  | [optional] [default to undefined]
**masterformatCode** | **object** |  | [optional] [default to undefined]
**omniclassNumber** | **object** |  | [optional] [default to undefined]
**status** | **string** |  | [default to 'active']
**notes** | **string** |  | [optional] [default to undefined]
**metadata** | **object** | Custom metadata fields | [optional] [default to undefined]
**projectId** | **string** |  | [default to undefined]
**locationId** | **object** |  | [optional] [default to undefined]
**createdAt** | **string** |  | [default to undefined]
**updatedAt** | **string** |  | [default to undefined]
**createdBy** | **string** |  | [default to undefined]

## Example

```typescript
import { EquipmentDto } from '@usasset/api-client';

const instance: EquipmentDto = {
    id,
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
    status,
    notes,
    metadata,
    projectId,
    locationId,
    createdAt,
    updatedAt,
    createdBy,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
