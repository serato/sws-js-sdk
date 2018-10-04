import Sws, { SwsClient } from '../../src/index'
import { describe, it, before } from 'mocha'
import { expect } from 'chai'
import environment from '../../environment.json'

const {
  'app_id': appId,
  'app_secret': appSecret,
  'user_email': userEmail,
  'user_password': userPassword,
  'service_uri': serviceUri,
  timeout
} = environment

describe('Identity Tests', function () {
  this.timeout(timeout)

  describe('Identity URI Validation Tests', function () {
    it(`confirms URI used in 'tokenRefresh()' method, by returning a non-404 HTTP response`, function () {
      let swsClient = new Sws({ appId: appId })

      return swsClient.id.tokenRefresh('token.value').then(
        () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
        err => {
          expect(err.httpStatus).not.to.equal(404)
        }
      )
    })

    it(`confirms URI used in 'getUser()' method, by returning a non-404 HTTP response`, function () {
      let swsClient = new Sws({ appId: appId })

      return swsClient.id.getUser().then(
        () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
        err => {
          expect(err.httpStatus).not.to.equal(404)
        }
      )
    })

    it(`confirms URI used in 'login()' method, by returning a non-404 HTTP response`, function () {
      let swsClient = new Sws({ appId: appId })

      return swsClient.id.login().then(
        () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
        err => {
          expect(err.httpStatus).not.to.equal(404)
        }
      )
    })
  })

  describe('makes valid requests to the /me endpoint', function () {
    let swsClient // Initialised in the before hook

    /**
     * Log in, setting the access and refresh tokens for the client.
     */
    before(function () {
      // Initialise the client with parameters for the environment defined in `environment.json`
      swsClient = new SwsClient({ appId, secret: appSecret, serviceUri, timeout })
      // Login request/promise to the 'old' login endpoint
      return swsClient.id.login({ emailAddress: userEmail, password: userPassword }).then(
        data => {
          // Set the access and refresh token from the response body returned from the login request
          swsClient.accessToken = data.tokens.access.token
          swsClient.refreshToken = data.tokens.refresh.token
        }
      )
    })

    it("confirms that a valid GET request to the /me endpoint returns the requested user's data", function () {
      return swsClient.id.getUser().then(
        data => {
          expect(data.email_address).to.equal(userEmail)
          expect(data).to.have.all.keys('id', 'email_address', 'first_name', 'last_name', 'date_created', 'locale')
        }
      )
    })
  })

  describe('makes invalid requests to the /me endpoint', function () {
    let swsClient

    it('confirms that a request to /me without an access token returns a 403 response', function () {
      swsClient = new SwsClient({ appId, secret: appSecret, serviceUri, timeout })
      swsClient.id.getUser().then(
        () => Promise.reject(new Error('Expected a 403 HTTP response code')),
        err => {
          // Expects a client user grants exception
          expect(err.httpStatus).to.equal(403)
          expect(err.code).to.equal(2000)
        }
      )
    })

    it('confirms that a request to /me with an invalid app ID returns a 401 response', function () {
      swsClient = new SwsClient({ appId: 'invalid-id', secret: appSecret, serviceUri, timeout })

      swsClient.accessTokenUpdatedHandler = (token) => {
        swsClient.accessToken = token
      }

      // Login request/promise to the 'old' login endpoint
      let getUser = swsClient.id.login({ emailAddress: userEmail, password: userPassword }).then(
        data => {
          // Set the access from the response body returned from the login request
          swsClient.accessToken = data.tokens.access.token
          return swsClient.id.getUser()
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
      swsClient = new SwsClient({ appId, secret: appSecret, serviceUri, timeout })

      swsClient.accessTokenUpdatedHandler = (token) => {
        swsClient.accessToken = token
      }

      // Login request/promise to the 'old' login endpoint
      let getUser = swsClient.id.login({ emailAddress: '', password: '' }).then(
        data => {
          // Set the access from the response body returned from the login request
          swsClient.accessToken = data.tokens.access.token
          return swsClient.id.getUser()
        }
      )

      // Make the request to /me
      getUser.then(
        () => Promise.reject(new Error('Expected a 400 HTTP response code')),
        err => {
          // Expects a missing required parameters exception exception
          expect(err.httpStatus).to.equal(400)
          expect(err.code).to.equal(1002)
        }
      )
    })
  })
})
