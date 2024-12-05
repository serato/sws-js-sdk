export default class SwsError extends Error {
    /**
   * Constructor
   *
   * @param {number} httpStatus 
   * @param {number} code 
   * @param {import("axios").AxiosResponse} response
   * @return {void}
   */
  
    constructor(message, httpStatus, response, code) {
        super(message)
        this.httpStatus = httpStatus
        this.response = response
        this.code = code
    }

    constructor(message, httpStatus, response) {
        super(message)
        this.httpStatus = httpStatus
        this.response = response
        this.code = undefined
    }
}
