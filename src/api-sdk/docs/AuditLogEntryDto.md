# AuditLogEntryDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** | Audit log entry ID | [default to undefined]
**action** | **string** | Action performed | [default to undefined]
**userId** | **string** | User ID who received/lost the role | [default to undefined]
**userEmail** | **string** | Email of the user who received/lost the role | [default to undefined]
**userName** | **string** | Name of the user who received/lost the role | [default to undefined]
**projectId** | **string** | Project ID where the change occurred | [default to undefined]
**projectName** | **string** | Name of the project | [default to undefined]
**roleId** | **string** | Role ID that was assigned/removed | [default to undefined]
**roleName** | **string** | Name of the role | [default to undefined]
**performedBy** | **string** | User ID who performed the action | [default to undefined]
**performedByEmail** | **string** | Email of the admin who performed the action | [default to undefined]
**performedByName** | **string** | Name of the admin who performed the action | [default to undefined]
**reason** | **object** | Optional reason for the change | [default to undefined]
**timestamp** | **string** | Timestamp when the action occurred | [default to undefined]

## Example

```typescript
import { AuditLogEntryDto } from '@usasset/api-client';

const instance: AuditLogEntryDto = {
    id,
    action,
    userId,
    userEmail,
    userName,
    projectId,
    projectName,
    roleId,
    roleName,
    performedBy,
    performedByEmail,
    performedByName,
    reason,
    timestamp,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
