import Sws from '../../src/index'
import { describe, it, before } from 'mocha'
import { expect } from 'chai'

describe('DigitalAssets Testscd', function () {
  let swsClient
  before(function () {
    swsClient = new Sws({ appId: 'myClientAppId' })
  })

  describe('DigitalAssets URI Validation Tests', function () {
    it(`confirms URI used in 'getDigitalAssets()' method by returning a non-404 HTTP response`,
      function () {
        return swsClient.da.getDigitalAssets({
          'host_app_name': 'serato_dj_pro',
          'host_app_version': '1',
          'host_app_os': 'mac',
          'type': 'application_installer',
          'release_type': 'release',
          'release_date': '2019-11-05T13:15:30Z',
          'latest_only': 1
        }).then(
          () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
          err => {
            expect(err.httpStatus).not.to.equal(404)
          }
        )
      })

    it(`confirms URI used in 'postDigitalAssets()' method by returning a non-404 HTTP response`,
      function () {
        return swsClient.da.postDigitalAssets({
          asset_id: '123',
          resource_id: '123'
        }).then(
          () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
          err => {
            expect(err.httpStatus).not.to.equal(404)
          }
        )
      })
  })
})

