'use strict'

import Service from './Service'

/**
 * @typedef {'serato_dj_pro' | 'serato_dj_lite' | 'serato_sample' | 'serato_studio' | 'scratch_live' | 'pitchntime_le' | 'pitchntime_pro' | 'serato_hex_fx'} HostApplicationName
 * @typedef {'release' | 'publicbeta' | 'privatebeta'} ReleaseType
 * @typedef {'win' | 'mac'} HostOs
 * @typedef {'application_installer' | 'content_pack'} ResourceType
 *
 * @typedef {Object} HostApplication
 * @property {HostApplicationName} name
 * @property {String} [min_version = undefined] min_version Minimum version of host application. If not provided there is no mimimum version.
 * @property {String} [max_version = undefined] max_version Maximum version of host application. If not provided there is no mimimum version.
 *
 * @typedef {Object} Resource
 * @property {Number} [id = undefined] id Indentifier for a protected resource. One of `url` or `id` will be present.
 * @property {String} name
 * @property {ResourceType | 'manual' | 'quick_start_guide'} type
 * @property {InstallerType} installer_type
 * @property {('win' | 'mac' | 'cc1')[]} host_os_compatibility List of compatible host operating systems.
 * @property {String} file_name Name of file resource
 * @property {String} mime_type Media type as defined in IETF's RFC 6838.
 * @property {Number} [file_size = undefined] file_size File size in bytes.
 * @property {String} [url = undefined] url Permanent URL for the resource. One of `url` or `id` will be present.
 * @property {String[]} [secured_by = undefined] secured_by A list of access scopes, one or more of which is required to access the resource.
 *
 * @typedef {Object} Asset
 * @property {Number} id
 * @property {String} name
 * @property {'application_installer' | 'content_pack'} type
 * @property {ReleaseType} release_type
 * @property {String} version
 * @property {HostApplication[]} host_app_compatibility A list of compatible host applications
 * @property {String} release_date Release date in ISO ISO 8061 format date
 * @property {Resource[]} resources Resources associated with the digital asset
 * @property {String} [webpage_url = undefined] webpage_url Canonical URL for a webpage associated with the asset
 * @property {Object<string, any>} [meta = undefined] meta Meta data associated with the asset
 *
 * @typedef {Object} AssetList
 * @property {Asset[]} items List of digital assets
 *
 * @typedef {Object} AssetDownload
 * @property {Number} resource_id
 * @property {String} mime_type Media type as defined in IETF's RFC 6838.
 * @property {String} file_size
 * @property {String} url Download URL
 * @property {String} url_expires Expiry time of the download URL expressed in ISO ISO 8061 date format.
 *
 * @typedef {Object} ResourceDownload
 * @property {Number} id
 * @property {String} file_name
 * @property {String} mime_type Media type as defined in IETF's RFC 6838.
 * @property {String} file_size
 * @property {String} url Download URL
 * @property {String} url_created Creation time of the download URL expressed in ISO ISO 8061 date format.
 * @property {String} url_expires Expiry time of the download URL expressed in ISO ISO 8061 date format.
 *
 * @typedef {Object} AssetWithoutResources
 * @property {Number} id
 * @property {String} name
 * @property {'application_installer' | 'content_pack'} type
 * @property {ReleaseType} release_type
 * @property {String} version
 * @property {HostApplication[]} host_app_compatibility A list of compatible host applications
 * @property {String} release_date Release date in ISO 8061 format
 * @property {String} [webpage_url = undefined] Canonical URL for a webpage associated with the asset
 * @property {Object<string, any>} [meta = undefined] Meta data associated with the asset
 *
 * @typedef {Object} DownloadHistory
 * @property {AssetWithoutResources} asset
 * @property {Resource} resource
 *
 * @typedef {Object} DownloadEmail
 * @property {String} email_address Email address of the user
 * @property {String} language User preferred language
 */

/**
 * Digital Assets Service class
 *
 * Exposes SWS Da Service API endpoints via class methods
 */
export default class DigitalAssetsService extends Service {
  /**
   * Constructor
   *
   * @param {Sws} Sws Configured Sws instance
   * @return {void}
   */
  constructor (Sws) {
    super(Sws)
    this._serviceUri = Sws.serviceUri.da
  }

  /**
   * Retrieve a list of digital assets
   * @param  {Object} [param = undefined] param
   * @param  {HostApplicationName} [param.hostAppName = undefined] param.hostAppName
   * @param  {String} [param.hostAppVersion = undefined] param.hostAppVersion
   * @param  {HostOs} [param.hostOs = undefined] param.hostOs
   * @param  {ResourceType} [param.type = undefined] param.type
   * @param  {ReleaseType} [param.releaseType = undefined] param.releaseType
   * @param  {String} [param.releaseDate = undefined] param.releaseDate
   * @param  {Number} [param.latestOnly = undefined] param.latestOnly
   * @return {Promise<AssetList>}
   */
  get ({ hostAppName, hostAppVersion, hostOs, type, releaseType, releaseDate, latestOnly } = {}) {
    // If an access token is present, use bearer token. If no access token, return use basic auth header
    return this.fetch(
      this.bearerTokenAuthHeader(),
      '/api/v1/assets',
      this.toBody({
        host_app_name: hostAppName,
        host_app_version: hostAppVersion,
        host_app_os: hostOs,
        type,
        release_type: releaseType,
        release_date: releaseDate,
        latest_only: latestOnly
      }),
      'GET'
    )
  }

  /**
   * Create a download URL for a resource
   * @param  {Object} param
   * @param  {Number} param.assetId
   * @param  {Number} param.resourceId
   * @return {Promise<AssetDownload>}
   */
  getDownloadUrl ({ assetId, resourceId }) {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      '/api/v1/assets/' + assetId + '/resources/' + resourceId + '/download',
      null,
      'POST'
    )
  }

  /**
   * Create a download URL for a resource
   * @param  {Object} param
   * @param  {Number} param.resourceId
   * @return {Promise<ResourceDownload>}
   */
  getResourceDownload ({ resourceId }) {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      '/api/v1/resources/' + resourceId + '/download',
      null,
      'POST'
    )
  }

  /**
   * Get user application installer download history
   * @param  {Object} [param = undefined] param
   * @param  {HostApplicationName} [param.hostAppName = undefined] param.hostAppName
   * @return {Promise<DownloadHistory>}
   */
  getApplicationInstallerDownloads ({ hostAppName }) {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      '/api/v1/me/log/downloads/applicationinstaller',
      this.toBody({
        host_app_name: hostAppName
      }),
      'GET'
    )
  }

  /**
   * Send an email for resource download
   * @param  {Object} param
   * @param  {String} param.resourceId
   * @return {Promise<DownloadEmail>}
   */
  sendResourceDownloadLink ({ resourceId }) {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      `/api/v1/resources/${resourceId}/download-email`,
      null,
      'POST'
    )
  }

  /**
   * Get application installer resource.
   * @param  {Object} param
   * @param  {HostApplicationName} param.hostAppName
   * @param  {String} param.hostAppVersion This should be a semantic version number string.
   * @param  {HostOs} param.hostOs
   * @param  {String} param.includeCorePack Used to distinguish between corepack and non corepack downloads.
   * Only applicable fot `studio`.Ignored for other products.
   * @return {Promise<DownloadEmail>}
   */
  getApplicationInstallerResource ({ hostAppName, hostAppVersion, hostOs, includeCorePack }) {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      `/api/v1/download/applicationinstaller/${hostAppName}/${hostAppVersion}/${hostOs}`,
      this.toBody({
        include_core_pack: includeCorePack
      }),
      'POST'
    )
  }
}
