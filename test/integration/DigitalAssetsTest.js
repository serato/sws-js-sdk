import Sws from '../../src/index'
import { describe, it, before } from 'mocha'
import { expect } from 'chai'

describe('DigitalAssets Tests', function () {
  let swsClient
  before(function () {
    swsClient = new Sws({ appId: 'myClientAppId' })
  })

  describe('DigitalAssets URI Validation Tests', function () {
    it(`confirms URI used in 'get()' method by returning a 200 HTTP response`,
      function () {
        return swsClient.da.get({
          hostAppName: 'serato_dj_pro',
          type: 'application_installer',
          releaseType: 'release',
          latestOnly: 1
        }).then(
          data => {
            // May as well confirm that we have exactly one item in the response
            expect(data.items.length).equals(1)
          }
        )
      })
  })
})
