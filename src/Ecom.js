'use strict'

import Service from './Service'

/**
 * @typedef {'dj' | 'wailshark' | 'sample' | 'serato_studio'} SubscriptionGroup
 * @typedef {'Active' | 'Canceled' | 'Past Due' | 'Expired' | 'Pending' | 'Expiring'} SubscriptionStatus
 * @typedef {'order_promotion' | 'voucher_promotion' | 'voucher_retail' | 'voucher_offer'} DiscountSource
 * @typedef {'complete' | 'pending_payment' | 'cancel' | 'fraud'} OrderStatus
 * @typedef {'dj' | 'dvs' | 'video' | 'fx' | 'pnt_dj' | 'flip' | 'play' | 'studio'} CatalogProductFeature
 * @typedef {'CreditCard' | 'PayPal'} PaymentMethodType
 * @typedef {'complete' | 'pending' | 'invalid'} SubscriptionPlanChangeStatus
 * @typedef {'promotion' | 'retention-offer' | 'upsell-offer, `retail'} VoucherTypeCategory
 * @typedef {'application/json' | 'application/pdf' | 'text/html'} InvoiceMimeType
 *
 * @typedef {Object} Discount
 * @property {String} name
 * @property {Number} amount
 * @property {Number} current_billing_cycle The billing cycle this discount is on.
 * @property {Number} number_of_billing_cycles The number of billing cycles this discount is for.
 * @property {DiscountSource} source
 *
 * @typedef {Object} SubscriptionPlan
 * @property {String} id
 * @property {String} name
 * @property {Number} billing_frequency Specifies the billing interval of the plan in months.
 * @property {Boolean} active Specifies if the plan is available for subscription to new subscribers.
 *
 * @typedef {Object} Subscription
 * @property {String} id
 * @property {Number} user_id
 * @property {String} product_id
 * @property {Discount[]} discounts
 * @property {Number} current_billing_cycle The current billing cycle of the subscription.
 * @property {Number} number_of_billing_cycle Number of billing cycles after which the subscription will expire. `0` means the subscription never expire.
 * @property {String} next_billing_date
 * @property {String} first_billing_date
 * @property {String} payment_method_token
 * @property {SubscriptionGroup} group
 * @property {SubscriptionPlan} plan
 * @property {Number} next_billing_period_amount
 * @property {Number} price
 * @property {Number} [remaining_days = undefined] remaining_days The number of days remaining for the current billing cycle. Returned only when status is `Active` or `Past Due`.
 * @property {Number} [days_until_activation = undefined] days_until_activation The number of days until a `Pending` subscription is activated.
 * @property {SubscriptionStatus} status
 * @property {Number[]} [tll_product_type_ids = undefined] tll_product_type_ids TLL product type IDs that map to this subscription.
 * @property {String} changing_to The ID of pending subscription which is created against this subscription as part of plan change.
 * @property {Number} remaining_credit
 *
 * @typedef {Object} SubscriptionList
 * @property {Subscription[]} items
 *
 * @typedef {Object} TargetSubscription
 * @property {String} next_billing_date
 * @property {SubscriptionGroup} group
 * @property {SubscriptionPlan} plan
 * @property {Number} next_billing_period_amount
 * @property {Number} [actual_plan_price = undefined] actual_plan_price
 *
 * @typedef {Object} SubscriptionPlanChange
 * @property {String} id
 * @property {Number} user_id
 * @property {TargetSubscription} target_subscription
 * @property {Subscription} current_subscription
 * @property {String} [order_id = undefined] order_id The order ID for a `completed` plan change when `next_billing_period_amount` for `target_subscription` is greater than `0.00`.
 * @property {String} [transaction_id = undefined] transaction_id The transaction ID for a `completed` plan change when `next_billing_period_amount` for `target_subscription` is greater than `0.00`.
 * @property {SubscriptionPlanChangeStatus} status
 * @property {String} created_at Date of creation expressed in ISO 8061 format.
 * @property {String} updated_at Date updated expressed in ISO 8061 format.
 * @property {Boolean} immediate Whether the plan change request will be immediate or not.
 *
 * @typedef {Object} CatalogCategory
 * @property {Number} id
 * @property {String} name
 * @property {String} description
 *
 * @typedef {Object} SubscriptionOptions
 * @property {Number[]} allow_concurrent_subscription
 * @property {Number[]} allow_change_to
 *
 * @typedef {Object} CatalogProduct
 * @property {Number} id
 * @property {String} name
 * @property {Boolean} subscription
 * @property {Boolean} time_limited
 * @property {Boolean} trial
 * @property {Boolean} available
 * @property {Number} price
 * @property {Number} [promotional_price = undefined] promotional_price
 * @property {CatalogCategory[]} categories
 * @property {SubscriptionGroup} [subscription_group = undefined] subscription_group
 * @property {SubscriptionPlan} [subscription_plan = undefined] subscription_plan
 * @property {Number} [product_type_group_id = undefined] product_type_group_id
 * @property {SubscriptionOptions} [subscription_options = undefined] subscription_options
 * @property {CatalogProductFeature[]} feature_set
 *
 * @typedef {Object} CatalogProductList
 * @property {CatalogProduct[]} items
 *
 * @typedef {Object} OrderItem
 * @property {String} id
 * @property {Number} quantity
 * @property {Number} base_price
 * @property {Number} [special_price = undefined] special_price
 * @property {Number} tax_rate
 * @property {Number} tax_amount
 * @property {Number} total_amount
 * @property {CatalogProduct} catalog_product
 *
 * @typedef {Object} Order
 * @property {String} id
 * @property {Number} user_id
 * @property {String} first_name
 * @property {String} last_name
 * @property {String} [address_1 = undefined] address_1
 * @property {String} [address_2 = undefined] address_2
 * @property {String} [city = undefined] city
 * @property {String} [state = undefined] state ISO code or name of the state, province or district.
 * @property {Number} [region_id = undefined] region_id
 * @property {String} [zip = undefined] zip
 * @property {String} country_code 2 letter country code (ISO 3166).
 * @property {OrderItem[]} items
 * @property {Number} total_amount
 * @property {Number} tax_amount
 * @property {Number[]} invoices List of invoice IDs.
 * @property {OrderStatus} status
 * @property {String} created_at
 * @property {String} updated_at
 *
 * @typedef {Object} OrderList
 * @property {Order[]} items
 *
 * @typedef {Object} PaymentMethod
 * @property {String} token The payment method unique ID
 * @property {Number} user_id
 * @property {String} [image_url = undefined] image_url A URL that points to a payment method image resource
 * @property {PaymentMethodType} type One of `CreditCard` or `PayPal`.
 * @property {String} [email = undefined] email The email address belonging to the PayPal account. Provided `type` is `PayPal`.
 * @property {String} [payer_id = undefined] payer_id The ID belonging to the PayPal account. Provided when `type` is `PayPal`.
 * @property {String} [card_type = undefined] card_type The type of the credit card. Provided when `type` is `CreditCard`.
 * @property {String} [masked_number = undefined] masked_number Masked credit card number. Provided when `type` is `CreditCard`.
 * @property {String} [expiration_date = undefined] expiration_date The expiration date of credit card, formatted `MM/YYYY`. Provided when `type` is `CreditCard`.
 * @property {String} [expiration_month = undefined] expiration_month The expiration month of credit card, formatted `MM`. Provided when `type` is `CreditCard`.
 * @property {String} [expiration_year = undefined] expiration_year The expiration year of credit card, formatted `YYYY`. Provided when `type` is `CreditCard`.
 * @property {Boolean} [expired = undefined] expired Indicates whether or not the card card has expired. Provided when `type` is `CreditCard`.
 * @property {String} created_at Date of creation expressed in ISO 8061 format
 * @property {String} updated_at Date updated expressed in ISO 8061 format
 * @property {String} [billing_address_id = undefined] billing_address_id
 *
 * @typedef {Object} PaymentMethodList
 * @property {PaymentMethod[]} items
 *
 * @typedef {Object} PaymentGatewayToken
 * @property {String} token
 * @property {String} paypal_environment
 *
 * @typedef {Object} VoucherType
 * @property {String} name
 * @property {String} [title = undefined] title
 * @property {String} [description = undefined] description
 * @property {VoucherTypeCategory} type
 * @property {String} [short_description = undefined] short_description
 *
 * @typedef {Object} VoucherRedeemsToProductType
 * @property {Number} id The product type ID of the product that is redeemed from a voucher
 *
 * @typedef {Object} VoucherRedeemsToSubscriptionDiscount
 * @property {Number} subscription_id
 * @property {Number} amount
 * @property {Number} number_of_billing_cycles
 * @property {Boolean} is_replacement Indicates whether or not redeeming this voucher will replace an existing discount on the subscription if redeemed.
 *
 * @typedef {Object} VoucherRedeemsToSubscriptionUpgrade
 * @property {Number} target_product_type_id The product type ID of the subscription product which will be discounted if the user changes their current subscription to it.
 *
 * @typedef {Object} VoucherRedeemsTo
 * @property {VoucherRedeemsToProductType} [product_type = undefined] product_type
 * @property {VoucherRedeemsToSubscriptionDiscount} [subscription_discount = undefined] subscription_discount
 * @property {VoucherRedeemsToSubscriptionUpgrade} [subscription_upgrade = undefined] subscription_upgrade
 *
 * @typedef {Object} UserVoucher
 * @property {String} id
 * @property {Number} user_id
 * @property {String} [product_id = undefined] product_id The ID of the product that was created when the voucher was redeemed.
 * @property {String} [subscription_id = undefined] subscription_id The ID of the subscription to which a discount was applied when the voucher was redeemed.
 * @property {Number} [redeemed_by_user_id = undefined] redeemed_by_user_id The user ID of the user who redeemed the voucher.
 * @property {String} [redeemed_at = undefined] redeemed_at Date redeemed expressed in ISO 8061 format.
 * @property {String} created_at Date created expressed in ISO 8061 format.
 * @property {String} [expires_at = undefined] expires_at Expiry date expressed in ISO 8061 format.
 * @property {Number} [expires_in_days = undefined] expires_in_days The number of days until the voucher expires, rounded up to a whole day.
 * @property {VoucherType} voucher_type
 * @property {Boolean} is_redeemable
 * @property {VoucherRedeemsTo} [redeems_to = undefined] redeems_to
 *
 * @typedef {Object} VoucherList
 * @property {UserVoucher[]} items
 *
 * @typedef {Object} RecommendationsList
 * @property {CatalogProduct[]} items
 * 
 * @typedef {Object} BillingAddress
 * @property {String} [first_name = undefined]
 * @property {String} [last_name = undefined]
 * @property {String} [company = undefined]
 * @property {String} [address = undefined]
 * @property {String} [address_extended = undefined]
 * @property {String} [city = undefined]
 * @property {String} [post_code = undefined]
 * @property {String} [region = undefined]
 * @property {String} country_code
 * 
 * @typedef {Object} Promotion
 * @property {String} description The description for the promotion that is applied to the cart item.
 * @property {String} [discount_fixed_amount = undefined] The fixed amount discount that is applied to the cart item. It will be presented only if the promotion is `fixed-amount`.
 * @property {Number} [discount_percentage = undefined] The percentage discount that is applied to the cart item. It will be presented only if the promotion is `percentage`.
 * @property {String} [end_date = undefined] The date the promotion ends.
 * 
 * @typedef {Object} ProductType
 * @property {CatalogProduct[]} items
 * @property {Number} id
 * @property {String} name
 * @property {String} [subscription_start_date = undefined] The start date/time of the subscription product. It will be presented only if the start date/time is in the future.
 * @property {Number} [subscription_billing_period = undefined] The billing period of the subscription product. It will be presented only if the product is a subscription.
 * @property {Number} [prepaid_credit_in_days = undefined] The number of days that the user has credit for the product they are subscribing to.
 * 
 * @typedef {Object} CartItem
 * @property {Number} id
 * @property {ProductType} product_type
 * @property {Number} quantity
 * @property {Number} base_amount
 * @property {Number} total_amount
 * @property {Number} tax_amount
 * @property {Number} tax_rate
 * @property {Number} [total_amount_after_promotion = undefined] The total amount of the cart item after the promotion is applied. It will be presented only if there is a promotion applied to the cart item.
 * @property {Number} [error_code = undefined] If present, proceeding with the purchase will not be possible with the item in the cart.
 * @property {String} [subscription_start_date = undefined] The start date/time of the subscription product. It will be presented only if the start date/time is in the future.
 * @property {Number} [prepaid_credit_in_days = undefined] The number of days that the user has credit for the product they are subscribing to.
 * @property {Number} [subscription_billing_period = undefined] The billing period of the subscription product. It will be presented only if the product is a subscription.
 * @property {Promotion[]} [promotion = undefined] The promotion that is applied to the cart item.

 * @typedef {Object} Cart
 * @property {String} uuid The cart universal unique ID.
 * @property {CartItem[]} items
 * @property {Number} total_amount
 * @property {Number} subtotal_amount 
 * @property {Number} tax_amount
 * @property {String} currency 3 letter currency code (ISO 4217).
 * @property {String} created_at The date/time the cart was created in ISO 8061 format.
 * @property {String} updated_at The date/time the cart was updated in ISO 8061 format.
 * @property {BillingAddress} [billing_address = undefined]
 * @property {String} [coupon_code = undefined] The coupon code for the promotion.
 */

/**
 * Ecom Service class
 *
 * Exposes SWS Ecom Service API endpoints via class methods
 */
export default class EcomService extends Service {
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
   *
   * @returns {Promise<SubscriptionList>}
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
   *
   * @param {Object} [param = undefined] param Options
   * @param {OrderStatus} [param.orderStatus = undefined] param.orderStatus
   * @returns {Promise<OrderList>}
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
   * Fetches products in the software product catalog.
   *
   * @returns {Promise<CatalogProductList>}
   */
  getCatalogProducts () {
    return this.fetch(
      null,
      '/api/v1/catalog/products',
      null
    )
  }

  /**
   * Add a payment method identified by a given nonce.
   *
   * @param {Object} param Options
   * @param {String} param.nonce A one-time-use reference to payment information.
   * @param {String} [param.deviceData = undefined] param.deviceData User device information.
   * @param {String} [param.billingAddressId = undefined] param.billingAddressId The two-letter value for an address.
   * @return {Promise<PaymentMethod>}
   */
  addPaymentMethod ({ nonce, deviceData, billingAddressId }) {
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
   *
   * @return {Promise<PaymentGatewayToken>}
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
   *
   * @returns {Promise<PaymentMethodList>}
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
   *
   * @param {Object} param Options
   * @param {String} param.subscriptionId ID of the subscription to update
   * @param {String} param.paymentToken
   * @param {Number} param.numberOfBillingCycle
   * @return {Promise<Subscription>}
   */
  updateSubscription ({ subscriptionId, paymentToken, numberOfBillingCycle }) {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      this.userId === 0 ? '/api/v1/me/subscriptions/' + subscriptionId : '/api/v1/users/' + this.userId + '/subscriptions/' + subscriptionId,
      this.toBody({
        number_of_billing_cycle: numberOfBillingCycle, payment_method_token: paymentToken
      }),
      'PUT'
    )
  }

  /**
   * Delete a payment method identified by a given payment token.
   * The payment method's customerId must match the user's ID.
   *
   * @param {Object} param Options
   * @param {String} param.paymentToken Token identifying the payment method on Braintree
   * @return {Promise}
   */
  deletePaymentMethod (paymentToken) {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      this.userId === 0
        ? '/api/v1/me/paymentmethods/' + paymentToken
        : '/api/v1/users/' + this.userId +
        '/paymentmethods/' + paymentToken,
      null,
      'DELETE'
    )
  }

  /**
   * Update a payment method identified by a given payment token.
   * The payment method's customerId must match the user's ID.
   *
   * @param {Object} param Options
   * @param {String} param.paymentToken Token identifying the payment method on Braintree
   * @param {String} param.nonce One-time-use reference to payment information provided by the user
   * @param {String} param.deviceData User device information (recommended inclusion by Braintree)
   * @param {String} param.billingAddressId The two-letter value for one of the user's addresses
   * @return {Promise<PaymentMethod>}
   */
  updatePaymentMethod ({ paymentToken, nonce, deviceData, billingAddressId }) {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      this.userId === 0
        ? '/api/v1/me/paymentmethods/' + paymentToken
        : '/api/v1/users/' + this.userId +
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
   *
   * @param {Object} param Options
   * @param {String} param.subscriptionId
   * @param {Number} param.catalogProductId
   * @param {Boolean} [param.immediate=false] param.immediate
   * @returns {Promise<SubscriptionPlanChange>}
   */
  addSubscriptionPlanChangeRequest ({ subscriptionId, catalogProductId, immediate }) {
    if (immediate === undefined) {
      immediate = false
    }
    return this.fetch(
      this.bearerTokenAuthHeader(),
      this.userId === 0
        ? '/api/v1/me/subscriptions/' + subscriptionId + '/planchanges'
        : '/api/v1/users/' + this.userId +
        '/subscriptions/' + subscriptionId + '/planchanges',
      this.toBody({
        catalog_product_id: catalogProductId,
        immediate: immediate
      }),
      'POST'
    )
  }

  /**
   * Retrieve an invoice PDF for the given order.
   * The logged-in user must be the order's owner.
   * Defaults to returning pdf if no accept parameter, otherwise it returns json
   *
   * @param {String} orderId ID of the order for which an invoice will be returned.
   * @param {String} invoiceId ID of the invoice for the order that will be returned.
   * @param {InvoiceMimeType} [accept='application/pdf'] accept MIME type to use for the invoice
   * @return {Promise}
   */
  getInvoice (orderId, invoiceId, accept = 'application/pdf') {
    const endpointPrefix = (this.userId === 0) ? '/api/v1/me' : `/api/v1/users/${this.userId}`
    const endpoint = `${endpointPrefix}/orders/${orderId}/invoices/${invoiceId}`
    return this.fetch(
      this.bearerTokenAuthHeader(),
      endpoint,
      null,
      'GET',
      null,
      (accept === 'application/pdf') ? 'blob' : 'json',
      {
        Accept: accept,
        'Content-Type': 'application/json'
      }
    )
  }

  /**
   * Sends a PUT request to confirm the subscription plan change request.
   *
   * @param {Object} param Options
   * @param {String} param.subscriptionId
   * @param {Number} param.planChangeRequestId
   * @returns {Promise<SubscriptionPlanChange>}
   */
  confirmSubscriptionPlanChangeRequest ({ subscriptionId, planChangeRequestId }) {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      this.userId === 0
        ? '/api/v1/me/subscriptions/' + subscriptionId + '/planchanges/' + planChangeRequestId
        : '/api/v1/users/' + this.userId +
        '/subscriptions/' + subscriptionId + '/planchanges/' + planChangeRequestId,
      null,
      'PUT'
    )
  }

  /**
   * Retries charge on a subscription.
   * The subscription ID must belong to the user's ID.
   *
   * @param {Object} param Options
   * @param {String} param.subscriptionId
   * @returns {Promise<Subscription>}
   */
  retrySubscriptionCharge ({ subscriptionId }) {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      this.userId === 0
        ? '/api/v1/me/subscriptions/' + subscriptionId + '/retrycharge'
        : '/api/v1/users/' +
        this.userId + '/subscriptions/' + subscriptionId + '/retrycharge',
      null,
      'POST'
    )
  }

  /**
   * Sends a DELETE request to cancel a subscription.
   *
   * @param {Object} param Options
   * @param {String} param.subscriptionId
   * @returns {Promise<Subscription>}
   */
  cancelSubscription ({ subscriptionId }) {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      this.userId === 0
        ? '/api/v1/me/subscriptions/' + subscriptionId
        : '/api/v1/users/' +
        this.userId + '/subscriptions/' + subscriptionId,
      null,
      'DELETE'
    )
  }

  /**
   * Return subscriptions owned by a user.
   *
   * @returns {Promise<VoucherList> }
   */
  getVouchers () {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      this.userId === 0 ? '/api/v1/me/vouchers' : '/api/v1/users/' + this.userId + '/vouchers',
      null
    )
  }

  /**
   * Add vouchers by a given voucher id.
   *
   * @param {Object} param Options
   * @param {String} param.voucherId
   * @return {Promise<UserVoucher>}
   */
  assignVoucher ({ voucherId }) {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      this.userId === 0 ? '/api/v1/me/vouchers' : '/api/v1/users/' + this.userId + '/vouchers',
      this.toBody({
        voucher_id: voucherId
      }),
      'POST'
    )
  }

  /**
   * Update vouchers by a given voucher id.
   *
   * @param {Object} param Options
   * @param {String} param.voucherId
   * @return {Promise<UserVoucher>}
   */
  redeemVoucher ({ voucherId }) {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      this.userId === 0 ? '/api/v1/me/vouchers/' + voucherId : '/api/v1/users/' + this.userId + '/vouchers/' + voucherId,
      null,
      'PUT'
    )
  }

  /**
   * Returns Product Recommendations for given user.
   *
   * @param {Object} [param = undefined] param
   * @param {String} [param.appName = undefined] param.appName
   * @param {String} [param.appVersion = undefined] param.appVersion
   * @param {String} [param.catalogCategory = undefined] param.catalogCategory
   * @returns {Promise<RecommendationsList>}
   */
  getRecommendations ({ appName, appVersion, catalogCategory } = {}) {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      this.userId === 0 ? '/api/v1/me/recommendations' : '/api/v1/users/' + this.userId + '/recommendations',
      this.toBody({
        app_name: appName,
        app_version: appVersion,
        catalog_category: catalogCategory
      }),
      'GET'
    )
  }

  /**
   * Returns a cart by a given cart uuid.
   * @param {String} param.cartId
   * @returns {Promise<Cart> }
   */
  getCart ({ cartId }) {
    return this.fetch(
      this._sws.accessToken ? this.bearerTokenAuthHeader() : null,
      '/api/v1/carts/' + cartId,
      null
    )
  }
}
