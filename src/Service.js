'use strict'

import { Base64 } from 'js-base64'
import axios from 'axios'
import Sws from './Sws'

/**
 * @typedef {'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS'} HttpMethod
 * @typedef {'json' | 'blob'} ResponseType
 */

/**
 * @class
 * @abstract
 */
export default class Service {
  /**
   * Constructor
   *
   * @param {Sws} Sws Configured Sws instance
   * @return {void}
   */
  constructor (Sws) {
    /** @private */
    this._sws = Sws
    /** @private */
    this._serviceUri = ''
    /** @private */
    this._lastRequest = null
    /** @private */
    this._invalidAccessTokenHandler = handleFetchError
    /** @private */
    this._invalidRefreshTokenHandler = handleFetchError
    /** @private */
    this._passwordReEntryRequiredHandler = handleFetchError
    /** @private */
    this._accessDeniedHandler = handleFetchError
    /** @private */
    this._timeoutExceededHandler = handleFetchError
    /** @private */
    this._serviceErrorHandler = handleFetchError
    /** @private */
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
   * Filters out empty and invalid values and returns a object
   * containing parameters for a request
   *
   * @protected
   *
   * @param { import("./Sws").RequestParams) } data Request params
   * @return { import("./Sws").RequestParams) } Params
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
   * @param  { import("./Sws").RequestParams) } body Object to send in the body
   * @param  {HttpMethod} [method='GET'] method HTTP Method GET, POST, PUT or DELETE (defaults to GET)
   * @param  {Number} [timeout=undefined] timeout Request timeout (ms)
   * @param  {ResponseType} [responseType='json'] responseType Response type for the request (e.g. json)
   * @param  { import("./Sws").RequestHeaders) } headers headers Custom headers (defaults to Accept/Content-Type json)
   * @return {Promise}
   */
  fetch (
    auth,
    endpoint,
    body,
    method = 'GET',
    timeout = null,
    responseType = 'json',
    headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  ) {
    this._lastRequest = buildRequest(
      auth,
      (this.serviceUri.indexOf('://') === -1 ? 'https://' : '') + this.serviceUri + endpoint,
      body,
      method,
      (timeout === null || timeout === undefined) ? this._sws.timeout : timeout,
      responseType,
      headers
    )
    return this.fetchRequest(this._lastRequest)
  }

  /**
   * Executes a request to an API endpoint
   *
   * @public
   *
   * @param { import("./Sws").Request) } request Request object
   * @returns {Promise}
   */
  fetchRequest (request) {
    return axios(request)
      .then((response) => { return response.data })
      .catch((err) => {
        err.client = this

        if (err.code === 'ECONNABORTED') {
          // Timeout
          return Promise.resolve(this.timeoutExceededHandler(request, err))
        }

        let status = err.response.status
        let code = err.response.data.code

        if (status === 500) {
          return Promise.resolve(this.serviceErrorHandler(request, err))
        } else if (status === 503) {
          return Promise.resolve(this.serviceUnavailableHandler(request, err))
        } else if ((status === 403 && code === 2001) || (status === 401 && code === 2002)) {
          // Access token is invalid or expired
          // 403 2001 - Invalid access token
          // 401 2002 - Expired access token
          return Promise.resolve(this.invalidAccessTokenHandler(request, err))
        } else if (status === 400 && (code === 1001 || code === 1007)) {
          // Refresh token is invalid or expired
          // 400 1001 - Invalid Refresh token
          // 400 1007 - Expired Refresh token
          return Promise.resolve(this.invalidRefreshTokenHandler(request, err))
        } else if (status === 403 && code === 2000) {
          // Permissions error
          // 403 2000 - Access token has insufficient scopes
          return Promise.resolve(this.accessDeniedHandler(request, err))
        } else if (status === 401 && code === 2011) {
          // Authorization error
          // 401 2011 - User is required to re-enter their password
          return Promise.resolve(this.passwordReEntryRequiredHandler(request, err))
        } else {
          // TODO (maybe): a generic way of injecting custom handlers
          // for any combination of HTTP response + error code.
          handleFetchError(request, err)
        }
      })
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
   * @return {String} Service URI
   */
  get serviceUri () {
    return this._serviceUri
  }

  /**
   * Set the invalid access token callback
   * @param { import("./Sws").RequestErrorHandler) } f Callback
   * @return {void}
   */
  set invalidAccessTokenHandler (f) {
    this._invalidAccessTokenHandler = f
  }

  /**
   * Get the invalid access token callback
   * @return { import("./Sws").RequestErrorHandler) }
   */
  get invalidAccessTokenHandler () {
    return this._invalidAccessTokenHandler
  }

  /**
   * Set the invalid refresh token callback
   * @param { import("./Sws").RequestErrorHandler) } f Callback
   * @return {void}
   */
  set invalidRefreshTokenHandler (f) {
    this._invalidRefreshTokenHandler = f
  }

  /**
   * Get the invalid refresh token callback
   * @return { import("./Sws").RequestErrorHandler) }
   */
  get invalidRefreshTokenHandler () {
    return this._invalidRefreshTokenHandler
  }

  /**
   * Set the password re-entry required callback
   * @param { import("./Sws").RequestErrorHandler) } f Callback
   * @return {void}
   */
  set passwordReEntryRequiredHandler (f) {
    this._passwordReEntryRequiredHandler = f
  }

  /**
   * Get the password re-entry required callback
   * @return { import("./Sws").RequestErrorHandler) }
   */
  get passwordReEntryRequiredHandler () {
    return this._passwordReEntryRequiredHandler
  }

  /**
   * Set the access denied callback
   * @param { import("./Sws").RequestErrorHandler) } f Callback
   * @return {void}
   */
  set accessDeniedHandler (f) {
    this._accessDeniedHandler = f
  }

  /**
   * Get the access denied callback
   * @return { import("./Sws").RequestErrorHandler) }
   */
  get accessDeniedHandler () {
    return this._accessDeniedHandler
  }

  /**
   * Set the timeout exceeded callback
   * @param { import("./Sws").RequestErrorHandler) } f Callback
   * @return {void}
   */
  set timeoutExceededHandler (f) {
    this._timeoutExceededHandler = f
  }

  /**
   * Get the timeout exceeded callback
   * @return { import("./Sws").RequestErrorHandler) }
   */
  get timeoutExceededHandler () {
    return this._timeoutExceededHandler
  }

  /**
   * Set the service error callback
   * @param { import("./Sws").RequestErrorHandler) } f Callback
   * @return {void}
   */
  set serviceErrorHandler (f) {
    this._serviceErrorHandler = f
  }

  /**
   * Get the service error callback
   * @return { import("./Sws").RequestErrorHandler) }
   */
  get serviceErrorHandler () {
    return this._serviceErrorHandler
  }

  /**
   * Set the service unavailable callback
   * @param { import("./Sws").RequestErrorHandler) } f Callback
   * @return {void}
   */
  set serviceUnavailableHandler (f) {
    this._serviceUnavailableHandler = f
  }

  /**
   * Get the service unavailable callback
   * @return { import("./Sws").RequestErrorHandler) }
   */
  get serviceUnavailableHandler () {
    return this._serviceUnavailableHandler
  }

  /**
   * Returns the configuration of the last request
   *
   * @return { import("./Sws").Request) }
   */
  get lastRequest () {
    return this._lastRequest
  }
}

/**
 * Default error handler for HTTP fetch error
 *
 * @param { import("./Sws").Request) } request Request object
 * @param {Error} err Fetch Error
 * @throws {Error}
 */
function handleFetchError (request, err) {
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
 * @param  { import("./Sws").RequestParams) } body Object to send in the body
 * @param  {HttpMethod} method HTTP Method GET, POST, PUT or DELETE (defaults to GET)
 * @param  {Number} timeout Request timout (ms)
 * @param  {ResponseType} responseType Response type for the request (e.g. json)
 * @param  { import("./Sws").RequestHeaders) } headers Custom headers (defaults to Accept/Content-Type json)
 * @return { import("./Sws").Request) }
 */
function buildRequest (auth, endpoint, body, method, timeout, responseType, headers) {
  let request = {
    timeout: timeout,
    url: endpoint,
    method: method,
    responseType: responseType,
    headers: headers
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
