export default class SwsError extends Error {
    constructor(message: any, httpStatus: number, response: import("axios").AxiosResponse, code?: number | undefined);
    httpStatus: number;
    response: import("axios").AxiosResponse<any, any>;
    code: number;
}
