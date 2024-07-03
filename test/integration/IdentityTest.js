import { Sws } from '../../src/index'
import { describe, it, before } from 'mocha'
import { expect } from 'chai'

describe('Identity Tests', function () {
  describe('Identity URI Validation Tests', function () {
    let swsClient
    before(function () {
      swsClient = new Sws({ appId: 'myClientAppId', timeout: 5000 })
    })
    it(`confirms URI used in 'tokenRefresh()' method, by returning a non-404 HTTP response`, function () {
      return swsClient.id.tokenRefresh('token.value').then(
        () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
        err => {
          expect(err.httpStatus).not.to.equal(404)
        }
      )
    })

    it(`confirms URI used in 'getUser()' method with no user ID, by returning a non-404 HTTP response`, function () {
      return swsClient.id.getUser().then(
        () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
        err => {
          expect(err.httpStatus).not.to.equal(404)
        }
      )
    })

    // Enable this test once `GET /api/v1/users/{user_id}` is in production
    // it(`confirms URI used in 'getUser()' method with user ID, by returning a non-404 HTTP response`, function () {
    //   swsClient.userId = 8
    //   return swsClient.id.getUser().then(
    //     () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
    //     err => {
    //       expect(err.httpStatus).not.to.equal(404)
    //     }
    //   )
    // })

    it(`confirms URI used in 'login()' method, by returning a non-404 HTTP response`, function () {
      return swsClient.id.login({ emailAddress: 'email@address', password: 'pass' }).then(
        () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
        err => {
          expect(err.httpStatus).not.to.equal(404)
        }
      )
    })
    it(`confirms URI used in 'logout()' method, by returning a non-404 HTTP response`, function () {
      return swsClient.id.logout({ refreshToken: 'thislookslikearefreshtokenyeah003939' }).then(
        () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
        err => {
          expect(err.httpStatus).not.to.equal(404)
        }
      )
    })
    it(`confirms URI used in 'deactivateUser()' method, by returning a non-404 HTTP response`, function () {
      return swsClient.id.deactivateUser().then(
        () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
        err => {
          expect(err.httpStatus).not.to.equal(404)
        }
      )
    })
    it(`confirms URI used in 'deactivateUser()' method, by returning a non-404 HTTP response`, function () {
      return swsClient.id.deactivateUser().then(
        () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
        err => {
          expect(err.httpStatus).not.to.equal(404)
        }
      )
    })
    it(`confirms URI used in 'changeEmailAddress()' method with no user ID, by returning a non-404 HTTP response`, function () {
      swsClient.userId = 0
      return swsClient.id.changeEmailAddress({ emailAddress: '123@serato.com', redirectUri: 'anylink' }).then(
        () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
        err => {
          expect(err.httpStatus).not.to.equal(404)
        }
      )
    })
    it(`confirms URI used in 'changeEmailAddress()' method with user ID, by returning a non-404 HTTP response`, function () {
      swsClient.userId = 123
      return swsClient.id.changeEmailAddress({ emailAddress: '123@serato.com', redirectUri: 'anylink' }).then(
        () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
        err => {
          expect(err.httpStatus).not.to.equal(404)
        }
      )
    })
    it(`confirms URI in 'updateUser()' method without user ID, by returning a non-404 response`, function () {
      swsClient.userId = 0
      return swsClient.id.updateUser({ emailAddress: '123@serato.com' }).then(
          () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
          err => {
            expect(err.httpStatus).not.to.equal(404)
          }
      )
    })
    it(`confirms URI in 'updateUser()' method with a user ID, by returning a non-404 response`, function () {
      swsClient.userId = 123
      return swsClient.id.updateUser({ emailAddress: '123@serato.com' }).then(
          () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
          err => {
            expect(err.httpStatus).not.to.equal(404)
          }
      )
    })
    it(`confirms URI used in 'getUsers()' method, by returning a non-404 HTTP response`, function () {
      return swsClient.id.getUsers({ emailAddress: '123@serato.com'}).then(
          () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
          err => {
            expect(err.httpStatus).not.to.equal(404)
          }
      )
    })
  })
})
