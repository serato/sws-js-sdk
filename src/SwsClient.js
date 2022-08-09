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
  constructor ({ appId, secret = '', timeout = 3000, serviceUri = {} }) {
    super({ appId: appId, secret: secret, timeout: timeout, serviceUri: serviceUri })

    /** @private */
    this._accessTokenUpdatedHandler = () => {}

    this.setInvalidAccessTokenHandler(this.fetchNewAccessTokenAndRetryRequest())

    this.setAccessDeniedHandler((request, err) => {
      // Could be that we haven't set the access token (ie. on first page load)
      if (this.accessToken === '') {
        const fn = this.fetchNewAccessTokenAndRetryRequest()
        fn(request, err)
      }
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
      return { method, verifier, challenge: this.bufferToString(challengeBuffer) }
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
   * @private
   * @param {Number[] | ArrayBuffer} input
   * @returns {String}
   */
  bufferToString (input) {
    const hashArray = Array.from(new Uint8Array(input))
    return hashArray
      .map((bytes) => bytes.toString(16).padStart(2, '0'))
      .join('')
  }

  /**
   * @private
   * @returns {RequestErrorHandler}
   */
  fetchNewAccessTokenAndRetryRequest () {
    return (request, err) => {
      // `err.client` is the specific client instance that made the inital request
      // when the `invalid access token` error was received.
      const client = err.client

      return this.id.tokenRefresh(this.refreshToken)
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
            // Set a new Authorization header for the request
            request.headers.Authorization = client.bearerTokenAuthHeader()
            // Re-execute the 'last request'
            return client.fetchRequest(request)
          }
        )
    }
  }
}
