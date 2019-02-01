import Sws from '../../src/index'
import { describe, it, before } from 'mocha'
import { expect } from 'chai'

describe('Profile Tests', function () {
  describe('Timeout', function () {
    it(`tests handling timeout on accessing /me endpoint`, function () {
      let sws = new Sws({ appId: 'myClientAppId', timeout: 1 })
      return sws.profile.getProfile().then().catch((err) => {
        expect(err.code).to.equal('ECONNABORTED')
      })
    })
  })

  let swsClient
  before(function() {
    swsClient = new Sws({ appId: "myClientAppId" })
  })

  describe('Profile URI Validation Tests', function () {
    it(`confirms URI used in 'getProfile()' method with no user ID, by returning a non-404 HTTP response`,
      function () {
        swsClient.userId = 0
        return swsClient.profile.getProfile().then(
          () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
          err => {
            expect(err.httpStatus).not.to.equal(404)
          }
        )
    })
    it(`confirms URI used in 'getProfile()' method with user ID, by returning a non-404 HTTP response`,
      function () {
      swsClient.userId = 123
      return swsClient.profile.getProfile().then(
        () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
        err => {
          expect(err.httpStatus).not.to.equal(404)
        }
      )
    }),
    it(`confirms URI in 'updateProfile()' method without user ID, by returning a non-404 response`,
    function () {
      swsClient.userId = 0
      return swsClient.profile.updateProfile({
        globalContactStatus: 0,
        firstName: 'Jimbo',
        lastName: 'Jackson',
        address1: '123 Fakes Ave',
        address2: 'Chungus',
        city: 'Chumbo',
        region: 'Swumbo',
        postCode: 1234,
        country: 'Austria'
      }).then(
        () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
        err => {
          expect(err.httpStatus).not.to.equal(404)
        }
      )
    })
    it(`confirms URI in 'updateProfile()' method with a user ID, by returning a non-404 response`,
    function () {
      swsClient.userId = 123
      return swsClient.profile.updateProfile({
        globalContactStatus: 0,
        firstName: 'Jimbo',
        lastName: 'Jackson',
        address1: '123 Fakes Ave',
        address2: 'Chungus',
        city: 'Chumbo',
        region: 'Swumbo',
        postCode: 1234,
        country: 'Austria'
      }).then(
        () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
        err => {
          expect(err.httpStatus).not.to.equal(404)
        }
      )
    })
  })
})
