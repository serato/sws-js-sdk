'use strict'

import { Base64 } from 'js-base64'
import axios from 'axios'

export default class Service {
  /**
   * Constructor
   *
   * @param {Sws} Sws Configured Sws instance
   * @return {void}
   */
  constructor (Sws) {
    this._sws = Sws
    this._serviceUri = ''
    this._lastRequest = null

    this._invalidAccessTokenHandler = handleFetchError
    this._invalidRefreshTokenHandler = handleFetchError
    this._accessDeniedHandler = handleFetchError
    this._timeoutExceededHandler = handleFetchError
    this._serviceErrorHandler = handleFetchError
    this._serviceUnavailableHandler = handleFetchError
  }

  /**
   * Returns an `Authorisation` header value comprised of
   * a bearer token
   *
   * @protected
   *
   * @return {String} Auth header value
   */
  bearerTokenAuthHeader () {
    return 'Bearer ' + this._sws.accessToken
  }

  /**
   * Returns an `Authorisation` header value comprised of
   * an application ID and secret
   *
   * @protected
   *
   * @return {String} Auth header value
   */
  basicAuthHeader () {
    return 'Basic ' + Base64.encode(this._sws.appId + ':' + this._sws.appSecret)
  }

  /**
   * Get the user ID
   *
   * @return {Number} User ID
   */
  get userId () {
    return this._sws.userId
  }

  /**
   * Get the service URI endpoint
   *
   * @return {string} Service URI
   */
  get serviceUri () {
    return this._serviceUri
  }

  /**
   * Filters out empty and invalid values and returns a object
   * containing parameters for a request
   *
   * @protected
   *
   * @param {Object} data Request params
   * @return {Object} Params
   */
  toBody (data) {
    let requestData = {}
    for (let p in data) {
      let val = data[p]
      if (data.hasOwnProperty(p) && typeof val !== 'undefined' && val !== null) {
        requestData[p] = val
      }
    }
    return requestData
  }

  /**
   * Makes a request to an API endpoint
   *
   * @protected
   *
   * @param  {String} auth Authorisation header value
   * @param  {String} endpoint API endpoint
   * @param  {Object} body Object to send in the body
   * @param  {String} method HTTP Method GET, POST, PUT or DELETE (defaults to GET)
   * @param  {Number} timeout Request timout (ms)
   * @return {Promise}
   */
  fetch (auth, endpoint, body, method = 'GET', timeout = null) {
    this._lastRequest = buildRequest(
      auth,
      (this.serviceUri.indexOf('://') === -1 ? 'https://' : '') + this.serviceUri + endpoint,
      body,
      method,
      timeout === null ? this._sws.timeout : timeout
    )
    return this.fetchRequest(this._lastRequest)
  }

  /**
   * Executes a request to an API endpoint
   *
   * @param {Object} request Request object
   * @returns {Promise}
   */
  fetchRequest (request) {
    return axios(request)
      .then((response) => { return response.data })
      .catch((err) => {
        err.client = this

        if (err.code === 'ECONNABORTED') {
          // Timeout
          return Promise.resolve(this.timeoutExceededHandler(err))
        }

        let status = err.response.status
        let code = err.response.data.code

        if (status === 500) {
          return Promise.resolve(this.serviceErrorHandler(err))
        } else if (status === 503) {
          return Promise.resolve(this.serviceUnavailableHandler(err))
        } else if ((status === 403 && code === 2001) || (status === 401 && code === 2002)) {
          // Access token is invalid or expired
          // 403 2001 - Invalid access token
          // 401 2002 - Expired access token
          return Promise.resolve(this.invalidAccessTokenHandler(err))
        } else if (status === 400 && (code === 1001 || code === 1007)) {
          // Refresh token is invalid or expired
          // 400 1001 - Invalid Refresh token
          // 400 1007 - Expired Refresh token
          return Promise.resolve(this.invalidRefreshTokenHandler(err))
        } else if (status === 403 && code === 2000) {
          // Permissions error
          // 403 2000 - Access token has insufficient scopes
          return Promise.resolve(this.accessDeniedHandler(err))
        } else {
          // TODO (maybe): a generic way of injecting custom handlers
          // for any combination of HTTP response + error code.
          handleFetchError(err)
        }
      })
  }

  /**
   * Set the invalid access token callback
   * @param {function} f Callback
   * @return {void}
   */
  set invalidAccessTokenHandler (f) {
    this._invalidAccessTokenHandler = f
  }

  /**
   * Get the invalid access token callback
   * @return {function}
   */
  get invalidAccessTokenHandler () {
    return this._invalidAccessTokenHandler
  }

  /**
   * Set the invalid refresh token callback
   * @param {function} f Callback
   * @return {void}
   */
  set invalidRefreshTokenHandler (f) {
    this._invalidRefreshTokenHandler = f
  }

  /**
   * Get the invalid refresh token callback
   * @return {function}
   */
  get invalidRefreshTokenHandler () {
    return this._invalidRefreshTokenHandler
  }

  /**
   * Set the access denied callback
   * @param {function} f Callback
   * @return {void}
   */
  set accessDeniedHandler (f) {
    this._accessDeniedHandler = f
  }

  /**
   * Get the access denied callback
   * @return {function}
   */
  get accessDeniedHandler () {
    return this._accessDeniedHandler
  }

  /**
   * Set the timeout exceeded callback
   * @param {function} f Callback
   * @return {void}
   */
  set timeoutExceededHandler (f) {
    this._timeoutExceededHandler = f
  }

  /**
   * Get the timeout exceeded callback
   * @return {function}
   */
  get timeoutExceededHandler () {
    return this._timeoutExceededHandler
  }

  /**
   * Set the service error callback
   * @param {function} f Callback
   * @return {void}
   */
  set serviceErrorHandler (f) {
    this._serviceErrorHandler = f
  }

  /**
   * Get the service error callback
   * @return {function}
   */
  get serviceErrorHandler () {
    return this._serviceErrorHandler
  }

  /**
   * Set the service unavailable callback
   * @param {function} f Callback
   * @return {void}
   */
  set serviceUnavailableHandler (f) {
    this._serviceUnavailableHandler = f
  }

  /**
   * Get the service unavailable callback
   * @return {function}
   */
  get serviceUnavailableHandler () {
    return this._serviceUnavailableHandler
  }

  /**
   * Returns the configuration of the last request
   *
   * @return {Object}
   */
  get lastRequest () {
    return this._lastRequest
  }
}

/**
 * Default error handler for HTTP fetch error
 *
 * @param {Error} err Fetch Error
 * @throws {Error}
 */
function handleFetchError (err) {
  if (err.response) {
    let errText = err.response.data.error ? err.response.data.error : err.response.data.message
    let error = new Error(errText)
    error.httpStatus = err.response.status
    if (err.response.data.code) {
      error.code = err.response.data.code
    }
    error.response = err.response
    throw error
  } else {
    // If response is undefined, re-throw the exception
    throw err
  }
}

/**
 * Constructs a Request object
 *
 * @param  {String} auth Authorisation header value
 * @param  {String} endpoint API endpoint
 * @param  {Object} body Object to send in the body
 * @param  {String} method HTTP Method GET, POST, PUT or DELETE (defaults to GET)
 * @param  {Number} timeout Request timout (ms)
 * @return {Object}
 */
function buildRequest (auth, endpoint, body, method, timeout) {
  let request = {
    timeout: timeout,
    url: endpoint,
    method: method,
    responseType: 'json',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }

  if (auth !== null) {
    request.headers['Authorization'] = auth
  }

  if (method === 'GET') {
    request.params = body
  }

  if (method === 'PUT' || method === 'PATCH' || method === 'POST') {
    // TODO: is this right?
    request.data = body
  }

  return request
}
