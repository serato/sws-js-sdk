import Sws from '../../src/index'
import {describe, it, before} from 'mocha'
import {expect} from 'chai'

describe('Notifications Tests', function () {
    let swsClient
    before(function () {
        swsClient = new Sws({appId: 'myClientAppId'})
    })

    describe('Notifications URI Validation Tests', function () {
        it(`confirms URI used in 'getNotifications()' method by returning a non-404 HTTP response`,
            function () {
                return swsClient.notifications.getNotifications({
                    hostAppName: 'serato_com',
                    hostAppVersion: 1,
                    hostAppOs: 'mac',
                    locale: 'en_US'
                }).then(
                    () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
                    err => {
                        expect(err.httpStatus).not.to.equal(404)
                    }
                )
            })
    })
})
