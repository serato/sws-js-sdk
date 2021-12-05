'use strict'

import Service from './Service'
import Sws from './Sws'

/**
 * @typedef {'sale' | 'generic' | 'none'} MessageType
 * @typedef {'text/plain'} MessageContentType
 * @typedef {'img' | 'video' | ''} MediaType
 *
 * @typedef {Object} Schedule
 * @property {String} id
 * @property {String} campaign_id
 * @property {String} starts_at
 * @property {String} ends_at
 *
 * @typedef {Object} Campaign
 * @property {String} id
 * @property {String} name
 * @property {String} description
 * @property {Schedule} [current_schedule = undefined] current_schedule
 *
 * @typedef {Object} MessageV1Body
 * @property {MessageContentType} content_type
 * @property {String} content
 *
 * @typedef {Object} MessageV1Action
 * @property {String} cta
 * @property {String} [url = undefined] url
 *
 * @typedef {Object} MessageV2Action
 * @property {String} url
 *
 * @typedef {Object} Media
 * @property {MediaType} type
 * @property {String} url
 * @property {Object<string, string>} [metadata = undefined] metadata
 *
 * @typedef {Object} MessageV1
 * @property {MessageType} type
 * @property {String} title
 * @property {MessageV1Body} body
 * @property {MessageV1Action[]} actions
 *
 * @typedef {Object} MessageV2
 * @property {MessageType} type
 * @property {String} title
 * @property {MessageV2Action[]} actions
 * @property {Media} media
 *
 * @typedef {Object} MessageVersions
 * @property {MessageV1} v1
 * @property {MessageV2} v2
 *
 * @typedef {Object} Message
 * @property {String} id
 * @property {Number} sequence
 * @property {String} language
 * @property {MessageVersions} versions
 *
 * @typedef {Object} Notification
 * @property {Campaign} campaign
 * @property {Message} message
 *
 * @typedef {Object} NotificationList
 * @property {Notification[]} items
 */

/**
 * Notifications Service V1 class
 */
export default class NotificationsV1Service extends Service {
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
   * Retrieve a list of notifcations for a client application.
   * Does not require authorization.
   *
   * @param  {Object} [params = undefined] params Input parameter object
   * @param  {String} [params.hostAppName = undefined] params.hostAppName Host app name to filter the results by
   * @param  {String} [params.hostAppVersion = undefined] params.hostAppVersion Host app version to filter by
   * @param  {String} [params.hostAppOs = undefined] params.hostAppOs Host app operating system to filter by
   * @param  {String} [params.locale = undefined] params.locale Locale of the client to indicate content language preference
   * @return {Promise<NotificationList>}
   */
  getNotifications ({ hostAppName, hostAppVersion, hostAppOs, locale } = {}) {
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
