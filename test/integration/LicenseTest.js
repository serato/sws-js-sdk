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

const timeout = 50000

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
          let item = data.items.pop()
          expect(item).to.have.all.keys('id', 'term', 'name')

          // Check that only product types with the requested term were returned
          let types = new Set(data.items.map(type => type.term))
          expect(types.size).to.equal(1)
          expect(types.has('permanent')).to.be.true
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

    it('confirms that a GET request to /users/{user_id}/products returns product type data', function () {
      return swsClient.license.getProducts({ userId: userId }).then(
        data => {
          // I.e. some product types were returned
          expect(data.items).to.not.be.empty

          // Check that the items are not malformed
          let item = data.items.pop()
          expect(item).to.have.all.keys('user_id', 'id', 'date_created', 'licenses', 'product_type', 'deleted')
        }
      )
    })

    it('confirms that a GET request to /me/products returns product type data', function () {
      return swsClient.license.getProducts().then(
        data => {
          // I.e. some product types were returned
          expect(data.items).to.not.be.empty

          // Check that the items are not malformed
          let item = data.items.pop()
          expect(item).to.have.all.keys('user_id', 'id', 'date_created', 'licenses', 'product_type', 'deleted')
        }
      )
    })
  })

  describe('makes invalid requests to the /me/products and /users/{user_id}/products endpoint', function () {
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
  })

  describe('Valid requests to the /me/licenses/authorizations endpoint', function () {
    let swsClient // Initialised in the before hook

    /**
     * Log in once, setting the access and refresh tokens for the client.
     */
    before(function () {
      // The login request can be slow in a dev environment, therefore specified timeout to 5000
      // Initialise the client with parameters for the environment defined in `environment.json`
      swsClient = new Sws({ appId: appId, secret: appSecret, serviceUri: serviceUri, timeout: 5000 })

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
  })
})
