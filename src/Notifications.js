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
   * Does not require authorization.
   *
   * NOTE: This is the client app variant of the method. For the management variant, see `adminGetNotifications`.
   *
   * @param  {Object} params - Input parameter object
   * @param  {?String} [params.hostAppName = null]    - Host app name to filter the results by
   * @param  {?String} [params.hostAppVersion = null] - Host app version to filter by
   * @param  {?String} [params.hostAppOs = null]      - Host app operating system to filter by
   * @param  {?String} [params.locale = null]         - Locale of the client to indicate content language preference
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

  /**
   * Retrieve a list of campaigns.
   * Requires a valid access token.
   *
   * @param {Object} params - Input parameter object
   * @param {?String} [params.status] - Status of the campaign to filter by. Must be one of 'active', 'draft' or
   *                                           'archived' if set
   * @return {Promise}
   */
  getCampaigns ({ status = null }) {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      '/api/v2/campaigns',
      this.toBody({
        'status': status
      }),
      'GET'
    )
  }

  /**
   * Creates a campaign.
   * Requires a valid access token.
   *
   * @param {Object}  params - Input parameter object
   * @param {String}  params.name          - Name of the campaign. Must be a non empty string
   * @param {Boolean} params.anonymous     - Whether the notifications for the campaign are anonymous or not
   * @param {?String} [params.description] - Description of the campaign
   *
   * @return {Promise}
   */
  createCampaign ({ name, anonymous, description = null }) {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      '/api/v2/campaigns',
      this.toBody({
        'name': name,
        'description': description,
        'anonymous': anonymous
      }),
      'POST'
    )
  }

  /**
   * Updates attributes of a campaign.
   * Requires a valid access token.
   *
   * @param {Object}   params - Input parameter object
   * @param {String}   params.campaignId           - ID of the campaign to update
   * @param {?String}  [params.name]        - Name of the campaign. Must be a non empty string if provided
   * @param {?Boolean} [params.anonymous]   - Whether the notifications for the campaign are anonymous or not
   * @param {?String}  [params.description] - Description of the campaign
   * @param {?String}  [params.status]      - Status of the campaign. Must be one of 'active',
   *                                                'draft' or 'archived'
   *
   * @return {Promise}
   */
  updateCampaign ({ campaignId, name = null, anonymous = null, description = null, status = null }) {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      `/api/v2/campaigns/${campaignId}`,
      this.toBody({
        'name': name,
        'description': description,
        'anonymous': anonymous,
        'status': status
      }),
      'PUT'
    )
  }

  /**
   * Lists all notifications.
   * Requires a valid access token.
   *
   * NOTE: This is the management variant of the method. The use-case and schema are different to `getNotifications`
   *
   * @return {Promise}
   */
  adminGetNotifications () {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      '/api/v2/notifications',
      null,
      'GET'
    )
  }

  /**
   * Create a notification for a campaign.
   * Requires a valid access token.
   *
   * @param {Object}  params                - Input parameter object
   * @param {String}  params.campaignId     - ID of the campaign to create the notification for
   * @param {String}  params.type           - The type (category) of the notification. Must be one of 'licensing',
   *                                          'system', 'promotion', 'streaming' or 'device_connection'
   * @param {Number}  params.priority       - An integer that indicates the priority of the notification
   * @param {String}  params.templateName   - Name of the notification template that will be used on the client app
   * @param {String}  params.templateOption - The variant (colours etc) of the template to use
   * @param {?Date}   [params.startsAt]     - The date/time that the notification is valid from
   * @param {?Date}   [params.endsAt]       - The date/time that the notificaiton is valid until
   * @param {?String} [params.takeoverId]   - ID used to takeover a static notification on a client app
   *
   * @return {Promise}
   */
  createNotification ({
    campaignId,
    type,
    priority,
    templateName,
    templateOption,
    startsAt = null,
    endsAt = null,
    takeoverId = null
  }) {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      '/api/v2/notifications',
      this.toBody({
        'campaign_id': campaignId,
        'type': type,
        'priority': priority,
        'template_name': templateName,
        'template_option': templateOption,
        'starts_at': startsAt,
        'ends_at': endsAt,
        'takeover_id': takeoverId
      }),
      'POST'
    )
  }

  /**
   * Updates attributes of a notification.
   * Requires a valid access token.
   *
   * @param {Object}  params                  - Input parameter object
   * @param {String}  params.notificationId   - ID of the notification to update
   * @param {String}  [params.type]           - The type (category) of the notification. Must be one of 'licensing',
   *                                          'system', 'promotion', 'streaming' or 'device_connection'
   * @param {Number}  [params.priority]       - An integer that indicates the priority of the notification
   * @param {String}  [params.templateName]   - Name of the notification template that will be used on the client app
   * @param {String}  [params.templateOption] - The variant (colours etc) of the template to use
   * @param {?Date}   [params.startsAt]       - The date/time that the notification is valid from
   * @param {?Date}   [params.endsAt]         - The date/time that the notificaiton is valid until
   * @param {?String} [params.takeoverId]     - ID used to takeover a static notification on a client app
   * @param {?String} [params.status]         - Status of the notification. Must be one of 'active', 'draft' or
   *                                            'archived'
   *
   * @return {Promise}
   */
  updateNotification ({
    notificationId,
    type = null,
    priority = null,
    templateName = null,
    templateOption,
    startsAt = null,
    endsAt = null,
    takeoverId = null,
    status = null
  }) {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      `/api/v2/notifications/${notificationId}`,
      this.toBody({
        'type': type,
        'priority': priority,
        'template_name': templateName,
        'template_option': templateOption,
        'starts_at': startsAt,
        'ends_at': endsAt,
        'takeover_id': takeoverId,
        'status': status
      }),
      'PUT'
    )
  }

  /**
   * Gets the host specifications for a notification.
   * Requires a valid access token.
   *
   * @param {Object} params                - Input parameter object
   * @param {String} params.notificationId - ID of the notification to get the hosts app specifications for
   *
   * @return {Promise}
   */
  getNotificationHostSpecifications ({ notificationId }) {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      `/api/v2/notifications/${notificationId}/hosts`,
      null,
      'GET'
    )
  }
}
