'use strict'

import Service from './Service'
/**
 * Profile Service class
 *
 * Exposes SWS Profile Service API endpoints via class methods
 */
export default class Profile extends Service {
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
   * Returns Product Recommendations for given user.
   * Requires a valid access token.
   *
   * @param {Object} param
   * @param {String} param.emailAddress
   * @returns {Promise}
   */
  getUsers ({ emailAddress = null } = {}) {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      '/api/v1/users',
      this.toBody({
        'email_address': emailAddress
      }),
      'GET'
    )
  }

  /**
   * Return a user's profile.
   * Requires a valid access token.
   *
   * @param   {Object} param
   * @param   {Boolean} param.useMe
   * @returns {Promise}
   */
  getProfile ({ useMe = false } = {}) {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      this.userId === 0 || useMe ? '/api/v1/me' : '/api/v1/users/' + this.userId,
      null,
      'GET'
    )
  }

  /**
   * Update a user's profile.
   * Requires a valid access token
   * @param   {Object} param
   * @param   {Number} param.globalContactStatus
   * @param   {String} param.firstName
   * @param   {String} param.lastName
   * @param   {String} param.djName
   * @param   {String} param.locale
   * @param   {String} param.address1
   * @param   {String} param.address2
   * @param   {String} param.city
   * @param   {String} param.region
   * @param   {Number} param.postCode
   * @param   {String} param.country
   * @param   {Boolean} param.notifyTracked
   * @param   {Boolean} param.notifyPrivate
   * @param   {Boolean} param.autoRead
   * @param   {Boolean} param.autoSubscribe,
   * @param   {Number} param.threadsPerPage
   * @param   {String} param.language
   * @param   {String} param.displayName
   * @returns {Promise}
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
    postCode,
    country,
    notifyTracked,
    notifyPrivate,
    autoRead,
    autoSubscribe,
    threadsPerPage,
    language,
    displayName
  }
  = {}
  ) {
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
        post_code: postCode,
        country: country,
        notify_tracked: notifyTracked,
        notify_private: notifyPrivate,
        auto_read: autoRead,
        auto_subscribe: autoSubscribe,
        threads_per_page: threadsPerPage,
        language: language,
        display_name: displayName
      }),
      'PUT'
    )
  }

  /**
   * Return a user's profile.
   * Requires a valid access token.
   *
   * @param   {Object} param
   * @param   {String} param.uploadType
   * @param   {String} param.contentType
   * @returns {Promise}
   */
  createUploadUrl ({ uploadType, contentType } = {}) {
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
   * Sets a user's avatar to an file that exists in a known location.
   *
   * @returns {Promise}
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
   * Deletes a user's avatar
   *
   * @returns {Promise}
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
   * Requires a valid access token.
   *
   * @returns {Promise}
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
   * Return Serato Beta Program memberships to a specified user.
   * Requires a valid access token.
   *
   * @returns {Promise}
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
   * Adding a betaPrograms to a specified user
   * Then return a user's betaPrograms object with all the betaPrograms of this user.
   * Requires a valid access token.
   *
   * @param   {Object} param
   * @param   {String} param.betaProgramId
   * @returns {Promise}
   */
  addBetaProgram ({ betaProgramId } = {}) {
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
  deleteBetaProgram ({ betaProgramId } = {}) {
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
   * Requires a valid access token.
   *
   * @returns {Promise}
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
   * Sends a survey to be written into cloudwatch logs.
   * Requires a valid access token.
   *
   * @param   {Object} param
   * @param   {Object} param.survey
   * @returns {Promise}
   */
  addSurvey ({ survey } = {}) {
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
   * Gets a list of a user's partner promotions.
   * Requires a valid access token.
   *
   * @returns {Promise}
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
   * @returns {Promise}
   */
  partnerPromotionAddUser ({ userId, promotionName } = {}) {
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
