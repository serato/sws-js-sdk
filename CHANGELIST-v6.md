# Version 6 Changelist

## New features

### Functionality for Authorization Code Flow with Proof Key for Code Exchange (PKCE)

The SDK now includes functionality to facilitate the authorization of a client application using the SWS Identity Service. The authorization workkflow supported is [Authorization Code flow with Proof Key for Code Exchange (PKCE)](https://oauth.net/2/pkce/).

The SDK can produce the parameters required for a client application to initiate an authorization workflow using [SwsClient.createAuthorizationRequest](./src/SwsClient.js) method. It then provides a [IdentityService.tokenExchange](./src/Identity.js) that allows a client application to exchange parameters for the JWT tokens required to access other SWS web services.

#### More reading

- Auth0 documentation for [Authorization Code flow with PKCE](https://auth0.com/docs/authorization/flows/authorization-code-flow-with-proof-key-for-code-exchange-pkce)

### Typescript definitions

All classes and data structures now have corresponding Typescript definitions.

Typescript definitions are primarily auto-generated from JSDoc annontations using the Typescript compiler, as described in the [Typescript documentation](https://www.typescriptlang.org/docs/handbook/declaration-files/dts-from-js.html). The [documentation](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html) also describes which JSDoc annotations are supported.

The initial `.d.ts` files produced by the Typescript compiler are output to the [types](./types) directory. The [tsbuilder](./tsbuilder.js) module then makes modifications to some auto-generated files.

The entire build process can be initiated from the following npm script:

```bash
npm run build
```

## Breaking changes

SDK v6 introduces a number of breaking changes.

### Changes to name of service classes.

The names of all service classes are now prefixed with `Service`:

- Was `Identity`, now `IdentityService`
- Was `License`, now `LicenseService`
- Was `Ecom`, now `EcomService`
- Was `Notifications`, now `NotificationsService`
- Was `Profile`, now `ProfileService`
- Was `DigitalAssets`, now `DigitalAssetsService`
- Was `Rewards`, now `RewardsService`

### Change of default export

The [SwsClient](./src/SwsClient.js) class is now the default export.

#### v5 example

```javascript
import Sws from '@serato/sws-sdk'
// sws is an instance of Sws
const sws = new Sws()
```

#### v6 example

```javascript
import Sws from '@serato/sws-sdk'
// sws is an instance of SwsClient
const sws = new Sws()
```

### Modified constructor for Sws

The configuration object constructor argument of [Sws](./src/Sws.js) no longer allows for the providing of a `userId` property.

### New `NotificationsV1Service` service class

The SDK includes a new service client, [NotificationsV1Service](./src/NotificationsV1.js). The client is used for interacting with the v1 API of the SWS Notifications Service.

This client contains a single method, [NotificationsV1Service.getNotifications](./src/NotificationsV1.js). This method is directly equivalent to `Notifications.getNotifications` in previous SDK versions.

A `NotificationsV1Service` instance is available from a `Sws` instance via the `notificationsV1` property:

```bash
import Sws from '@serato/sws-sdk'
// sws is an instance of SwsClient
const sws = new Sws()

const notifications = sws.notificationsV1.getNotifications()
```

### Renamed methods

The `NotificationsService.adminGetNotifications` method has been renamed `NotificationsService.getNotifications`.

### Removed methods

The `NotificationsService.getHostSpecifications` method has been removed (this method mapped to a non-existent endpoint and therefore has never worked).
