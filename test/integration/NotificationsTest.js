import Sws from '../../src/index'
import { describe, it, before } from 'mocha'
import { expect } from 'chai'

describe('Notifications Tests', function () {
  /** @type {Sws} */
  let swsClient
  before(function () {
    swsClient = new Sws({ appId: 'myClientAppId' })
  })

  describe('Notifications URI Validation Tests', function () {
    it(`confirms URI used in 'getNotifications()' method by returning a 200 HTTP response`,
      function () {
        return swsClient.notifications.getNotifications({
          hostAppName: 'serato_com',
          hostAppVersion: 1,
          hostAppOs: 'mac',
          locale: 'en_US'
        }).then(
          response => {
            // We don't care about the contents of the response
            expect(response).to.be.a('object')
          }
        )
      })
  })
})
