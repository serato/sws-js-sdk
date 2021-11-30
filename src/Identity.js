'use strict'

import Service from './Service'
import Sws from './Sws'

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
   * @param {String} param.refreshTokenIds Comma delimited string containing multiple refresh tokens
   * @param {Boolean} param.disableLogin When provided, the user will be prevented from logging into the SSO service
   * @return {Promise}
   */
  logout ({ refreshToken, refreshTokenIds, disableLogin } = {}) {
    if (refreshToken) {
      return this.fetch(
        null,
        '/api/v1/me/logout',
        this.toBody({
          'refresh_token': refreshToken,
          'disable_login': disableLogin
        }),
        'POST'
      )
    } else if (refreshTokenIds) {
      return this.fetch(
        null,
        '/api/v1/me/logout',
        this.toBody({
          'refresh_token_ids': refreshTokenIds,
          'disable_login': disableLogin
        }),
        'POST'
      )
    }
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

  /**
   * Change email address through POST request on /me/sendverifyemailaddress &  /users/{user_id}/sendverifyemailaddress endpoints.
   *
   *@param {Object} param Options
   * @param {String} param.emailAddress Email address to change to
   * @param {String} param.redirectUri URI to redirect to after an email is sent.
   * @returns {Promise}
   * **/
  changeEmailAddress ({ emailAddress, redirectUri } = {}) {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      this.userId === 0 ? '/api/v1/me/sendverifyemailaddress' : '/api/v1/users/' + this.userId + '/sendverifyemailaddress',
      this.toBody({ 'email_address': emailAddress, 'redirect_uri': redirectUri }),
      'POST'
    )
  }
}
