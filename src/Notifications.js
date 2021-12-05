'use strict'

import Service from './Service'
import Sws from './Sws'

/**
 * @typedef {'active' | 'draft' | 'archived'} Status
 * @typedef {'licensing' | 'system' | 'promotion' | 'streaming' | 'device_connection'} NotificationType
 * @typedef {'text/plain' | 'text/html' | 'text/markdown'} TextContentType
 * @typedef {'image/jpeg' | 'image/gif' | 'image/png' | 'image/webp'} MediaContentType
 * @typedef {'mac' | 'win'} OsName
 * @typedef {'serato_dj_pro' | 'serato_dj_lite' | 'serato_sample' | 'serato_studio' | 'my_account' | 'express_checkout' | 'serato_com' | 'mega_nav'} AppName
 * @typedef {'en' | 'de' | 'fr' | 'es' | 'pt' | 'it' | 'ja' | 'zh'} Language
 * @typedef {'dark' | 'light' | 'dark-orange-button' | 'light-orange-button'} TemplateOptions
 *
 * @typedef {Object} MediaSrc
 * @property {String} small
 * @property {String} medium
 * @property {String} large
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
 * @typedef {Object} AppNotificationTemplate
 * @property {String} name
 * @property {String} [option = undefined] option
 *
 * @typedef {Object} AppNotificationText
 * @property {TextContentType} content_type
 * @property {String} content
 * @property {Metadata} metadata
 *
 * @typedef {Object} AppNotificationAction
 * @property {String} label
 * @property {String} [url = undefined] url
 * @property {Metadata} metadata
 *
 * @typedef {Object} AppNotificationMedia
 * @property {MediaContentType} mime_type
 * @property {MediaSrc  } src
 * @property {Metadata} metadata
 * 
 * @typedef {Object} AppNotificationHeader
 * @property {String} language
 * @property {NotificationType} type
 * @property {Number} [priority = undefined] priority
 * @property {AppNotificationTemplate} template
 * @property {String} [takeover_id = undefined] takeover_id An identifier used by client apps to replace static notifications with dynamic content.
 * @property {String} [campaign_id = undefined]
 * @property {String} [expires = undefined] expires
 * @property {Object} [client_metadata = undefined] client_metadata Client application-specific meta data. Maximum size is 64KB.
 *
 * @typedef {Object} AppNotificationContent
 * @property {AppNotificationText[]} text
 * @property {AppNotificationAction[]} [actions = undefined] actions A list of actions associated with the notification. Each item will have a unique `metadata`.`id` value.
 * @property {AppNotificationMedia[]} [media = undefined] media A list of media objects associated with the notification. Each item will have a unique `metadata`.`id` value.
 *
 * @typedef {Object} AppNotification
 * @property {String} id
 * @property {AppNotificationHeader} header
 * @property {AppNotificationContent} content
 *
 * @typedef {Object} AppNotificationList
 * @property {AppNotification[]} items
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
 * @typedef {String} id
 * @property {MediaContentType} mime_type
 * @property {MediaSrc  } src
 * @property {Metadata} metadata
 *
 * @typedef {Object} Action
 * @typedef {String} id
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
 * @property {TestUser[]} items
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
   * @param {Object} [params = undefined] params  Input parameter object
   * @param {String} [params.status = undefined] params.status  Status of the campaign to filter by. Must be one of 'active', 'draft' or 'archived' if set
   * @return {Promise<CampaignList>}
   */
  getCampaigns ({ status } = {}) {
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
   *
   * @param {Object}  params Input parameter object
   * @param {String}  params.name          Name of the campaign. Must be a non empty string
   * @param {Boolean} params.anonymous     Whether the notifications for the campaign are anonymous or not
   * @param {String} [params.description = undefined] params.description  Description of the campaign
   * @param {Date}   [params.startsAt = undefined] params.startsAt   The date/time that the campaign is valid from
   * @param {Date}   [params.endsAt = undefined] params.endsAt     The date/time that the campaign is valid until
   *
   * @return {Promise<Campaign>}
   */
  createCampaign ({ name, anonymous, description, startsAt, endsAt }) {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      '/api/v2/campaigns',
      this.toBody({
        'name': name,
        'description': description,
        'anonymous': anonymous,
        'starts_at': startsAt,
        'ends_at': endsAt
      }),
      'POST'
    )
  }

  /**
   * Updates attributes of a campaign.
   *
   * @param {Object}   params Input parameter object
   * @param {String}   params.campaignId           ID of the campaign to update
   * @param {String}  [params.name = undefined] params.name       Name of the campaign. Must be a non empty string if provided
   * @param {Boolean} [params.anonymous = undefined] params.anonymous  Whether the notifications for the campaign are anonymous or not
   * @param {String}  [params.description = undefined] params.description   Description of the campaign
   * @param {String}  [params.status = undefined] params.status     Status of the campaign. Must be one of 'active', 'draft' or 'archived'
   * @param {Date}   [params.startsAt = undefined] params.startsAt   The date/time that the campaign is valid from
   * @param {Date}   [params.endsAt = undefined] params.endsAt     The date/time that the campaign is valid until
   *
   * @return {Promise<Campaign>}
   */
  updateCampaign ({campaignId, name, anonymous, description, status, startsAt, endsAt }) {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      `/api/v2/campaigns/${campaignId}`,
      this.toBody({
        'name': name,
        'description': description,
        'anonymous': anonymous,
        'status': status,
        'starts_at': startsAt,
        'ends_at': endsAt
      }),
      'PUT'
    )
  }

  /**
   * Get notifications.
   *
   * @return {Promise<AppNotificationList>}
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
   * Create a notification for a campaign.
   *
   * @param {Object}  params                Input parameter object
   * @param {String}  params.name           Name of the campaign message. Must be a non empty string
   * @param {String}  params.campaignId     ID of the campaign to create the notification for
   * @param {String}  params.type           The type (category) of the notification. Must be one of 'licensing', 'system', 'promotion', 'streaming' or 'device_connection'
   * @param {Number}  params.priority       An integer that indicates the priority of the notification
   * @param {String}  params.templateName   Name of the notification template that will be used on the client app
   * @param {String}  params.templateOption The variant (colours etc) of the template to use
   * @param {Boolean} params.isPersistent   Whether the notification is persistent
   * @param {Boolean} [params.isTakeover = undefined] params.isTakeover    Whether the notification is a takeover
   * @param {Date}   [params.startsAt = undefined] params.startsAt      The date/time that the notification is valid from
   * @param {Date}   [params.endsAt = undefined] params.endsAt        The date/time that the notificaiton is valid until
   *
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
        'name': name,
        'campaign_id': campaignId,
        'type': type,
        'priority': priority,
        'template_name': templateName,
        'template_option': templateOption,
        'starts_at': startsAt,
        'ends_at': endsAt,
        'is_persistent': isPersistent,
        'is_takeover': isTakeover
      }),
      'POST'
    )
  }

  /**
   * Updates attributes of a notification.
   *
   * @param {Object}  params                  Input parameter object
   * @param {String}  params.notificationId   ID of the notification to update
   * @param {String} [params.name = undefined] params.name           Name of the campaign message. Must be a non empty string if provided
   * @param {String}  [params.type = undefined] params.type          The type (category) of the notification. Must be one of 'licensing', 'system', 'promotion', 'streaming' or 'device_connection'
   * @param {Number}  [params.priority = undefined] params.priority      An integer that indicates the priority of the notification
   * @param {String}  [params.templateName = undefined] params.templateName  Name of the notification template that will be used on the client app
   * @param {String}  [params.templateOption = undefined] params.templateOption   The variant (colours etc) of the template to use
   * @param {Date}   [params.startsAt = undefined] params.startsAt      The date/time that the notification is valid from
   * @param {Date}   [params.endsAt = undefined] params.endsAt        The date/time that the notificaiton is valid until
   * @param {String} [params.status = undefined] params.status        Status of the notification ('active', 'draft' or 'archived')
   * @param {Boolean} [params.isPersistent = undefined] params.isPersistent    Whether the notification is a persistent
   * @param {Boolean} [params.isTakeover = undefined] params.isTakeover      Whether the notification is a takeover
   * @param {Number} [params.campaignId = undefined] params.campaignId      Campaign ID
   *
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
        'name': name,
        'type': type,
        'priority': priority,
        'template_name': templateName,
        'template_option': templateOption,
        'starts_at': startsAt,
        'ends_at': endsAt,
        'status': status,
        'is_persistent': isPersistent,
        'is_takeover': isTakeover,
        'campaign_id': campaignId
      }),
      'PUT'
    )
  }

  /**
   * Creates a clone of the notification whose ID is supplied in the URL.
   *
   * @param {Object} params                 Input parameter object
   * @param {String} params.notificationId  ID of the notification to clone
   *
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
   * @param {Object} params                    Input parameter object
   * @param {String} params.notificationId     ID of the notification to create the host specification for
   * @param {String} params.appName            Name of the host app. Must be one of 'serato_dj_pro', 'serato_dj_lite',
   *                                           'serato_sample', 'serato_studio', 'my_account', 'express_checkout',
   *                                           'serato_com' or 'mega_nav'
   * @param {String} [params.appVersionMin = undefined] params.appVersionMin    The minimum version of the host application which the notification is
   *                                           compatible with. Must be a string that comprises 1 - 4 dot-separated
   *                                           integer values. 0 means any version.
   * @param {String} [params.appVersionMax = undefined] params.appVersionMax   The exclusive maximum version of the host application which the
   *                                           notification is compatible with. Must be a string that comprises 1 - 4
   *                                           dot-separated integer values. 0 means any version.
   * @param {String} [params.osName = undefined] params.osName       The name of the host operating system. Possible values are 'mac', 'win'
   *                                           and (empty means all operating systems).
   * @param {String} [params.osVersionMin = undefined] params.osVersionMin     The minimum version of the host operating system which the notification
   *                                           is compatible with. Must be a string that comprises 1 - 4 dot-separated
   *                                           integer values in the format major.minor.patch.build where major =>
   *                                           no range, minor => 0-99, patch => 0-999, build => 0-999999. 0 means any
   *                                           version.
   * @param {String} [params.osVersionMax = undefined] params.osVersionMax     The exlusive maximum version of the host operating system which the
   *                                          notification is compatible with. Must be a string that comprises 1 - 4
   *                                          dot-separated integer values in the format major.minor.patch.build where
   *                                          major => no range, minor => 0-99, patch => 0-999, build => 0-999999.
   *                                          0 means any version.
   *
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
   *
   * @param {Object} params                  Input parameter object
   * @param {String} params.notificationId   ID of the notification that the host specification belongs to
   * @param {String} params.hostId           ID of the host specification to update
   * @param {String} [params.appName = undefined] params.appName      Name of the host app. Must be one of 'serato_dj_pro', 'serato_dj_lite',
   *                                           'serato_sample', 'serato_studio', 'my_account', 'express_checkout',
   *                                           'serato_com' or 'mega_nav'
   * @param {String} [params.appVersionMin = undefined] params.appVersionMin    The minimum version of the host application which the notification is
   *                                           compatible with. Must be a string that comprises 1 - 4 dot-separated
   *                                           integer values. 0 means any version.
   * @param {String} [params.appVersionMax = undefined] params.appVersionMax    The exclusive maximum version of the host application which the
   *                                           notification is compatible with. Must be a string that comprises 1 - 4
   *                                           dot-separated integer values. 0 means any version.
   * @param {String} [params.osName = undefined] params.osName       The name of the host operating system. Possible values are 'mac', 'win'
   *                                           and (empty means all operating systems).
   * @param {String} [params.osVersionMin = undefined] params.osVersionMin     The minimum version of the host operating system which the notification
   *                                           is compatible with. Must be a string that comprises 1 - 4 dot-separated
   *                                           integer values in the format major.minor.patch.build where major =>
   *                                           no range, minor => 0-99, patch => 0-999, build => 0-999999. 0 means any
   *                                           version.
   * @param {String} [params.osVersionMax = undefined] params.osVersionMax    The exlusive maximum version of the host operating system which the
   *                                          notification is compatible with. Must be a string that comprises 1 - 4
   *                                          dot-separated integer values in the format major.minor.patch.build where
   *                                          major => no range, minor => 0-99, patch => 0-999, build => 0-999999.
   *                                          0 means any version.
   *
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
   *
   * @param {Object} params                - Input parameter object
   * @param {String} params.notificationId - Id of the notification that the host specification belongs to
   * @param {String} params.hostId         - ID of the host specification to delete
   *
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
   * @param {Object} params                 Input parameter object
   * @param {String} params.notificationId  Notification to create/update content for
   * @param {String} params.language        A two letter ISO 639-1 language code
   * @param {Object} params.content         Object containing the content to create or update. For the full object
   * structure refer to: https://notifications.serato.com/api/v2/schema/json/content_create_update.json
   * @param {Array} [params.content.text]    - Array of text to create/update. Empty to remove existing text
   * @param {Array} [params.content.media]   - Array of media to create/update. Empty to remove existing media
   * @param {Array} [params.content.actions] - Array of actions to create/update. Empty to remove existing actions
   *
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
   * @param {Object} params         Input parameter object.
   * @param {Number} params.userId  User ID.
   * @param {Boolean} [params.enabled] params.enabled   User is enabled (defaults to `true`).
   *
   * @return {Promise<TestUser>}
   */
  createTestUser ({ userId, enabled }) {
    if (enabled === undefined) {
      enabled = true
    }
    return this.fetch(
      this.bearerTokenAuthHeader(),
      `/api/v2/testusers`,
      this.toBody({
        'user_id': userId,
        'enabled': enabled
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
   * @param {Object} params
   * @param {String} params.userId User ID
   *
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
