import { Base64 } from 'js-base64'
import fetch, { Request, Headers } from 'node-fetch'

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
  fetch (auth, endpoint, body, method = 'GET') {
    let url = (this.serviceUri.indexOf('://') === -1 ? 'https://' : '') + this.serviceUri + endpoint

    let request = buildRequest(auth, url, body, method)
    this._lastRequest = request

    return fetch(request)
      .then((response) => {
        if (response.ok) {
          return response.json()
        } else {
          let error = new Error(response.statusText)
          error.httpStatus = response.status
          error.response = response
          error.request = request
          throw error
        }
      })
      .then((json) => {
        return json
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
function buildRequest (auth, url, body, method = 'GET') {
  let headers = new Headers()

  headers.append('Accept', 'application/json')
  headers.append('Content-Type', 'application/json')

  if (auth !== null) {
    headers.append('Authorization', auth)
  }

  let init = {
    method: method,
    headers: headers
  }

  if (method === 'GET') {
    if (body) {
      let q = toQueryString(body)
      if (q !== '') {
        let separator = url.indexOf('?') !== -1 ? '&' : '?'
        url = url + separator + q
      }
    }
  } else {
    // Is this right? Should we be JSON-encoding the data?
    init['body'] = JSON.stringify(body)
  }

  return new Request(url, init)
}

/**
 * Encodes an object into a URL safe query string
 *
 * @param {Object} data Request params
 * @return {String} Query string
 */
function toQueryString (data) {
  let str = []
  for (let p in data) {
    if (data.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + '=' + encodeURIComponent(data[p]))
    }
  }
  return str.join('&')
}
