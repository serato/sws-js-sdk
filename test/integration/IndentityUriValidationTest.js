import Sws from '../../src/index'
import { describe, it } from 'mocha'
import { expect } from 'chai'

const appId = 'myClientAppId'

describe('Identity', function () {
  it(`confirms URI used in 'tokenRefresh()' method, by returning a non-404 HTTP response`, function () {
    let sws = new Sws({ appId: appId })

    return sws.id.tokenRefresh('token.value').then(
      () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
      err => {
        expect(err.httpStatus).not.to.equal(404)
      }
    )
  })

  it(`confirms URI used in 'getMe()' method, by returning a non-404 HTTP response`, function () {
    let sws = new Sws({ appId: appId })

    return sws.id.getUserMe().then(
      () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
      err => {
        expect(err.httpStatus).not.to.equal(404)
      }
    )
  })

  it(`confirms URI used in 'login()' method, by returning a non-404 HTTP response`, function () {
    let sws = new Sws({ appId: appId })

    return sws.id.login().then(
      () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
      err => {
        expect(err.httpStatus).not.to.equal(404)
      }
    )
  })
})
