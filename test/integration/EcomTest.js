import { Sws } from '../../src/index'
import { describe, it, before } from 'mocha'
import { expect } from 'chai'

describe('Ecom Tests', function () {
  describe('Timeout', function () {
    it(`tests handling timeout on accessing /subscriptions endpoint`, function () {
      let sws = new Sws({ appId: 'myClientAppId', timeout: 1 })
      return sws.ecom.getSubscriptions().then().catch((err) => {
        expect(err.code).to.equal('ECONNABORTED')
      })
    })
  })

  let swsClient
  before(function () {
    swsClient = new Sws({ appId: 'myClientAppId', timeout: 5000 })
  })

  describe('Ecom URI Validation Tests', function () {
    it(`confirms URI used in 'getSubscriptions()' method with no user ID, by returning a non-404 HTTP response`,
      function () {
        swsClient.userId = 0
        return swsClient.ecom.getSubscriptions().then(
          () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
          err => {
            expect(err.httpStatus).not.to.equal(404)
          }
        )
      })

    it(`confirms URI used in 'getSubscriptions()' method with user ID, by returning a non-404 HTTP response`,
      function () {
        swsClient.userId = 123
        return swsClient.ecom.getSubscriptions().then(
          () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
          err => {
            expect(err.httpStatus).not.to.equal(404)
          }
        )
      })

    it(`confirms URI used in 'getOrders()' method with no user ID, by returning a non-404 HTTP response`,
      function () {
        swsClient.userId = 0
        return swsClient.ecom.getOrders().then(
          () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
          err => {
            expect(err.httpStatus).not.to.equal(404)
          }
        )
      }
    )

    it(`confirms URI used in 'getOrders()' method with user ID, by returning a non-404 HTTP response`,
      function () {
        swsClient.userId = 123
        return swsClient.ecom.getOrders().then(
          () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
          err => {
            expect(err.httpStatus).not.to.equal(404)
          }
        )
      }
    )

    it(`confirms URI used in 'addPaymentMethod()' method with no user ID, by returning a non-404 HTTP response`,
      function () {
        swsClient.userId = 0
        return swsClient.ecom.addPaymentMethod({ nonce: 'not-a-real-nonce' }).then(
          () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
          err => {
            expect(err.httpStatus).not.to.equal(404)
          }
        )
      }
    )

    it(`confirms URI used in 'addPaymentMethod()' method with user ID, by returning a non-404 HTTP response`,
      function () {
        swsClient.userId = 123
        return swsClient.ecom.addPaymentMethod({ nonce: 'not-a-real-nonce' }).then(
          () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
          err => {
            expect(err.httpStatus).not.to.equal(404)
          }
        )
      }
    )

    it(`confirms URI used in 'paymentGatewayToken()' method with no user ID, by returning a non-404 HTTP response`,
      function () {
        swsClient.userId = 0
        return swsClient.ecom.paymentGatewayToken().then(
          () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
          err => {
            expect(err.httpStatus).not.to.equal(404)
          }
        )
      }
    )

    it(`confirms URI used in 'paymentGatewayToken()' method with user ID, by returning a non-404 HTTP response`,
      function () {
        swsClient.userId = 123
        return swsClient.ecom.paymentGatewayToken().then(
          () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
          err => {
            expect(err.httpStatus).not.to.equal(404)
          }
        )
      }
    )

    it(`confirms URI used in 'getPaymentMethods()' method with no user ID, by returning a non-404 HTTP response`,
      function () {
        swsClient.userId = 0
        return swsClient.ecom.getPaymentMethods().then(
          () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
          err => {
            expect(err.httpStatus).not.to.equal(404)
          }
        )
      }
    )

    it(`confirms URI used in 'getPaymentMethods()' method with user ID, by returning a non-404 HTTP response`,
      function () {
        swsClient.userId = 123
        return swsClient.ecom.getPaymentMethods().then(
          () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
          err => {
            expect(err.httpStatus).not.to.equal(404)
          }
        )
      }
    )

    it(`confirms URI used in 'deletePaymentMethod()' method with no user ID, by returning a non-404 HTTP response`,
      function () {
        swsClient.userId = 0
        return swsClient.ecom.deletePaymentMethod('123').then(
          () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
          err => {
            expect(err.httpStatus).not.to.equal(404)
          }
        )
      }
    )

    it(`confirms URI used in 'deletePaymentMethod()' method with a user ID, by returning a non-404 HTTP response`,
      function () {
        swsClient.userId = 123
        return swsClient.ecom.deletePaymentMethod('123').then(
          () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
          err => {
            expect(err.httpStatus).not.to.equal(404)
          }
        )
      }
    )

    it(`confirms URI used in 'updatePaymentMethod()' method with no user ID, by returning a non-404 HTTP response`,
      function () {
        swsClient.userId = 0
        return swsClient.ecom.updatePaymentMethod({
          paymentToken: '123',
          nonce: 'abc',
          deviceData: '123',
          billingAddressId: 'AB'
        }).then(
          () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
          err => {
            expect(err.httpStatus).not.to.equal(404)
          }
        )
      }
    )

    it(`confirms URI used in 'updatePaymentMethod()' method with a user ID, by returning a non-404 HTTP response`,
      function () {
        swsClient.userId = 123
        return swsClient.ecom.updatePaymentMethod({
          paymentToken: '123',
          nonce: 'abc',
          deviceData: '123',
          billingAddressId: 'AB'
        }).then(
          () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
          err => {
            expect(err.httpStatus).not.to.equal(404)
          }
        )
      }
    )

    it(`confirms URI used in 'addSubscriptionPlanChangeRequest()' method with no user ID, by returning a non-404 HTTP response`,
      function () {
        swsClient.userId = 0
        return swsClient.ecom.addSubscriptionPlanChangeRequest({
          subscriptionId: '123',
          catalogProductId: 2323
        }).then(
          () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
          err => {
            expect(err.httpStatus).not.to.equal(404)
          }
        )
      }
    )

    it(`confirms URI used in 'addSubscriptionPlanChangeRequest()' method with a user ID, by returning a non-404 HTTP response`,
      function () {
        swsClient.userId = 123
        return swsClient.ecom.addSubscriptionPlanChangeRequest({
          subscriptionId: '123',
          catalogProductId: 2323
        }).then(
          () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
          err => {
            expect(err.httpStatus).not.to.equal(404)
          }
        )
      }
    )

    it(`confirms URI used in 'addSubscriptionPlanChangeRequest()' method with a immediate option, by returning a non-404 HTTP response`,
      function () {
        swsClient.userId = 123
        return swsClient.ecom.addSubscriptionPlanChangeRequest({
          subscriptionId: '123',
          catalogProductId: 2323,
          immediate: true
        }).then(
          () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
          err => {
            expect(err.httpStatus).not.to.equal(404)
          }
        )
      }
    )

    it(`confirms URI used in 'getInvoice()' method without a user ID by returning a non-404 HTTP response`,
      function () {
        swsClient.userId = 0
        return swsClient.ecom.getInvoice(123, 456).then(
          () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
          err => {
            expect(err.httpStatus).not.to.equal(404)
          }
        )
      }
    )

    it(`confirms URI used in 'getInvoice()' method with a user ID by returning a non-404 HTTP response`,
      function () {
        swsClient.userId = 123
        return swsClient.ecom.getInvoice(123, 456).then(
          () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
          err => {
            expect(err.httpStatus).not.to.equal(404)
          }
        )
      }
    )

    it(`confirms URI used in 'confirmSubscriptionPlanChangeRequest()' method with no user ID, by returning a non-404 HTTP response`,
      function () {
        swsClient.userId = 0
        return swsClient.ecom.confirmSubscriptionPlanChangeRequest({
          subscriptionId: '123',
          planChangeRequestId: 2323
        }).then(
          () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
          err => {
            expect(err.httpStatus).not.to.equal(404)
          }
        )
      }
    )

    it(`confirms URI used in 'confirmSubscriptionPlanChangeRequest()' method with a user ID, by returning a non-404 HTTP response`,
      function () {
        swsClient.userId = 123
        return swsClient.ecom.confirmSubscriptionPlanChangeRequest({
          subscriptionId: '123',
          planChangeRequestId: 2323
        }).then(
          () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
          err => {
            expect(err.httpStatus).not.to.equal(404)
          }
        )
      }
    )

    it(`confirms URI used in 'getVouchers()' method with no user ID, by returning a non-404 HTTP response`,
      function () {
        swsClient.userId = 0
        return swsClient.ecom.getVouchers().then(
          () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
          err => {
            expect(err.httpStatus).not.to.equal(404)
          }
        )
      }
    )

    it(`confirms URI used in 'getVouchers()' method with user ID, by returning a non-404 HTTP response`,
      function () {
        swsClient.userId = 123
        return swsClient.ecom.getVouchers().then(
          () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
          err => {
            expect(err.httpStatus).not.to.equal(404)
          }
        )
      }
    )

    it(`confirms URI used in 'assignVoucher()' method with no user ID, by returning a non-404 HTTP response`,
      function () {
        swsClient.userId = 0
        return swsClient.ecom.assignVoucher({
          voucherId: 'AB'
        }).then(
          () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
          err => {
            expect(err.httpStatus).not.to.equal(404)
          }
        )
      }
    )

    it(`confirms URI used in 'assignVoucher()' method with user ID, by returning a non-404 HTTP response`,
      function () {
        swsClient.userId = 123
        return swsClient.ecom.assignVoucher({
          voucherId: 'AB'
        }).then(
          () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
          err => {
            expect(err.httpStatus).not.to.equal(404)
          }
        )
      }
    ),
    it(`confirms URI used in 'getRecommendations()' method with no user ID, by returning a non-404 HTTP response`,
      function () {
        swsClient.userId = 0
        return swsClient.ecom.getRecommendations().then(
          () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
          err => {
            expect(err.httpStatus).not.to.equal(404)
          }
        )
      }
    ),
    it(`confirms URI used in 'getRecommendations()' method with user ID, by returning a non-404 HTTP response`,
      function () {
        swsClient.userId = 123
        return swsClient.ecom.getRecommendations().then(
          () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
          err => {
            expect(err.httpStatus).not.to.equal(404)
          }
        )
      }
    ),
    it(`confirms URI used in 'getRecommendations()' method with no user ID, with appName param by returning a non-404 HTTP response`,
      function () {
        swsClient.userId = 0
        return swsClient.ecom.getRecommendations({
          appName: 'serato_dj'
        }).then(
          () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
          err => {
            expect(err.httpStatus).not.to.equal(404)
          }
        )
      }
    ),
    it(`confirms URI used in 'getRecommendations()' method with user ID, with appName and appVersion params by returning a non-404 HTTP response`,
      function () {
        swsClient.userId = 0
        return swsClient.ecom.getRecommendations({
          appName: 'serato_dj',
          appVersion: '2.0.0'
        }).then(
          () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
          err => {
            expect(err.httpStatus).not.to.equal(404)
          }
        )
      }
    ),
    it(`confirms URI used in 'getRecommendations()' method with user ID, with catalogCategory param by returning a non-404 HTTP response`,
      function () {
        swsClient.userId = 0
        return swsClient.ecom.getRecommendations({
          catalogCategory: 'dj'
        }).then(
          () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
          err => {
            expect(err.httpStatus).not.to.equal(404)
          }
        )
      }
    )
    it.only(`confirms URI used in 'blacklistProductVoucherOrders()' method with productVoucherOrderId, by returning a non-404 HTTP response`,
      function () {
        swsClient.userId = 0
        return swsClient.ecom.blacklistProductVoucherOrders({
          productVoucherOrderId: 1
        }).then(
          () => Promise.reject(new Error('Expected non-404 HTTP response code')),
          err => {
            expect(err.httpStatus).not.to.equal(404)
          }
        )
      }
    )
    it(`confirms URI used in 'blacklistProductVoucherOrders()' method without productVoucherOrderId, by returning a 404 HTTP response`,
      function () {
        swsClient.userId = 0
        return swsClient.ecom.blacklistProductVoucherOrders().then(
          () => Promise.reject(new Error('Expected 404 HTTP response code')),
          err => {
            expect(err.httpStatus).to.equal(404)
          }
        )
      })
  })
})
