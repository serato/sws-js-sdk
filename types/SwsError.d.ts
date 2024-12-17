export default class SwsError extends Error {
    constructor(message: any, httpStatus: number, response: Response, code?: number | undefined);
    httpStatus: number;
    response: {
        [x: string]: string;
    };
    code: number;
}
export type Response = {
    [x: string]: string;
};
