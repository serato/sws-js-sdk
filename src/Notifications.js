'use strict'

import Service from './Service'

/**
 * @typedef {'active' | 'draft' | 'archived' | 'testing'} Status
 * @typedef {'licensing' | 'system' | 'promotion' | 'streaming' | 'device_connection'} NotificationType
 * @typedef {'text/plain' | 'text/html' | 'text/markdown'} TextContentType
 * @typedef {'image/jpeg' | 'image/gif' | 'image/png' | 'image/webp'} MediaContentType
 * @typedef {'mac' | 'win'} OsName
 * @typedef {'serato_dj_pro' | 'serato_dj_lite' | 'serato_sample' | 'serato_studio' | 'my_account' | 'express_checkout' | 'serato_com' | 'mega_nav'} AppName
 * @typedef {'en' | 'de' | 'fr' | 'es' | 'pt' | 'it' | 'ja' | 'zh'} Language
 * @typedef {'dark' | 'light' | 'dark-orange-button' | 'light-orange-button'} TemplateOptions
 *
 * @typedef {Object} MediaSource
 * @property {String} [small = undefined] small
 * @property {String} medium
 * @property {String} [large = undefined] large
 *
 * @typedef {Object<string, any>} Metadata
 *
 * @typedef {Object} Campaign
 * @property {String} id
 * @property {String} name
 * @property {String} [description = undefined] description
 * @property {String} uuid
 * @property {Boolean} anonymous
 * @property {Status} status
 * @property {String} [starts_at = undefined] starts_at
 * @property {String} [ends_at = undefined] ends_at
 * @property {String} created_at
 * @property {String} updated_at
 *
 * @typedef {Object} CampaignList
 * @property {Campaign[]} items
 *
 * @typedef {Object} Host
 * @property {String} id
 * @property {AppName} app_name
 * @property {String} app_version_min The minimum version of the host application which the notification is compatible with. This is an inclusive bound. Must be a string that comprises 1 - 4 dot-separated integer values. `0` means any version.
 * @property {String} app_version_max The maximum version of the host application which the notification is compatible with. This is an inclusive bound. Must be a string that comprises 1 - 4 dot-separated integer values. `0` means any version.
 * @property {OsName} os_name
 * @property {String} os_version_min A string that comprises 1 - 4 dot-separated integer values in the format `major.minor.patch.build` where `major` => no range, `minor` => 0-99, `patch` => 0-999, `build` => 0-999999.
 * @property {String} os_version_max A string that comprises 1 - 4 dot-separated integer values in the format `major.minor.patch.build` where `major` => no range, `minor` => 0-99, `patch` => 0-999, `build` => 0-999999.
 *
 * @typedef {Object} Text
 * @property {String} id
 * @property {TextContentType} mime_type
 * @property {String} content
 * @property {Metadata} metadata
 *
 * @typedef {Object} Media
 * @property {String} id
 * @property {MediaContentType} mime_type
 * @property {MediaSource} src
 * @property {Metadata} metadata
 *
 * @typedef {Object} Action
 * @property {String} id
 * @property {String} label
 * @property {String} url
 * @property {Metadata} metadata
 *
 * @typedef {Object} Content
 * @property {Language} language
 * @property {Text[]} text
 * @property {Media[]} [media = undefined] media
 * @property {Action[]} [action = undefined] action
 *
 * @typedef {Object} Notification
 * @property {String} id
 * @property {String} name
 * @property {Campaign} campaign
 * @property {Host[]} compatible_hosts
 * @property {Language[]} languages
 * @property {NotificationType} [type = undefined] type
 * @property {Number} priority Indicates that the priority of a notification within a campaign.
 * @property {String} [template_name = undefined] template_name
 * @property {String} [template_option = undefined] template_option The template option for displaying the notification in the client application.
 * @property {Boolean} is_takeover Indicates that the template referenced by `template_name` is a takeover template.
 * @property {Content[]} content
 * @property {Boolean} is_persistent Persistent notifications cannot be deleted.
 * @property {Status} status
 * @property {String} [starts_at = undefined] starts_at
 * @property {String} [ends_at = undefined] ends_at
 * @property {String} created_at
 * @property {String} updated_at
 *
 * @typedef {Object} NotificationList
 * @property {Notification[]} items
 *
 * @typedef {Object} TemplateHost
 * @property {AppName} app_name
 * @property {String} app_version_min The minimum version of the host application which the notification is compatible with. This is an inclusive bound. Must be a string that comprises 1 - 4 dot-separated integer values. `0` means any version.
 * @property {String} app_version_max The maximum version of the host application which the notification is compatible with. This is an inclusive bound. Must be a string that comprises 1 - 4 dot-separated integer values. `0` means any version.
 *
 * @typedef {Object} TemplateMetaData
 * @property {String} metadata_id The unique ID for the item. Used for mapping the item to a UI text element.
 * @property {Boolean} required
 * @property {Number} order The display order of items in the template.
 *
 * @typedef {Object} Template
 * @property {String} name
 * @property {String} description
 * @property {Boolean} is_takeover
 * @property {TemplateHost[]} compatible_hosts
 * @property {TemplateOptions[]} options
 * @property {TemplateMetaData[]} [text_items = undefined] text_items
 * @property {TemplateMetaData[]} [action_items = undefined] action_items
 * @property {TemplateMetaData[]} [media_items = undefined] media_items
 *
 * @typedef {Object} TemplateList
 * @property {Template[]} items
 *
 * @typedef {Object} TestUser
 * @property {Number} user_id
 * @property {Boolean} enabled
 * @property {String} created_at
 * @property {String} updated_at
 *
 * @typedef {Object} TestUserList
 * @property {TestUser[]} users
 *
 * *** Definitions for request parameter objects ***
 *
 * @typedef {Object} GetCampaignsParams
 * @property {Status} [status = undefined] status
 *
 * @typedef {Object} CreateCampaignParams
 * @property {String} name          Name of the campaign. Must be a non empty string
 * @property {Boolean} anonymous     Whether the notifications for the campaign are anonymous or not
 * @property {String} [description = undefined] description  Description of the campaign
 * @property {String} [startsAt = undefined] startsAt   The date/time that the campaign is valid from
 * @property {String} [endsAt = undefined] endsAt     The date/time that the campaign is valid until
 *
 * @typedef {Object} UpdateCampaignParams
 * @property {String} campaignId           ID of the campaign to update
 * @property {String} [name = undefined] name       Name of the campaign. Must be a non empty string if provided
 * @property {Boolean} [anonymous = undefined] anonymous  Whether the notifications for the campaign are anonymous or not
 * @property {String} [description = undefined] description   Description of the campaign
 * @property {Status} [status = undefined] status     Status of the campaign. Must be one of 'active', 'draft' or 'archived'
 * @property {String} [startsAt = undefined] startsAt   The date/time that the campaign is valid from
 * @property {String} [endsAt = undefined] endsAt     The date/time that the campaign is valid until
 *
 * @typedef {Object} GetMeNotificationsParams
 * @property {String} hostAppName       Name of the host application
 * @property {String} [hostAppVersion = undefined] hostAppVersion     Host app version. Must be a string that comprises 1 - 4 dot-separated integer values
 * @property {String} [hostOsName = undefined] hostOsName    Host application OS. Valid values are `win` or `mac`
 * @property {String} [hostOsVersion = undefined] hostOsVersion     Host application OS version
 * @property {String} [locale = undefined] locale    Locale setting of the client application
 * @property {String} deviceId      ID of the device. Expected to be generated on a per device basis
 * @property {Boolean} [useAuth = true]     Whether to use an auth header for this request
 *
 * @typedef {Object} CreateNotificationParams
 * @property {String} name           Name of the campaign message. Must be a non empty string
 * @property {String} campaignId     ID of the campaign to create the notification for
 * @property {NotificationType} [type = undefined]           The type (category) of the notification.
 * @property {Number} [priority = undefined]       An integer that indicates the priority of the notification
 * @property {String} [templateName = undefined] templateName   Name of the notification template that will be used on the client app
 * @property {String} [templateOption = undefined] templateOption The variant (colours etc) of the template to use
 * @property {Boolean} isPersistent   Whether the notification is persistent
 * @property {Boolean} [isTakeover = undefined] isTakeover    Whether the notification is a takeover
 * @property {String} [startsAt = undefined] startsAt      The date/time that the notification is valid from
 * @property {String} [endsAt = undefined] endsAt        The date/time that the notificaiton is valid until
 *
 * @typedef {Object} UpdateNotificationParams
 * @property {String} notificationId   ID of the notification to update
 * @property {String} [name = undefined] name           Name of the campaign message. Must be a non empty string if provided
 * @property {NotificationType} [type = undefined] type          The type (category) of the notification.
 * @property {Number} [priority = undefined] priority      An integer that indicates the priority of the notification
 * @property {String} [templateName = undefined] templateName  Name of the notification template that will be used on the client app
 * @property {String} [templateOption = undefined] templateOption   The variant (colours etc) of the template to use
 * @property {String} [startsAt = undefined] startsAt      The date/time that the notification is valid from
 * @property {String} [endsAt = undefined] endsAt        The date/time that the notificaiton is valid until
 * @property {Status} [status = undefined] status        Status of the notification ('active', 'draft' or 'archived')
 * @property {Boolean} [isPersistent = undefined] isPersistent    Whether the notification is a persistent
 * @property {Boolean} [isTakeover = undefined] isTakeover      Whether the notification is a takeover
 * @property {String} [campaignId = undefined] campaignId      Campaign ID
 *
 * @typedef {Object} CloneNotificationParams
 * @property {String} notificationId   ID of the notification to update
 *
 * @typedef {Object} CreateHostSpecificationParams
 * @property {String} notificationId     ID of the notification to create the host specification for.
 * @property {AppName} appName            Name of the host app.
 * @property {String} [appVersionMin = undefined] appVersionMin    The minimum version of the host application which the notification is
 *                                           compatible with. Must be a string that comprises 1 - 4 dot-separated
 *                                           integer values. 0 means any version.
 * @property {String} [appVersionMax = undefined] appVersionMax   The exclusive maximum version of the host application which the
 *                                           notification is compatible with. Must be a string that comprises 1 - 4
 *                                           dot-separated integer values. 0 means any version.
 * @property {OsName} [osName = undefined] osName       The name of the host operating system.
 *                                           and (empty means all operating systems).
 * @property {String} [osVersionMin = undefined] osVersionMin     The minimum version of the host operating system which the notification
 *                                           is compatible with. Must be a string that comprises 1 - 4 dot-separated
 *                                           integer values in the format major.minor.patch.build where major =>
 *                                           no range, minor => 0-99, patch => 0-999, build => 0-999999. 0 means any
 *                                           version.
 * @property {String} [osVersionMax = undefined] osVersionMax     The exlusive maximum version of the host operating system which the
 *                                          notification is compatible with. Must be a string that comprises 1 - 4
 *                                          dot-separated integer values in the format major.minor.patch.build where
 *                                          major => no range, minor => 0-99, patch => 0-999, build => 0-999999.
 *                                          0 means any version.
 *
 * @typedef {Object} UpdateHostSpecificationParams
 * @property {String} notificationId     ID of the notification to create the host specification for.
 * @property {String} hostId   ID of the host specification to update.
 * @property {AppName} appName            Name of the host app.
 * @property {String} [appVersionMin = undefined] appVersionMin    The minimum version of the host application which the notification is
 *                                           compatible with. Must be a string that comprises 1 - 4 dot-separated
 *                                           integer values. 0 means any version.
 * @property {String} [appVersionMax = undefined] appVersionMax   The exclusive maximum version of the host application which the
 *                                           notification is compatible with. Must be a string that comprises 1 - 4
 *                                           dot-separated integer values. 0 means any version.
 * @property {OsName} [osName = undefined] osName       The name of the host operating system.
 *                                           and (empty means all operating systems).
 * @property {String} [osVersionMin = undefined] osVersionMin     The minimum version of the host operating system which the notification
 *                                           is compatible with. Must be a string that comprises 1 - 4 dot-separated
 *                                           integer values in the format major.minor.patch.build where major =>
 *                                           no range, minor => 0-99, patch => 0-999, build => 0-999999. 0 means any
 *                                           version.
 * @property {String} [osVersionMax = undefined] osVersionMax     The exlusive maximum version of the host operating system which the
 *                                          notification is compatible with. Must be a string that comprises 1 - 4
 *                                          dot-separated integer values in the format major.minor.patch.build where
 *                                          major => no range, minor => 0-99, patch => 0-999, build => 0-999999.
 *                                          0 means any version.
 *
 * @typedef {Object} DeleteHostSpecificationParams
 * @property {String} notificationId
 * @property {String} hostId
 *
 * @typedef {Object} CreateTestUserParams
 * @property {Number} userId
 * @property {Boolean} [enabled = undefined] enabled
 *
 * @typedef {Object} DeleteTestUserParams
 * @property {Number} userId
 *
 * @typedef {Object} TextParam
 * @property {TextContentType} mime_type
 * @property {String} content
 * @property {Metadata} metadata
 *
 * @typedef {Object} MediaParam
 * @property {MediaContentType} mime_type
 * @property {MediaSource} src
 * @property {Metadata} metadata
 *
 * @typedef {Object} ActionParam
 * @property {String} label
 * @property {String} [url = undefined] url
 * @property {Metadata} metadata
 *
 * @typedef {Object} ContentParam
 * @property {TextParam[]} [text = undefined] text
 * @property {MediaParam[]} [media = undefined] media
 * @property {ActionParam[]} [actions = undefined] actions
 *
 * @typedef {Object} CreateUpdateContentParams
 * @property {String} notificationId
 * @property {Language} language
 * @property {ContentParam} content
 */

/**
 * Notifications Service V2 class
 */
export default class NotificationsService extends Service {
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
   * Retrieve a list of campaigns.
   *
   * @param {GetCampaignsParams} [params = undefined] params
   * @return {Promise<CampaignList>}
   */
  getCampaigns ({ status } = {}) {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      '/api/v2/campaigns',
      this.toBody({
        status: status
      }),
      'GET'
    )
  }

  /**
   * Creates a campaign.
   *
   * @param {CreateCampaignParams}  params
   * @return {Promise<Campaign>}
   */
  createCampaign ({ name, anonymous, description, startsAt, endsAt }) {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      '/api/v2/campaigns',
      this.toBody({
        name: name,
        description: description,
        anonymous: anonymous,
        starts_at: startsAt,
        ends_at: endsAt
      }),
      'POST'
    )
  }

  /**
   * Updates attributes of a campaign.
   *
   * @param {UpdateCampaignParams}   params
   * @return {Promise<Campaign>}
   */
  updateCampaign ({ campaignId, name, anonymous, description, status, startsAt, endsAt }) {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      `/api/v2/campaigns/${campaignId}`,
      this.toBody({
        name: name,
        description: description,
        anonymous: anonymous,
        status: status,
        starts_at: startsAt,
        ends_at: endsAt
      }),
      'PUT'
    )
  }

  /**
   * Get notifications.
   *
   * @return {Promise<NotificationList>}
   */
  getNotifications () {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      '/api/v2/notifications',
      null,
      'GET'
    )
  }

  /**
   * Returns a list of notification messages to a client application.
   *
   * @param {GetMeNotificationsParams}  params
   * @return {Promise<NotificationList>}
   */
  getMeNotifications ({ hostAppName, hostAppVersion, hostOsName, hostOsVersion, locale, deviceId, useAuth } = {}) {
    return this.fetch(
      useAuth ? this.bearerTokenAuthHeader() : null,
      '/api/v2/me/notifications',
      this.toBody({
        host_app_name: hostAppName,
        host_app_version: hostAppVersion,
        host_os_name: hostOsName,
        host_os_version: hostOsVersion,
        locale: locale,
        device_id: deviceId
      }),
      'GET'
    )
  }

  /**
   * Create a notification for a campaign.
   *
   * @param {CreateNotificationParams}  params
   * @return {Promise<Notification>}
   */
  createNotification ({
    name,
    campaignId,
    type,
    priority,
    templateName,
    templateOption,
    isPersistent,
    isTakeover,
    startsAt,
    endsAt
  }) {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      '/api/v2/notifications',
      this.toBody({
        name: name,
        campaign_id: campaignId,
        type: type,
        priority: priority,
        template_name: templateName,
        template_option: templateOption,
        starts_at: startsAt,
        ends_at: endsAt,
        is_persistent: isPersistent,
        is_takeover: isTakeover
      }),
      'POST'
    )
  }

  /**
   * Updates attributes of a notification.
   *
   * @param {UpdateNotificationParams}  params
   * @return {Promise<Notification>}
   */
  updateNotification ({
    notificationId,
    name,
    templateOption,
    type,
    priority,
    templateName,
    startsAt,
    endsAt,
    status,
    isPersistent,
    isTakeover,
    campaignId
  }) {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      `/api/v2/notifications/${notificationId}`,
      this.toBody({
        name: name,
        type: type,
        priority: priority,
        template_name: templateName,
        template_option: templateOption,
        starts_at: startsAt,
        ends_at: endsAt,
        status: status,
        is_persistent: isPersistent,
        is_takeover: isTakeover,
        campaign_id: campaignId
      }),
      'PUT'
    )
  }

  /**
   * Creates a clone of the notification whose ID is supplied in the URL.
   *
   * @param {CloneNotificationParams} params
   * @return {Promise<Notification>}
   */
  cloneNotification ({ notificationId }) {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      `/api/v2/notifications/${notificationId}`,
      null,
      'POST'
    )
  }

  /**
   * Creates a host specification for a notification.
   *
   * @param {CreateHostSpecificationParams} params
   * @return {Promise<Host>}
   */
  createHostSpecification ({
    notificationId,
    appName,
    appVersionMin,
    appVersionMax,
    osName,
    osVersionMin,
    osVersionMax
  }) {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      `/api/v2/notifications/${notificationId}/hosts`,
      this.toBody({
        app_name: appName,
        app_version_min: appVersionMin,
        app_version_max: appVersionMax,
        os_name: osName,
        os_version_min: osVersionMin,
        os_version_max: osVersionMax
      }),
      'POST'
    )
  }

  /**
   * Update attributes of a host specification for a notification.
   *
   * @param {UpdateHostSpecificationParams} params
   * @return {Promise<Host>}
   */
  updateHostSpecification ({
    notificationId,
    hostId,
    appName,
    appVersionMin,
    appVersionMax,
    osName,
    osVersionMin,
    osVersionMax
  }) {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      `/api/v2/notifications/${notificationId}/hosts/${hostId}`,
      this.toBody({
        app_name: appName,
        app_version_min: appVersionMin,
        app_version_max: appVersionMax,
        os_name: osName,
        os_version_min: osVersionMin,
        os_version_max: osVersionMax
      }),
      'PUT'
    )
  }

  /**
   * Delete a host specification for a notification.
   *
   * @param {DeleteHostSpecificationParams} params
   * @return {Promise}
   */
  deleteHostSpecification ({ notificationId, hostId }) {
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
   * @param {CreateUpdateContentParams} params
   * @return {Promise<Content>}
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
   * @return {Promise<TemplateList>}
   */
  getNotificationTemplates () {
    return this.fetch(
      null,
      '/api/v2/templates',
      null,
      'GET'
    )
  }

  /**
   * Creates a test user.
   *
   * @param {CreateTestUserParams} params
   * @return {Promise<TestUser>}
   */
  createTestUser ({ userId, enabled }) {
    if (enabled === undefined) {
      enabled = true
    }
    return this.fetch(
      this.bearerTokenAuthHeader(),
      '/api/v2/testusers',
      this.toBody({
        user_id: userId,
        enabled: enabled
      }),
      'POST'
    )
  }

  /**
   * Lists all the test users.
   *
   * @return {Promise<TestUserList>}
   */
  getTestUsers () {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      '/api/v2/testusers',
      null,
      'GET'
    )
  }

  /**
   * Remove a user from the list of test users.
   *
   * @param {DeleteTestUserParams} params
   * @return {Promise}
   */
  deleteTestUser ({ userId }) {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      `/api/v2/testusers/${userId}`,
      null,
      'DELETE'
    )
  }
}
