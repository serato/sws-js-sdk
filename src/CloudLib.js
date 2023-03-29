'use strict'

import Service from './Service'

/**
 * Cloud Library Service class
 *
 * Exposes SWS Cloud Library Service API endpoints via class methods
 */
export default class CloudLib extends Service {
  /**
   * Constructor
   *
   * @param {Sws} Sws Configured Sws instance
   * @return {void}
   */
  constructor (Sws) {
    super(Sws)
    this._serviceUri = Sws.serviceUri.cloudlib
  }

  /**
   * Get a detail of a file
   * @param  {String} fileId
   * @return {Promise<FileDetail>}
   */
  getFiles ({ fileId } = {}) {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      this.userId === 0
        ? '/api/v1/me/files/' + fileId
        : '/api/v1/users/' + this.userId + '/files/' + fileId,
      null,
      'GET'
    )
  }
}
