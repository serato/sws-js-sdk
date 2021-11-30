'use strict'

import Service from './Service'
import Sws from './Sws'

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
  get ({ hostAppName, hostAppVersion, type, releaseType, releaseDate, latestOnly } = {}) {
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
   * @param  {String} assetId
   * @param  {String} resourceId
   * @return {Promise}
   */
  getDownloadUrl ({ assetId, resourceId } = {}) {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      '/api/v1/assets/' + assetId + '/resources/' + resourceId + '/download',
      null,
      'POST'
    )
  }
}
