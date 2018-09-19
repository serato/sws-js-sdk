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
const customHandlerResponse = 'This value is returned by our custom handler'

describe('Service', function () {
  /**
   * Test the happy path
   */
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

  /**
   * Test the custom error handlers.
   *
   * Iterate over a data set the specifies the the combination of HTTP status
   * and error code that, if received, will trigger a custom error handler (if specified).
   *
   * Two tests are executed for each data item:
   *
   * One the doesn't specify a customer handler and asserts that the default error handler is used.
   * One the sets a custom error handler and asserts that it is used.
   */

  // Define the custom error handler. The err handler receives the error object returned
  // from the HTTP request.
  let customErrorHandler = (err) => {
    return `${customHandlerResponse} ${err.response.status} - ${err.response.data.code}`
  }

  let customHandlerTests = [
    // Access token is invalid (eg. bad signature)
    {
      httpStatus: 403,
      statusText: 'Forbidden',
      code: 2001,
      error: 'Invalid Aaccess token',
      handlerName: 'invalidAccessTokenHandler',
      attachHandler: (client) => { client.invalidAccessTokenHandler = customErrorHandler }
    },
    // Access token has expired
    {
      httpStatus: 401,
      statusText: 'Unauthorized',
      code: 2002,
      error: 'Expired Access token',
      handlerName: 'invalidAccessTokenHandler',
      attachHandler: (client) => { client.invalidAccessTokenHandler = customErrorHandler }
    },
    // Access token does not contain required scopes
    {
      httpStatus: 403,
      statusText: 'Forbidden',
      code: 2000,
      error: 'Access denied. Invalid grants.',
      handlerName: 'accessDeniedHandler',
      attachHandler: (client) => { client.accessDeniedHandler = customErrorHandler }
    },
    // Refresh token is invalid (eg. bad signature)
    {
      httpStatus: 400,
      statusText: 'Bad Request',
      code: 1001,
      error: 'Invalid Refresh token.',
      handlerName: 'invalidRefreshTokenHandler',
      attachHandler: (client) => { client.invalidRefreshTokenHandler = customErrorHandler }
    },
    // Refresh token has expired
    {
      httpStatus: 400,
      statusText: 'Bad Request',
      code: 1007,
      error: 'Expired Refresh token.',
      handlerName: 'invalidRefreshTokenHandler',
      attachHandler: (client) => { client.invalidRefreshTokenHandler = customErrorHandler }
    }
  ]

  customHandlerTests.forEach(test => {
    it(`handles '${test.httpStatus} ${test.statusText}, error code ${test.code}' with default error handler`, function () {
      // Intercept the HTTP request and return the desired HTTP status and JSON message body
      nock(licenseServiceHost).get(getLicensesUri, '').reply(
        test.httpStatus,
        { 'code': test.code, 'error': test.error }
      )

      let client = new Sws({ appId: appId })

      return client.license.getLicenses().then(
        // Should never hit the `resolve` callback
        () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
        // Should always hit the `reject` callback
        err => {
          expect(err.httpStatus).to.equal(test.httpStatus)
          expect(err.code).to.equal(test.code)
          expect(err.response.status).to.equal(test.httpStatus)
        }
      )
    })

    it(`handles '${test.httpStatus} ${test.statusText}, error code ${test.code}' with custom handler`, function () {
      // Intercept the HTTP request and return the desired HTTP status and JSON message body
      nock(licenseServiceHost).get(getLicensesUri, '').reply(
        test.httpStatus,
        { 'code': test.code, 'error': test.error }
      )

      let client = new Sws({ appId: appId })

      // Attach the customer handler to the client
      test.attachHandler(client.license)

      return client.license.getLicenses().then(
        // Should always hit the `resolve` callback because we're using our custom handler
        data => expect(data).to.equal(`${customHandlerResponse} ${test.httpStatus} - ${test.code}`),
        // Should never hit the `reject` callback
        err => {
          let error = new Error(`Expected error to be handled by custom ${test.handlerName} handler`)
          error.error = err
          Promise.reject(error)
        }
      )
    })
  })
})
