'use strict'

import Service from './Service'

/**
 * License Service class
 *
 * Exposes SWS License Service API endpoints via class methods
 */
export default class License extends Service {
  /**
   * Constructor
   *
   * @param {Sws} Sws Configured Sws instance
   * @return {void}
   */
  constructor (Sws) {
    super(Sws)
    this._serviceUri = Sws.serviceUri.license
  }

  /**
   * Returns a list of a user's licenses.
   * Requires a valid access token.
   * Uses the current user from the access token if `userId` is not specified.
   *
   * @param {Object} param Options
   * @param {String} param.appName Only return licenses compatible with app
   * @param {String} param.appVersion Only return licenses compatible with app version `Major.minor.point`
   * @param {String} param.term Only return licenses of specified term
   * @param {Number} param.userId Return licenses belonging to user
   * @return {Promise}
   */
  getLicenses ({ appName = '', appVersion = '', term = '', userId = '' } = {}) {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      userId === '' ? '/api/v1/me/licenses' : '/api/v1/users/' + userId + '/licenses',
      this.toBody({ app_name: appName, app_version: appVersion, term: term })
    )
  }

  /**
   * Create a new license authorization for a host.
   *
   * Requires a valid access token.
   * Uses the current user from the access token if `userId` is not specified.
   *
   * @param action
   * @param appName
   * @param appVersion
   * @param hostMachineId
   * @param hostMachineName
   * @param licenseId
   * @param systemTime
   * @param userId
   * @returns {Promise}
   */
  postLicensesAuthorizations({
    action = '',
    appName = '',
    appVersion = '',
    hostMachineId = '',
    hostMachineName = '',
    licenseId = '',
    systemTime = '',
    userId = '' }) {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      userId === '' ? '/api/v1/me/licenses/authorizations' : '/api/v1/users/' + userId + '/licenses/authorizations',
      this.toBody({
        action: action,
        app_name: appName,
        app_version: appVersion,
        host_machine_id: hostMachineId,
        host_machine_name: hostMachineName,
        license_id: licenseId,
        system_time: systemTime
      }),
      'POST'
    )
  }
}
