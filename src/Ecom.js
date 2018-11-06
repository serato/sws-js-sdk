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
  getPaymentMethods () {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      this.userId === 0 ? '/api/v1/me/paymentmethods' : '/api/v1/users/' + this.userId + '/paymentmethods',
      null
    )
  }

  /**
   * Update the payment method and number of billing cycles of a subscription identified by a given subscription ID.
   * Requires a valid access token.
   *
   * @param {Object} param Options
   * @param {String} param.subscriptionId ID of the subscription to update
   * @param {String} param.paymentToken
   * @param {Number} param.numberOfBillingCycle
   * @return {Promise}
   */
  updateSubscription ({ subscriptionId, paymentToken, numberOfBillingCycle }) {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      this.userId === 0 ? '/api/v1/me/subscriptions/' + subscriptionId : '/api/v1/users/' + this.userId + '/subscriptions/' + subscriptionId,
      this.toBody({
        'number_of_billing_cycle': numberOfBillingCycle, 'payment_method_token': paymentToken
      }),
      'PUT'
    )
  }
}
