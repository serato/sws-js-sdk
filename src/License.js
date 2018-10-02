'use strict'

import Service from './Service'
import qs from 'qs'

/**
 * License Service class
 *
 * Exposes SWS License Service API endpoints via class methods
 */
export default class License extends Service {
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
   * Requires a valid access token.
   * Uses the current user from the access token if `userId` is not specified.
   *
   * @param {Object} param Options
   * @param {String} param.appName Only return licenses compatible with app
   * @param {String} param.appVersion Only return licenses compatible with app version `Major.minor.point`
   * @param {String} param.term Only return licenses of specified term
   * @param {Number} param.userId Return licenses belonging to user
   * @return {Promise}
   */
  getLicenses ({ appName = '', appVersion = '', term = '', userId = '' } = {}) {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      userId === '' ? '/api/v1/me/licenses' : '/api/v1/users/' + userId + '/licenses',
      this.toBody({ app_name: appName, app_version: appVersion, term: term })
    )
  }

  /**
   * Returns a single software product type matching the given type ID.
   * Requires a valid access token.
   *
   * @param {Number} productTypeId Product type ID
   * @return {Promise}
   */
  getProductType (productTypeId) {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      `/api/v1/products/types/${productTypeId}`,
      null,
      'GET'
    )
  }

  /**
   * Returns a list of software product types.
   * Requires a valid access token.
   *
   * @param {Object} param Options
   * @param {String} param.appName Only return product types compatible with app
   * @param {String} param.appVersion Only return product types compatible with app version `Major.minor.point`
   * @param {String} param.term Only return product types of specified term
   * @return {Promise}
   */
  getProductTypes ({ appName = '', appVersion = '', term = '' } = {}) {
    let params = { app_name: appName, app_version: appVersion, term: term }
    let query = qs.stringify(params, { addQueryPrefix: true, skipNulls: true })
    return this.fetch(
      this.bearerTokenAuthHeader(),
      '/api/v1/products/types' + query,
      null,
      'GET'
    )
  }

  /**
   * Returns a list of a user's products.
   * Requires a valid access token.
   * Uses the current user from the access token if `userId` is not specified.
   *
   * @param {Object} param Options
   * @param {String} param.checkoutOrderId Only return products compatible with app
   * @param {String} param.magentoOrderId Only return products compatible with app version `Major.minor.point`
   * @param {Number} param.userId Return products belonging to user
   * @return {Promise}
   */
  getProducts ({ checkoutOrderId = '', magentoOrderId = '', userId = 0 } = {}) {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      userId === 0 ? '/api/v1/me/products' : '/api/v1/users/' + userId + '/products',
      this.toBody({ checkout_order_id: checkoutOrderId, magento_order_id: magentoOrderId })
    )
  }

  /**
   * Create a new license authorization for a host.
   *
   * Requires a valid access token.
   * Uses the current user from the access token if `userId` is not specified.
   *
   * @param action
   * @param appName
   * @param appVersion
   * @param hostMachineId
   * @param hostMachineName
   * @param licenseId
   * @param systemTime
   * @param userId
   * @returns {Promise}
   */
  postLicensesAuthorizations({
    action = '',
    appName = '',
    appVersion = '',
    hostMachineId = '',
    hostMachineName = '',
    licenseId = '',
    systemTime = '',
    userId = '' }) {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      userId === '' ? '/api/v1/me/licenses/authorizations' : '/api/v1/users/' + userId + '/licenses/authorizations',
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
}
