'use strict'

import Service from './Service'

/**
 * Indentity Service class
 *
 * Exposes SWS Indentity Service API endpoints via class methods
 */
export default class Identity extends Service {
  /**
   * Constructor
   *
   * @param {Sws} Sws Configured Sws instance
   * @return {void}
   */
  constructor (Sws) {
    super(Sws)
    this._serviceUri = Sws.serviceUri.id
  }

  /**
   * Request a new access token
   *
   * @param {String} refreshToken Refresh token
   * @returns {Promise}
   */
  tokenRefresh (refreshToken) {
    return this.fetch(
      null,
      '/api/v1/tokens/refresh',
      this.toBody({ refresh_token: refreshToken }),
      'POST'
    )
  }
}
