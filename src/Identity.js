'use strict'

import Service from './Service'

/**
 * Indentity Service class
 *
 * Exposes SWS Indentity Service API endpoints via class methods
 */
export default class Identity extends Service {
  /**
   * Constructor
   *
   * @param {Sws} Sws Configured Sws instance
   * @return {void}
   */
  constructor (Sws) {
    super(Sws)
    this._serviceUri = Sws.serviceUri.id
  }

  /**
   * Request a new access token
   *
   * @param {String} refreshToken Refresh token
   * @returns {Promise}
   */
  tokenRefresh (refreshToken) {
    return this.fetch(
      null,
      '/api/v1/tokens/refresh',
      this.toBody({ refresh_token: refreshToken }),
      'POST'
    )
  }

  /**
   * Request user data for the user identified by the current access token.
   * Requires a valid access token.
   *
   * @return {Promise}
   */
  getUser () {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      this.userId === 0 ? '/api/v1/me' : '/api/v1/users/' + this.userId,
      null,
      'GET'
    )
  }

  /**
   * Request a new access and refresh token for the user identified by the given credentials.
   *
   * @param {Object} param Options
   * @param {String} param.emailAddress Email address of the user to log in as
   * @param {String} param.password Password of the user to log in as
   * @param {String} param.deviceId ID of the user's device
   * @param {String} param.deviceName Name of the user's device
   * @return {Promise}
   */
  login ({ emailAddress, password, deviceId, deviceName } = {}) {
    return this.fetch(
      this.basicAuthHeader(),
      '/api/v1/login',
      this.toBody({
        'email_address': emailAddress, 'password': password, 'device_id': deviceId, 'device_name': deviceName
      }),
      'POST'
    )
  }

  /**
   * Logout user from all SSO authenticated apps
   *
   * @param {Object} param Options
   * @param {String} param.refreshToken Users Refresh token to invalidate
   * @param {Boolean} param.allAppInstances
   * @return {Promise}
   */
  logout ({ refreshToken, allAppInstances = true } = {}) {
    return this.fetch(
      null,
      '/api/v1/me/logout',
      this.toBody({
        'refresh_token': refreshToken, 'all_app_instances': allAppInstances
      }),
      'POST'
    )
  }

  /**
   * Request for creating a new user account
   * NOTE: This endpoint is mainly created for integration tests
   *
   * @param {Object} param Options
   * @param {String} param.emailAddress
   * @param {String} param.password
   * @param {String} param.firstName
   * @param {String} param.lastName
   * @param {String} param.timestamp
   * @param {String} param.locale
   * @returns {Promise}
   */
  addUser ({ emailAddress, password, firstName, lastName, timestamp, locale } = {}) {
    return this.fetch(
      this.basicAuthHeader(),
      '/api/v1/users',
      this.toBody({
        'email_address': emailAddress,
        'password': password,
        'first_name': firstName,
        'last_name': lastName,
        'timestamp': timestamp,
        'locale': locale
      }),
      'POST'
    )
  }

  /**
   * Deactivate a user account through DELETE request on /me &  /users/{user_id} endpoints.
   *
   * @returns {Promise}
   * **/
  deactivateUser () {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      this.userId === 0 ? '/api/v1/me' : '/api/v1/users/' + this.userId,
      null,
      'DELETE'
    )
  }
}
