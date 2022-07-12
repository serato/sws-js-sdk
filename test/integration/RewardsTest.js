import Sws from '../../src/index'
import { describe, it, before } from 'mocha'
import { expect } from 'chai'

describe('Rewards Tests', function () {
  describe('Timeout', function () {
    it(`tests handling timeout on accessing /rewards endpoint`, function () {
      let sws = new Sws({ appId: 'myClientAppId', timeout: 1 })
      return sws.rewards.getRewards().then().catch((err) => {
        expect(err.code).to.equal('ECONNABORTED')
      })
    })
  })

  let swsClient
  before(function () {
    swsClient = new Sws({ appId: 'myClientAppId' })
  })

  describe('Rewards URI Validation Tests', function () {
    it(`confirms URI used in 'getRewards()' method with no user ID, by returning a non-404 HTTP response`,
      function () {
        swsClient.userId = 0
        return swsClient.rewards.getRewards().then(
          () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
          err => {
            expect(err.httpStatus).not.to.equal(404)
          }
        )
      })

    it(`confirms URI used in 'getRewards()' method with user ID, by returning a non-404 HTTP response`,
      function () {
        swsClient.userId = 123
        return swsClient.rewards.getRewards().then(
          () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
          err => {
            expect(err.httpStatus).not.to.equal(404)
          }
        )
      })
    
      it(`confirms URI used in 'getReferalCampaigns()' method by returning a 200 HTTP response`,
        function () {
          return swsClient.rewards.getReferalCampaigns().then(
            response => {
              expect(response).to.be.a('object')
            }
          )
        }
      )

    it(`confirms URI used in 'getReferalCampaign()' method with Campaign Id by returning a 200 HTTP response`,
      function () {
        return swsClient.rewards.getReferalCampaign({id: 1}).then(
          response => {
            expect(response).to.be.a('array')
          }
        )
      }
    )

    it(`confirms URI used in 'getReferrerParticipation()' method with no user id and campaign id , by returning a non-404 HTTP response`,
      function () {
        swsClient.userId = 0
        return swsClient.rewards.getReferrerParticipation({id: 1}).then(
          () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
          err => {
            expect(err.httpStatus).not.to.equal(404)
          }
        )
      }
    )

    it(`confirms URI used in 'getReferrerParticipation()' method with Campaign Id, by returning a non-404 HTTP response`,
      function () {
        swsClient.userId = 123
        return swsClient.rewards.getReferrerParticipation({id: 1}).then(
          () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
          err => {
            expect(err.httpStatus).not.to.equal(404)
          }
        )
      }
    )

    it(`confirms URI used in 'getUsageOfReferralCode()' method with Campaign Id, by returning a non-404 HTTP response`,
      function () {
        return swsClient.rewards.getUsageOfReferralCode({code: 'testcode', userId: 1}).then(
          response => {
            expect(response).to.be.a('object')
          }
        )
      }
    )

    it(`confirms URI used in 'addReferralCampaignActivityLog()' method with Campaign Id, by returning a non-404 HTTP response`,
      function () {
        return swsClient.rewards.addReferralCampaignActivityLog({
          code: 'testcode',
          referrerUserId: 123,
          productId: 123
        }).then(
          response => {
            // console.log(response)
          }
        )
      }
    )  
  })
})
