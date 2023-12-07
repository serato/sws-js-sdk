import { Sws } from '../../src/index'
import { describe, it, before } from 'mocha'
import { expect } from 'chai'

describe('Notifications Tests', function () {
  /** @type {Sws} */
  let swsClient
  before(function () {
    swsClient = new Sws({ appId: 'myClientAppId', timeout: 5000 })
  })

  describe('Notifications URI Validation Tests', function () {
    it(`confirms URI used in 'getCampaigns()' method by returning a non-404 response`,
      function () {
        return swsClient.notifications.getCampaigns({
          status: 'active'
        }).then(
          () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
          err => {
            expect(err.httpStatus).not.to.equal(404)
          }
        )
      }
    )
    it(`confirms URI used in 'createCampaign()' method by returning a non-404 response`,
      function () {
        return swsClient.notifications.createCampaign({
          name: null, /* Invalid value to prevent creation */
          anonymous: null /* Invalid value to prevent creation */
        }).then(
          () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
          err => {
            expect(err.httpStatus).not.to.equal(404)
          }
        )
      }
    )
    it(`confirms URI used in 'getNotifications()' method by returning a non-404 response`,
      function () {
        return swsClient.notifications.getNotifications().then(
          () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
          err => {
            expect(err.httpStatus).not.to.equal(404)
          }
        )
      }
    )
    it(`confirms URI used in 'getNotificationTemplates()' method by returning a 200 HTTP response`,
      function () {
        return swsClient.notifications.getNotificationTemplates().then(
          response => {
            // We don't care about the contents of the response
            expect(response).to.be.a('object')
          }
        )
      }
    )
    it(`confirms URI used in 'createTestUser()' method by returning a non-404 response`,
      function () {
        return swsClient.notifications.createTestUser({
          userId: 123
        }).then(
          () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
          err => {
            expect(err.httpStatus).not.to.equal(404)
          }
        )
      }
    )
    it(`confirms URI used in 'getTestUsers()' method by returning a non-404 response`,
      function () {
        return swsClient.notifications.getTestUsers().then(
          () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
          err => {
            expect(err.httpStatus).not.to.equal(404)
          }
        )
      }
    )
    it(`confirms URI used in 'deleteTestUser()' method by returning a non-404 response`,
      function () {
        return swsClient.notifications.deleteTestUser({
          userId: 123
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
