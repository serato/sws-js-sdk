'use strict'

import Service from './Service'

/**
 * @typedef {String} RlmLicenseFileContents
 * @typedef {'permanent' | 'subscription' | 'trial' | 'timelimited'} LicenseTerm
 * @typedef {'dj' | 'dj_lite' | 'serato_sample' | 'wailshark' | 'serato_studio'} HostApplicationId
 *
 * @typedef {Object} HostApplication
 * @property {HostApplicationId} id Host application identifer
 * @property {String} version
 *
 * @typedef {Object} HostMachine
 * @property {String} hardware_id
 * @property {String} canonical_hardware_id
 * @property {String} name
 * @property {String} activated_at
 *
 * @typedef {Object} Activation
 * @property {HostApplication} app
 * @property {HostMachine} machine
 *
 * @typedef {Object} RlmSchema
 * @property {String} name
 * @property {String} version RLM license version of the form Major.Minor.
 * @property {String} [options = undefined] options RLM license options.
 *
 * @typedef {Object} LicenseType
 * @property {Number} id
 * @property {String} name
 * @property {LicenseTerm} term
 * @property {Number} [expires_days = undefined] expires_days Number of days that the license will be valid for. Only trial and time-limited licenses return this value.
 * @property {RlmSchema} [rlm_schema = undefined] rlm_schema
 *
 * @typedef {Object} IlokToken
 * @property {String} token
 * @property {String} [user_id = undefined] user_id Ilok user id.
 * @property {String} url
 *
 * @typedef {Object} License
 * @property {String} id
 * @property {Number} [user_id = undefined] user_id
 * @property {Activation[]} activations
 * @property {Number} activation_limit
 * @property {LicenseType} license_type
 * @property {String} [valid_to = undefined] valid_to Expiry date of the license expressed as timestamp in ISO 8601 format. If not present license is valid indefinitely.
 * @property {Number} [expires_in_days = undefined] expires_in_days The number of days in which the license expires. If not present license is valid indefinitely.
 * @property {RlmLicenseFileContents} [rlm_license_file = undefined] rlm_license_file
 * @property {IlokToken} [ilok = undefined] ilok
 * @property { import("./Ecom").SubscriptionStatus } [subscription_status = undefined] subscription_status The subscription status for licenses included in products which themselves contain licenses whose term is `subscription`.
 * @property {Boolean} deleted
 *
 * @typedef {Object} LicenseList
 * @property {License[]} items
 *
 * @typedef {Object} ProductLicenseType
 * @property {Number} count
 * @property {LicenseType} license_type
 *
 * @typedef {Object} ProductType
 * @property {Number} id
 * @property {String} name
 * @property {ProductLicenseType[]} [license_types = undefined] license_types
 * @property {String[]} [trial_resets = undefined] trial_resets A list of dates at which trials were reset for the Product Type.
 * @property {Number[]} [upgrade_from = undefined] upgrade_from A list of Product Type IDs whose Product instances can be upgraded from instances of this Product Type.
 * @property {Number[]} [upgrade_to = undefined] upgrade_to A list of Product Type IDs whose Product instances can be upgraded to instances of this Product Type.
 *
 * @typedef {Object} ProductTypeList
 * @property {ProductType[]} items
 *
 * @typedef {Object} Product
 * @property {String} id
 * @property {String} date_created Date created timestamp in ISO 8601 format
 * @property {Number} [user_id = undefined] user_id
 * @property {License[]} licenses
 * @property {ProductType} product_type
 * @property {Number} [magento_order_id = undefined] magento_order_id
 * @property {Number} [magento_order_item_id = undefined] magento_order_item_id
 * @property {Number} [checkout_order_id = undefined] checkout_order_id
 * @property {Number} [checkout_order_item_id = undefined] checkout_order_item_id
 * @property {Boolean} deleted
 * @property { import("./Ecom").SubscriptionStatus } [subscription_status = undefined] subscription_status The subscription status for products that contain licenses whose term is `subscription`.
 *
 * @typedef {Object} ProductList
 * @property {Product[]} items
 *
 * @typedef {Object} LicenseAuthorizationList
 * @property {Number} authorization_id
 * @property {License[]} licenses
 *
 * @typedef {Object} RefreshTokenList
 * @property {'true'} result
 * @property {String[]} refresh_token_id
 */

/**
 * License Service class
 *
 * Exposes SWS License Service API endpoints via class methods
 */
export default class LicenseService extends Service {
  /**
   * Constructor
   *
   * @param {Sws} Sws Configured Sws instance
   * @return {void}
   */
  constructor (Sws) {
    super(Sws)
    this._serviceUri = Sws.serviceUri.license
  }

  /**
   * Returns a list of a user's licenses.
   * Uses the current user from the access token if `userId` is not specified.
   *
   * @param {Object} [param = undefined] param Options
   * @param {String} [param.appName = undefined] param.appName Only return licenses compatible with app
   * @param {String} [param.appVersion = undefined] param.appVersion Only return licenses compatible with app version `Major.minor.point`
   * @param {String} [param.term = undefined] param.term Only return licenses of specified term
   * @return {Promise<LicenseList>}
   */
  getLicenses ({ appName, appVersion, term } = {}) {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      this.userId === 0 ? '/api/v1/me/licenses' : '/api/v1/users/' + this.userId + '/licenses',
      this.toBody({ app_name: appName, app_version: appVersion, term })
    )
  }

  /**
   * Returns a single software product type matching the given type ID.
   *
   * @param {Number} productTypeId Product type ID
   * @return {Promise<ProductType>}
   */
  getProductType (productTypeId) {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      '/api/v1/products/types/' + productTypeId,
      null,
      'GET'
    )
  }

  /**
   * Returns a list of software product types.
   *
   * @param {Object} [param = undefined] param Options
   * @param {String} [param.appName = undefined] param.appName Only return product types compatible with app
   * @param {String} [param.appVersion = undefined] param.appVersion Only return product types compatible with app version `Major.minor.point`
   * @param {String} [param.term = undefined] param.term Only return product types of specified term
   * @return {Promise<ProductTypeList>}
   */
  getProductTypes ({ appName, appVersion, term } = {}) {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      '/api/v1/products/types',
      this.toBody({ app_name: appName, app_version: appVersion, term: term }),
      'GET'
    )
  }

  /**
   * Returns a list of a user's products.
   *
   * @param {Object} [param = undefined] param Options
   * @param {String} [param.appName = undefined] param.appName Only return products compatible with app
   * @param {String} [param.appVersion = undefined] param.appVersion Only return products compatible with app version `Major.minor.point`
   * @param {String} [param.term = undefined] param.term Only return product of specified term
   * @param {'true' | 'false'} [param.showLicenceActivations = undefined] param.showLicenceActivations Include activations for licenses
   * @return {Promise<ProductList>}
   */
  getProducts ({ appName, appVersion, term, showLicenceActivations } = {}) {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      this.userId === 0 ? '/api/v1/me/products' : '/api/v1/users/' + this.userId + '/products',
      this.toBody({ app_name: appName, app_version: appVersion, term: term, show_license_activations: showLicenceActivations })
    )
  }

  /**
   * Adds a product to a user.
   *
   * @param {Object} param Options
   * @param {String} [param.hostMachineId = undefined] param.hostMachineId Required when `productTypeId` is trial product type.
   * @param {Number} [param.productTypeId = undefined] param.productTypeId One of `productTypeId` or `productSerialNumber` is required.
   * @param {String} [param.productSerialNumber = undefined] param.productSerialNumber
   * @returns {Promise<Product>}
   */
  addProduct ({ hostMachineId, productTypeId, productSerialNumber }) {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      this.userId === 0 ? '/api/v1/me/products' : '/api/v1/users/' + this.userId + '/products',
      this.toBody({
        host_machine_id: hostMachineId,
        product_type_id: productTypeId,
        product_serial_number: productSerialNumber
      }),
      'POST'
    )
  }

  /**
   * Updates a product.
   *
   * @param {Object} param Options
   * @param {String} param.productId
   * @param {String} param.ilokUserId
   * @returns {Promise<Product>}
   */
  updateProduct ({ productId, ilokUserId }) {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      this.userId === 0
        ? '/api/v1/me/products/' + productId
        : '/api/v1/users/' + this.userId + '/products/' + productId,
      this.toBody({
        ilok_user_id: ilokUserId
      }),
      'PUT'
    )
  }

  /**
   * Create a new license authorization for a host.
   *
   * @param {Object} param Options
   * @param {String} param.action
   * @param {String} param.appName
   * @param {String} param.appVersion
   * @param {String} param.hostMachineId
   * @param {String} param.hostMachineName
   * @param {Number} param.licenseId
   * @param {String} param.systemTime
   * @returns {Promise<LicenseAuthorizationList>}
   */
  addLicenseAuthorization ({
    action,
    appName,
    appVersion,
    hostMachineId,
    hostMachineName,
    licenseId,
    systemTime
  }
  = {}) {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      this.userId === 0 ? '/api/v1/me/licenses/authorizations' : '/api/v1/users/' + this.userId + '/licenses/authorizations',
      this.toBody({
        action: action,
        app_name: appName,
        app_version: appVersion,
        host_machine_id: hostMachineId,
        host_machine_name: hostMachineName,
        license_id: licenseId,
        system_time: systemTime
      }),
      'POST'
    )
  }

  /**
   * Update the status of a license authorization action.
   *
   * @param {Object} param Options
   * @param {Number} param.authorizationId
   * @param {Number} param.statusCode
   * @returns {Promise<RefreshTokenList>}
   */
  updateLicenseAuthorization ({ authorizationId, statusCode }) {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      this.userId === 0
        ? '/api/v1/me/licenses/authorizations/' + authorizationId
        : '/api/v1/users/' + this.userId + '/licenses/authorizations/' + authorizationId,
      this.toBody({ status_code: statusCode }),
      'PUT'
    )
  }
}
