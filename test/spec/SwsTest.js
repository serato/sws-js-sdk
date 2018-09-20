import Sws, { serviceUriDefault } from '../../src/index'
import { describe, it } from 'mocha'
import assert from 'assert'
import { expect } from 'chai'

const appId = 'myClientAppId'
const idServiceUri = 'my.id-service.uri'
const licenseServiceUri = 'my.license-service.uri'

describe('Sws', function () {
  it('fails constructing Sws with no app ID', function () {
    let bad = function () {
      return new Sws()
    }
    expect(bad).to.throw('Cannot read property \'appId\' of undefined')
  })

  it('constructs Sws with app password and default service URIs', function () {
    let sws = new Sws({ appId: appId, secret: 'myAppSecret' })
    assert.strict.equal(sws.appId, appId)
    assert.strict.equal(sws.appSecret, 'myAppSecret')
    assert.strict.equal(sws.serviceUri.id, serviceUriDefault.id)
    assert.strict.equal(sws.serviceUri.license, serviceUriDefault.license)
  })

  it('constructs Sws with custom service URIs', function () {
    let sws = new Sws({ appId: appId, serviceUri: { id: idServiceUri, license: licenseServiceUri } })
    assert.strict.equal(sws.appId, appId)
    assert.strict.equal(sws.appSecret, '')
    assert.strict.equal(sws.serviceUri.id, idServiceUri)
    assert.strict.equal(sws.serviceUri.license, licenseServiceUri)
  })

  it('tests `accessToken` get and set', function () {
    let tokenValue = '123abc456'
    let sws = new Sws({ appId: appId })
    sws.accessToken = tokenValue
    assert.strict.equal(sws.accessToken, tokenValue)
  })

  it('tests that `setInvalidAccessTokenHandler` sets the correct callback to a service client', function () {
    let customErrorHandler = () => { return 'A value' }
    let sws = new Sws({ appId: appId })
    sws.setInvalidAccessTokenHandler(customErrorHandler)
    assert.strict.equal(customErrorHandler, sws.license.invalidAccessTokenHandler)
  })

  it('tests that `setInvalidRefreshTokenHandler` sets the correct callback to a service client', function () {
    let customErrorHandler = () => { return 'A value' }
    let sws = new Sws({ appId: appId })
    sws.setInvalidRefreshTokenHandler(customErrorHandler)
    assert.strict.equal(customErrorHandler, sws.license.invalidRefreshTokenHandler)
  })

  it('tests that `setAccessDeniedHandler` sets the correct callback to a service client', function () {
    let customErrorHandler = () => { return 'A value' }
    let sws = new Sws({ appId: appId })
    sws.setAccessDeniedHandler(customErrorHandler)
    assert.strict.equal(customErrorHandler, sws.license.accessDeniedHandler)
  })
})
