export default class SwsError extends Error {
    /**
   * Constructor
   *
   * @param {number} httpStatus 
   * @param {number} code 
   * @param {import("axios").AxiosResponse} response
   * @return {void}
   */
  
    constructor(httpStatus, response, code) {
        super()
        this.httpStatus = httpStatus
        this.response = response
        this.code = code
    }
}