'use strict'

import Service from './Service'

/**
 * @typedef Avatar
 * @property {Number} ts A timestamp of the creation date of the current avatar image. `0` when the default avatar is used.
 * @property {String} thumb The URL of the thumbnail avatar image.
 * @property {String} mid The URL of the mid-sized avatar image.
 * @property {String} full The URL of the full size avatar image.
 *
 * @typedef TwitchChannel
 * @property {String} id Twitch channel ID.
 * @property {String} display_name Twitch channel display name.
 * @property {String} name Twitch channel name.
 * @property {String} url Twitch channel URL.
 * @property {String} logo Twitch channel logo URL.
 * @property {String} description Twitch description.
 *
 * @typedef TwitchExtension
 * @property {String} id
 * @property {String} name
 *
 * @typedef Twitch
 * @property {TwitchChannel} channel
 * @property {TwitchExtension[]} extensions
 *
 * @typedef {Object} Profile
 * @property {Number} user_id
 * @property {String} email_address
 * @property {Number} global_contact_status
 * @property {Boolean} [notify_tracked = undefined] notify_tracked
 * @property {Boolean} [notify_private_message = undefined] notify_private_message
 * @property {Boolean} [auto_subscribe = undefined] auto_subscribe
 * @property {Boolean} [auto_read = undefined] auto_read
 * @property {Number} [threads_per_page = undefined] threads_per_page
 * @property {String} [language = undefined] language
 * @property {String} [first_name = undefined] first_name
 * @property {String} [last_name = undefined] last_name
 * @property {String} [dj_name = undefined] dj_name
 * @property {String} [locale = undefined] locale ISO 15897 locale string.
 * @property {String} [address_1 = undefined] address_1
 * @property {String} [address_2 = undefined] address_2
 * @property {String} [city = undefined] city
 * @property {String} [region = undefined] region Region/state/province
 * @property {String} [postcode = undefined] postcode
 * @property {String} [country_code = undefined] country_code
 * @property {String} [company = undefined] company
 * @property {String} [date_created = undefined] date_created Date created timestamp in ISO 8601 format.
 * @property {String} [date_updated = undefined] date_updated Date updated timestamp in ISO 8601 format.
 * @property {String} [display_name = undefined] display_name
 * @property {Avatar} [avatar = undefined] avatar
 * @property {Number} [edit_avatar_disabled = undefined] edit_avatar_disabled
 * @property {Twitch} [twitch = undefined] twitch
 *
 * @typedef {Object} ProfileList
 * @property {Profile[]} items
 *
 * @typedef {Object} FileUploadUrl
 * @property {String} method The HTTP method to use for the file upload.
 * @property {String} url The URL for the file upload.
 * @property {String} expires The expiry time of the upload URL.
 *
 * @typedef {Object} BetaProgram
 * @property {String} id
 * @property {String} name
 * @property {Boolean} active Indicates whether or not new memberships are allowed for the beta program.
 * @property {String[]} qualifying_license_type_ids A list of license type IDs, at least one of which of user must own to qualify for the beta program.
 * @property {String[]} [memberships_groups = undefined] memberships_groups A list of user groups to which a user is added when joining a beta program.
 * @property {String} download_url The download URL for the beta application.
 *
 * @typedef {Object} BetaProgramList
 * @property {BetaProgram[]} items
 *
 * @typedef {Object} UserBetaProgram
 * @property {BetaProgram} beta_program
 * @property {Boolean} active
 * @property {Boolean} banned
 *
 * @typedef {Object} UserBetaProgramList
 * @property {UserBetaProgram[]} items
 *
 * @typedef {Object} PartnerPromotionCode
 * @property {Number} user_id
 * @property {String} promotion_code
 * @property {String} promotion_name
 * @property {String} user_added_at The date the user acquired the promotion code expressed in ISO 8601 format.
 *
 * @typedef {Object} PartnerPromotionCodeList
 * @property {PartnerPromotionCode[]} items
 */

/**
 * Profile Service class
 *
 * Exposes SWS Profile Service API endpoints via class methods
 */
export default class ProfileService extends Service {
  /**
   * Constructor
   *
   * @param {Sws} Sws Configured Sws instance
   * @return {void}
   */
  constructor (Sws) {
    super(Sws)
    this._serviceUri = Sws.serviceUri.profile
  }

  /**
   * Returns a list of user profiles.
   *
   * @param {Object} param
   * @param {String} param.emailAddress
   * @returns {Promise<ProfileList>}
   */
  getProfiles ({ emailAddress }) {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      '/api/v1/users',
      this.toBody({
        email_address: emailAddress
      }),
      'GET'
    )
  }

  /**
   * Returns a user profile.
   *
   * @param   {Object} [param = undefined] param
   * @param   {Boolean} [param.useMe = undefined] param.useMe
   * @returns {Promise<Profile>}
   */
  getProfile ({ useMe } = {}) {
    if (useMe === undefined) {
      useMe = false
    }
    return this.fetch(
      this.bearerTokenAuthHeader(),
      this.userId === 0 || useMe ? '/api/v1/me' : '/api/v1/users/' + this.userId,
      null,
      'GET'
    )
  }

  /**
   * Updates a user profile.
   *
   * @param   {Object} param
   * @param   {Number} [param.globalContactStatus = undefined] param.globalContactStatus
   * @param   {String} [param.firstName = undefined] param.firstName
   * @param   {String} [param.lastName = undefined] param.lastName
   * @param   {String} [param.djName = undefined] param.djName
   * @param   {String} [param.locale = undefined] param.locale
   * @param   {String} [param.address1 = undefined] param.address1
   * @param   {String} [param.address2 = undefined] param.address2
   * @param   {String} [param.city = undefined] param.city
   * @param   {String} [param.region = undefined] param.region
   * @param   {Number} [param.postcode = undefined] param.postcode
   * @param   {String} [param.countryCode = undefined] param.countryCode
   * @param   {Boolean} [param.notifyTracked = undefined] param.notifyTracked
   * @param   {Boolean} [param.notifyPrivate = undefined] param.notifyPrivate
   * @param   {Boolean} [param.autoRead = undefined] param.autoRead
   * @param   {Boolean} [param.autoSubscribe = undefined] param.autoSubscribe
   * @param   {Number} [param.threadsPerPage = undefined] param.threadsPerPage
   * @param   {String} [param.language = undefined] param.language
   * @param   {String} [param.displayName = undefined] param.displayName
   * @param   {String} [param.company = undefined] param.company
   * @returns {Promise<Profile>}
   */
  updateProfile ({
    globalContactStatus,
    firstName,
    lastName,
    djName,
    locale,
    address1,
    address2,
    city,
    region,
    postcode,
    countryCode,
    notifyTracked,
    notifyPrivate,
    autoRead,
    autoSubscribe,
    threadsPerPage,
    language,
    displayName,
    company,
    daw
  }) {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      this.userId === 0 ? '/api/v1/me' : '/api/v1/users/' + this.userId,
      this.toBody({
        global_contact_status: globalContactStatus,
        first_name: firstName,
        last_name: lastName,
        dj_name: djName,
        locale: locale,
        address_1: address1,
        address_2: address2,
        city: city,
        region: region,
        postcode: postcode,
        country_code: countryCode,
        notify_tracked: notifyTracked,
        notify_private: notifyPrivate,
        auto_read: autoRead,
        auto_subscribe: autoSubscribe,
        threads_per_page: threadsPerPage,
        language: language,
        display_name: displayName,
        company: company,
        daw: daw
      }),
      'PUT'
    )
  }

  /**
   * Return a user's profile.
   *
   * @param   {Object} param
   * @param   {String} param.uploadType
   * @param   {String} param.contentType
   * @returns {Promise<FileUploadUrl>}
   */
  createUploadUrl ({ uploadType, contentType }) {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      this.userId === 0 ? '/api/v1/me/fileuploadurl' : '/api/v1/users/' + this.userId + '/fileuploadurl',
      this.toBody({
        upload_type: uploadType,
        content_type: contentType
      }),
      'POST'
    )
  }

  /**
   * Sets a user's avatar to a previously uploaded file.
   *
   * @returns {Promise<Avatar>}
   */
  updateAvatar () {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      this.userId === 0 ? '/api/v1/me/avatar' : '/api/v1/users/' + this.userId + '/avatar',
      null,
      'PUT'
    )
  }

  /**
   * Deletes a user's avatar.
   *
   * @returns {Promise<Avatar>}
   */
  deleteAvatar () {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      this.userId === 0 ? '/api/v1/me/avatar' : '/api/v1/users/' + this.userId + '/avatar',
      null,
      'DELETE'
    )
  }

  /**
   * Return All Serato Beta Program.
   *
   * @returns {Promise<BetaProgramList>}
   */
  getAllBetaPrograms () {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      '/api/v1/betaprograms',
      null,
      'GET'
    )
  }

  /**
   * Return Serato Beta Program memberships for a user.
   *
   * @returns {Promise<UserBetaProgramList>}
   */
  getBetaPrograms () {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      this.userId === 0 ? '/api/v1/me/betaprograms' : '/api/v1/users/' + this.userId + '/betaprograms',
      null,
      'GET'
    )
  }

  /**
   * Adds a user to a beta program.
   *
   * @param   {Object} param
   * @param   {String} param.betaProgramId
   * @returns {Promise<UserBetaProgram>}
   */
  addBetaProgram ({ betaProgramId }) {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      this.userId === 0 ? '/api/v1/me/betaprograms' : '/api/v1/users/' + this.userId + '/betaprograms',
      this.toBody({
        beta_program_id: betaProgramId
      }),
      'POST'
    )
  }

  /**
   * Deletes a user's betaprogram
   *
   * @param   {Object} param
   * @param   {Boolean} param.betaProgramId
   * @returns {Promise}
   */
  deleteBetaProgram ({ betaProgramId }) {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      this.userId === 0 ? '/api/v1/me/betaprograms/' + betaProgramId : '/api/v1/users/' + this.userId + '/betaprograms/' + betaProgramId,
      null,
      'DELETE'
    )
  }

  /**
   * Re-validate all Serato Beta Program memberships for the authenticated client user.
   * Then return a user's betaPrograms object with all the betaPrograms of this user.
   *
   * @returns {Promise<UserBetaProgramList>}
   */
  validateAllBetaPrograms () {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      this.userId === 0 ? '/api/v1/me/betaprograms/validateall' : '/api/v1/users/' + this.userId + '/betaprograms/validateall',
      null,
      'POST'
    )
  }

  /**
   * Sends a survey result.
   *
   * @param   {Object} param
   * @param   {Object} param.survey
   * @returns {Promise}
   */
  addSurvey ({ survey }) {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      this.userId === 0 ? '/api/v1/me/survey' : '/api/v1/users/' + this.userId + '/survey',
      this.toBody({
        survey: survey
      }),
      'POST'
    )
  }

  /**
  * Gets whether we can track this user without explicit consent
  * Based on IP address
  *
  * @returns {Promise}
  */
  trackingAllowed () {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      '/api/v1/allowtracking',
      null,
      'GET'
    )
  }

  /**
   * Gets a list of a user's partner promotions.
   *
   * @returns {Promise<PartnerPromotionCodeList>}
   */
  getPartnerPromotions () {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      this.userId === 0 ? '/api/v1/me/partnerpromotions' : '/api/v1/users/' + this.userId + '/partnerpromotions',
      null,
      'GET'
    )
  }

  /**
   * Adds a user to a partner promotion.
   *
   * @param   {Object} param
   * @param   {String} param.userId
   * @param   {String} param.promotionName
   * @returns {Promise<PartnerPromotionCode>}
   */
  partnerPromotionAddUser ({ userId, promotionName }) {
    return this.fetch(
      this.basicAuthHeader(),
      '/api/v1/partnerpromotions/code',
      this.toBody({
        user_id: userId,
        promotion_name: promotionName
      }),
      'POST'
    )
  }
}
