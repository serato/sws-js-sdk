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
  before(function () {
    swsClient = new Sws({ appId: 'myClientAppId' })
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
      }
    )

    it(`confirms URI used in 'getProfile()' method with user ID, by returning a non-404 HTTP response`, function () {
      swsClient.userId = 123
      return swsClient.profile.getProfile().then(
        () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
        err => {
          expect(err.httpStatus).not.to.equal(404)
        }
      )
    })

    it(`confirms URI in 'updateProfile()' method without user ID, by returning a non-404 response`, function () {
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

    it(`confirms URI in 'updateProfile()' method with a user ID, by returning a non-404 response`, function () {
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

    it(`confirms URI in 'createUploadUrl()' method without user ID, by returning a non-404 response`, function () {
      swsClient.userId = 0
      return swsClient.profile.createUploadUrl({
        uploadType: 'avatar',
        contentType: 'image/jpeg'
      }).then(
        () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
        err => {
          expect(err.httpStatus).not.to.equal(404)
        }
      )
    })

    it(`confirms URI in 'createUploadUrl()' method with a user ID, by returning a non-404 response`, function () {
      swsClient.userId = 123
      return swsClient.profile.createUploadUrl({
        uploadType: 'avatar',
        contentType: 'image/jpeg'
      }).then(
        () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
        err => {
          expect(err.httpStatus).not.to.equal(404)
        }
      )
    })
  })

  describe('Profile URI Avatars Tests', function () {
    it(`confirms URI in 'updateAvatar()' method without user ID, by returning a non-404 response`, function () {
      swsClient.userId = 0
      return swsClient.profile.updateAvatar().then(
        () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
        err => {
          expect(err.httpStatus).not.to.equal(404)
        }
      )
    })

    it(`confirms URI in 'updateAvatar()' method with a user ID, by returning a non-404 response`, function () {
      swsClient.userId = 123
      return swsClient.profile.updateAvatar().then(
        () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
        err => {
          expect(err.httpStatus).not.to.equal(404)
        }
      )
    })

    it(`confirms URI in 'deleteAvatar()' method without user ID, by returning a non-404 response`, function () {
      swsClient.userId = 0
      return swsClient.profile.deleteAvatar().then(
        () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
        err => {
          expect(err.httpStatus).not.to.equal(404)
        }
      )
    })

    it(`confirms URI in 'deleteAvatar()' method with a user ID, by returning a non-404 response`, function () {
      swsClient.userId = 123
      return swsClient.profile.deleteAvatar().then(
        () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
        err => {
          expect(err.httpStatus).not.to.equal(404)
        }
      )
    })
  })

  describe('Profile URI betaPrograms Tests', function () {
    it(`confirms URI used in 'getAllBetaPrograms()' method, by returning a non-404 HTTP response`,
    function () {
      return swsClient.profile.getAllBetaPrograms().then(
        () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
        err => {
          expect(err.httpStatus).not.to.equal(404)
        }
      )
    })

    it(`confirms URI used in 'getBetaPrograms()' method with no user ID, by returning a non-404 HTTP response`,
    function () {
      swsClient.userId = 0
      return swsClient.profile.getBetaPrograms().then(
        () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
        err => {
          expect(err.httpStatus).not.to.equal(404)
        }
      )
    })

    it(`confirms URI used in 'getBetaPrograms()' method with user ID, by returning a non-404 HTTP response`, function () {
      swsClient.userId = 123
      return swsClient.profile.getBetaPrograms().then(
        () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
        err => {
          expect(err.httpStatus).not.to.equal(404)
        }
      )
    })

    it(`confirms URI in 'addBetaProgram()' method without user ID, by returning a non-404 response`, function () {
      swsClient.userId = 0
      return swsClient.profile.addBetaProgram({
        betaProgramId: 'serato_studio_public_beta'
      }).then(
        () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
        err => {
          expect(err.httpStatus).not.to.equal(404)
        }
      )
    })

    it(`confirms URI in 'addBetaProgram()' method with a user ID, by returning a non-404 response`, function () {
      swsClient.userId = 123
      return swsClient.profile.addBetaProgram({
        betaProgramId: 'serato_studio_public_beta'
      }).then(
        () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
        err => {
          expect(err.httpStatus).not.to.equal(404)
        }
      )
    })

    it(`confirms URI in 'deleteBetaProgram()' method without user ID, by returning a non-404 response`, function () {
      swsClient.userId = 0
      return swsClient.profile.deleteBetaProgram({
        betaProgramId: 'serato_studio_public_beta'
      }).then(
        () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
        err => {
          expect(err.httpStatus).not.to.equal(404)
        }
      )
    })

    it(`confirms URI in 'deleteBetaProgram()' method with a user ID, by returning a non-404 response`, function () {
      swsClient.userId = 123
      return swsClient.profile.deleteBetaProgram({
        betaProgramId: 'serato_studio_public_beta'
      }).then(
        () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
        err => {
          expect(err.httpStatus).not.to.equal(404)
        }
      )
    })

    it(`confirms URI in 'validateAllBetaPrograms()' method without user ID, by returning a non-404 response`, function () {
      swsClient.userId = 0
      return swsClient.profile.validateAllBetaPrograms().then(
        () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
        err => {
          expect(err.httpStatus).not.to.equal(404)
        }
      )
    })

    it(`confirms URI in 'validateAllBetaPrograms()' method with a user ID, by returning a non-404 response`, function () {
      swsClient.userId = 123
      return swsClient.profile.validateAllBetaPrograms().then(
        () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
        err => {
          expect(err.httpStatus).not.to.equal(404)
        }
      )
    })
  })

  describe('Profile URI Survey validation Tests', function () {
    it(`confirms URI used in 'addSurvey()' method with no user ID, by returning a non-404 HTTP response`,
      function () {
        swsClient.userId = 123
        return swsClient.profile.addSurvey().then(
          () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
          err => {
            expect(err.httpStatus).not.to.equal(404)
          }
        )
      }
    )
  })
})
