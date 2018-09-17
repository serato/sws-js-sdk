import { Base64 } from 'js-base64'
import fetch from 'node-fetch'

class Service {
  /**
   * Constructor
   */
  constructor (SwsClient) {
    this._client = SwsClient
    this._serviceUri = ''
  }

  /**
   * Returns an `Authorisation` header value comprised of
   * a bearer token
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
   * Encodes an object into a URL safe query string
   *
   * @param {Object} data Request params
   * @return {String} Query string
   */
  toQueryString (data) {
    let str = []
    for (let p in data) {
      if (data.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + '=' + encodeURIComponent(data[p]))
      }
    }
    return str.join('&')
  }

  /**
   * @param  {String} auth Authorisation header value
   * @param  {String} endpoint API endpoint
   * @param  {Object} body Object to send in the body
   * @param  {String} method HTTP Method GET, POST, PUT or DELETE (defaults to GET)
   * @return {Promise}
   */
  fetch (auth, endpoint, body, method = 'GET') {
    let _headers = { 'Accept': 'application/json', 'Authorization': auth }
    let _url = (this.serviceUri.indexOf('://') === -1 ? 'https://' : '') + this.serviceUri + endpoint
    let _body

    if (method === 'GET') {
      if (body) {
        let q = this.toQueryString(body)
        if (q !== '') {
          let separator = _url.indexOf('?') !== -1 ? '&' : '?'
          _url = _url + separator + q
        }
      }
    } else {
      _body = JSON.stringify(body)
    }

    return fetch(_url, {
      method: method,
      headers: _headers,
      body: _body
    })
      .then((response) => {
        if (response.ok) {
          return response.json()
        } else {
          let error = new Error(response.statusText)
          error.httpStatus = response.status
          error.response = response
          throw error
        }
      })
      .then((json) => {
        return json
      })
  }
}

export default Service
