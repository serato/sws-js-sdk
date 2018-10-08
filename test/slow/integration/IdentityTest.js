import SwsClient from '../../../src/index'
import { describe, it, before } from 'mocha'
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
  beforeEach(function () {
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
})
