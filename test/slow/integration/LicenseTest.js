import SwsClient from '../../../src/index'
import { describe, it, before } from 'mocha'
import { expect } from 'chai'
import environment from '../../../environment.json'

const {
  'app_id': appId,
  'app_secret': appSecret,
  'user_email': userEmail,
  'user_password': userPassword,
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
          // Also set the user ID for the logged-in user
          userId = data.user.id
        }
      )
    })
  })

  describe('makes valid requests to the /products/types endpoint', function () {
    it('confirms that a valid GET request to the /products/types endpoint returns an array of matching types',
      function () {
        let params = { appName: 'serato_dj', appVersion: '2.0.0', term: 'permanent' }

        return swsClient.license.getProductTypes(params).then(
          data => {
            // I.e. some product types were returned
            expect(data.items).to.not.be.empty

            // Check that the items are not malformed
            data.items.map(item => expect(item).to.have.all.keys('id', 'term', 'name'))

            // Check that only product types with the requested term were returned
            data.items.map(item => expect(item.term).to.equal('permanent'))
          }
        )
      })

    it(`confirms that a valid GET request to the /products/types endpoint with only the app name specified returns an
        array of matching types`, function () {
      let params = { appName: 'serato_sample' }

      return swsClient.license.getProductTypes(params).then(
        data => {
          // I.e. some product types were returned
          expect(data.items).to.not.be.empty

          // Check that the items are not malformed
          data.items.map(item => expect(item).to.have.all.keys('id', 'term', 'name'))

          // Check that the product types are for the correct product
          data.items.map(item => expect(item.name.toLowerCase()).to.have.string('sample'))
        }
      )
    })

    it(`confirms that a valid GET request to the /products/types endpoint with only the term specified returns an array
        of matching types`, function () {
      let params = { term: 'trial' }

      return swsClient.license.getProductTypes(params).then(
        data => {
          // I.e. some product types were returned
          expect(data.items).to.not.be.empty

          // Check that the items are not malformed
          data.items.map(item => expect(item).to.have.all.keys('id', 'term', 'name'))

          // Check that the product types all have the correct term
          data.items.map(item => expect(item.term).to.equal('trial'))
        }
      )
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

    it('confirms that a GET request to /users/{user_id}/products returns product data for that user', function () {
      return swsClient.license.getProducts({ userId: userId }).then(
        data => {
          // I.e. some products were returned
          expect(data.items).to.not.be.empty

          // Check that the items are not malformed
          data.items.map(item => expect(item).to.have.all.keys(...expectedKeys))

          // Check that the products contain licenses
          let product = data.items.pop()
          let licenseKeys = ['id', 'activation_limit', 'license_type', 'user_id']
          product.licenses.map(license => expect(license).to.have.all.keys(licenseKeys))

          // Check that the products correspond to the correct user
          data.items.map(item => expect(item.user_id).to.equal(userId))
        }
      )
    })

    it('confirms that a GET request to /me/products returns product data for that user 123456', function () {
      return swsClient.license.getProducts().then(
        data => {
          // I.e. some products were returned
          expect(data.items).to.not.be.empty

          // Check that the items are not malformed
          data.items.map(item => expect(item).to.have.all.keys(...expectedKeys))

          // Check that the products contain licenses
          let product = data.items.pop()
          let licenseKeys = ['id', 'activation_limit', 'license_type', 'user_id']
          product.licenses.map(license => expect(license).to.have.all.keys(licenseKeys))

          // Check that the products correspond to the correct user
          data.items.map(item => expect(item.user_id).to.equal(userId))
        }
      )
    })

    it(`confirms that a GET request to /users/{user_id}/products in which the app name is specified returns product data
        for that user and app`, function () {
      return swsClient.license.getProducts({ appName: 'serato_sample', userId: userId }).then(
        data => {
          // I.e. some products were returned
          expect(data.items).to.not.be.empty

          // Check that the items are not malformed
          data.items.map(item => expect(item).to.have.all.keys(...expectedKeys))

          // Check that the user's products are for the correct app
          data.items.map(item => expect(item.product_type.name.toLowerCase()).to.have.string('sample'))
        }
      )
    })

    it(`confirms that a GET request to /users/{user_id}/products in which the term is specified returns only products
        matching that term`, function () {
      return swsClient.license.getProducts({ term: 'permanent', userId: userId }).then(
        data => {
          // I.e. some products were returned
          expect(data.items).to.not.be.empty

          // Check that the items are not malformed
          data.items.map(item => expect(item).to.have.all.keys(...expectedKeys))

          // Check that the products all have the correct term
          data.items.map(item => expect(item.product_type.term).to.equal('permanent'))
        }
      )
    })
  })

  describe('makes valid requests to the /me/licenses and /users/{user_id}/licenses endpoints', function () {
    let swsClient
    let userId
    let expectedKeys = ['id', 'activation_limit', 'license_type', 'user_id', 'activations']

    before(function () {
      // Initialise the client with parameters for the environment defined in `environment.json`
      swsClient = new SwsClient({ appId: appId, secret: appSecret, serviceUri: serviceUri, timeout: timeout })
      // Login request/promise to the 'old' login endpoint
      return swsClient.id.login({ emailAddress: userEmail, password: userPassword }).then(
        data => {
          // Set the access from the response body returned from the login request
          swsClient.accessToken = data.tokens.access.token

          // Also set the user ID for the logged-in user
          userId = data.user.id
        }
      )
    })

    it('confirms that a GET request to /users/{user_id}/licenses returns license data for that user', function () {
      return swsClient.license.getLicenses({ userId: userId }).then(
        data => {
          // I.e. some licenses were returned
          expect(data.items).to.not.be.empty

          for (let item of data.items) {
            // Check that the items are not malformed ('include' because there is an optional 'valid_to' key)
            expect(item).to.include.all.keys(...expectedKeys)

            // Check that the licenses correspond to the correct user
            expect(item.user_id).to.equal(userId)

            // Check that the license types are not malformed
            expect(item.license_type).to.have.all.keys('id', 'name', 'term', 'rlm_schema')
          }
        }
      )
    })

    it('confirms that a GET request to /me/licenses returns license data for that user', function () {
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
            expect(item.license_type).to.have.all.keys('id', 'name', 'term', 'rlm_schema')
          }
        }
      )
    })
  })

  describe('Post requests to /me/products and /users/{user_id}/products endpoints', function () {
    let hostMachineId = Math.random().toString(36).substring(2, 15)
    let productTypeId = 108 // Serato DJ Suite Trial

    describe('Valid requests', function () {
      it(`makes a request to /me/products endpoint`, function () {
        // Assign a product to the newly created user
        return swsClient.license.addProduct({ hostMachineId, productTypeId }).then(
          data => {
            expect(data.product_type.id).to.equal(productTypeId)
            expect(data.user_id).to.equal(userId)
          }
        )
      })
    })
  })

  describe('Post requests to /me/licenses/authorizations and /users/{user_id}/licenses/authorizations endpoints',
    function () {
      let hostMachineId = 'SID=' + Math.random().toString(36).substring(2, 15)
      let hostMachineName = 'test-machine' + hostMachineId
      let licenseId = Math.random().toString(36).substring(2, 10)
      let appVersion = '2.0.0'
      let appName = 'serato_dj'
      let productTypeId = 108 // Serato DJ Suite Trial

      /**
       * Assign a product to the user
       */
      before(function () {
        // Assign a product to the newly created user
        return swsClient.license.addProduct({ hostMachineId, productTypeId }).then(
          data => {
            licenseId = data.licenses[0].id
          }
        )
      })
      it(`makes a request to /me/licenses/authorizations endpoint`, function () {
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

  describe('Post requests to /me/licenses/authorizations/{authorization_id}' +
    ' and /users/{user_id}/licenses/authorizations/{authorization_id} endpoints',
  function () {
    let productTypeId = 108 // Serato DJ Suite Trial
    let hostMachineId = 'SID=' + Math.random().toString(36).substring(2, 15)
    let hostMachineName = 'test-machine' + hostMachineId
    let licenseId = Math.random().toString(36).substring(2, 10)
    let appVersion = '2.0.0'
    let appName = 'serato_dj'
    let action = 'activate'
    let authorizationId

    /**
     * Log in, setting the access and refresh tokens for the client and assign a product to the user
     */
    before(function () {
      // Assign a product to the newly created user and authorize the first license ID
      return swsClient.license.addProduct({ hostMachineId, productTypeId }).then(
        data => {
          licenseId = data.licenses[0].id
        }
      ).then(() => {
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
      })
    })
    it(`makes a request to /me/licenses/authorizations/{authorization_id} endpoint`, function () {
      let statusCode = 0 // A statusCode of 0 always indicates success. Non-zero values are application specific.
      return swsClient.license.updateLicenseAuthorization({ authorizationId, statusCode }).then(data => {
        expect(data.result).to.equal('success')
      })
    })
  })
})
