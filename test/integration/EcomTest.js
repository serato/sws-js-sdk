import Sws from '../../src/index'
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
    swsClient = new Sws({ appId: 'myClientAppId' })
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
        return swsClient.ecom.addPaymentMethod().then(
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
        return swsClient.ecom.addPaymentMethod().then(
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

    it(`confirms URI used in 'updateSubscription()' method with no user ID, by returning a non-404 HTTP response`,
      function () {
        swsClient.userId = 0
        return swsClient.ecom.updateSubscription({
          subscriptionId: 'test-id',
          paymentToken: 'abc',
          numberOfBillingCycle: 2
        }).then(
          () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
          err => {
            expect(err.httpStatus).not.to.equal(404)
          }
        )
      }
    )

    it(`confirms URI used in 'updateSubscription()' method with a user ID, by returning a non-404 HTTP response`,
      function () {
        swsClient.userId = 123
        return swsClient.ecom.updateSubscription({
          subscriptionId: 'test-id',
          paymentToken: 'abc',
          numberOfBillingCycle: 2
        }).then(
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

    it(`confirms URI used in 'getInvoicePdf()' method without a user ID by returning a non-404 HTTP response`,
      function () {
        swsClient.userId = 0
        return swsClient.ecom.getInvoice(123).then(
          () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
          err => {
            expect(err.httpStatus).not.to.equal(404)
          }
        )
      }
    )

    it(`confirms URI used in 'getInvoicePdf()' method with a user ID by returning a non-404 HTTP response`,
      function () {
        swsClient.userId = 123
        return swsClient.ecom.getInvoice(123).then(
          () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
          err => {
            expect(err.httpStatus).not.to.equal(404)
          }
        )
      }
    )

    it(`confirms URI used in 'retrySubscriptionCharge()' method with no user ID, by returning a non-404 HTTP response`,
      function () {
        swsClient.userId = 0
        return swsClient.ecom.retrySubscriptionCharge({
          subscriptionId: 'valid-subscription-id'
        }).then(
          () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
          err => {
            expect(err.httpStatus).not.to.equal(404)
          }
        )
      }
    )

    it(`confirms URI used in 'retrySubscriptionCharge()' method with a user ID, by returning a non-404 HTTP response`,
      function () {
        swsClient.userId = 123
        return swsClient.ecom.retrySubscriptionCharge({
          subscriptionId: 'valid-subscription-id'
        }).then(
          () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
          err => {
            expect(err.httpStatus).not.to.equal(404)
          }
        )
      }
    )
  })
})
