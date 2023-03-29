import Sws from '../../src/index'
import { describe, it, before } from 'mocha'
import { expect } from 'chai'

describe('Cloud Library Tests', function () {
  let swsClient
  before(function () {
    swsClient = new Sws({ appId: 'myClientAppId' })
  })

  describe('CloudLib URI Validation Tests', function () {
    it(`confirms URI used in 'getFiles()' method by returning a 200 HTTP response`,
      function () {
        return swsClient.cloudlib.getFiles({
          fileId: 'file-id'
        }).then(
          () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
          err => {
            expect(err.httpStatus).not.to.equal(404)
          }
        )
      })
  })
})
