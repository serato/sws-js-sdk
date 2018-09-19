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

    return axios(request)
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          return response.data
        } else {
          let error = new Error(response.data.error)
          error.httpStatus = response.status
          error.code = response.data.code
          error.response = response
          throw error
        }
      })
  }
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
    },
    // Handle all non-200 responses ourselves
    validateStatus: function (status) {
      return true
    }
  }

  if (auth !== null) {
    request.headers['Authorization'] = auth
  }

  if (method === 'GET') {
    request.params = body
  }

  if (method === 'PUT' || method === 'PATCH' || method === 'POST') {
    request.data = body
    // // Do we need to do this??
    // request.transformRequest = function (data, headers) {
    //   return JSON.stringify(body)
    // }
  }

  return request
}
