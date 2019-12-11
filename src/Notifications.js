'use strict'

import Service from './Service'

/**
 * Notifications Service class
 *
 * Exposes SWS Notifications Service API endpoints via class methods
 */
export default class Notifications extends Service {
  /**
   * Constructor
   *
   * @param {Sws} Sws Configured Sws instance
   * @return {void}
   */
  constructor (Sws) {
    super(Sws)
    this._serviceUri = Sws.serviceUri.notifications
  }

  /**
   * Retrieve a list of notifcations to a client application.
   * @param  {String} hostAppName
   * @param  {String} hostAppVersion
   * @param  {String} hostAppOs
   * @param  {String} locale
   * @return {Promise}
   */
  getNotifications ({ hostAppName, hostAppVersion, hostAppOs, locale } = {}) {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      '/api/v1/notifcations',
      this.toBody({
        'host_app_name': hostAppName,
        'host_app_version': hostAppVersion,
        'host_app_os': hostAppOs,
        'locale': locale
      }),
      'GET'
    )
  }
}
