import Sws, { SwsClient } from '../../src/index'
import { describe, it, before } from 'mocha'
import { expect } from 'chai'
import environment from '../../environment.json'

const {
  'app_id': appId,
  'app_secret': appSecret,
  'user_email': userEmail,
  'user_password': userPassword,
  'service_uri': serviceUri
} = environment

const timeout = 5000

describe('Identity Tests', function () {
  describe('Identity URI Validation Tests', function () {
    it(`confirms URI used in 'tokenRefresh()' method, by returning a non-404 HTTP response`, function () {
      let sws = new Sws({ appId: appId })

      return sws.id.tokenRefresh('token.value').then(
        () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
        err => {
          expect(err.httpStatus).not.to.equal(404)
        }
      )
    })

    it(`confirms URI used in 'getMe()' method, by returning a non-404 HTTP response`, function () {
      let sws = new Sws({ appId: appId })

      return sws.id.getUserMe().then(
        () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
        err => {
          expect(err.httpStatus).not.to.equal(404)
        }
      )
    })

    it(`confirms URI used in 'login()' method, by returning a non-404 HTTP response`, function () {
      let sws = new Sws({ appId: appId })

      return sws.id.login().then(
        () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
        err => {
          expect(err.httpStatus).not.to.equal(404)
        }
      )
    })
  })

  describe('makes valid requests to the /me endpoint', function () {
    let sws // Initialised in the before hook

    /**
     * Log in, setting the access and refresh tokens for the client.
     */
    before(function () {
      // The login request can be slow in a dev environment
      this.timeout(timeout)

      // Initialise the client with parameters for the environment defined in `environment.json`
      sws = new SwsClient({ appId: appId, secret: appSecret, serviceUri: serviceUri, timeout: timeout })

      sws.accessTokenUpdatedHandler = (token) => {
        sws.accessToken = token
      }

      // Login request/promise to the 'old' login endpoint
      let login = sws.id.login({ emailAddress: userEmail, password: userPassword })

      // Set the access and refresh tokens from the response body returned from the login request
      return login.then(
        data => {
          sws.accessTokenUpdatedHandler(
            data.tokens.access.token,
            new Date(data.tokens.access.expires_at)
          )

          sws.refreshToken = data.tokens.refresh.token
        }
      )
    })

    it("confirms that a valid GET request to the /me endpoint returns the requested user's data", function () {
      return sws.id.getUserMe().then(
        userData => {
          expect(userData.email_address).to.equal(userEmail)
        }
      )
    })
  })

  describe('makes invalid requests to the /me endpoint', function () {
    let sws

    before(function () {
      this.timeout(timeout)
    })

    it('confirms that a request to /me without an access token returns a 403 response', function () {
      sws = new SwsClient({ appId: appId, secret: appSecret, serviceUri: serviceUri, timeout: timeout })
      sws.id.getUserMe().then(
        () => Promise.reject(new Error('Expected a 403 HTTP response code')),
        err => {
          // Expects a client user grants exception
          expect(err.httpStatus).to.equal(403)
          expect(err.code).to.equal(2000)
        }
      )
    })

    it('confirms that a request to /me with an invalid app ID returns a 401 response', function () {
      sws = new SwsClient({ appId: 'invalid-id', secret: appSecret, serviceUri: serviceUri, timeout: timeout })

      sws.accessTokenUpdatedHandler = (token) => {
        sws.accessToken = token
      }

      // Login request/promise to the 'old' login endpoint
      let login = sws.id.login({ emailAddress: userEmail, password: userPassword })

      // Set the access and refresh tokens from the response body returned from the login request
      let getUser = login.then(
        data => {
          sws.accessTokenUpdatedHandler(
            data.tokens.access.token,
            new Date(data.tokens.access.expires_at)
          )
          sws.refreshToken = data.tokens.refresh.token
          return sws.id.getUserMe()
        }
      )

      // Make the request to /me
      getUser.then(
        () => Promise.reject(new Error('Expected a 401 HTTP response code')),
        err => {
          // Expects an invalid basic authorization exception
          expect(err.httpStatus).to.equal(401)
          expect(err.code).to.equal(2004)
        }
      )
    })

    it('confirms that a request to /me with missing body params returns a 400 response', function () {
      sws = new SwsClient({ appId: appId, secret: appSecret, serviceUri: serviceUri, timeout: timeout })

      sws.accessTokenUpdatedHandler = (token) => {
        sws.accessToken = token
      }

      // Login request/promise to the 'old' login endpoint
      let login = sws.id.login({ emailAddress: '', password: '' })

      // Set the access and refresh tokens from the response body returned from the login request
      let getUser = login.then(
        data => {
          sws.accessTokenUpdatedHandler(
            data.tokens.access.token,
            new Date(data.tokens.access.expires_at)
          )
          sws.refreshToken = data.tokens.refresh.token
          return sws.id.getUserMe()
        }
      )

      // Make the request to /me
      getUser.then(
        () => Promise.reject(new Error('Expected a 400 HTTP response code')),
        err => {
          // Expects an invalid basic authorization exception
          expect(err.httpStatus).to.equal(400)
          expect(err.code).to.equal(1002)
        }
      )
    })
  })
})
