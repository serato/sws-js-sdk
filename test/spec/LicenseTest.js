import { Sws, serviceUriDefault } from '../../src'
import { describe, it } from 'mocha'
import assert from 'assert'
import nock from 'nock'
import { expect } from 'chai'

const appId = 'myClientAppId'

describe('License', function () {
  it('throws Forbidden error with `Access denied` response', function () {
    nock('https://' + serviceUriDefault.license)
      .get('/api/v1/me/licenses', '')
      .reply(403, {
        'code': 2000,
        'error': 'Access denied. Invalid grants.'
      })

    let client = new Sws({ appId: appId })

    return client.license.getLicenses().then(
      () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
      err => {
        expect(err.httpStatus).to.equal(403)
        return err.response.json()
      }
    ).then(
      data => assert.strictEqual(data.code, 2000)
    )
  })
})
