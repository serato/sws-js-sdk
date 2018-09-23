import Sws from '../../src'
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

    let scope = nock(/serato/).get(getLicensesUri, '').reply(200, body)

    let sws = new Sws({ appId: appId })

    return sws.license.getLicenses().then(
      data => {
        expect(data).to.eql(body) // FYI `eql` is non-strict "deep equal"
        // Confirm that all mock requests have been made
        expect(scope.isDone()).to.equal(true)
      }
    )
  })

  /**
   * Test the custom error handlers for errors that include a specific error code.
   * (FWIW, these are all HTTP 4xx status errors that are explicity thrown by the web applications)
   *
   * Iterate over a data set the specifies the combination of HTTP status
   * and error code that, if received, will trigger a custom error handler (if specified).
   *
   * Two tests are executed for each data item:
   *
   * One the doesn't specify a customer handler and asserts that the default error handler is used.
   * One the sets a custom error handler and asserts that it is used.
   */

  // Define the custom error handler. The err handler receives the error object returned
  // from the HTTP request.
  let customErrorCodeHandler = (err) => {
    return `${customHandlerResponse} ${err.response.status} - ${err.response.data.code}`
  }

  const errorsWithCodesTests = [
    // Access token is invalid (eg. bad signature)
    {
      httpStatus: 403,
      statusText: 'Forbidden',
      code: 2001,
      error: 'Invalid Access token',
      handlerName: 'invalidAccessTokenHandler',
      attachHandler: (client) => { client.invalidAccessTokenHandler = customErrorCodeHandler }
    },
    // Access token has expired
    {
      httpStatus: 401,
      statusText: 'Unauthorized',
      code: 2002,
      error: 'Expired Access token',
      handlerName: 'invalidAccessTokenHandler',
      attachHandler: (client) => { client.invalidAccessTokenHandler = customErrorCodeHandler }
    },
    // Access token does not contain required scopes
    {
      httpStatus: 403,
      statusText: 'Forbidden',
      code: 2000,
      error: 'Access denied. Invalid grants.',
      handlerName: 'accessDeniedHandler',
      attachHandler: (client) => { client.accessDeniedHandler = customErrorCodeHandler }
    },
    // Refresh token is invalid (eg. bad signature)
    {
      httpStatus: 400,
      statusText: 'Bad Request',
      code: 1001,
      error: 'Invalid Refresh token.',
      handlerName: 'invalidRefreshTokenHandler',
      attachHandler: (client) => { client.invalidRefreshTokenHandler = customErrorCodeHandler }
    },
    // Refresh token has expired
    {
      httpStatus: 400,
      statusText: 'Bad Request',
      code: 1007,
      error: 'Expired Refresh token.',
      handlerName: 'invalidRefreshTokenHandler',
      attachHandler: (client) => { client.invalidRefreshTokenHandler = customErrorCodeHandler }
    }
  ]

  errorsWithCodesTests.forEach(({ httpStatus, statusText, code, error, handlerName, attachHandler }) => {
    it(`handles '${httpStatus} ${statusText}, error code ${code}' with default error handler`, function () {
      // Intercept the HTTP request and return the desired HTTP status and JSON message body
      let scope = nock(/serato/).get(getLicensesUri, '').reply(httpStatus, { 'code': code, 'error': error })

      let sws = new Sws({ appId: appId })

      return sws.license.getLicenses().then(
        // Should never hit the `resolve` callback
        () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
        // Should always hit the `reject` callback
        err => {
          expect(err.httpStatus).to.equal(httpStatus)
          expect(err.code).to.equal(code)
          expect(err.response.status).to.equal(httpStatus)
          // Confirm that all mock requests have been made
          expect(scope.isDone()).to.equal(true)
        }
      )
    })

    it(`handles '${httpStatus} ${statusText}, error code ${code}' with custom handler`, function () {
      // Intercept the HTTP request and return the desired HTTP status and JSON message body
      let scope = nock(/serato/).get(getLicensesUri, '').reply(httpStatus, { 'code': code, 'error': error })

      let sws = new Sws({ appId: appId })

      // Attach the customer handler to the client
      attachHandler(sws.license)

      return sws.license.getLicenses().then(
        // Should always hit the `resolve` callback because we're using our custom handler
        data => {
          expect(data).to.equal(`${customHandlerResponse} ${httpStatus} - ${code}`)
          // Confirm that all mock requests have been made
          expect(scope.isDone()).to.equal(true)
        },
        // Should never hit the `reject` callback
        err => {
          let error = new Error(`Expected error to be handled by custom ${handlerName} handler`)
          error.error = err
          Promise.reject(error)
        }
      )
    })
  })

  /**
   * Test the custom error handlers for errors that do NOT specify an error code.
   * (FWIW, these are all HTTP 5xx status errors - either unhandled application error or service unavailable)
   *
   * Iterate over a data set the specifies the HTTP status that, if received, will trigger a custom
   * error handler (if specified).
   *
   * Two tests are executed for each data item:
   *
   * One the doesn't specify a customer handler and asserts that the default error handler is used.
   * One the sets a custom error handler and asserts that it is used.
   */

  // Define the custom error handler. The err handler receives the error object returned
  // from the HTTP request.
  const customErrorHandler = (err) => {
    return `${customHandlerResponse} ${err.response.status}`
  }

  const errorsWithoutCodesTests = [
    // Unhandled application error
    {
      httpStatus: 500,
      statusText: 'Application error',
      errorMessage: 'Application error',
      handlerName: 'serviceErrorHandler',
      attachHandler: (client) => { client.serviceErrorHandler = customErrorHandler }
    },
    // Service unavailable error
    {
      httpStatus: 503,
      statusText: 'Service unavailable',
      errorMessage: 'Service unavailable',
      handlerName: 'serviceUnavailableHandler',
      attachHandler: (client) => { client.serviceUnavailableHandler = customErrorHandler }
    }
  ]

  errorsWithoutCodesTests.forEach(({ httpStatus, statusText, errorMessage, handlerName, attachHandler }) => {
    it(`handles '${httpStatus} ${statusText}' with default error handler`, function () {
      // Intercept the HTTP request and return the desired HTTP status and JSON message body
      let scope = nock(/serato/).get(getLicensesUri, '').reply(httpStatus, { 'message': errorMessage })

      let sws = new Sws({ appId: appId })

      return sws.license.getLicenses().then(
        // Should never hit the `resolve` callback
        () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
        // Should always hit the `reject` callback
        err => {
          expect(err.httpStatus).to.equal(httpStatus)
          expect(err.response.status).to.equal(httpStatus)
          // Confirm that all mock requests have been made
          expect(scope.isDone()).to.equal(true)
        }
      )
    })

    it(`handles '${httpStatus} ${statusText}' with custom handler`, function () {
      // Intercept the HTTP request and return the desired HTTP status and JSON message body
      let scope = nock(/serato/).get(getLicensesUri, '').reply(httpStatus, { 'message': errorMessage })

      let sws = new Sws({ appId: appId })

      // Attach the customer handler to the client
      attachHandler(sws.license)

      return sws.license.getLicenses().then(
        // Should always hit the `resolve` callback because we're using our custom handler
        data => {
          expect(data).to.equal(`${customHandlerResponse} ${httpStatus}`)
          // Confirm that all mock requests have been made
          expect(scope.isDone()).to.equal(true)
        },
        // Should never hit the `reject` callback
        err => {
          let error = new Error(`Expected error to be handled by custom ${handlerName} handler`)
          error.error = err
          Promise.reject(error)
        }
      )
    })
  })
})
