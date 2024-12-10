'use strict'

/**
 * @classdesc Extends Error class to allow for additional properties.
 * @class
 * @extends Error
 */
export default class SwsError extends Error {
    /**
   * Constructor
   *
   * @param {number} httpStatus 
   * @param {number|undefined} code 
   * @param {import("axios").AxiosResponse} response
   * @return {void}
   */
    constructor(message, httpStatus, response, code = undefined) {
        super(message)
        // append additional properties to SwsError object for cleaner error handling in TS
        this.httpStatus = httpStatus
        this.response = response
        this.code = code
    }
}