import Sws, { serviceUriDefault } from '../../src/index'
import { describe, it } from 'mocha'
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
    expect(sws.appId).to.equal(appId)
    expect(sws.appSecret).to.equal('myAppSecret')
    expect(sws.serviceUri.id).to.equal(serviceUriDefault.id)
    expect(sws.serviceUri.license).to.equal(serviceUriDefault.license)
  })

  it('constructs Sws with custom service URIs', function () {
    let sws = new Sws({ appId: appId, serviceUri: { id: idServiceUri, license: licenseServiceUri } })
    expect(sws.appId).to.equal(appId)
    expect(sws.appSecret).to.equal('')
    expect(sws.serviceUri.id).to.equal(idServiceUri)
    expect(sws.serviceUri.license).to.equal(licenseServiceUri)
  })

  it('tests `accessToken` get and set', function () {
    let tokenValue = '123abc456'
    let sws = new Sws({ appId: appId })
    sws.accessToken = tokenValue
    expect(sws.accessToken).to.equal(tokenValue)
  })

  it('tests that `setInvalidAccessTokenHandler` sets the correct callback to a service client', function () {
    let customErrorHandler = () => { return 'A value' }
    let sws = new Sws({ appId: appId })
    sws.setInvalidAccessTokenHandler(customErrorHandler)
    expect(customErrorHandler).to.equal(sws.license.invalidAccessTokenHandler)
  })

  it('tests that `setInvalidRefreshTokenHandler` sets the correct callback to a service client', function () {
    let customErrorHandler = () => { return 'A value' }
    let sws = new Sws({ appId: appId })
    sws.setInvalidRefreshTokenHandler(customErrorHandler)
    expect(customErrorHandler).to.equal(sws.license.invalidRefreshTokenHandler)
  })

  it('tests that `setAccessDeniedHandler` sets the correct callback to a service client', function () {
    let customErrorHandler = () => { return 'A value' }
    let sws = new Sws({ appId: appId })
    sws.setAccessDeniedHandler(customErrorHandler)
    expect(customErrorHandler).to.equal(sws.license.accessDeniedHandler)
  })

  it('tests that `setServiceErrorHandler` sets the correct callback to a service client', function () {
    let customErrorHandler = () => { return 'A value' }
    let sws = new Sws({ appId: appId })
    sws.setServiceErrorHandler(customErrorHandler)
    expect(customErrorHandler).to.equal(sws.license.serviceErrorHandler)
  })

  it('tests that `setServiceUnavailableHandler` sets the correct callback to a service client', function () {
    let customErrorHandler = () => { return 'A value' }
    let sws = new Sws({ appId: appId })
    sws.setServiceUnavailableHandler(customErrorHandler)
    expect(customErrorHandler).to.equal(sws.license.serviceUnavailableHandler)
  })
})
