'use strict'

import Service from './Service'

/**
 * Ecom Service class
 *
 * Exposes SWS Ecom Service API endpoints via class methods
 */
export default class Ecom extends Service {
  /**
   * Constructor
   *
   * @param {Sws} Sws Configured Sws instance
   * @return {void}
   */
  constructor (Sws) {
    super(Sws)
    this._serviceUri = Sws.serviceUri.ecom
  }

  /**
   * Return subscriptions owned by a user.
   * Requires a valid access token.
   *
   * @returns {Promise}
   */
  getSubscriptions () {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      this.userId === 0 ? '/api/v1/me/subscriptions' : '/api/v1/users/' + this.userId + '/subscriptions',
      null
    )
  }

  /**
  * Return payment methods added by a logged-in user.
  * Requires a valid access token.
  *
  * @returns {Promise}
  */
  getMePaymentMethods () {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      '/api/v1/me/paymentmethods',
      null
    )
  }
}
