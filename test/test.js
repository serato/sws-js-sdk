import { SwsClient, serviceUriDefault } from '../src/index'
import { describe, it } from 'mocha'
import assert from 'assert'

const appId = 'myClientAppId'
const idServiceUri = 'my.id-service.uri'
const licenseServiceUri = 'my.license-service.uri'

describe('SwsClient', function () {
  it('construct with password', function () {
    let client = new SwsClient({ appId: appId, secret: 'myAppSecret' })
    assert.strict.equal(client.appId, appId)
    assert.strict.equal(client.appSecret, 'myAppSecret')
    assert.strict.equal(client.serviceUri.id, serviceUriDefault.id)
    assert.strict.equal(client.serviceUri.license, serviceUriDefault.license)
  })
  it('construct with service URIs', function () {
    let client = new SwsClient({ appId: appId, serviceUri: { id: idServiceUri, license: licenseServiceUri } })
    assert.strict.equal(client.appId, appId)
    assert.strict.equal(client.appSecret, '')
    assert.strict.equal(client.serviceUri.id, idServiceUri)
    assert.strict.equal(client.serviceUri.license, licenseServiceUri)
  })
})
