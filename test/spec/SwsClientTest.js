import { SwsClient } from '../../src/index'
import { describe, it } from 'mocha'
import nock from 'nock'
// import assert from 'assert'
import { expect } from 'chai'

const appId = 'myClientAppId'
// const licenseServiceHost = 'https://' + serviceUriDefault.license
// const idServiceHost = 'https://' + serviceUriDefault.id
const getLicensesUri = '/api/v1/me/licenses'

// {
//   httpStatus: 403,
//   statusText: 'Forbidden',
//   code: 2001,
//   error: 'Invalid Access token',
//   handlerName: 'invalidAccessTokenHandler',
//   attachHandler: (client) => { client.invalidAccessTokenHandler = customErrorCodeHandler }
// },
// // Access token has expired
// {
//   httpStatus: 401,
//   statusText: 'Unauthorized',
//   code: 2002,
//   error: 'Expired Access token',
//   handlerName: 'invalidAccessTokenHandler',
//   attachHandler: (client) => { client.invalidAccessTokenHandler = customErrorCodeHandler }
// }

describe('SwsClient', function () {
  it('should retry a request if it initially results in `invalid access token` error', function () {
    let accessTokenExpiresAt = new Date(Date.now() + 3600)
    let scope = nock(/serato/)
      .get(getLicensesUri, '')
      .reply(403, { 'code': 2001, 'error': 'Invalid Access token' })
      .post('/api/v1/tokens/refresh')
      .reply(200, {
        'tokens': {
          'access': {
            'token': 'New.Access.Token',
            'expires_at': accessTokenExpiresAt.toISOString()
          }
        }
      })

    let sws = new SwsClient({ appId: appId })

    return sws.license.getLicenses().then(
      data => expect(data).to.eql('') // FYI `eql` is non-strict "deep equal"
    )
  })
})
