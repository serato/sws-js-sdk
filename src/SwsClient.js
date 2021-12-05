'use strict'

import Sws from './Sws'

/**
 * A function that is called each time a new Access token is received.
 *
 * @callback AccessTokenUpdatedHandler
 * @param {String} accessToken
 * @param {Date} accessTokenExpires
 * @param {String} refreshToken
 * @param {Date} refreshTokenExpires
 * @returns {void}
 *
 * @classdesc Extends Sws to provide functionality for use in client side applications.
 * @class
 * @extends Sws
 */
 export default class SwsClient extends Sws {
  /**
   * Constructor
   *
   * @param { import("./Sws").SwsConfiguration) } config Configuration options
   * @return {void}
   */
  constructor ({ appId, secret = '', timeout = 3000, serviceUri = {} }) {
    super({ appId: appId, secret: secret, timeout: timeout, serviceUri: serviceUri })

    /** @private */
    this._accessTokenUpdatedHandler = () => {}

    this.setInvalidAccessTokenHandler((request, err) => {
      // `err.client` is the specific client instance that made the inital request
      // when the `invalid access token` error was received.
      let client = err.client

      return this.id.tokenRefresh(this.refreshToken)
        .then(
          data => {
            // This token refresh request may have resulted in an error that was
            // handled by a custom error handler.
            // If so, call `Promise.resolve` with `data` so that the
            // outer Promise (ie. the one that failed before refreshing tokens)
            // has the expected result.
            if (!data.access) {
              return Promise.resolve(data)
            }

            // Update the access token property
            this.accessToken = data.access.token
            // Call the callback
            this.accessTokenUpdatedHandler(
              this.accessToken,
              new Date(data.access.expires_at * 1000),
              data.refresh.token,
              new Date(data.refresh.expires_at * 1000)
            )
            // Set a new Authorization header for the request
            request.headers.Authorization = client.bearerTokenAuthHeader()
            // Re-execute the 'last request'
            return client.fetchRequest(request)
          }
        )
    })
  }

  /**
   * Set the access token updated callback
   *
   * @param {AccessTokenUpdatedHandler} f Callback
   * @return {void}
   */
  set accessTokenUpdatedHandler (f) {
    this._accessTokenUpdatedHandler = f
  }

  /**
   * Get the access token updated callback
   *
   * @return {AccessTokenUpdatedHandler}
   */
  get accessTokenUpdatedHandler () {
    return this._accessTokenUpdatedHandler
  }
}
