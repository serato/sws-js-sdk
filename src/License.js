import Service from './Service'

class License extends Service {
  /**
   * Constructor
   */
  constructor (SwsClient) {
    super(SwsClient)
    this._serviceUri = SwsClient.serviceUri.license
  }

  /**
   * Returns a list of a user's licenses.
   * Requires a valid access token.
   * Uses the current user from the access token if `userId` is not specified.
   *
   * @param {*} param0 Filter options
   * @return {Promise}
   */
  getLicenses ({ appName = '', appVersion = '', term = '', userId = '' } = {}) {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      userId === '' ? '/api/v1/me/licenses' : '/api/v1/users/' + userId + '/licenses',
      this.toBody({ app_name: appName, app_version: appVersion, term: term })
    )
  }
}

export default License
