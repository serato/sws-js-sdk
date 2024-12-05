import {AxiosResponse} from 'axios'
export default class Service {
    constructor(Sws: any);
    private _sws;
    private _serviceUri;
    private _lastRequest;
    private _invalidAccessTokenHandler;
    private _invalidRefreshTokenHandler;
    private _passwordReEntryRequiredHandler;
    private _accessDeniedHandler;
    private _timeoutExceededHandler;
    private _serviceErrorHandler;
    private _serviceUnavailableHandler;
    private _defaultErrorHandler;
    protected bearerTokenAuthHeader(): string;
    protected basicAuthHeader(): string;
    protected toBody(data: import("./Sws").RequestParams): import("./Sws").RequestParams;
    protected fetch(auth: string, endpoint: string, body: import("./Sws").RequestParams, method?: HttpMethod, timeout?: number, responseType?: ResponseType, headers?: import("./Sws").RequestHeaders): Promise<any>;
    public fetchRequest(request: import("./Sws").Request): Promise<any>;
    get userId(): number;
    get serviceUri(): string;
    set invalidAccessTokenHandler(arg: import("./Sws").RequestErrorHandler);
    get invalidAccessTokenHandler(): import("./Sws").RequestErrorHandler;
    set invalidRefreshTokenHandler(arg: import("./Sws").RequestErrorHandler);
    get invalidRefreshTokenHandler(): import("./Sws").RequestErrorHandler;
    set passwordReEntryRequiredHandler(arg: import("./Sws").RequestErrorHandler);
    get passwordReEntryRequiredHandler(): import("./Sws").RequestErrorHandler;
    set accessDeniedHandler(arg: import("./Sws").RequestErrorHandler);
    get accessDeniedHandler(): import("./Sws").RequestErrorHandler;
    set timeoutExceededHandler(arg: import("./Sws").RequestErrorHandler);
    get timeoutExceededHandler(): import("./Sws").RequestErrorHandler;
    set serviceErrorHandler(arg: import("./Sws").RequestErrorHandler);
    get serviceErrorHandler(): import("./Sws").RequestErrorHandler;
    set serviceUnavailableHandler(arg: import("./Sws").RequestErrorHandler);
    get serviceUnavailableHandler(): import("./Sws").RequestErrorHandler;
    get defaultErrorHandler(): import("./Sws").RequestErrorHandler;
    get lastRequest(): import("./Sws").Request;
}
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS';
export type ResponseType = 'json' | 'blob';
export interface SwsError extends Error {
    httpStatus: number
    code?: number
    response: AxiosResponse
}
