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
  * Return orders owned by a user.
  * Requires a valid access token.
  *
  * @param orderStatus
  * @returns {Promise}
  */
  getOrders ({ orderStatus } = {}) {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      this.userId === 0 ? '/api/v1/me/orders' : '/api/v1/users/' + this.userId + '/orders',
      this.toBody({
        order_status: orderStatus
      })
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
      null,
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

  /**
   * Delete a payment method identified by a given payment token.
   * The payment method's customerId must match the user's ID.
   * Requires a valid access token.
   *
   * @param paymentToken Token identifying the payment method on Braintree
   * @return {Promise}
   */
  deletePaymentMethod (paymentToken) {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      this.userId === 0 ? '/api/v1/me/paymentmethods/' + paymentToken : '/api/v1/users/' + this.userId +
      '/paymentmethods/' + paymentToken,
      null,
      'DELETE'
    )
  }

  /**
   * Update a payment method identified by a given payment token.
   * The payment method's customerId must match the user's ID.
   * Requires a valid access token.
   *
   * @param {Object} param Options
   * @param {String} param.paymentToken Token identifying the payment method on Braintree
   * @param {String} param.nonce One-time-use reference to payment information provided by the user
   * @param {String} param.deviceData User device information (recommended inclusion by Braintree)
   * @param {String} param.billingAddressId The two-letter value for one of the user's addresses
   * @return {Promise}
   */
  updatePaymentMethod ({ paymentToken, nonce, deviceData, billingAddressId }) {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      this.userId === 0 ? '/api/v1/me/paymentmethods/' + paymentToken : '/api/v1/users/' + this.userId +
        '/paymentmethods/' + paymentToken,
      this.toBody({
        nonce: nonce,
        device_data: deviceData,
        billing_address_id: billingAddressId
      }),
      'PUT'
    )
  }

  /**
   * Sends a subscription plan change request by providing a catalog product Id to change to.
   * @param {Object} param Options
   * @param {string} subscriptionId
   * @param {integer} catalogProductId
   * @returns {Promise}
   */
  addSubscriptionPlanChangeRequest ({ subscriptionId, catalogProductId }) {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      this.userId === 0 ? '/api/v1/me/subscriptions/' + subscriptionId + '/planchanges' : '/api/v1/users/' + this.userId +
        '/subscriptions/' + subscriptionId + '/planchanges',
      this.toBody({
        catalog_product_id: catalogProductId
      }),
      'POST'
    )
  }

  /**
   * Sends a PUT request to confirm the subscription plan change request.
   * @param {Object} param Options
   * @param {string} subscriptionId
   * @param {integer} planChangeRequestId
   * @returns {Promise}
   */
  confirmSubscriptionPlanChangeRequest ({ subscriptionId, planChangeRequestId }) {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      this.userId === 0 ? '/api/v1/me/subscriptions/' + subscriptionId + '/planchanges/' + planChangeRequestId : '/api/v1/users/' + this.userId +
        '/subscriptions/' + subscriptionId + '/planchanges/' + planChangeRequestId,
      null,
      'PUT'
    )
  }
}
