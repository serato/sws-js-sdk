import Sws, { serviceUriDefault } from '../../src/index'
import { describe, it } from 'mocha'
import assert from 'assert'
import { expect } from 'chai'

const appId = 'myClientAppId'
const idServiceUri = 'my.id-service.uri'
const licenseServiceUri = 'my.license-service.uri'

describe('Sws', function () {
  it('fails constructing client with no app ID', function () {
    let bad = function () {
      return new Sws()
    }
    expect(bad).to.throw('Cannot read property \'appId\' of undefined')
  })

  it('constructs client with app password and default service URIs', function () {
    let client = new Sws({ appId: appId, secret: 'myAppSecret' })
    assert.strict.equal(client.appId, appId)
    assert.strict.equal(client.appSecret, 'myAppSecret')
    assert.strict.equal(client.serviceUri.id, serviceUriDefault.id)
    assert.strict.equal(client.serviceUri.license, serviceUriDefault.license)
  })

  it('constructs client with custom service URIs', function () {
    let client = new Sws({ appId: appId, serviceUri: { id: idServiceUri, license: licenseServiceUri } })
    assert.strict.equal(client.appId, appId)
    assert.strict.equal(client.appSecret, '')
    assert.strict.equal(client.serviceUri.id, idServiceUri)
    assert.strict.equal(client.serviceUri.license, licenseServiceUri)
  })

  it('tests `accessToken` get and set', function () {
    let tokenValue = '123abc456'
    let client = new Sws({ appId: appId })
    client.accessToken = tokenValue
    assert.strict.equal(client.accessToken, tokenValue)
  })

  it('tests that `setInvalidAccessTokenHandler` sets the correct callback to a service client', function () {
    let customErrorHandler = () => { return 'A value' }
    let client = new Sws({ appId: appId })
    client.setInvalidAccessTokenHandler(customErrorHandler)
    assert.strict.equal(customErrorHandler, client.license.invalidAccessTokenHandler)
  })

  it('tests that `setInvalidRefreshTokenHandler` sets the correct callback to a service client', function () {
    let customErrorHandler = () => { return 'A value' }
    let client = new Sws({ appId: appId })
    client.setInvalidRefreshTokenHandler(customErrorHandler)
    assert.strict.equal(customErrorHandler, client.license.invalidRefreshTokenHandler)
  })

  it('tests that `setAccessDeniedHandler` sets the correct callback to a service client', function () {
    let customErrorHandler = () => { return 'A value' }
    let client = new Sws({ appId: appId })
    client.setAccessDeniedHandler(customErrorHandler)
    assert.strict.equal(customErrorHandler, client.license.accessDeniedHandler)
  })
})
