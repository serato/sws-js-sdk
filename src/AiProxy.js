'use strict'

import Service from './Service'
/**
 * @typedef {Object} Image
 * @property {Number} created
 * @property {String} [b64_image = undefined]
 * @property {String} [image_url = undefined]
 */

/**
 * AI Proxy Service class
 *
 * Exposes SWS AI Proxy API endpoints via class methods
 */
export default class AiProxy extends Service {
  /**
   * Constructor
   *
   * @param {Sws} Sws Configured Sws instance
   * @return {void}
   */
  constructor (Sws) {
    super(Sws)
    this._serviceUri = Sws.serviceUri.aiproxy
  }

  /**
   * Generate an image from the phrase
   * @param  {Object} param
   * @param  {String} param.prompt
   * @param  {String} [param.provider = undefined]
   * @param  {String} [param.resolution = undefined]
   * @param  {String} [param.responseFormat = undefined]
   * @return {Promise<Image>}
   */
  generateImage ({ prompt, provider, resolution, responseFormat }) {
    return this.fetch(
      this.bearerTokenAuthHeader(),
      '/api/v1/images/generate',
      this.toBody({
        prompt: prompt,
        provider: provider,
        resolution: resolution,
        response_format: responseFormat
      }),
      'POST'
    )
  }
}
