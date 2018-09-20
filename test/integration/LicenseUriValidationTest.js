import Sws from '../../src/index'
import { describe, it } from 'mocha'
import { expect } from 'chai'

const appId = 'myClientAppId'

describe('License', function () {
  it('confirms `/me/licenses` URI by returning a non-404 HTTP response', function () {
    let sws = new Sws({ appId: appId })

    return sws.license.getLicenses().then(
      () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
      err => {
        expect(err.httpStatus).not.to.equal(404)
      }
    )
  })

  it('confirms `/user/{user_id}/licenses` URI by returning a non-404 HTTP response', function () {
    let sws = new Sws({ appId: appId })

    return sws.license.getLicenses({ userId: 123 }).then(
      () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
      err => {
        expect(err.httpStatus).not.to.equal(404)
      }
    )
  })
})
