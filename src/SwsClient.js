'use strict'

import Sws from './Sws'

/**
 * SwsClient class.
 *
 * Extends Sws to provide functionality for use in client side applications.
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

    this.setInvalidAccessTokenHandler(err => {
      let previousRequest = err.config

      this.id.tokenRefresh(this.refreshToken).then(
        (data) => {
          console.log('Got dat NOO')
          console.log(data)
        },
        err => {
          console.log(err)
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
