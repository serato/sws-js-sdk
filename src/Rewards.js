'use strict'

import Service from './Service'

/**
 * Rewards Service class
 *
 * Exposes SWS Rewards Service API endpoints via class methods
 */
export default class Rewards extends Service {
  /**
   * Constructor
   *
   * @param {Sws} Sws Configured Sws instance
   * @return {void}
   */
  constructor (Sws) {
    super(Sws)
    this._serviceUri = Sws.serviceUri.rewards
  }

  /**
   * Return rewards owned by a user.
   * Requires a valid access token.
   *
   * @returns {Promise}
   */
  getRewards () {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      this.userId === 0 ? '/api/v1/me/rewards' : '/api/v1/users/' + this.userId + '/rewards',
      null
    )
  }

  /**
   * Returns information about all Referral Campaigns.
   * @returns {Promise}
   */
  getReferalCampaigns () {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      '/api/v1/referralcampaigns',
      null,
      'GET'
    )
  }

  /**
   * Returns information about a specific Referral Campaign
   * @param {Object} params - Input parameter object
   * @param {Int} params.id - Campaign id
   * @returns {Promise}
   */
  getReferalCampaign ({ id }) {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      `/api/v1/referralcampaigns/${id}`,
      null,
      'GET'
    )
  }

  /**
   * Returns information about a Referrer’s participation in a Referral Campaign
   * @param {Object} params - Input parameter object
   * @param {Int} params.id - Campaign id
   * @returns {Promise}
   */
  getReferrerParticipation ({ id }) {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      this.userId === 0 ? `/api/v1/me/referralcampaign/${id}` : `/user/${this.userId}/referralcampaign/${id}`,
      null,
      'GET'
    )
  }

  /**
   * Returns information about a Referee’s usage of the Referral Code
   * @param {Object} params       - Input parameter object
   * @param {String} params.code  - Referral code
   * @param {Int} params.userId  - Referral code
   * @returns {Promise}
   */
  getUsageOfReferralCode ({ code, userId }) {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      `/referralcode/${code}/referee/${userId}`,
      null,
      'GET'
    )
  }

  /**
   * Returns Logs a Referral Campaign activity
   * @param {Object} params             - Input parameter object
   * @param {String} params.code        - Referral code
   * @param {Int} params.referrerUserId - Referral user id
   * @param {Int} params.refereeUserId  - Referee user id
   * @param {String} params.voucherId   - Voucher id
   * @param {String} params.productId   - Product type id
   * @return {Promise}
   */
  addReferralCampaignActivityLog ({
    code,
    referrerUserId,
    refereeUserId,
    voucherId,
    productId
  }) {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      `/referralcode/${code}/log`,
      this.toBody({
        referrer_user_id: referrerUserId,
        referee_user_id: refereeUserId,
        voucher_id: voucherId,
        product_id: productId
      }),
      'POST'
    )
  }
}
