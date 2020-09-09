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
  getHostSpecifications ({ notificationId }) {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      `/api/v2/notifications/${notificationId}/hosts`,
      null,
      'GET'
    )
  }

  /**
   * Creates a host specification for a notification.
   * Requires a valid access token.
   *
   * @param {Object} params                  - Input parameter object
   * @param {String} params.notificationId   - ID of the notification to create the host specification for
   * @param {String} params.appName          - Name of the host app. Must be one of 'serato_dj_pro', 'serato_dj_lite',
   *                                           'serato_sample', 'serato_studio', 'my_account', 'express_checkout',
   *                                           'serato_com' or 'mega_nav'
   * @param {?String} [params.appVersionMin] - The minimum version of the host application which the notification is
   *                                           compatible with. Must be a string that comprises 1 - 4 dot-separated
   *                                           integer values. 0 means any version.
   * @param {?String} [params.appVersionMax] - The exclusive maximum version of the host application which the
   *                                           notification is compatible with. Must be a string that comprises 1 - 4
   *                                           dot-separated integer values. 0 means any version.
   * @param {?String} [params.osName]        - The name of the host operating system. Possible values are 'mac', 'win'
   *                                           and (empty means all operating systems).
   * @param {?String} [params.osVersionMin]  - The minimum version of the host operating system which the notification
   *                                           is compatible with. Must be a string that comprises 1 - 4 dot-separated
   *                                           integer values in the format major.minor.patch.build where major =>
   *                                           no range, minor => 0-99, patch => 0-999, build => 0-999999. 0 means any
   *                                           version.
   * @param {?String} [params.osVersionMax] - The exlusive maximum version of the host operating system which the
   *                                          notification is compatible with. Must be a string that comprises 1 - 4
   *                                          dot-separated integer values in the format major.minor.patch.build where
   *                                          major => no range, minor => 0-99, patch => 0-999, build => 0-999999.
   *                                          0 means any version.
   *
   * @return {Promise}
   */
  createHostSpecification ({
    notificationId,
    appName,
    appVersionMin = null,
    appVersionMax = null,
    osName = null,
    osVersionMin = null,
    osVersionMax = null
  }) {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      `/api/v2/notifications/${notificationId}/hosts`,
      this.toBody({
        'app_name': appName,
        'app_version_min': appVersionMin,
        'app_version_max': appVersionMax,
        'os_name': osName,
        'os_version_min': osVersionMin,
        'os_version_max': osVersionMax
      }),
      'POST'
    )
  }

  /**
   * Update attributes of a host specification for a notification.
   * Requires a valid access token.
   *
   * @param {Object} params                  - Input parameter object
   * @param {String} params.notificationId   - ID of the notification that the host specification belongs to
   * @param {String} params.hostId           - ID of the host specification to update
   * @param {?String} [params.appName]       - Name of the host app. Must be one of 'serato_dj_pro', 'serato_dj_lite',
   *                                           'serato_sample', 'serato_studio', 'my_account', 'express_checkout',
   *                                           'serato_com' or 'mega_nav'
   * @param {?String} [params.appVersionMin] - The minimum version of the host application which the notification is
   *                                           compatible with. Must be a string that comprises 1 - 4 dot-separated
   *                                           integer values. 0 means any version.
   * @param {?String} [params.appVersionMax] - The exclusive maximum version of the host application which the
   *                                           notification is compatible with. Must be a string that comprises 1 - 4
   *                                           dot-separated integer values. 0 means any version.
   * @param {?String} [params.osName]        - The name of the host operating system. Possible values are 'mac', 'win'
   *                                           and (empty means all operating systems).
   * @param {?String} [params.osVersionMin]  - The minimum version of the host operating system which the notification
   *                                           is compatible with. Must be a string that comprises 1 - 4 dot-separated
   *                                           integer values in the format major.minor.patch.build where major =>
   *                                           no range, minor => 0-99, patch => 0-999, build => 0-999999. 0 means any
   *                                           version.
   * @param {?String} [params.osVersionMax] - The exlusive maximum version of the host operating system which the
   *                                          notification is compatible with. Must be a string that comprises 1 - 4
   *                                          dot-separated integer values in the format major.minor.patch.build where
   *                                          major => no range, minor => 0-99, patch => 0-999, build => 0-999999.
   *                                          0 means any version.
   *
   * @return {Promise}
   */
  updateHostSpecification ({
    notificationId,
    hostId,
    appName = null,
    appVersionMin = null,
    appVersionMax = null,
    osName = null,
    osVersionMin = null,
    osVersionMax = null
  }) {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      `/api/v2/notifications/${notificationId}/hosts/${hostId}`,
      this.toBody({
        'app_name': appName,
        'app_version_min': appVersionMin,
        'app_version_max': appVersionMax,
        'os_name': osName,
        'os_version_min': osVersionMin,
        'os_version_max': osVersionMax
      }),
      'PUT'
    )
  }

  /**
   * Delete a host specification for a notification.
   * Requires a valid access token.
   *
   * @param {Object} params                - Input parameter object
   * @param {String} params.notificationId - Id of the notification that the host specification belongs to
   * @param {String} params.hostId         - ID of the host specification to delete
   *
   * @return {Promise}
   */
  deleteHostSpecification ({
    notificationId,
    hostId
  }) {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      `/api/v2/notifications/${notificationId}/hosts/${hostId}`,
      null,
      'DELETE'
    )
  }

  /**
   * Creates or update content for a notification. Creation occurs if no existing content. Content will be overwritten
   * if exists already and specified in the payload for this method.
   *
   * @param {Object} params                - Input parameter object
   * @param {String} params.notificationId - Notification to create/update content for
   * @param {String} params.language       - A two letter ISO 639-1 language code
   * @param {Object} params.content        - Object containing the content to create or update. For the full object
   * structure refer to: https://notifications.serato.com/api/v2/schema/json/content_create_update.json
   * @param {Array} [params.content.text]    - Array of text to create/update. Empty to remove existing text
   * @param {Array} [params.content.media]   - Array of media to create/update. Empty to remove existing media
   * @param {Array} [params.content.actions] - Array of actions to create/update. Empty to remove existing actions
   *
   * @return {Promise}
   */
  createOrUpdateNotificationContent ({
    notificationId,
    language,
    content
  }) {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      `/api/v2/notifications/${notificationId}/content/${language}`,
      this.toBody(content),
      'PUT'
    )
  }

  /**
   * Lists all the available notification templates.
   * Does not require authorization.
   *
   * @return {Promise}
   */
  getNotificationTemplates () {
    return this.fetch(
      null,
      '/api/v2/templates',
      null,
      'GET'
    )
  }
}
