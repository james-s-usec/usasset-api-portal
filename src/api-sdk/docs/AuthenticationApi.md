# AuthenticationApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**authControllerAzureCallback**](#authcontrollerazurecallback) | **POST** /auth/azure/callback | Exchange Azure AD auth code for internal JWT (Web App flow)|
|[**authControllerAzureLogin**](#authcontrollerazurelogin) | **POST** /auth/azure | Exchange Azure AD token for internal JWT|
|[**authControllerGetProfile**](#authcontrollergetprofile) | **GET** /auth/profile | Get current user profile from JWT|
|[**authControllerGetTokenInfo**](#authcontrollergettokeninfo) | **GET** /auth/token-info | Get current token metadata|
|[**authControllerLogin**](#authcontrollerlogin) | **POST** /auth/login | Login with email and password|
|[**authControllerSwitchProject**](#authcontrollerswitchproject) | **POST** /auth/switch-project | Switch to a different project context|

# **authControllerAzureCallback**
> AuthControllerLogin200Response authControllerAzureCallback(body)


### Example

```typescript
import {
    AuthenticationApi,
    Configuration
} from '@usasset/api-client';

const configuration = new Configuration();
const apiInstance = new AuthenticationApi(configuration);

let body: object; //

const { status, data } = await apiInstance.authControllerAzureCallback(
    body
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **body** | **object**|  | |


### Return type

**AuthControllerLogin200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Azure AD callback successful |  -  |
|**401** | Invalid auth code or token exchange failed |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **authControllerAzureLogin**
> AuthControllerLogin200Response authControllerAzureLogin(body)


### Example

```typescript
import {
    AuthenticationApi,
    Configuration
} from '@usasset/api-client';

const configuration = new Configuration();
const apiInstance = new AuthenticationApi(configuration);

let body: object; //

const { status, data } = await apiInstance.authControllerAzureLogin(
    body
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **body** | **object**|  | |


### Return type

**AuthControllerLogin200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Azure AD login successful |  -  |
|**401** | Invalid Azure AD token |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **authControllerGetProfile**
> AuthControllerGetProfile200Response authControllerGetProfile()


### Example

```typescript
import {
    AuthenticationApi,
    Configuration
} from '@usasset/api-client';

const configuration = new Configuration();
const apiInstance = new AuthenticationApi(configuration);

const { status, data } = await apiInstance.authControllerGetProfile();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**AuthControllerGetProfile200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | User profile retrieved |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **authControllerGetTokenInfo**
> authControllerGetTokenInfo()


### Example

```typescript
import {
    AuthenticationApi,
    Configuration
} from '@usasset/api-client';

const configuration = new Configuration();
const apiInstance = new AuthenticationApi(configuration);

const { status, data } = await apiInstance.authControllerGetTokenInfo();
```

### Parameters
This endpoint does not have any parameters.


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Token metadata retrieved |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **authControllerLogin**
> AuthControllerLogin200Response authControllerLogin(body)


### Example

```typescript
import {
    AuthenticationApi,
    Configuration
} from '@usasset/api-client';

const configuration = new Configuration();
const apiInstance = new AuthenticationApi(configuration);

let body: object; //

const { status, data } = await apiInstance.authControllerLogin(
    body
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **body** | **object**|  | |


### Return type

**AuthControllerLogin200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Login successful |  -  |
|**401** | Invalid credentials |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **authControllerSwitchProject**
> AuthControllerLogin200Response authControllerSwitchProject(body)


### Example

```typescript
import {
    AuthenticationApi,
    Configuration
} from '@usasset/api-client';

const configuration = new Configuration();
const apiInstance = new AuthenticationApi(configuration);

let body: object; //

const { status, data } = await apiInstance.authControllerSwitchProject(
    body
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **body** | **object**|  | |


### Return type

**AuthControllerLogin200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Project switched successfully |  -  |
|**403** | No access to requested project |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

