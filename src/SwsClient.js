'use strict'

import Sws from './Sws'

/**
 * SwsClient class.
 *
 * Extends Sws to provide functionality for use in client side applications.
 *
 * Specifically, it adds:
 *
 * - A `setInvalidAccessTokenHandler` handler that refreshes the access token
 *   and retries the original request.
 * - Adds an `accessTokenUpdatedHandler` callback that is called whenever the
 *   access token is successfully refreshed.
 */
export class SwsClient extends Sws {
  /**
   * Constructor
   *
   * @param {Object} param Configuration options
   * @param {String} param.appId Application ID
   * @param {String} param.secret Application secret
   * @param {Number} param.timeout Request timeout
   * @param {Object} param.serviceUri Base URIs for SWS services
   * @param {String} param.serviceUri.id Base URI for SWS ID Service
   * @param {String} param.serviceUri.license Base URI for SWS License Service
   * @return {void}
   */
  constructor ({ appId, secret = '', timeout = 3000, serviceUri = {} }) {
    super({ appId: appId, secret: secret, timeout: timeout, serviceUri: serviceUri })

    this._accessTokenUpdatedHandler = () => {}

    this.setInvalidAccessTokenHandler((request, err) => {
      // `err.client` is the specific client instance that made the inital request
      // when the `invalid access token` error was received.
      const client = err.client

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
   * @param {function} f Callback
   * @return {void}
   */
  set accessTokenUpdatedHandler (f) {
    this._accessTokenUpdatedHandler = f
  }

  /**
   * Get the access token updated callback
   *
   * @return {function}
   */
  get accessTokenUpdatedHandler () {
    return this._accessTokenUpdatedHandler
  }
}
