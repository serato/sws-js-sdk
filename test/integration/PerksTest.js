import Sws from '../../src/index'
import { describe, it, before } from 'mocha'
import { expect } from 'chai'

describe('Perks Tests', function () {
  describe('Timeout', function () {
    it(`tests handling timeout on accessing /perks endpoint`, function () {
      let sws = new Sws({ appId: 'myClientAppId', timeout: 1 })
      return sws.perks.getPerks().then().catch((err) => {
        expect(err.code).to.equal('ECONNABORTED')
      })
    })
  })

  let swsClient
  before(function () {
    swsClient = new Sws({ appId: 'myClientAppId' })
  })

  describe('Perks URI Validation Tests', function () {
    it(`confirms URI used in 'getPerks()' method with no user ID, by returning a non-404 HTTP response`,
      function () {
        swsClient.userId = 0
        return swsClient.perks.getPerks().then(
          () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
          err => {
            expect(err.httpStatus).not.to.equal(404)
          }
        )
      })

    it(`confirms URI used in 'getPerks()' method with user ID, by returning a non-404 HTTP response`,
      function () {
        swsClient.userId = 123
        return swsClient.perks.getPerks().then(
          () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
          err => {
            expect(err.httpStatus).not.to.equal(404)
          }
        )
      })
  })
})
