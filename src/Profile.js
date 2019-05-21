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
   * @param   {String} param.displayName
   * @param   {String} param.language
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
}
