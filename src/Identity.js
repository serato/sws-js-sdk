'use strict'

import Service from './Service'

/**
 * @typedef {String} RawToken
 * @typedef {Object<string, string[]>} Scopes
 *
 * @typedef {Object} RefreshToken
 * @property {RawToken} token
 * @property {Number} expires_at UNIX timestamp expiry time of token
 * @property {'Bearer'} type
 *
 * @typedef {Object} AccessToken
 * @property {RawToken} token
 * @property {Number} expires_at UNIX timestamp expiry time of token
 * @property {'Bearer'} type
 * @property {Scopes} scopes
 *
 * @typedef {Object} UserTokens
 * @property {AccessToken} access
 * @property {RefreshToken} refresh
 *
 * @typedef {Object} User
 * @property {Number} id
 * @property {String} email_address
 * @property {String} [first_name = undefined] first_name
 * @property {String} [last_name = undefined] last_name
 * @property {String} date_created Date of account creation expressed in ISO 8061 format
 * @property {String} locale ISO 15897 locale string
 * @property {String} [password_last_updated = undefined]  Date user last updated their password in ISO 8061 format, not returned if null
 *
 * @typedef {Object} UserLogin
 * @property {User} user
 * @property {UserTokens} tokens
 *
 * @typedef {Object} OkMessage
 * @property {String} message
 */

/**
 * Indentity Service class
 *
 * Exposes SWS Indentity Service API endpoints via class methods
 */
export default class IdentityService extends Service {
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
   * Exchange an authorization code for access and refresh tokens.
   *
   * Currently only supports authorization code flow with PKCE.
   *
   * @param {String} code Authorization code
   * @param {String} redirectUri The redirect URI used during the authorization workflow
   * @param {String} codeVerifier PKCE code verifier
   * @returns {Promise<UserLogin>}
   */
  tokenExchange (code, redirectUri, codeVerifier) {
    return this.fetch(
      null,
      '/api/v1/tokens/exchange',
      this.toBody({
        grant_type: 'authorization_code',
        app_id: this._sws.appId,
        code,
        redirect_uri: redirectUri,
        code_verifier: codeVerifier
      }),
      'POST'
    )
  }

  /**
   * Request a new access token
   *
   * @param {RawToken} refreshToken Refresh token
   * @returns {Promise<UserTokens>}
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
   *
   * @return {Promise<User>}
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
   * @param {String} [param.deviceId = undefined] param.deviceId ID of the user's device
   * @param {String} [param.deviceName = undefined] param.deviceName Name of the user's device
   * @return {Promise<UserLogin>}
   */
  login ({ emailAddress, password, deviceId, deviceName }) {
    return this.fetch(
      this.basicAuthHeader(),
      '/api/v1/login',
      this.toBody({
        email_address: emailAddress, password: password, device_id: deviceId, device_name: deviceName
      }),
      'POST'
    )
  }

  /**
   * Logout user from all SSO authenticated apps
   *
   * @param {Object} param Options
   * @param {RawToken} param.refreshToken Users Refresh token to invalidate
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
          refresh_token: refreshToken,
          disable_login: disableLogin
        }),
        'POST'
      )
    } else if (refreshTokenIds) {
      return this.fetch(
        null,
        '/api/v1/me/logout',
        this.toBody({
          refresh_token_ids: refreshTokenIds,
          disable_login: disableLogin
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
   * @param {String} [param.firstName = undefined] param.firstName
   * @param {String} [param.lastName = undefined] param.lastName
   * @param {String} [param.timestamp = undefined] param.timestamp
   * @param {String} [param.locale = undefined] param.locale
   * @returns {Promise<User>}
   */
  addUser ({ emailAddress, password, firstName, lastName, timestamp, locale }) {
    return this.fetch(
      this.basicAuthHeader(),
      '/api/v1/users',
      this.toBody({
        email_address: emailAddress,
        password: password,
        first_name: firstName,
        last_name: lastName,
        timestamp: timestamp,
        locale: locale
      }),
      'POST'
    )
  }

  /**
   * Deactivate a user account through DELETE request on /me &  /users/{user_id} endpoints.
   *
   * @returns {Promise<OkMessage>}
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
   * @param {Object} param Options
   * @param {String} param.emailAddress Email address to change to
   * @param {String} [param.redirectUri = undefined] param.redirectUri URI to redirect to after an email is sent.
   * @returns {Promise}
   * **/
  changeEmailAddress ({ emailAddress, redirectUri }) {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      this.userId === 0 ? '/api/v1/me/sendverifyemailaddress' : '/api/v1/users/' + this.userId + '/sendverifyemailaddress',
      this.toBody({ email_address: emailAddress, redirect_uri: redirectUri }),
      'POST'
    )
  }

  /**
   * Updates user's details (email address)
   *
   * @param {Object} param Options
   * @param {String} param.emailAddress Email address to change to
   * @returns {Promise<User>}
   * **/
  updateUser ({ emailAddress }) {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      '/api/v1/users/' + this.userId,
      this.toBody({ email_address: emailAddress }),
      'PUT'
    )
  }

  /**
   * Returns a list of users.
   *
   * @param {Object} param
   * @param {String} param.emailAddress
   * @param {Boolean} param.includeEmailAddressHistory
   * @returns {Promise<UserList>}
   */
  getUsers ({ emailAddress, includeEmailAddressHistory }) {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      '/api/v1/users',
      this.toBody({
        email_address: emailAddress,
        include_email_address_history: includeEmailAddressHistory
      }),
      'GET'
    )
  }
}
