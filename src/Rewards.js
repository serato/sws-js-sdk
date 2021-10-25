'use strict'

import Service from './Service'

/**
 * Rewards Service class
 *
 * Exposes SWS Rewards Service API endpoints via class methods
 */
export default class Rewards extends Service {
  /**
   * Constructor
   *
   * @param {Sws} Sws Configured Sws instance
   * @return {void}
   */
  constructor (Sws) {
    super(Sws)
    this._serviceUri = Sws.serviceUri.rewards
  }

  /**
   * Return rewards owned by a user.
   * Requires a valid access token.
   *
   * @returns {Promise}
   */
  getRewards () {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      this.userId === 0 ? '/api/v1/me/rewards' : '/api/v1/users/' + this.userId + '/rewards',
      null
    )
  }
}
