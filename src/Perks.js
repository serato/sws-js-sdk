'use strict'

import Service from './Service'

/**
 * Perks Service class
 *
 * Exposes SWS Perks Service API endpoints via class methods
 */
export default class Perks extends Service {
  /**
   * Constructor
   *
   * @param {Sws} Sws Configured Sws instance
   * @return {void}
   */
  constructor (Sws) {
    super(Sws)
    this._serviceUri = Sws.serviceUri.perks
  }

  /**
   * Return perks owned by a user.
   * Requires a valid access token.
   *
   * @returns {Promise}
   */
  getPerks () {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      this.userId === 0 ? '/api/v1/me/perks' : '/api/v1/users/' + this.userId + '/perks',
      null
    )
  }
}
