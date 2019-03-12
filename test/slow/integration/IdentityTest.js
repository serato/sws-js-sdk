import SwsClient from '../../../src/index'
import { describe, it, before, beforeEach } from 'mocha'
import { expect } from 'chai'
import environment from '../../../environment.json'

const {
  'app_id': appId,
  'app_secret': appSecret,
  'service_uri': serviceUri,
  timeout
} = environment

describe('Slow Identity Tests', function () {
  this.timeout(timeout)
  let swsClient
  let systemTime
  let timestamp
  let emailAddress
  let password = 'test123'

  before(function () {
    // Initialise the client with parameters for the environment defined in `environment.json`
    swsClient = new SwsClient({ appId, secret: appSecret, serviceUri, timeout })
  })

  /**
   * Add a new user, log in, setting the access and refresh tokens for the client.
   */
  beforeEach('log the user in', function () {
    systemTime = new Date()
    timestamp = systemTime.getTime()
    emailAddress = 'testAddLicenseAuthorization' + timestamp + '@serato.com'
    return swsClient.id.addUser({ emailAddress, password, timestamp: systemTime }).then(() => {
      // Login request/promise to the newly created account
      return swsClient.id.login({ emailAddress, password }).then(
        data => {
          // Set the access and refresh from the response body returned from the login request
          swsClient.accessToken = data.tokens.access.token
          swsClient.refreshToken = data.tokens.refresh.token
        }
      )
    })
  })

  describe('makes valid requests to the /me endpoint', function () {
    it(`confirms that a valid GET request to the /me endpoint returns the requested user's data`, function () {
      return swsClient.id.getUser().then(
        data => {
          expect(data.email_address).to.equal(emailAddress)
          expect(data).to.have.all.keys('id', 'email_address', 'first_name', 'last_name', 'date_created', 'locale')
        }
      )
    })
  })
  describe('make valid request to me/logout', function () {
    it('logout should return a 204 and refresh token should then be invalidated', () => {
      swsClient.id.logout({ refreshToken: swsClient.refreshToken, allAppInstances: true })
        .then((data) => {
          expect(data === null)
          swsClient.id.tokenRefresh(swsClient.refreshToken)
            .then(data => {
              expect.fail()
            })
            .catch(err => {
              expect(err)
              expect(err.httpStatus).to.be(400)
              expect(err.data.code).to.be(1001)
            })
        })
        .catch(err => {
          console.error(err)
        })
    })
  })
})
