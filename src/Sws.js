'use strict'

import License from './License'

const serviceUriDefault = { id: 'id.serato.io', license: 'license.serato.io' }

/**
 * Sws class.
 *
 * Provides single point of configuration and access to service clients.
 */
export default class Sws {
  /**
   * Constructor
   *
   * @param {Object} config Configuration options
   * @param {String} config.appId Application ID
   * @param {String} config.secret Application secret
   * @param {Number} config.timeout Request timeout
   * @param {Object} config.serviceUri Base URIs for SWS services
   * @param {String} config.serviceUri.id Base URI for SWS ID Service
   * @param {String} config.serviceUri.license Base URI for SWS License Service
   * @return {void}
   */
  constructor (
    { appId, secret = '', timeout = 3000, serviceUri = {} },
    { invalidAccessTokenHandler = null, invalidRefreshTokenHandler = null, accessDeniedHandler = null } = {}
  ) {
    this._appId = appId
    this._secret = secret
    this._timeout = timeout
    this._accessToken = ''
    // Set custom service URIs if provided
    this._serviceUri = {
      id: serviceUri.id ? serviceUri.id : serviceUriDefault.id,
      license: serviceUri.license ? serviceUri.license : serviceUriDefault.license
    }
    // Create service clients
    this._licenseService = new License(this)
  }

  /**
   * Get the client application ID
   *
   * @return {String} Application ID
   */
  get appId () {
    return this._appId
  }

  /**
   * Get the client application secret
   *
   * @return {String} Application secret
   */
  get appSecret () {
    return this._secret
  }

  /**
   * Get the service URI endpoints for SWS services
   *
   * @return {Object} Service URIs
   */
  get serviceUri () {
    return this._serviceUri
  }

  /**
   * Set access token
   *
   * @param {String} data Token
   * @return {Void}
   */
  set accessToken (data) {
    this._accessToken = data
  }

  /**
   * Get the current token
   *
   * @return {String} Current access token
   */
  get accessToken () {
    return this._accessToken
  }

  /**
   * Set the request timeout
   *
   * @param {Number} t Request timeout (ms)
   * @return {Void}
   */
  set timeout (t) {
    this._timeout = t
  }

  /**
   * Get the request timeout
   *
   * @return {Number} Request timeout (ms)
   */
  get timeout () {
    return this._timeout
  }

  /**
   * Get the license service instance
   *
   * @return {License} License service
   */
  get license () {
    return this._licenseService
  }
}

export {
  serviceUriDefault
}
