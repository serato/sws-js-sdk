'use strict'

import Service from './Service'

/**
 * @typedef {Object} CallToAction
 * @property {String} primary_cta Primary call to action link text
 * @property {String} primary_cta_link Primary call to action link
 * @property {String} primary_cta_prefix Primary call to action pre-text
 * @property {String} primary_cta_postfix Primary call to action post-text
 * @property {String} [secondary_cta = undefined] secondary_cta Secondary call to action text
 * @property {String} [secondary_cta_link = undefined] secondary_cta_link Secondary call to action link
 *
 * @typedef {Object} TemplateLogo
 * @property {String} dark URL for dark theme image logo
 * @property {String} light URL for light theme image logo
 *
 * @typedef {Object} Template
 * @property {'light'|'dark'} type The theme used in the template
 * @property {TemplateLogo} logos Logos used by the template
 * @property {String} [background_colour = undefined] background_colour Background color
 * @property {String} [background_image_url = undefined] background_image_url URL of background image
 *
 * @typedef {Object} Reward
 * @property {String} name Reward name
 * @property {String} headline Reward headline
 * @property {String} description Description
 * @property {Boolean} unlocked Has the user unlocked the reward?
 * @property {CallToAction} cta Call to action details
 * @property {Boolean} latest_ribbon Rewards is displayed in `latest` section
 * @property {String[]} tags Tags
 * @property {Template} template Template details
 *
 * @typedef {Object} RewardList
 * @property {Reward[]} items List of rewards
 */

/**
 * Rewards Service class
 *
 * Exposes SWS Rewards Service API endpoints via class methods
 */
export default class RewardsService extends Service {
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
   *
   * @returns {Promise<RewardList>}
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
   getReferralCampaigns () {
    return this.fetch(
      null,
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
   getReferralCampaign ({ id }) {
    return this.fetch(
      null,
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
  getReferrerCampaignDetailsById ({ id }) {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      this.userId === 0 ? `/api/v1/me/referralcampaign/${id}` : `/api/v1/users/${this.userId}/referralcampaign/${id}`,
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
   getRefereeEligibilityByReferralCode ({ code, userId }) {
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
    productId,
    voucherTypeId,
    voucherBatchId
  }) {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      `/referralcode/${code}/log`,
      this.toBody({
        referrer_user_id: referrerUserId,
        referee_user_id: refereeUserId,
        voucher_id: voucherId,
        product_id: productId,
        voucher_type_id: voucherTypeId,
        voucher_batch_id: voucherBatchId
      }),
      'POST'
    )
  }
}
