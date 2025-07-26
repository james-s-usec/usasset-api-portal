# HealthApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**healthControllerCheck**](#healthcontrollercheck) | **GET** /health | Health check endpoint|
|[**healthControllerDebugConfig**](#healthcontrollerdebugconfig) | **GET** /health/debug/config | Debug configuration status|
|[**healthControllerExportAuditLogs**](#healthcontrollerexportauditlogs) | **GET** /health/audit/export | Export audit logs|

# **healthControllerCheck**
> HealthControllerCheck200Response healthControllerCheck()


### Example

```typescript
import {
    HealthApi,
    Configuration
} from '@usasset/api-client';

const configuration = new Configuration();
const apiInstance = new HealthApi(configuration);

const { status, data } = await apiInstance.healthControllerCheck();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**HealthControllerCheck200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Service is healthy |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **healthControllerDebugConfig**
> healthControllerDebugConfig()


### Example

```typescript
import {
    HealthApi,
    Configuration
} from '@usasset/api-client';

const configuration = new Configuration();
const apiInstance = new HealthApi(configuration);

const { status, data } = await apiInstance.healthControllerDebugConfig();
```

### Parameters
This endpoint does not have any parameters.


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **healthControllerExportAuditLogs**
> Array<HealthControllerExportAuditLogs200ResponseInner> healthControllerExportAuditLogs()


### Example

```typescript
import {
    HealthApi,
    Configuration
} from '@usasset/api-client';

const configuration = new Configuration();
const apiInstance = new HealthApi(configuration);

let limit: number; //Number of records to return (default: 100) (optional) (default to undefined)

const { status, data } = await apiInstance.healthControllerExportAuditLogs(
    limit
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **limit** | [**number**] | Number of records to return (default: 100) | (optional) defaults to undefined|


### Return type

**Array<HealthControllerExportAuditLogs200ResponseInner>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Audit logs exported successfully |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

