'use strict'

import Service from './Service'

/**
 * @typedef {Object} File
 * @property {Number} id
 * @property {String} file_name
 * @property {String} mime_type
 * @property {Number} size
 * @property {String} download.request.method
 * @property {String} download.request.url
 * @property {Object.<string, string>} [download.request.headers]
 * @property {String} download.expiry
 *
 * @typedef FileInputParameter
 * @property {String} fileId
 */

/**
 * Cloud Library Service class
 *
 * Exposes SWS Cloud Library Service API endpoints via class methods
 */
export default class CloudLibrary extends Service {
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
   * @param  {FileInputParameter} fileId
   * @return {Promise<File>}
   */
  getFile ({ fileId }) {
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
