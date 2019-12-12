'use strict'

import Service from './Service'

/**
 * Digital Assets Service class
 *
 * Exposes SWS Da Service API endpoints via class methods
 */
export default class DigitalAssets extends Service {
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
   * Retrieve a list of notifcations to a client application.
   * @param  {String} hostAppName
   * @param  {String} hostAppVersion
   * @param  {String} type
   * @param  {String} releaseType
   * @param  {String} releaseDate
   * @param  {Number} latestOnly
   * @return {Promise}
   */
  getDigitalAssets ({ hostAppName, hostAppVersion, type, releaseType, releaseDate, latestOnly } = {}) {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      '/api/v1/assets',
      this.toBody({
        'host_app_name': hostAppName,
        'host_app_version': hostAppVersion,
        'type': type,
        'release_type': releaseType,
        'release_date': releaseDate,
        'latest_only': latestOnly
      }),
      'GET'
    )
  }

  /**
   * Create a download URL for a resource
   * @param  {String} assetIid
   * @param  {String} resourceId
   * @return {Promise}
   */
  postDigitalAssets ({ assetIid, resourceId } = {}) {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      '/api/v1/assets/' + assetIid + '/resources/' + resourceId + '/download',
      null,
      'POST'
    )
  }
}
