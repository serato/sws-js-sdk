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
   *
   * @param  {Object} params - Input parameter object
   * @param  {?String} params.hostAppName - Host app name to filter the results by
   * @param  {?String} params.hostAppVersion - Host app version to filter by
   * @param  {?String} params.hostAppOs - Host app operating system to filter by
   * @param  {?String} params.locale - Locale of the client to indicate content language preference
   * @return {Promise}
   */
  getNotifications ({ hostAppName = null, hostAppVersion = null, hostAppOs = null, locale = null }) {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      '/api/v1/notifications',
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
