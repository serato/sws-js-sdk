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

  describe('makes valid requests to the /products/types endpoint', function () {
    let sws

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

    it('confirms that a valid GET request to the /products/types endpoint returns an array of matching types', function () {
      let params = { appName: 'serato_dj', appVersion: '2.0.0', term: 'permanent' }

      return sws.license.getProductTypes(params).then(
        productTypes => {
          // I.e. some product types were returned
          expect(productTypes.items).to.not.be.empty

          // Check that the items are not malformed
          let item = productTypes.items.pop()
          expect(item).to.have.all.keys('id', 'term', 'name')

          // Check that only product types with the requested term were returned
          let types = new Set(productTypes.items.map(type => type.term))
          expect(types.size).to.equal(1)
          expect(types.has('permanent')).to.be.true
        }
      )
    })
  })

  describe('makes valid requests to the /products/types/{product_type_id} endpoint', function () {
    let sws

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

    it('confirms that a GET request to /products/types/{product_type_id} returns product type data', function () {
      return sws.license.getProductType(58).then(
        productType => {
          // `58` is DJ Pro. This test will break if the product type ID changes.
          expect(productType.id).to.equal(58)
          expect(productType.term).to.equal('permanent')
          expect(productType.name).to.equal('Serato DJ Pro [download]')
          expect(productType.license_types).to.have.lengthOf(1) // Just the DJ Pro license
        }
      )
    })
  })

  describe('makes valid requests to the /products/products endpoint', function () {
    this.timeout(timeout)

    it('confirms that a GET request to /products/products returns product type data', function () {
      // Initialise the client with parameters for the environment defined in `environment.json`
      let sws = new SwsClient({ appId: appId, secret: appSecret, serviceUri: serviceUri, timeout: timeout })
      let userId = 0

      sws.accessTokenUpdatedHandler = (token) => {
        sws.accessToken = token
      }

      // Login request/promise to the 'old' login endpoint
      let login = sws.id.login({ emailAddress: userEmail, password: userPassword })

      // Set the access and refresh tokens from the response body returned from the login request
      let getProducts = login.then(
        data => {
          sws.accessTokenUpdatedHandler(
            data.tokens.access.token,
            new Date(data.tokens.access.expires_at)
          )

          sws.refreshToken = data.tokens.refresh.token

          // Also set the user ID for the logged-in user
          userId = data.user.id

          return sws.license.getProducts({ userId: userId })
        }
      )

      return getProducts.then(
        products => {
          // I.e. some product types were returned
          expect(products.items).to.not.be.empty

          // Check that the items are not malformed
          let item = products.items.pop()
          expect(item).to.have.all.keys('user_id', 'id', 'date_created', 'licenses', 'product_type', 'deleted')
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
