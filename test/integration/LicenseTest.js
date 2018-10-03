import Sws, { SwsClient } from '../../src/index'
import { describe, it, before } from 'mocha'
import { expect } from 'chai'
import environment from '../../environment.json'

// Some assumptions here: the user specified owns Serato products, which include Sample (may be a trial) and at least
// one permanent license.
// TODO: Add these products / activate these licenses during test setup
const {
  'app_id': appId,
  'app_secret': appSecret,
  'user_email': userEmail,
  'user_password': userPassword,
  'service_uri': serviceUri,
  timeout
} = environment

describe('License Tests', function () {
  this.timeout(timeout)

  describe('License URI Validation Tests', function () {
    it(`confirms URI used in 'getLicenses()' method with no user ID, by returning a non-404 HTTP response`, function () {
      let swsClient = new Sws({ appId: 'myClientAppId' })

      return swsClient.license.getLicenses().then(
        () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
        err => {
          expect(err.httpStatus).not.to.equal(404)
        }
      )
    })

    it(`confirms URI used in 'getLicenses()' method with user ID, by returning a non-404 HTTP response`, function () {
      let swsClient = new Sws({ appId: 'myClientAppId' })

      return swsClient.license.getLicenses({ userId: 123 }).then(
        () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
        err => {
          expect(err.httpStatus).not.to.equal(404)
        }
      )
    })

    it(`confirms URI used in 'getProductType()' method, by returning a non-404 HTTP response`, function () {
      let swsClient = new Sws({ appId: appId })

      return swsClient.license.getProductType(0).then(
        () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
        err => {
          expect(err.httpStatus).not.to.equal(404)
        }
      )
    })

    it(`confirms URI used in 'getProductTypes()' method, by returning a non-404 HTTP response`, function () {
      let swsClient = new Sws({ appId: appId })

      return swsClient.license.getProductTypes().then(
        () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
        err => {
          expect(err.httpStatus).not.to.equal(404)
        }
      )
    })

    it(`confirms URI used in 'getProducts()' method with no user ID, by returning a non-404 HTTP response`, function () {
      let swsClient = new Sws({ appId: appId })

      return swsClient.license.getProducts().then(
        () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
        err => {
          expect(err.httpStatus).not.to.equal(404)
        }
      )
    })

    it(`confirms URI used in 'getProducts()' method with user ID, by returning a non-404 HTTP response`, function () {
      let swsClient = new Sws({ appId: appId })

      return swsClient.license.getProducts({ userId: 123 }).then(
        () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
        err => {
          expect(err.httpStatus).not.to.equal(404)
        }
      )
    })
  })

  describe('makes valid requests to the /products/types endpoint', function () {
    let swsClient

    /**
     * Log in, setting the access and refresh tokens for the client.
     */
    before(function () {
      // Initialise the client with parameters for the environment defined in `environment.json`
      swsClient = new SwsClient({ appId: appId, secret: appSecret, serviceUri: serviceUri, timeout: timeout })

      swsClient.accessTokenUpdatedHandler = (token) => {
        swsClient.accessToken = token
      }

      // Login request/promise to the 'old' login endpoint
      let login = swsClient.id.login({ emailAddress: userEmail, password: userPassword })

      // Set the access and refresh tokens from the response body returned from the login request
      return login.then(
        data => {
          swsClient.accessTokenUpdatedHandler(
            data.tokens.access.token,
            new Date(data.tokens.access.expires_at)
          )

          swsClient.refreshToken = data.tokens.refresh.token
        }
      )
    })

    it('confirms that a valid GET request to the /products/types endpoint returns an array of matching types', function () {
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

  describe('makes invalid requests to the /products/types endpoint', function () {
    let swsClient

    /**
     * Log in, setting the access and refresh tokens for the client.
     */
    before(function () {
      // Initialise the client with parameters for the environment defined in `environment.json`
      swsClient = new SwsClient({ appId: appId, secret: appSecret, serviceUri: serviceUri, timeout: timeout })

      swsClient.accessTokenUpdatedHandler = (token) => {
        swsClient.accessToken = token
      }

      // Login request/promise to the 'old' login endpoint
      let login = swsClient.id.login({ emailAddress: userEmail, password: userPassword })

      // Set the access and refresh tokens from the data body returned from the login request
      return login.then(
        data => {
          swsClient.accessTokenUpdatedHandler(
            data.tokens.access.token,
            new Date(data.tokens.access.expires_at)
          )

          swsClient.refreshToken = data.tokens.refresh.token
        }
      )
    })

    it('confirms that a GET request to the /products/types with an invalid app name returns a 400 error', function () {
      let params = { appName: 'invalid-app-name' }

      return swsClient.license.getProductTypes(params).then(
        () => Promise.reject(new Error('Expected 400 HTTP response code')),
        err => {
          // Expects an invalid host app name exception
          expect(err.httpStatus).to.equal(400)
          expect(err.code).to.equal(1000)
        }
      )
    })

    it('confirms that a GET request to the /products/types with an invalid app version returns a 400 error',
      function () {
        let params = { appName: 'serato_dj', appVersion: 'invalid-app-version' }

        return swsClient.license.getProductTypes(params).then(
          () => Promise.reject(new Error('Expected 400 HTTP response code')),
          err => {
            // Expects an invalid host app version exception
            expect(err.httpStatus).to.equal(400)
            expect(err.code).to.equal(1007)
          }
        )
      })

    it('confirms that a GET request to the /products/types with an invalid term returns a 400 error', function () {
      let params = { term: 'invalid-term' }

      return swsClient.license.getProductTypes(params).then(
        () => Promise.reject(new Error('Expected 400 HTTP response code')),
        err => {
          // Expects an invalid license term exception
          expect(err.httpStatus).to.equal(400)
          expect(err.code).to.equal(1015)
        }
      )
    })
  })

  describe('makes valid requests to the /products/types/{product_type_id} endpoint', function () {
    let swsClient

    /**
     * Log in, setting the access and refresh tokens for the client.
     */
    before(function () {
      // Initialise the client with parameters for the environment defined in `environment.json`
      swsClient = new SwsClient({ appId: appId, secret: appSecret, serviceUri: serviceUri, timeout: timeout })

      swsClient.accessTokenUpdatedHandler = (token) => {
        swsClient.accessToken = token
      }

      // Login request/promise to the 'old' login endpoint
      let login = swsClient.id.login({ emailAddress: userEmail, password: userPassword })

      // Set the access and refresh tokens from the response body returned from the login request
      return login.then(
        data => {
          swsClient.accessTokenUpdatedHandler(
            data.tokens.access.token,
            new Date(data.tokens.access.expires_at)
          )

          swsClient.refreshToken = data.tokens.refresh.token
        }
      )
    })

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

  describe('makes invalid requests to the /products/types/{product_type_id} endpoint', function () {
    let swsClient

    /**
     * Log in, setting the access and refresh tokens for the client.
     */
    before(function () {
      // Initialise the client with parameters for the environment defined in `environment.json`
      swsClient = new SwsClient({ appId: appId, secret: appSecret, serviceUri: serviceUri, timeout: timeout })

      swsClient.accessTokenUpdatedHandler = (token) => {
        swsClient.accessToken = token
      }

      // Login request/promise to the 'old' login endpoint
      let login = swsClient.id.login({ emailAddress: userEmail, password: userPassword })

      // Set the access and refresh tokens from the response body returned from the login request
      return login.then(
        data => {
          swsClient.accessTokenUpdatedHandler(
            data.tokens.access.token,
            new Date(data.tokens.access.expires_at)
          )

          swsClient.refreshToken = data.tokens.refresh.token
        }
      )
    })

    it(`confirms that a GET request to /products/types/{product_type_id} with an invalid type ID results in a 404 
        response`, function () {
      return swsClient.license.getProductType(0).then(
        () => Promise.reject(new Error('Expected 404 HTTP response code')),
        err => {
          // Standard 404; no Serato-specific error code header
          expect(err.httpStatus).to.equal(404)
        }
      )
    })
  })

  describe('makes valid requests to the /me/products and /users/{user_id}/products endpoints', function () {
    let swsClient
    let userId
    let expectedKeys = ['user_id', 'id', 'date_created', 'licenses', 'product_type', 'deleted']

    before(function () {
      // Initialise the client with parameters for the environment defined in `environment.json`
      swsClient = new SwsClient({ appId: appId, secret: appSecret, serviceUri: serviceUri, timeout: timeout })

      swsClient.accessTokenUpdatedHandler = (token) => {
        swsClient.accessToken = token
      }

      // Login request/promise to the 'old' login endpoint
      let login = swsClient.id.login({ emailAddress: userEmail, password: userPassword })

      // Set the access and refresh tokens from the response body returned from the login request
      return login.then(
        data => {
          swsClient.accessTokenUpdatedHandler(
            data.tokens.access.token,
            new Date(data.tokens.access.expires_at)
          )

          swsClient.refreshToken = data.tokens.refresh.token

          // Also set the user ID for the logged-in user
          userId = data.user.id
        }
      )
    })

    it('confirms that a GET request to /users/{user_id}/products returns product data for that user', function () {
      return swsClient.license.getProducts({ userId: userId }).then(
        data => {
          // I.e. some product types were returned
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

    it('confirms that a GET request to /me/products returns product data for that user', function () {
      return swsClient.license.getProducts().then(
        data => {
          // I.e. some product types were returned
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
          // I.e. some product types were returned
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
          // I.e. some product types were returned
          expect(data.items).to.not.be.empty

          // Check that the items are not malformed
          data.items.map(item => expect(item).to.have.all.keys(...expectedKeys))

          // Check that the product types all have the correct term
          data.items.map(item => expect(item.product_type.term).to.equal('permanent'))
        }
      )
    })
  })

  describe('makes invalid requests to the /me/products and /users/{user_id}/products endpoints', function () {
    let swsClient
    let userId

    before(function () {
      // Initialise the client with parameters for the environment defined in `environment.json`
      swsClient = new SwsClient({ appId: appId, secret: appSecret, serviceUri: serviceUri, timeout: timeout })

      swsClient.accessTokenUpdatedHandler = (token) => {
        swsClient.accessToken = token
      }

      // Login request/promise to the 'old' login endpoint
      let login = swsClient.id.login({ emailAddress: userEmail, password: userPassword })

      // Set the access and refresh tokens from the response body returned from the login request
      return login.then(
        data => {
          swsClient.accessTokenUpdatedHandler(
            data.tokens.access.token,
            new Date(data.tokens.access.expires_at)
          )

          swsClient.refreshToken = data.tokens.refresh.token

          // Also set the user ID for the logged-in user
          userId = data.user.id
        }
      )
    })

    it(`confirms that a GET request to /me/products with an invalid app name results in a 400 response`, function () {
      return swsClient.license.getProducts({ appName: 'invalid-app-name' }).then(
        () => Promise.reject(new Error('Expected 400 HTTP response code')),
        err => {
          // Expects an invalid host app name exception
          expect(err.httpStatus).to.equal(400)
          expect(err.code).to.equal(1000)
        }
      )
    })

    it(`confirms that a GET request to /users/{user_id}/products with an invalid app name results in a 400 response`,
      function () {
        return swsClient.license.getProducts({ appName: 'invalid-app-name', userId: userId }).then(
          () => Promise.reject(new Error('Expected 400 HTTP response code')),
          err => {
          // Expects an invalid host app name exception
            expect(err.httpStatus).to.equal(400)
            expect(err.code).to.equal(1000)
          }
        )
      })

    it(`confirms that a GET request to /me/products with an invalid app version results in a 400 response`,
      function () {
        return swsClient.license.getProducts({ appName: 'serato_dj', appVersion: 'invalid-app-version' }).then(
          () => Promise.reject(new Error('Expected 400 HTTP response code')),
          err => {
            // Expects an invalid host app version exception
            expect(err.httpStatus).to.equal(400)
            expect(err.code).to.equal(1007)
          }
        )
      })

    it(`confirms that a GET request to /users/{user_id}/products with an invalid app version results in a 400 response`,
      function () {
        let params = { appName: 'serato_dj', appVersion: 'invalid-app-version', userId: userId }

        return swsClient.license.getProducts(params).then(
          () => Promise.reject(new Error('Expected 400 HTTP response code')),
          err => {
            // Expects an invalid host app version exception
            expect(err.httpStatus).to.equal(400)
            expect(err.code).to.equal(1007)
          }
        )
      })

    it(`confirms that a GET request to /me/products with an invalid term results in a 400 response`, function () {
      return swsClient.license.getProducts({ term: 'invalid-term' }).then(
        () => Promise.reject(new Error('Expected 400 HTTP response code')),
        err => {
          // Expects an invalid license term exception
          expect(err.httpStatus).to.equal(400)
          expect(err.code).to.equal(1015)
        }
      )
    })

    it(`confirms that a GET request to /users/{user_id}/products with an invalid term results in a 400 response`,
      function () {
        return swsClient.license.getProducts({ term: 'invalid-term', userId: userId }).then(
          () => Promise.reject(new Error('Expected 400 HTTP response code')),
          err => {
            // Expects an invalid license term exception
            expect(err.httpStatus).to.equal(400)
            expect(err.code).to.equal(1015)
          }
        )
      })
  })

  describe('Post requests to /me/products and /users/{user_id}/products endpoints', function () {
    let hostMachineId = Math.random().toString(36).substring(2, 15)
    let productTypeId = 108 // Serato DJ Suite Trial
    let userId = 123

    describe('Invalid requests', function () {
      it(`confirms URI used in 'addProduct()' method with no user ID, by returning a non-404 HTTP response`,
        function () {
          let sws = new Sws({ appId: 'myClientAppId' })
          return sws.license.addProduct({ hostMachineId, productTypeId }).then(
            () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
            err => {
              expect(err.httpStatus).not.to.equal(404)
            }
          )
        })

      it(`confirms URI used in 'addProduct()' method with user ID, by returning a non-404 HTTP response`,
        function () {
          let sws = new Sws({ appId: 'myClientAppId' })
          return sws.license.addProduct({ hostMachineId, productTypeId, userId }).then(
            () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
            err => {
              expect(err.httpStatus).not.to.equal(404)
            }
          )
        })
    })

    describe('Valid requests', function () {
      let swsClient
      let systemTime = new Date()
      let timestamp = systemTime.getTime()
      let emailAddress = 'testAddProduct' + timestamp + '@serato.com'
      let password = 'test123'

      /**
       * Log in, setting the access and refresh tokens for the client.
       */
      before(function () {
        // Initialise the client with parameters for the environment defined in `environment.json`
        swsClient = new SwsClient({ appId: appId, secret: appSecret, serviceUri, timeout })

        swsClient.accessTokenUpdatedHandler = (token) => {
          swsClient.accessToken = token
        }

        // Create a new user
        return swsClient.id.addUser({
          emailAddress,
          password,
          timestamp: systemTime
        }).then(
          data => {
            userId = data.id
          }
        ).then(() => {
          // Login request/promise to the newly created account
          return swsClient.id.login({ emailAddress, password }).then(
            data => {
              swsClient.accessTokenUpdatedHandler(
                data.tokens.access.token,
                new Date(data.tokens.access.expires_at)
              )
              // Set the access and refresh tokens from the response body returned from the login request
              swsClient.refreshToken = data.tokens.refresh.token
            }
          )
        })
      })
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
      let action = 'activate'
      let systemTime = new Date()
      let userId = 123

      describe('Invalid requests', function () {
        it(`confirms URI used in 'addLicenseAuthorization()' method with no user ID, by returning a non-404
        HTTP response`, function () {
          let sws = new Sws({ appId: 'myClientAppId' })
          return sws.license.addLicenseAuthorization({
            action,
            appName,
            appVersion,
            hostMachineId,
            hostMachineName,
            licenseId,
            systemTime
          }).then(
            () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
            err => {
              expect(err.httpStatus).not.to.equal(404)
            }
          )
        })

        it(`confirms URI used in 'addLicenseAuthorization()' method with user ID, by returning a non-404
        HTTP response`, function () {
          let sws = new Sws({ appId: 'myClientAppId' })
          return sws.license.addLicenseAuthorization({
            action,
            appName,
            appVersion,
            hostMachineId,
            hostMachineName,
            licenseId,
            systemTime,
            userId
          }).then(
            () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
            err => {
              expect(err.httpStatus).not.to.equal(404)
            }
          )
        })
      })

      describe('Valid requests', function () {
        let swsClient
        let timestamp = systemTime.getTime()
        let emailAddress = 'testAddLicenseAuthorization' + timestamp + '@serato.com'
        let password = 'test123'
        let productTypeId = 108 // Serato DJ Suite Trial

        /**
         * Log in, setting the access and refresh tokens for the client and assign a product to the user
         */
        before(function () {
          // Initialise the client with parameters for the environment defined in `environment.json`
          swsClient = new SwsClient({ appId: appId, secret: appSecret, serviceUri, timeout })

          swsClient.accessTokenUpdatedHandler = (token) => {
            swsClient.accessToken = token
          }

          // Create a new user
          return swsClient.id.addUser({
            emailAddress,
            password,
            timestamp: systemTime
          }).then(
            data => {
              userId = data.id
            }
          ).then(() => {
            // Login request/promise to the newly created account
            return swsClient.id.login({ emailAddress, password }).then(
              data => {
                swsClient.accessTokenUpdatedHandler(
                  data.tokens.access.token,
                  new Date(data.tokens.access.expires_at)
                )
                // Set the access and refresh tokens from the response body returned from the login request
                swsClient.refreshToken = data.tokens.refresh.token
              }
            )
          }).then(() => {
            // Assign a product to the newly created user
            return swsClient.license.addProduct({ hostMachineId, productTypeId }).then(
              data => {
                licenseId = data.licenses[0].id
              }
            )
          })
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
    })

  describe('Post requests to /me/licenses/authorizations/{authorization_id}' +
    ' and /users/{user_id}/licenses/authorizations/{authorization_id} endpoints',
  function () {
    let authorizationId = 123
    let userId = 123

    describe('Invalid requests', function () {
      it(`confirms URI used in 'updateLicenseAuthorization()' method with no user ID, by returning a non-404
      HTTP response`, function () {
        let sws = new Sws({ appId: 'myClientAppId' })
        return sws.license.updateLicenseAuthorization({ authorizationId }).then(
          () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
          err => {
            expect(err.httpStatus).not.to.equal(404)
          }
        )
      })

      it(`confirms URI used in 'updateLicenseAuthorization()' method with user ID, by returning a non-404
      HTTP response`, function () {
        let sws = new Sws({ appId: 'myClientAppId' })
        return sws.license.updateLicenseAuthorization({ authorizationId, userId }).then(
          () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
          err => {
            expect(err.httpStatus).not.to.equal(404)
          }
        )
      })
    })
  })
})
