'use strict'

import License from './License'
import Identity from './Identity'
import Ecom from './Ecom'
import Profile from './Profile'
import Notifications from './Notifications'
import DigitalAssets from './DigitalAssets'

const serviceUriDefault = {
  id: 'id.serato.com',
  license: 'license.serato.com',
  ecom: 'ecom.serato.com',
  notifications: 'notifications.serato.com',
  profile: 'profile.serato.com',
  da: 'da.serato.com'
}

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
   * @param {String} config.userId End user ID
   * @param {Number} config.timeout Request timeout
   * @param {Object} config.serviceUri Base URIs for SWS services
   * @param {String} config.serviceUri.id Base URI for SWS ID Service
   * @param {String} config.serviceUri.license Base URI for SWS License Service
   * @return {void}
   */
  constructor ({ appId, secret = '', userId = 0, timeout = 3000, serviceUri = {} }) {
    this._appId = appId
    this._secret = secret
    this._userId = userId
    this._timeout = timeout
    this._accessToken = ''
    this._refreshToken = ''
    // Set custom service URIs if provided
    this._serviceUri = {
      id: serviceUri.id ? serviceUri.id : serviceUriDefault.id,
      license: serviceUri.license ? serviceUri.license : serviceUriDefault.license,
      ecom: serviceUri.ecom ? serviceUri.ecom : serviceUriDefault.ecom,
      notifications: serviceUri.notifications ? serviceUri.notifications : serviceUriDefault.notifications,
      profile: serviceUri.profile ? serviceUri.profile : serviceUriDefault.profile,
      da: serviceUri.da ? serviceUri.da : serviceUriDefault.da
    }
    // Create service clients
    this._service = {
      license: new License(this),
      id: new Identity(this),
      ecom: new Ecom(this),
      notifications: new Notifications(this),
      profile: new Profile(this),
      da: new DigitalAssets(this)
      // Define more clients here,
      // and add a getter method
    }
  }

  /**
   * Sets the invalid access token callback for all clients
   *
   * @param {Function} f Callback function
   * @return {Void}
   */
  setInvalidAccessTokenHandler (f) {
    for (let service in this._service) {
      this._service[service].invalidAccessTokenHandler = f
    }
  }

  /**
   * Sets the invalid refresh token callback for all clients
   *
   * @param {Function} f Callback function
   * @return {Void}
   */
  setInvalidRefreshTokenHandler (f) {
    for (let service in this._service) {
      this._service[service].invalidRefreshTokenHandler = f
    }
  }

  /**
   * Sets the access denied callback for all clients
   *
   * @param {Function} f Callback function
   * @return {Void}
   */
  setAccessDeniedHandler (f) {
    for (let service in this._service) {
      this._service[service].accessDeniedHandler = f
    }
  }

  /**
   * Sets the service error callback for all clients
   *
   * @param {Function} f Callback function
   * @return {Void}
   */
  setServiceErrorHandler (f) {
    for (let service in this._service) {
      this._service[service].serviceErrorHandler = f
    }
  }

  /**
   * Sets the service unavailable callback for all clients
   *
   * @param {Function} f Callback function
   * @return {Void}
   */
  setServiceUnavailableHandler (f) {
    for (let service in this._service) {
      this._service[service].serviceUnavailableHandler = f
    }
  }

  /**
   * Sets the timeout exceeded callback for all clients
   *
   * @param {Function} f Callback function
   * @return {Void}
   */
  setTimesoutExceededHandler (f) {
    for (let service in this._service) {
      this._service[service].timeoutExceededHandler = f
    }
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
   * Set the user ID
   *
   * @param {Number} userId User ID
   * @return {void}
   */
  set userId (userId) {
    this._userId = (userId === null || userId === '' ? 0 : userId)
  }

  /**
   * Get the user ID
   *
   * @return {Number} User ID
   */
  get userId () {
    return this._userId
  }

  /**
   * Set access token
   *
   * @param {String} data Token
   * @return {void}
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
   * Set refresh token
   *
   * @param {String} data Token
   * @return {void}
   */
  set refreshToken (data) {
    this._refreshToken = data
  }

  /**
   * Get the current token
   *
   * @return {String} Current access token
   */
  get refreshToken () {
    return this._refreshToken
  }

  /**
   * Set the request timeout
   *
   * @param {Number} t Request timeout (ms)
   * @return {void}
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
   * Get the license service client instance
   *
   * @return {License} License service client
   */
  get license () {
    return this._service.license
  }

  /**
   * Get the identity service client instance
   *
   * @return {Identity} Identity service client
   */
  get id () {
    return this._service.id
  }

  /**
   * Get the ecom service client instance
   *
   * @return {Ecom} Ecom service client
   */
  get ecom () {
    return this._service.ecom
  }
  /**
   * Get the profile service client instance
   *
   * @return {Profile} Profile service client
   */
  get profile () {
    return this._service.profile
  }
  /**
   * Get the notifications service client instance
   *
   * @return {Notifications} Notifications service client
   */
  get notifications () {
    return this._service.notifications
  }
  /**
   * Get the DigitalAssets service client instance
   *
   * @return {DigitalAssets} DigitalAssets service client
   */
  get digitalAssets () {
    return this._service.da
  }
}

export {
  serviceUriDefault
}
