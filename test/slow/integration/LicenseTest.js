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

describe('Slow Licenses Tests', function () {
  this.timeout(timeout)
  let swsClient
  let systemTime
  let timestamp
  let emailAddress
  let userId
  let password = 'test123'
  let hostMachineId
  let appVersion
  let appName
  let productTypeId

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
    hostMachineId = 'SID=' + Math.random().toString(36).substring(2, 15)
    appVersion = '2.0.0'
    appName = 'serato_dj'
    productTypeId = 108 // Serato DJ Suite Trial

    return swsClient.id.addUser({ emailAddress, password, timestamp: systemTime }).then(() => {
      // Login request/promise to the newly created account
      return swsClient.id.login({ emailAddress, password }).then(
        data => {
          // Set the access and refresh from the response body returned from the login request
          swsClient.accessToken = data.tokens.access.token
          swsClient.refreshToken = data.tokens.refresh.token
          // Also set the user ID for the logged-in user
          userId = data.user.id
        }
      )
    })
  })

  describe('makes valid requests to the /products/types endpoint', function () {
    it('confirms that a valid GET request to the /products/types endpoint returns an array of matching types',
      function () {
        // Assign a product to the newly created user
        return swsClient.license.addProduct({ hostMachineId, productTypeId }).then(() => {
          let params = { appName: appName, appVersion: appVersion, term: 'trial' }

          return swsClient.license.getProductTypes(params).then(
            data => {
              // I.e. some product types were returned
              expect(data.items).to.not.be.empty
              expect(data.items[0].id).to.be.equal(productTypeId)
              expect(data.items[0].term).to.be.equal('trial')
              // Check that the items are not malformed
              data.items.map(item => expect(item).to.include.all.keys('id', 'name'))
            }
          )
        })
      })
  })

  describe('makes valid requests to the /products/types/{product_type_id} endpoint', function () {
    it('confirms that a GET request to /products/types/{product_type_id} returns product type data', function () {
      return swsClient.license.getProductType(58).then(
        data => {
          // `58` is DJ Pro. This test will break if the product type ID changes.
          expect(data.id).to.equal(58)
          expect(data.term).to.equal('permanent')
          expect(data.name).to.equal('Serato DJ Pro [download]')
          expect(data.license_types).to.have.lengthOf(1) // Just the DJ Pro license
        }
      )
    })
  })

  describe('makes valid requests to the /me/products and /users/{user_id}/products endpoints', function () {
    let expectedKeys = ['user_id', 'id', 'date_created', 'licenses', 'product_type', 'deleted']

    it('confirms that a GET request to /me/products returns product data', function () {
      return swsClient.license.addProduct({ hostMachineId, productTypeId }).then(() => {
        return swsClient.license.getProducts().then(
          data => {
            // I.e. some products were returned
            expect(data.items).to.not.be.empty

            // Check that the items are not malformed
            data.items.map(item => expect(item).to.include.all.keys(...expectedKeys))

            // Check that the products contain licenses
            let product = data.items.pop()
            let licenseKeys = ['id', 'activation_limit', 'license_type']
            product.licenses.map(license => expect(license).to.include.all.keys(licenseKeys))

            // Check that the products correspond to the correct user
            data.items.map(item => expect(item.user_id).to.equal(userId))
          }
        )
      })
    })
  })

  describe('makes valid requests to the /me/products and /users/{user_id}/products endpoints with' +
    ' showLicenceActivations set to `true`', function () {
    let expectedKeys = ['user_id', 'id', 'date_created', 'licenses', 'product_type', 'deleted']
    let showLicenceActivations = 'true'
    it('confirms that a GET request to /me/products with showLicenceActivations set to `true` returns product data' +
      ' with license activations', function () {
      return swsClient.license.addProduct({ hostMachineId, productTypeId }).then(() => {
        return swsClient.license.getProducts({ showLicenceActivations }).then(
          data => {
            // I.e. some products were returned
            expect(data.items).to.not.be.empty

            // Check that the items are not malformed
            data.items.map(item => expect(item).to.include.all.keys(...expectedKeys))

            // Check that the products contain licenses
            let product = data.items.pop()
            let licenseKeys = ['id', 'activation_limit', 'license_type', 'activations']
            product.licenses.map(license => expect(license).to.include.all.keys(licenseKeys))

            // Check that the products correspond to the correct user
            data.items.map(item => expect(item.user_id).to.equal(userId))
          }
        )
      })
    })
  })

  describe('makes valid requests to the /me/licenses and /users/{user_id}/licenses endpoints', function () {
    let expectedKeys = ['id', 'activation_limit', 'license_type']
    it('confirms that a GET request to /me/licenses returns license data for that user', function () {
      return swsClient.license.addProduct({ hostMachineId, productTypeId }).then(() => {
        return swsClient.license.getLicenses().then(
          data => {
            // I.e. some licenses were returned
            expect(data.items).to.not.be.empty

            for (let item of data.items) {
              // Check that the items are not malformed ('include' because there is an optional 'valid_to' key)
              expect(item).to.include.all.keys(...expectedKeys)

              // Check that the licenses correspond to the correct user
              expect(item.user_id).to.equal(userId)

              // Check that the license types are not malformed
              expect(item.license_type).to.include.all.keys('id', 'name', 'term')
            }
          }
        )
      })
    })
  })

  describe('Post requests to /me/products and /users/{user_id}/products endpoints', function () {
    it(`makes a POST request to /me/products endpoint`, function () {
      // Assign a product to the newly created user
      return swsClient.license.addProduct({ hostMachineId, productTypeId }).then(
        data => {
          expect(data.product_type.id).to.equal(productTypeId)
          expect(data.user_id).to.equal(userId)
        }
      )
    })
  })

  describe('Post requests to /me/licenses/authorizations and /users/{user_id}/licenses/authorizations endpoints',
    function () {
      let hostMachineName = 'test-machine' + hostMachineId
      let licenseId = Math.random().toString(36).substring(2, 10)

      it(`makes a POST request to /me/licenses/authorizations endpoint`, function () {
        // Assign a product to the newly created user
        return swsClient.license.addProduct({ hostMachineId, productTypeId }).then(
          data => {
            licenseId = data.licenses[0].id
          }
        ).then(() => {
          return swsClient.license.addLicenseAuthorization({
            action: 'activate', // activate license
            appName,
            appVersion,
            hostMachineId,
            hostMachineName,
            licenseId,
            systemTime
          }).then(
            data => {
              expect(data.licenses[0].activations[0].machine.hardware_id).to.equal(hostMachineId)
              expect(data.licenses[0].activations[0].machine.name).to.equal(hostMachineName)
              expect(data.licenses[0].user_id).to.equal(userId)
              expect(data.licenses[0].id).to.equal(licenseId)
              expect(data.licenses[0].activations[0].app.id).to.equal(appName)
              expect(data.licenses[0].activations[0].app.version).to.equal(appVersion)
            }
          )
        })
      })
    })

  describe('Post requests to /me/licenses/authorizations/{authorization_id}' +
    ' and /users/{user_id}/licenses/authorizations/{authorization_id} endpoints',
  function () {
    let hostMachineName = 'test-machine' + hostMachineId
    let licenseId = Math.random().toString(36).substring(2, 10)
    let action = 'activate'
    let authorizationId

    it(`makes a PUT request to /me/licenses/authorizations/{authorization_id} endpoint`, function () {
      let statusCode = 0 // A statusCode of 0 always indicates success. Non-zero values are application specific.
      // Assign a product to the newly created user
      return swsClient.license.addProduct({ hostMachineId, productTypeId }).then(
        data => {
          licenseId = data.licenses[0].id
        }
      ).then(() => {
        // Authorize the first license ID
        return swsClient.license.addLicenseAuthorization({
          action, // activate license
          appName,
          appVersion,
          hostMachineId,
          hostMachineName,
          licenseId,
          systemTime
        }).then(
          data => {
            authorizationId = data.authorization_id
          }
        )
      }).then(() => {
        return swsClient.license.updateLicenseAuthorization({ authorizationId, statusCode }).then(data => {
          expect(data.result).to.equal('success')
        })
      })
    })
  })
})
