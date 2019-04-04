import Sws from '../../src/index'
import { describe, it, before } from 'mocha'
import { expect } from 'chai'

describe('License Tests', function () {
  describe('Timeout', function () {
    it(`tests handling timeout on accessing /licenses endpoint`, function () {
      let sws = new Sws({ appId: 'myClientAppId', timeout: 1 })
      return sws.license.getLicenses().then().catch((err) => {
        expect(err.code).to.equal('ECONNABORTED')
      })
    })
  })

  let swsClient
  before(function () {
    swsClient = new Sws({ appId: 'myClientAppId' })
  })

  describe('License URI Validation Tests', function () {
    it(`confirms URI used in 'getLicenses()' method with no user ID, by returning a non-404 HTTP response`,
      function () {
        swsClient.userId = 0
        return swsClient.license.getLicenses().then(
          () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
          err => {
            expect(err.httpStatus).not.to.equal(404)
          }
        )
      })

    it(`confirms URI used in 'getLicenses()' method with user ID, by returning a non-404 HTTP response`, function () {
      swsClient.userId = 123
      return swsClient.license.getLicenses().then(
        () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
        err => {
          expect(err.httpStatus).not.to.equal(404)
        }
      )
    })

    it(`confirms URI used in 'getProductType()' method, by returning a non-404 HTTP response`, function () {
      return swsClient.license.getProductType(0).then(
        () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
        err => {
          expect(err.httpStatus).not.to.equal(404)
        }
      )
    })

    it(`confirms URI used in 'getProductTypes()' method, by returning a non-404 HTTP response`, function () {
      return swsClient.license.getProductTypes().then(
        () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
        err => {
          expect(err.httpStatus).not.to.equal(404)
        }
      )
    })

    it(`confirms URI used in 'getProducts()' method with no user ID, by returning a non-404 HTTP response`,
      function () {
        swsClient.userId = 0
        return swsClient.license.getProducts().then(
          () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
          err => {
            expect(err.httpStatus).not.to.equal(404)
          }
        )
      })

    it(`confirms URI used in 'getProducts()' method with user ID, by returning a non-404 HTTP response`, function () {
      swsClient.userId = 123
      return swsClient.license.getProducts().then(
        () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
        err => {
          expect(err.httpStatus).not.to.equal(404)
        }
      )
    })

    it(`confirms URI used in 'updateProduct()' method with no user ID, by returning a non-404 HTTP response`, function () {
      swsClient.userId = 0
      return swsClient.license.updateProduct({ ilokUserId: 'ilok-user-1', productId: '123' }).then(
        () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
        err => {
          expect(err.httpStatus).not.to.equal(404)
        }
      )
    })

    it(`confirms URI used in 'updateProduct()' method with user ID, by returning a non-404 HTTP response`, function () {
      swsClient.userId = 123
      return swsClient.license.updateProduct({ ilokUserId: 'ilok-user-1', productId: '123' }).then(
        () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
        err => {
          expect(err.httpStatus).not.to.equal(404)
        }
      )
    })

    it(`confirms URI used in 'addProduct()' method with no user ID, by returning a non-404 HTTP response`, function () {
      swsClient.userId = 0
      return swsClient.license.addProduct({ hostMachineId: 'SID-test', productTypeId: 108 }).then(
        () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
        err => {
          expect(err.httpStatus).not.to.equal(404)
        }
      )
    })

    it(`confirms URI used in 'addProduct()' method with user ID, by returning a non-404 HTTP response`, function () {
      swsClient.userId = 123
      return swsClient.license.addProduct({ hostMachineId: 'SID-test', productTypeId: 108 }).then(
        () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
        err => {
          expect(err.httpStatus).not.to.equal(404)
        }
      )
    })

    it(`confirms URI used in 'addLicenseAuthorization()' method with no user ID, by returning a non-404 HTTP response`,
      function () {
        swsClient.userId = 0
        return swsClient.license.addLicenseAuthorization({
          action: 'activate',
          appName: 'testAppName',
          appVersion: '1.0.0',
          hostMachineId: 'SID-test',
          hostMachineName: 'testMachineName',
          licenseId: 123,
          systemTime: new Date()
        }).then(
          () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
          err => {
            expect(err.httpStatus).not.to.equal(404)
          }
        )
      })

    it(`confirms URI used in 'addLicenseAuthorization()' method with user ID, by returning a non-404 HTTP response`,
      function () {
        swsClient.userId = 123
        return swsClient.license.addLicenseAuthorization({
          action: 'activate',
          appName: 'testAppName',
          appVersion: '1.0.0',
          hostMachineId: 'SID-test',
          hostMachineName: 'testMachineName',
          licenseId: 123456789,
          systemTime: new Date()
        }).then(
          () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
          err => {
            expect(err.httpStatus).not.to.equal(404)
          }
        )
      })

    it(`confirms URI used in 'updateLicenseAuthorization()' method with no user ID, by returning a non-404 HTTP response`,
      function () {
        swsClient.userId = 0
        return swsClient.license.updateLicenseAuthorization({ authorizationId: 11 }).then(
          () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
          err => {
            expect(err.httpStatus).not.to.equal(404)
          }
        )
      }
    )

    // TODO: uncomment this test once bug is fixed in master branch in license service
    // it(`confirms URI used in 'updateLicenseAuthorization()' method with user ID, by returning a non-404
    //  HTTP response`, function () {
    //  swsClient.userId = 123
    //  return swsClient.license.updateLicenseAuthorization({ authorizationId: 11 }).then(
    //    () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
    //    err => {
    //      expect(err.httpStatus).not.to.equal(404)
    //    }
    //  )
    //})
  })
})
