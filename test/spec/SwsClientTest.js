import { SwsClient } from '../../src/index'
import { describe, it } from 'mocha'
import nock from 'nock'
import { expect } from 'chai'

const appId = 'myClientAppId'
const getLicensesUri = '/api/v1/me/licenses'

describe('SwsClient', function () {
  describe('receives invalid access token errors', function () {
    const invalidAccessTokenErrors = [
      {
        httpStatus: 403,
        // statusText: 'Forbidden',
        code: 2001,
        errorText: 'Invalid Access token'
      },
      // Access token has expired
      {
        httpStatus: 401,
        // statusText: 'Unauthorized',
        code: 2002,
        errorText: 'Expired Access token'
      }
    ]

    invalidAccessTokenErrors.forEach(({ httpStatus, code, errorText }) => {
      it(`receives '${errorText}' error then successfully fetches a new access token and successfully retries original request`, function () {
        let successBody = { 'some': 'body content', 'more': ['body', 'content'] }
        let accessTokenExpiresAt = new Date(Date.now() + 3600)

        let scope = nock(/serato/)
          .get(getLicensesUri, '')
          .reply(httpStatus, { 'code': code, 'error': errorText })
          .post('/api/v1/tokens/refresh')
          .reply(200, {
            'tokens': {
              'access': {
                'token': 'New.Access.Token',
                'expires_at': accessTokenExpiresAt.toISOString()
              }
            }
          })
          .get(getLicensesUri, '')
          .reply(200, successBody)

        let sws = new SwsClient({ appId: appId })

        return sws.license.getLicenses().then(
          data => {
            expect(data).to.eql(successBody) // FYI `eql` is non-strict "deep equal"
            // Confirm that all mock requests have been made
            expect(scope.isDone()).to.equal(true)
          }
        )
      })

      it(`receives '${errorText}' error then successfully fetches a new access token but receives HTTP 400 error when retrying original request`, function () {
        let secondErrorHttpStatus = 400
        let secondErrorCode = 1
        let secondErrorText = 'Some kind of error'
        let accessTokenExpiresAt = new Date(Date.now() + 3600)

        let scope = nock(/serato/)
          .get(getLicensesUri, '')
          .reply(httpStatus, { 'code': code, 'error': errorText })
          .post('/api/v1/tokens/refresh')
          .reply(200, {
            'tokens': {
              'access': {
                'token': 'New.Access.Token',
                'expires_at': accessTokenExpiresAt.toISOString()
              }
            }
          })
          .get(getLicensesUri, '')
          .reply(secondErrorHttpStatus, { 'code': secondErrorCode, 'error': secondErrorText })

        let sws = new SwsClient({ appId: appId })

        return sws.license.getLicenses().then(
          // Shouldn't hit the `resolve` callback
          () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
          // Should always hit the `reject` callback
          err => {
            expect(err.httpStatus).to.equal(secondErrorHttpStatus)
            expect(err.code).to.equal(secondErrorCode)
            // Confirm that all mock requests have been made
            expect(scope.isDone()).to.equal(true)
          }
        )
      })

      it(`receives '${errorText}' error then successfully fetches a new access token but receives HTTP 500 error when retrying original request`, function () {
        let accessTokenExpiresAt = new Date(Date.now() + 3600)

        let scope = nock(/serato/)
          .get(getLicensesUri, '')
          .reply(httpStatus, { 'code': code, 'error': errorText })
          .post('/api/v1/tokens/refresh')
          .reply(200, {
            'tokens': {
              'access': {
                'token': 'New.Access.Token',
                'expires_at': accessTokenExpiresAt.toISOString()
              }
            }
          })
          .get(getLicensesUri, '')
          .reply(500, { 'message': 'Application error' })

        let sws = new SwsClient({ appId: appId })

        return sws.license.getLicenses().then(
          // Shouldn't hit the `resolve` callback
          () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
          // Should always hit the `reject` callback
          err => {
            expect(err.httpStatus).to.equal(500)
            // Confirm that all mock requests have been made
            expect(scope.isDone()).to.equal(true)
          }
        )
      })

      it(`receives '${errorText}' error then successfully fetches a new access token but receives HTTP 500 error when retrying original request and uses custom 'serviceErrorHandler' handler`, function () {
        let accessTokenExpiresAt = new Date(Date.now() + 3600)
        let customHandlerResponse = 'This value is returned by our custom handler'
        let customErrorHandler = (err) => {
          return `${customHandlerResponse} ${err.response.status}`
        }

        let scope = nock(/serato/)
          .get(getLicensesUri, '')
          .reply(httpStatus, { 'code': code, 'error': errorText })
          .post('/api/v1/tokens/refresh')
          .reply(200, {
            'tokens': {
              'access': {
                'token': 'New.Access.Token',
                'expires_at': accessTokenExpiresAt.toISOString()
              }
            }
          })
          .get(getLicensesUri, '')
          .reply(500, { 'message': 'Application error' })

        let sws = new SwsClient({ appId: appId })

        sws.setServiceErrorHandler(customErrorHandler)

        return sws.license.getLicenses().then(
          // Should always hit the `resolve` callback because we're using our custom handler
          data => {
            expect(data).to.equal(`${customHandlerResponse} 500`)
            expect(scope.isDone()).to.equal(true)
          },
          // Should never hit the `reject` callback
          err => {
            let error = new Error(`Expected error to be handled by custom serviceErrorHandler callback`)
            error.error = err
            Promise.reject(error)
          }
        )
      })

      it(`receives '${errorText}' error then receives a HTTP 500 error when fetching a new access token`, function () {
        let scope = nock(/serato/)
          .get(getLicensesUri, '')
          .reply(httpStatus, { 'code': code, 'error': errorText })
          .post('/api/v1/tokens/refresh')
          .reply(500, { 'message': 'Application Error' })

        let sws = new SwsClient({ appId: appId })

        return sws.license.getLicenses().then(
          // Shouldn't hit the `resolve` callback
          () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
          // Should always hit the `reject` callback
          err => {
            expect(err.httpStatus).to.equal(500)
            // Confirm that all mock requests have been made
            expect(scope.isDone()).to.equal(true)
          }
        )
      })

      it(`receives '${errorText}' error then receives a HTTP 500 error when fetching a new access token and uses custom 'serviceErrorHandler' handler`, function () {
        let customHandlerResponse = 'This value is returned by our custom handler'
        let customErrorHandler = (err) => {
          return `${customHandlerResponse} ${err.response.status}`
        }

        let scope = nock(/serato/)
          .get(getLicensesUri, '')
          .reply(httpStatus, { 'code': code, 'error': errorText })
          .post('/api/v1/tokens/refresh')
          .reply(500, { 'message': 'Application Error' })

        let sws = new SwsClient({ appId: appId })

        // Attach the custom handler
        sws.setServiceErrorHandler(customErrorHandler)

        return sws.license.getLicenses().then(
          // Should always hit the `resolve` callback because we're using our custom handler
          data => {
            expect(data).to.equal(`${customHandlerResponse} 500`)
            expect(scope.isDone()).to.equal(true)
          },
          // Should never hit the `reject` callback
          err => {
            let error = new Error(`Expected error to be handled by custom serviceErrorHandler callback`)
            error.error = err
            Promise.reject(error)
          }
        )
      })

      // it(`receives '${errorText}' error then successfully fetches a new access token but receives another '${errorText}' error when retrying original request`, function () {
      //   let accessTokenExpiresAt = new Date(Date.now() + 3600)

      //   let scope = nock(/serato/)
      //     .get(getLicensesUri, '')
      //     .reply(httpStatus, { 'code': code, 'error': errorText })
      //     .post('/api/v1/tokens/refresh')
      //     .reply(200, {
      //       'tokens': {
      //         'access': {
      //           'token': 'New.Access.Token',
      //           'expires_at': accessTokenExpiresAt.toISOString()
      //         }
      //       }
      //     })
      //     .get(getLicensesUri, '')
      //     .reply(httpStatus, { 'code': code, 'error': errorText })

      //   let sws = new SwsClient({ appId: appId })

      //   return sws.license.getLicenses().then(
      //     // Should always hit the `resolve` callback because we're using our custom handler
      //     data => {
      //       console.log('SUCKESS')
      //     },
      //     // Should never hit the `reject` callback
      //     err => {
      //       console.log('FAILS')
      //       // console.log(err)
      //     }
      //   )
      // })
    })
  })
})
