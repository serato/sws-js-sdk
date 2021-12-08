'use strict'

import License from './License'
import Identity from './Identity'
import Ecom from './Ecom'
import Profile from './Profile'
import Notifications from './Notifications'
import NotificationsV1 from './NotificationsV1'
import DigitalAssets from './DigitalAssets'
import Rewards from './Rewards'

/**
 * @typedef {Object<string,string>} RequestHeaders
 * @typedef {Object<string,string>} RequestParams
 *
 * @typedef {Object} Request
 * @property {Number} timeout Request timeout (ms)
 * @property {String} url Request URI
 * @property {String} method HTTP method
 * @property {String} responseType Response type for the request (e.g. json)
 * @property {RequestHeaders} headers HTTP request headers
 * @property {RequestParams} [params = undefined] params URL params
 * @property {RequestParams} [data = undefined] data Request body
 *
 * @callback RequestErrorHandler
 * @param {Request} request
 * @param {Error} error
 * @returns {void}
 *
 * @typedef {Object} ServiceUri
 * @property {String} [id=undefined] id Base URI for SWS ID Service
 * @property {String} [license=undefined] license Base URI for SWS License Service
 * @property {String} [ecom=undefined] ecom Base URI for SWS Ecommerce Service
 * @property {String} [notifications=undefined] notifications Base URI for SWS Notifications Service
 * @property {String} [profile=undefined] profile Base URI for SWS Profile Service
 * @property {String} [da=undefined] da Base URI for SWS Digital Assets Service
 * @property {String} [rewards=undefined] rewards Base URI for SWS Rewards Service
 *
 * @typedef {Object} SwsConfiguration
 * @property {String} appId Application ID
 * @property {String} [secret=''] secret Application secret
 * @property {Number} [timeout=3000] timeout Request timeout
 * @property {ServiceUri} [serviceUri={}] serviceUri Base URIs for SWS services
 */

/**
 * @type {ServiceUri}
 */
const serviceUriDefault = {
  id: 'id.serato.com',
  license: 'license.serato.com',
  ecom: 'ecom.serato.com',
  notifications: 'notifications.serato.com',
  profile: 'profile.serato.com',
  da: 'da.serato.com',
  rewards: 'rewards.serato.com'
}

export { serviceUriDefault }

/**
 * @classdesc Provides single point of configuration and access to service clients.
 * @class
 */
export default class Sws {
  /**
   * Constructor
   *
   * @param {SwsConfiguration} config Configuration options
   * @return {void}
   */
  constructor ({ appId, secret = '', timeout = 3000, serviceUri = {} }) {
    /** @private */
    this._appId = appId
    /** @private */
    this._secret = secret
    /** @private */
    this._timeout = timeout
    /** @private */
    this._accessToken = ''
    /** @private */
    this._refreshToken = ''
    /** @private */
    this._userId = 0
    /**@private */
    this._serviceUri = {
      id: serviceUri.id ? serviceUri.id : serviceUriDefault.id,
      license: serviceUri.license ? serviceUri.license : serviceUriDefault.license,
      ecom: serviceUri.ecom ? serviceUri.ecom : serviceUriDefault.ecom,
      notifications: serviceUri.notifications ? serviceUri.notifications : serviceUriDefault.notifications,
      profile: serviceUri.profile ? serviceUri.profile : serviceUriDefault.profile,
      da: serviceUri.da ? serviceUri.da : serviceUriDefault.da,
      rewards: serviceUri.rewards ? serviceUri.rewards : serviceUriDefault.rewards
    }
    /** @private */
    this._service = {
      license: new License(this),
      id: new Identity(this),
      ecom: new Ecom(this),
      notifications: new Notifications(this),
      notificationsV1: new NotificationsV1(this),
      profile: new Profile(this),
      da: new DigitalAssets(this),
      rewards: new Rewards(this)
      // Define more clients here,
      // and add a getter method
    }
  }

  /**
   * Sets the invalid access token callback for all clients
   *
   * @param {RequestErrorHandler} f Callback function
   * @return {Void}
   */
  setInvalidAccessTokenHandler (f) {
    for (const service in this._service) {
      this._service[service].invalidAccessTokenHandler = f
    }
  }

  /**
   * Sets the invalid refresh token callback for all clients
   *
   * @param {RequestErrorHandler} f Callback function
   * @return {Void}
   */
  setInvalidRefreshTokenHandler (f) {
    for (const service in this._service) {
      this._service[service].invalidRefreshTokenHandler = f
    }
  }

  /**
   * Sets the password re-entry required callback for all clients
   *
   * @param {RequestErrorHandler} f Callback function
   * @return {Void}
   */
  setPasswordReEntryRequiredHandler (f) {
    for (const service in this._service) {
      this._service[service].passwordReEntryRequiredHandler = f
    }
  }

  /**
   * Sets the access denied callback for all clients
   *
   * @param {RequestErrorHandler} f Callback function
   * @return {Void}
   */
  setAccessDeniedHandler (f) {
    for (const service in this._service) {
      this._service[service].accessDeniedHandler = f
    }
  }

  /**
   * Sets the service error callback for all clients
   *
   * @param {RequestErrorHandler} f Callback function
   * @return {Void}
   */
  setServiceErrorHandler (f) {
    for (const service in this._service) {
      this._service[service].serviceErrorHandler = f
    }
  }

  /**
   * Sets the service unavailable callback for all clients
   *
   * @param {RequestErrorHandler} f Callback function
   * @return {Void}
   */
  setServiceUnavailableHandler (f) {
    for (const service in this._service) {
      this._service[service].serviceUnavailableHandler = f
    }
  }

  /**
   * Sets the timeout exceeded callback for all clients
   *
   * @param {RequestErrorHandler} f Callback function
   * @return {Void}
   */
  setTimesoutExceededHandler (f) {
    for (const service in this._service) {
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
   * @return {ServiceUri} Service URIs
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
   * Get the notifications service client instance
   *
   * @return {NotificationsV1} Notifications V1 service client
   */
   get notificationsV1 () {
    return this._service.notificationsV1
  }
  /**
   * Get the DigitalAssets service client instance
   *
   * @return {DigitalAssets} DigitalAssets service client
   */
  get da () {
    return this._service.da
  }

  /**
   * Get the Rewards service client instance
   *
   * @return {Rewards} Rewards service client
   */
  get rewards () {
    return this._service.rewards
  }
}
