'use strict'

import Sws from './Sws'
import { v4 as uuidv4 } from 'uuid'

/**
 * A function that is called each time a new Access token is received.
 *
 * @callback AccessTokenUpdatedHandler
 * @param {String} accessToken
 * @param {Date} accessTokenExpires
 * @param {String} refreshToken
 * @param {Date} refreshTokenExpires
 * @returns {void}
 *
 * @typedef {'s256'} CodeChallengeMethod
 *
 * @typedef {Object} CodeChallenge
 * @property {CodeChallengeMethod} method
 * @property {String} challenge
 * @property {String} verifier
 *
 * @typedef {Object} AuthorizationRequest
 * @property {String} state
 * @property {String} codeVerifier
 * @property {String} url
 *
 * @classdesc Extends Sws to provide functionality for use in web browser-based applications.
 * @class
 * @extends Sws
 */
export default class SwsClient extends Sws {
  /**
   * Constructor
   *
   * @param { import("./Sws").SwsConfiguration } config Configuration options
   * @return {void}
   */
  constructor ({ appId, secret = '', timeout = 3000, serviceUri = {}, isServerSide }) {
    super({ appId, secret, timeout, serviceUri, isServerSide })

    /** @private */
    this._accessTokenUpdatedHandler = () => {}

    /**
     * @private
     * @type {(Promise<any|null>|null)}
     * @description This property stores any access token refresh that is currently in progress that is triggered
     * from `fetchNewAccessTokenAndRetryRequest`. It will resolve with `null` if refreshed successfully, or with
     * any value returned by a custom error handler.
     * */
    this._accessTokenRefreshPromise = null

    this.setInvalidAccessTokenHandler(this.fetchNewAccessTokenAndRetryRequest())

    this.setAccessDeniedHandler((request, err) => {
      const client = err.client
      // Could be that we haven't set the access token (ie. on first page load)
      if (this.accessToken === '' && this.refreshToken !== '') {
        // Try refreshing the access token and retrying
        const fn = this.fetchNewAccessTokenAndRetryRequest()
        return fn(request, err)
      }
      return client.defaultErrorHandler(request, err)
    })
  }

  /**
   * Creates the data required to redirect a client application through the authorization process.
   *
   * @public
   * @param {String} redirectUrl
   * @param {String} [refreshTokenId = undefined] refreshTokenId
   * @returns {Promise<AuthorizationRequest>}
   */
  createAuthorizationRequest (redirectUrl, refreshTokenId = undefined) {
    const state = this.createAuthState()

    return this.createCodeChallenge().then(codeChallenge => {
      const urlParams = [
        'app_id=' + encodeURIComponent(this.appId),
        'state=' + encodeURIComponent(state),
        'redirect_uri=' + encodeURIComponent(redirectUrl),
        'code_challenge=' + encodeURIComponent(codeChallenge.challenge),
        'code_challenge_method=' + encodeURIComponent(codeChallenge.method)
      ]
      if (refreshTokenId) {
        urlParams.push('rtid=' + encodeURIComponent(refreshTokenId))
      }
      const codeVerifier = codeChallenge.verifier
      const host = this.serviceUri.id
      const url = (host.indexOf('://') === -1 ? 'https://' : '') + host + '/en/authorize?' + urlParams.join('&')
      return { state, codeVerifier, url }
    })
  }

  /**
   * Set the access token updated callback
   *
   * @param {AccessTokenUpdatedHandler} f Callback
   * @return {void}
   */
  set accessTokenUpdatedHandler (f) {
    this._accessTokenUpdatedHandler = f
  }

  /**
   * Get the access token updated callback
   *
   * @return {AccessTokenUpdatedHandler}
   */
  get accessTokenUpdatedHandler () {
    return this._accessTokenUpdatedHandler
  }

  /**
   * @private
   * @returns {String}
   */
  createAuthState () {
    return uuidv4()
  }

  /**
   * @private
   * @param {String} [method = 's256'] method
   * @returns {Promise<CodeChallenge>}
   */
  createCodeChallenge (method = 's256') {
    const verifier = this.createRandomString()
    return this.sha256(verifier).then(challengeBuffer => {
      return { method, verifier, challenge: this.bufferToBase64UrlEncodedString(challengeBuffer) }
    })
  }

  /**
   * @private
   * @returns {Cryto}
   */
  getCrypto () {
    // IE 11.x uses msCrypto
    return window.crypto || window.msCrypto
  }

  /**
   * @private
   * @returns {SubtleCrypto}
   */
  getCryptoSubtle () {
    const crypto = this.getCrypto()
    // Safari 10.x uses webkitSubtle
    return crypto.subtle || crypto.webkitSubtle
  }

  /**
   * @private
   * @returns {String}
   */
  createRandomString () {
    const charset =
      '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_~.'
    let random = ''
    const randomValues = Array.from(
      this.getCrypto().getRandomValues(new Uint8Array(43))
    )
    randomValues.forEach(v => (random += charset[v % charset.length]))
    return random
  }

  /**
   * @private
   * @param {String} str
   * @returns {Promise<Number[] | Uint8Array>}
   */
  sha256 (str) {
    const digest = this.getCryptoSubtle().digest(
      { name: 'SHA-256' },
      new TextEncoder().encode(str)
    )
    if (window.msCrypto) {
      // msCrypto is not Promised based
      // https://msdn.microsoft.com/en-us/expression/dn904640(v=vs.71)
      return new Promise((resolve, reject) => {
        digest.oncomplete = (evt) => {
          resolve(evt.target.result)
        }
        digest.onerror = (evt) => {
          reject(evt.error)
        }
        digest.onabort = () => {
          reject(new Error('Digest operation aborted'))
        }
      })
    }

    return digest
  }

  /**
   * Base64url encodes the input buffer
   * @private
   * @param {Number[] | ArrayBuffer} input
   * @returns {String}
   */
  bufferToBase64UrlEncodedString (input) {
    const hashArray = Array.from(new Uint8Array(input))
    const base64 = window.btoa(String.fromCharCode(...hashArray))
    return base64
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
  }

  /**
   * @private
   * @returns {RequestErrorHandler}
   *
   * Returns a request error handler which will reattempt the original request with a refreshed access token.
   * The handler will also prevent concurrent access token refreshes to occur. Meaning that multiple calls
   * to this method will only result in one access token refresh. The resulting promise chain is as below:
   *
   * Call #1 Token refresh -> Process results -> Reattempt request
   *                                          \
   * Call #2                                   -> Reattempt request
   */
  fetchNewAccessTokenAndRetryRequest () {
    return (request, err) => {
      if (this._accessTokenRefreshPromise === null) {
        // If no access token refresh is in flight, request a refresh.
        // The promise stored here is resolved after the refresh has been attempted
        // and the results processed. Resolves with `null` on success, or with
        // any data an error handler may have returned as a result of the refresh.
        this._accessTokenRefreshPromise = this.id.tokenRefresh(this.refreshToken, false)
          .then(
            data => {
              // This token refresh request may have resulted in an error that was
              // handled by a custom error handler.
              // If so, call `Promise.resolve` with `data` so that the
              // outer Promise (ie. the one that failed before refreshing tokens)
              // has the expected result.
              if (!data.access) {
                return Promise.resolve(data)
              }

              // Update the access token property
              this.accessToken = data.access.token
              // Call the callback
              this.accessTokenUpdatedHandler(
                this.accessToken,
                new Date(data.access.expires_at * 1000),
                data.refresh.token,
                new Date(data.refresh.expires_at * 1000)
              )
              // Access token refresh has completed
              this._accessTokenRefreshPromise = null

              // Resolve the promise with `null` if successful
              return Promise.resolve(null)
            }
          )
      }

      // Retry the request or resolve with error handler data
      return this._accessTokenRefreshPromise.then(data => {
        if (data !== null) {
          // If data is not null, access token refresh was handled by an error handler.
          // Resolve the promise with this data.
          return Promise.resolve(data)
        }
        // Otherwise reattempt the initial request with a new access token

        // `err.client` is the specific client instance that made the inital request
        // when the `invalid access token` error was received.
        const client = err.client
        // Set a new Authorization header for the request
        request.headers.Authorization = client.bearerTokenAuthHeader()
        // Re-execute the 'last request'
        return client.fetchRequest(request)
      })
    }
  }
}
