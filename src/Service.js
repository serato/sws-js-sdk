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
    this._client = Sws
    this._serviceUri = ''
    this._lastRequest = null

    this._invalidAccessTokenHandler = handleFetchError
    this._invalidRefreshTokenHandler = handleFetchError
    this._accessDeniedHandler = handleFetchError
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
    return 'Bearer ' + this._client.accessToken
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
    return 'Basic ' + Base64.encode(this._client.appId + ':' + this._client.appSecret)
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
      if (data.hasOwnProperty(p) && val && (val === true || val === false || val !== '')) {
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
   * @return {Promise}
   */
  fetch (auth, endpoint, body, method = 'GET', timeout = null) {
    let url = (this.serviceUri.indexOf('://') === -1 ? 'https://' : '') + this.serviceUri + endpoint

    let request = buildRequest(auth, url, body, method, timeout === null ? this._client.timeout : timeout)
    this._lastRequest = request

    return this.fetchRequest(request)
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
        let status = err.response.status
        let code = err.response.data.code

        if (status >= 500) {
          // TODO - Handle 500 and 503 responses
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
}

/**
 * Default error handler for HTTP fetch error
 *
 * @param {Error} err Fetch Error
 * @throws {Error}
 */
function handleFetchError (err) {
  let error = new Error(err.response.data.error)
  error.httpStatus = err.response.status
  error.code = err.response.data.code
  error.response = err.response
  throw error
}

/**
 * Constructs a Request object
 *
 * @param  {String} auth Authorisation header value
 * @param  {String} endpoint API endpoint
 * @param  {Object} body Object to send in the body
 * @param  {String} method HTTP Method GET, POST, PUT or DELETE (defaults to GET)
 * @return {Request}
 */
function buildRequest (auth, url, body, method, timeout) {
  let request = {
    timeout: timeout,
    url: url,
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
