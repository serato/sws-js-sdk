import Sws from '../../src/index'
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

describe('License Tests', function () {
  describe('License URI Validation Tests', function () {
    it(`confirms URI used in 'getLicenses()' method with no user ID, by returning a non-404 HTTP response`, function () {
      let sws = new Sws({ appId: 'myClientAppId' })

      return sws.license.getLicenses().then(
        () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
        err => {
          expect(err.httpStatus).not.to.equal(404)
        }
      )
    })

    it(`confirms URI used in 'getLicenses()' method with user ID, by returning a non-404 HTTP response`, function () {
      let sws = new Sws({ appId: 'myClientAppId' })

      return sws.license.getLicenses({ userId: 123 }).then(
        () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
        err => {
          expect(err.httpStatus).not.to.equal(404)
        }
      )
    })
  })

  describe('Valid requests to the /me/licenses/authorizations endpoint', function () {
    let sws // Initialised in the before hook

    /**
     * Log in once, setting the access and refresh tokens for the client.
     */
    before(function () {
      // The login request can be slow in a dev environment, therefore specified timeout to 5000
      // Initialise the client with parameters for the environment defined in `environment.json`
      sws = new Sws({ appId: appId, secret: appSecret, serviceUri: serviceUri, timeout: 5000 })

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

  })
})
