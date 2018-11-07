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
   * Add a payment method identified by a given nonce.
   * Requires a valid access token.
   *
   * @param nonce A one-time-use reference to payment information.
   * @param deviceData User device information.
   * @param billingAddressId The two-letter value for an address.
   * @return {Promise}
   */
  addPaymentMethod ({ nonce, deviceData, billingAddressId } = {}) {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      this.userId === 0 ? '/api/v1/me/paymentmethods' : '/api/v1/users/' + this.userId + '/paymentmethods',
      this.toBody({
        nonce: nonce,
        device_data: deviceData,
        billing_address_id: billingAddressId
      }),
      'POST'
    )
  }

  /**
   * Create a token resource for payment gateway integration
   * Requires a valid access token.
   *
   * @return {Promise}
   */
  paymentGatewayToken () {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      '/api/v1/paymentgateway/token',
      (this.userId !== 0 ? this.toBody({ user_id: this.userId }) : null),
      'POST'
    )
  }

  /**
  * Return payment methods added by a logged-in user.
  * Requires a valid access token.
  *
  * @returns {Promise}
  */
  getPaymentMethods () {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      this.userId === 0 ? '/api/v1/me/paymentmethods' : '/api/v1/users/' + this.userId + '/paymentmethods',
      null
    )
  }
}
