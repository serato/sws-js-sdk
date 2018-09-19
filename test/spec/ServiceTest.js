import Sws, { serviceUriDefault } from '../../src'
import { describe, it } from 'mocha'
import nock from 'nock'
import { expect } from 'chai'

/**
 * Tests for the Service module that cover common functionality
 * used by all service clients.
 *
 * Tests are executed using the License service client as an exemplar
 * child instance of Service. But the tests in this module only cover
 * common functionality contained within the Service module.
 */

const appId = 'myClientAppId'
const licenseServiceHost = 'https://' + serviceUriDefault.license
const getLicensesUri = '/api/v1/me/licenses'
const customAccessDeniedHandlerResponse = 'This value is returned by our custom accessDeniedHandler'

describe('Service', function () {
  it('returns message body when `getLicenses` executed successfully', function () {
    let body = {
      'some': 'body content',
      'more': ['body', 'content']
    }

    nock(licenseServiceHost).get(getLicensesUri, '').reply(200, body)

    let client = new Sws({ appId: appId })

    return client.license.getLicenses().then(
      data => expect(data).to.eql(body) // FYI `eql` is non-strict "deep equal"
    )
  })

  it('handles `403 Forbidden` + error code `2000` with default Promise reject when no custom handler is supplied', function () {
    nock(licenseServiceHost).get(getLicensesUri, '').reply(
      403, { 'code': 2000, 'error': 'Access denied. Invalid grants.' }
    )

    let client = new Sws({ appId: appId })

    return client.license.getLicenses().then(
      () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
      err => {
        // Error codes should be exposed via Error object...
        expect(err.httpStatus).to.equal(403)
        expect(err.code).to.equal(2000)
        // But check that we have the underlying axios response object
        // is in the Error too
        expect(err.response.status).to.equal(403)
      }
    )
  })

  it('handles `403 Forbidden` + error code `2000` with custom handler when supplied', function () {
    nock(licenseServiceHost).get(getLicensesUri, '').reply(
      403, { 'code': 2000, 'error': 'Access denied. Invalid grants.' }
    )

    let client = new Sws({ appId: appId })

    client.license.accessDeniedHandler = (err) => {
      return customAccessDeniedHandlerResponse + ' ' + err.response.status + ' - ' + err.response.data.code
    }

    return client.license.getLicenses().then(
      data => expect(data).to.equal(customAccessDeniedHandlerResponse + ' 403 - 2000'),
      err => {
        let error = new Error('Expected error to be handled by custom `accessDeniedHandler` handler')
        error.error = err
        Promise.reject(error)
      }
    )
  })
})
