import SwsClient from '../../src/index'
import { describe, it } from 'mocha'
import nock from 'nock'
import { expect } from 'chai'

const appId = 'myClientAppId'
const getLicensesUri = '/api/v1/me/licenses'
const newAccessTokenValue = 'New.Access.Token.Value'
const newRefreshTokenValue = 'New.RefreshToken.Value'

describe('SwsClient', function () {
  describe('receives invalid access token errors', function () {
    const invalidAccessTokenErrors = [
      {
        httpStatus: 403,
        code: 2001,
        errorText: 'Invalid Access token',
        useTokenRotation: true
      },
      {
        httpStatus: 403,
        code: 2001,
        errorText: 'Invalid Access token',
        useTokenRotation: false
      },
      // Access token has expired
      {
        httpStatus: 401,
        code: 2002,
        errorText: 'Expired Access token',
        useTokenRotation: true
      },
      {
        httpStatus: 401,
        code: 2002,
        errorText: 'Expired Access token',
        useTokenRotation: false
      }
    ]

    invalidAccessTokenErrors.forEach(({ httpStatus, code, errorText, useTokenRotation }) => {
      let refreshTokenUri = useTokenRotation ? '/api/v2/tokens/refresh' : '/api/v1/tokens/refresh'

      it(`'${errorText}' error then successfully fetches a new access token ${useTokenRotation ? 'with' : 'without'} refresh token rotation and successfully retries original request`, function () {
        let successBody = { 'some': 'body content', 'more': ['body', 'content'] }
        let accessTokenExpiresAt = new Date(Date.now() + 3600000)
        let refreshTokenExpiresAt = new Date(Date.now() + (365 * 3600000))

        let scope = nock(/serato/)
          .get(getLicensesUri, '')
          .reply(httpStatus, { 'code': code, 'error': errorText })
          .post(refreshTokenUri)
          .reply(200, {
            'access': {
              'token': newAccessTokenValue,
              'expires_at': (accessTokenExpiresAt.valueOf() / 1000)
            },
            'refresh': {
              'token': newRefreshTokenValue,
              'expires_at': (refreshTokenExpiresAt.valueOf() / 1000)
            }
          })
          .get(getLicensesUri, '')
          .reply(200, successBody)

        let sws = new SwsClient({ appId: appId }, useTokenRotation)

        return sws.license.getLicenses().then(
          data => {
            expect(sws.accessToken).to.equal(newAccessTokenValue)
            expect(data).to.eql(successBody) // FYI `eql` is non-strict "deep equal"
            // Confirm that all mock requests have been made
            expect(scope.isDone()).to.equal(true)
          }
        )
      })

      it(`'${errorText}' error then successfully fetches a new access token ${useTokenRotation ? 'with' : 'without'} refresh token rotation but receives a generic HTTP 400 error when retrying original request`, function () {
        let secondErrorHttpStatus = 400
        let secondErrorCode = 1
        let secondErrorText = 'Some kind of error'
        let accessTokenExpiresAt = new Date(Date.now() + 3600000)
        let refreshTokenExpiresAt = new Date(Date.now() + (365 * 3600000))

        let scope = nock(/serato/)
          .get(getLicensesUri, '')
          .reply(httpStatus, { 'code': code, 'error': errorText })
          .post(refreshTokenUri)
          .reply(200, {
            'access': {
              'token': newAccessTokenValue,
              'expires_at': (accessTokenExpiresAt.valueOf() / 1000)
            },
            'refresh': {
              'token': newRefreshTokenValue,
              'expires_at': (refreshTokenExpiresAt.valueOf() / 1000)
            }
          })
          .get(getLicensesUri, '')
          .reply(secondErrorHttpStatus, { 'code': secondErrorCode, 'error': secondErrorText })

        let sws = new SwsClient({ appId: appId }, useTokenRotation)

        return sws.license.getLicenses().then(
          // Shouldn't hit the `resolve` callback
          () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
          // Should always hit the `reject` callback
          err => {
            expect(sws.accessToken).to.equal(newAccessTokenValue)
            expect(err.httpStatus).to.equal(secondErrorHttpStatus)
            expect(err.code).to.equal(secondErrorCode)
            // Confirm that all mock requests have been made
            expect(scope.isDone()).to.equal(true)
          }
        )
      })

      it(`'${errorText}' error then successfully fetches a new access token ${useTokenRotation ? 'with' : 'without'} refresh token rotation but receives HTTP 500 error when retrying original request`, function () {
        let accessTokenExpiresAt = new Date(Date.now() + 3600000)
        let refreshTokenExpiresAt = new Date(Date.now() + (365 * 3600000))

        let scope = nock(/serato/)
          .get(getLicensesUri, '')
          .reply(httpStatus, { 'code': code, 'error': errorText })
          .post(refreshTokenUri)
          .reply(200, {
            'access': {
              'token': newAccessTokenValue,
              'expires_at': (accessTokenExpiresAt.valueOf() / 1000)
            },
            'refresh': {
              'token': newRefreshTokenValue,
              'expires_at': (refreshTokenExpiresAt.valueOf() / 1000)
            }
          })
          .get(getLicensesUri, '')
          .reply(500, { 'message': 'Application error' })

        let sws = new SwsClient({ appId: appId }, useTokenRotation)

        return sws.license.getLicenses().then(
          // Shouldn't hit the `resolve` callback
          () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
          // Should always hit the `reject` callback
          err => {
            expect(sws.accessToken).to.equal(newAccessTokenValue)
            expect(err.httpStatus).to.equal(500)
            // Confirm that all mock requests have been made
            expect(scope.isDone()).to.equal(true)
          }
        )
      })

      it(`'${errorText}' error then successfully fetches a new access token ${useTokenRotation ? 'with' : 'without'} refresh token rotation but receives HTTP 500 error when retrying original request and uses custom 'serviceErrorHandler' handler`, function () {
        let accessTokenExpiresAt = new Date(Date.now() + 3600000)
        let refreshTokenExpiresAt = new Date(Date.now() + (365 * 3600000))
        let customHandlerResponse = 'This value is returned by our custom handler'
        let customErrorHandler = (request, err) => {
          return `${customHandlerResponse} ${err.response.status}`
        }

        let scope = nock(/serato/)
          .get(getLicensesUri, '')
          .reply(httpStatus, { 'code': code, 'error': errorText })
          .post(refreshTokenUri)
          .reply(200, {
            'access': {
              'token': newAccessTokenValue,
              'expires_at': (accessTokenExpiresAt.valueOf() / 1000)
            },
            'refresh': {
              'token': newRefreshTokenValue,
              'expires_at': (refreshTokenExpiresAt.valueOf() / 1000)
            }
          })
          .get(getLicensesUri, '')
          .reply(500, { 'message': 'Application error' })

        let sws = new SwsClient({ appId: appId }, useTokenRotation)

        sws.setServiceErrorHandler(customErrorHandler)

        return sws.license.getLicenses().then(
          // Should always hit the `resolve` callback because we're using our custom handler
          data => {
            expect(sws.accessToken).to.equal(newAccessTokenValue)
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

      it(`'${errorText}' error then receives a HTTP 500 error when fetching a new access token`, function () {
        let scope = nock(/serato/)
          .get(getLicensesUri, '')
          .reply(httpStatus, { 'code': code, 'error': errorText })
          .post(refreshTokenUri)
          .reply(500, { 'message': 'Application Error' })

        let sws = new SwsClient({ appId: appId }, useTokenRotation)

        return sws.license.getLicenses().then(
          // Shouldn't hit the `resolve` callback
          () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
          // Should always hit the `reject` callback
          err => {
            expect(sws.accessToken).not.to.equal(newAccessTokenValue)
            expect(err.httpStatus).to.equal(500)
            // Confirm that all mock requests have been made
            expect(scope.isDone()).to.equal(true)
          }
        )
      })

      it(`'${errorText}' error then receives a HTTP 500 error when fetching a new access token ${useTokenRotation ? 'with' : 'without'} refresh token rotation and uses custom 'serviceErrorHandler' handler`, function () {
        let customHandlerResponse = 'This value is returned by our custom handler'
        let customErrorHandler = (request, err) => {
          return `${customHandlerResponse} ${err.response.status}`
        }

        let scope = nock(/serato/)
          .get(getLicensesUri, '')
          .reply(httpStatus, { 'code': code, 'error': errorText })
          .post(refreshTokenUri)
          .reply(500, { 'message': 'Application Error' })

        let sws = new SwsClient({ appId: appId }, useTokenRotation)

        // Attach the custom handler
        sws.setServiceErrorHandler(customErrorHandler)

        return sws.license.getLicenses().then(
          // Should always hit the `resolve` callback because we're using our custom handler
          data => {
            expect(sws.accessToken).not.to.equal(newAccessTokenValue)
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

      it(`'${errorText}' error then receives 'Refresh token expired' error when fetching new access token ${useTokenRotation ? 'with' : 'without'} refresh token rotation`, function () {
        let scope = nock(/serato/)
          .get(getLicensesUri, '')
          .reply(httpStatus, { 'code': code, 'error': errorText })
          .post(refreshTokenUri)
          .reply(400, { 'code': 1007, 'error': 'Refresh token expired' })

        let sws = new SwsClient({ appId: appId }, useTokenRotation)

        return sws.license.getLicenses().then(
          // Shouldn't hit the `resolve` callback
          () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
          // Should always hit the `reject` callback
          err => {
            expect(sws.accessToken).not.to.equal(newAccessTokenValue)
            expect(err.httpStatus).to.equal(400)
            expect(err.code).to.equal(1007)
            // Confirm that all mock requests have been made
            expect(scope.isDone()).to.equal(true)
          }
        )
      })

      it(`'${errorText}' error then receives 'Refresh token expired' error when fetching new access token ${useTokenRotation ? 'with' : 'without'} refresh token rotation and handles error with custom handler`, function () {
        let customHandlerResponse = 'This value is returned by our custom handler'
        let customErrorHandler = (request, err) => {
          return `${customHandlerResponse} ${err.response.status}`
        }

        let scope = nock(/serato/)
          .get(getLicensesUri, '')
          .reply(httpStatus, { 'code': code, 'error': errorText })
          .post(refreshTokenUri)
          .reply(400, { 'code': 1007, 'error': 'Refresh token expired' })

        let sws = new SwsClient({ appId: appId }, useTokenRotation)

        // Attach the custom handler
        sws.setInvalidRefreshTokenHandler(customErrorHandler)

        return sws.license.getLicenses().then(
          // Should always hit the `resolve` callback because we're using our custom handler
          data => {
            expect(sws.accessToken).not.to.equal(newAccessTokenValue)
            expect(data).to.equal(`${customHandlerResponse} 400`)
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
    })
  })

  describe('successfully updates expired access token', function () {
    const testCases = [
      { useTokenRotation: true },
      { useTokenRotation: false }
    ]
  
    testCases.forEach(({ useTokenRotation }) => {
      it(`Calls 'accessTokenUpdatedHandler' handler after successfully updating access token ${useTokenRotation ? 'with' : 'without'} refresh token rotation`, function () {
        // FYI, JS timestamps use milliseconds but our web service returns timestamps in seconds
        // The SwsClient under test has code that coverts a server timestamp into a JavaScript date.
        // So this test includes some maths that takes that into account
        let accessTokenExpiresAt = new Date(Date.now() + 3600000) // Add 1 hour (in milliseconds)
        let refreshTokenExpiresAt = new Date(Date.now() + 24 * 3600000)
        let refreshTokenUri = useTokenRotation ? '/api/v2/tokens/refresh' : '/api/v1/tokens/refresh'
        let scope = nock(/serato/)
          .get(getLicensesUri, '')
          .reply(403, { 'code': 2001, 'error': 'Invalid Access token' })
          .post(refreshTokenUri)
          .reply(200, {
            access: {
              token: newAccessTokenValue,
              expires_at: accessTokenExpiresAt.valueOf() / 1000 // Convert to second-based unix timestamp
            },
            refresh: {
              token: newRefreshTokenValue,
              expires_at: refreshTokenExpiresAt.valueOf() / 1000
            }
          })
          .get(getLicensesUri, '')
          .reply(200, { some: 'response' })
  
        let accessTokenUpdatedHandler = (accessToken, accessTokenExpires, refreshToken, refreshTokenExpires) => {
          expect(accessToken).to.equal(newAccessTokenValue)
          expect(accessTokenExpires.valueOf()).to.eql(accessTokenExpiresAt.valueOf())
          expect(refreshToken).to.equal(newRefreshTokenValue)
          expect(refreshTokenExpires.valueOf()).to.equal(refreshTokenExpiresAt.valueOf())
        }
  
        let sws = new SwsClient({ appId: appId }, useTokenRotation)
        sws.accessTokenUpdatedHandler = accessTokenUpdatedHandler
  
        return sws.license.getLicenses().then(
          // Should always hit the `resolve` callback because we're using our custom handler
          data => {
            expect(sws.accessToken).to.equal(newAccessTokenValue)
            expect(scope.isDone()).to.equal(true)
          },
          // Should never hit the `reject` callback
          err => {
            let error = new Error(`Expected error to be handled by custom serviceErrorHandler callback`)
            error.error = err
            return Promise.reject(error)
          }
        )
      })
    })
  })
})
