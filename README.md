# Serato Web Services SDK for JavaScript

A Javascript library for interacting with Serato Web Services.

Supports endpoints that use either JWT-based `Bearer` authorisation or `Basic` authorisation.

Consists of an `Sws` configuration class and mutiple service clients. A service client interacts with a specific SWS service.
Service clients are exposed as properties of an `Sws` instance.

Service client have methods for interacting with the corresponding web service. Service client methods return a Promise which
resolve to a data object containing the response from the web service.

> SDK v6 has some major breaking changes from v5.
> Read the [changelist](./CHANGELIST-v6.md) for details.

## Basic usage

Basic usage consists of creating an `Sws` instance then calling a method on a service client:

```javascript
import { Sws } from '@serato/sws-sdk'

// `secret` is optional and only required when interacting with API endpoints that require Basic authentication
const sws = new Sws({ appId: 'myAppId', secret: 'myAppSecret' })

// Provided an access token for the current user (required for endpoints that use `Bearer` authorisation)
sws.accessToken = 'myAccessToken'

// Use the License service client to get the current user's licenses (all service methods return a Promise)
sws.license.getLicenses().then(
  (data) => {
    // `data` is a plain object of the API response
    console.log('Success')
  },
  (err) => {
    // `err` contains request and response details
    console.log('Failure')
  }
)
```

## Configuration

The `Sws` object is used to configure the behavior of the service clients. A configuration object
can be provided to the constructor:

```javascript
import { Sws } from '@serato/sws-sdk'

const sws = new Sws({
  appId: 'myAppId',
  secret: 'myAppSecret', // Only required for SWS endpoints that require `Basic` authentication
  timeout: 3000, // Defaults to 3000 (ms)
  serviceUri: { // Base URIs for SWS services (defaults to production endpoints)
    id: 'my.id-service.uri',
    license: 'my.license-service.uri',
    ecom: 'my.ecom-service.uri',
    profile: 'my.profile-service.uri',
    da: 'my.da-service.uri',
    notifications: 'my.notifications-service.uri',
    rewards: : 'my.rewards-service.uri'
  }
})
```

## Service clients

All service clients are exposed as properties of a Sws instance.

```javascript
import { Sws } from '@serato/sws-sdk'

const sws = new Sws()

sws.id              // IdentityService instance
sws.license         // LicenseService instance
sws.ecom            // EcomService instance
sws.notifications   // NotificationsService instance
sws.notificationsV1 // NotificationsV1Service instance
sws.profile         // ProfileService instance
sws.da              // DigitalAssetsService instance
sws.rewards         // RewardsService instance
```

## Custom Callbacks

The default behavior for all service clients is raise an error for any API call that does
not return a HTTP 2xx response. This can be handled by a client application's Promise `reject` callback.

But clients allow for the providing of custom callbacks to handle common error scenarios that may occur
across all web services.

When a custom callback is provided an error is not raised and instead the Promise is resolved with the result
of the custom callback.

### Invalid Access Token callback

This callback is called when an SWS service indicates that an Access token has either expired or is otherwise invalid.

### Invalid Refresh Token callback

This callback is called when the SWS Identity service indicates that a Refresh token has either expired or is otherwise invalid.

### Password Re-entry Required callback

This callback is called when the SWS Identity service indicates that a client application must direct the user back to Identity service to re-enter their password.

### Access Denied callback

This callback is called when an SWS service indicates that a user has insufficient permissions to access the requested resource.

### Service Error callback

This callback is called when an SWS service returns a HTTP 500 Application Error response.

### Service Unavailable callback

This callback is called when an SWS service returns a HTTP 503 Service Unavailable response.

### Request Timeout Exceeded callback

This callback is called when an SWS service does not respond within the specified timeout period.

## Setting callbacks

Callbacks can be attached to all service clients via methods of the `Sws` instance, or to individual service clients:

```javascript
const sws = new Sws({ appId: 'myAppId' })

const invalidAccessTokenCallback = (request, err) => {
  // `request` is the request object that returned the error
  // `err` is the error response that was returned from the API call
  return 'Access token is invalid'
}
const invalidRefreshTokenCallback = (request, err) => {
  return 'Refresh token is invalid'
}
const reEnterPasswordCallback = (request, err) => {
  return 'Password must be re-entered'
}
const accessDeniedCallback = (request, err) => {
  return 'Access is denied'
}
const serviceErrorCallback = (request, err) => {
  return 'Service error'
}
const serviceUnavailableCallback = (request, err) => {
  return 'Service is unavailable'
}
const requestTimeoutExceededCallback = (request, err) => {
  return 'Request timeout exceeded'
}

// Attach the callback to all service clients
sws.setInvalidAccessTokenHandler(invalidAccessTokenCallback)
sws.setInvalidRefreshTokenHandler(invalidRefreshTokenCallback)
sws.setPasswordReEntryRequiredHandler(reEnterPasswordCallback)
sws.setAccessDeniedHandler(accessDeniedCallback)
sws.setServiceErrorHandler(serviceErrorCallback)
sws.setServiceUnavailableHandler(serviceUnavailableCallback)
sws.setTimesoutExceededHandler(requestTimeoutExceededCallback)

// Attach the callback to an individual service client
sws.license.invalidAccessTokenHandler = invalidAccessTokenCallback
sws.license.invalidRefreshTokenHandler = invalidRefreshTokenCallback
sws.license.passwordReEntryRequiredHandler = reEnterPasswordCallback
sws.license.accessDeniedHandler = accessDeniedCallback
sws.license.serviceErrorHandler = serviceErrorCallback
sws.license.serviceUnavailableHandler = serviceUnavailableCallback
sws.license.timeoutExceededHandler = requestTimeoutExceededCallback
```

## SwsClient class

The SDK also includes a `SwsClient` class.

The class extends `Sws` and provides some useful functionality when using the SDK in web browser-based applications.

### Create authorization request

The `SwsClient.createAuthorizationRequest` method returns an object that an application can use to start an authorization workflow using the SWS Identity Service.

The workflow is an implementation of Authorization Code Flow with Proof Key for Code Exchange (PKCE).

```javascript
// SwsClient is the default export
import SwsClient from '@serato/sws-sdk'

const sws = new SwsClient({ appId: 'myAppId' })

// After authorization redirect back to this URL
const redirectUrl = window.location.href
const { state, codeVerifier, url } = sws.createAuthorizationRequest(redirectUrl)

// Store `state` and `codeVerifier` in a storage mechanism (eg localstorage, sessionstorage)
// for use after redirecting back into the application after the authorization process.

// Redirect the browser to the authorization URL
window.location.href = url
```

After the authorization process the SWS Identity Service will return the browser to `redirectUrl` with `state` and `code` URL parameters appended.

Compare the `state` URL parameter with the stored `state` value to confirm the authenticity of authorization request.

Use the [IdentityService.tokenExchange](./src/Identity.js) method to exchange `code`, `redirectUrl` and `codeVerifier` for JWT access and refresh tokens.

### Invalid Access Token handler

`SwsClient` sets a **Invalid Access Token** handler that:

* Retrieves a new Access Token from the Identity Service and updates the `Sws` instance with it.
* Provides a **Access Token Updated** callback that is called whenever a new Access Token is successfully received from the Identity Service.

### Access Token Updated callback

The **Access Token Updated** token callback accepts two arguments: the value of the Access token, and a date object representing the expiry time of the access token.

```javascript
// SwsClient is the default export
import SwsClient from '@serato/sws-sdk'

const sws = new SwsClient({ appId: 'myAppId' })

const accessTokenUpdatedCallback = (accessToken, accessTokenExp, refreshToken, refreshTokenExp) => {
  console.log('Access token value is ' + accessToken)
  console.log('Access token expires on ' + accessTokenExp.toISOString())
  console.log('Refresh token value is ' + refreshToken)
  console.log('Refresh token expires on ' + refreshTokenExp.toISOString())
}

// Attach the callback
sws.accessTokenUpdatedHandler = accessTokenUpdatedCallback

```
