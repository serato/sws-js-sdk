export default class Sws {
    constructor({ appId, secret, timeout, serviceUri }: SwsConfiguration);
    private _appId;
    private _secret;
    private _timeout;
    private _accessToken;
    private _refreshToken;
    private _userId;
    private _serviceUri;
    private _service;
    private _isServerSide;
    setInvalidAccessTokenHandler(f: RequestErrorHandler): void;
    setInvalidRefreshTokenHandler(f: RequestErrorHandler): void;
    setPasswordReEntryRequiredHandler(f: RequestErrorHandler): void;
    setAccessDeniedHandler(f: RequestErrorHandler): void;
    setServiceErrorHandler(f: RequestErrorHandler): void;
    setServiceUnavailableHandler(f: RequestErrorHandler): void;
    setTimesoutExceededHandler(f: RequestErrorHandler): void;
    get appId(): string;
    get appSecret(): string;
    get serviceUri(): ServiceUri;
    set userId(arg: number);
    get userId(): number;
    set accessToken(arg: string);
    get accessToken(): string;
    set refreshToken(arg: string);
    get refreshToken(): string;
    set timeout(arg: number);
    get timeout(): number;
    get license(): License;
    get id(): Identity;
    get ecom(): Ecom;
    get profile(): Profile;
    get notifications(): Notifications;
    get notificationsV1(): NotificationsV1;
    get da(): DigitalAssets;
    get rewards(): Rewards;
    get aiproxy(): AiProxy;
    get cloudlib(): CloudLibrary;
}
export type RequestHeaders = {
    [x: string]: string;
};
export type RequestParams = {
    [x: string]: string;
};
export type Request = {
    timeout: number;
    url: string;
    method: string;
    responseType: string;
    headers: RequestHeaders;
    params?: RequestParams;
    data?: RequestParams;
};
export type RequestErrorHandler = (request: Request, error: Error) => void;
export type ServiceUri = {
    id?: string;
    license?: string;
    ecom?: string;
    notifications?: string;
    profile?: string;
    da?: string;
    rewards?: string;
    aiproxy?: string;
    cloudlib?: string;
};
export type SwsConfiguration = {
    appId: string;
    secret?: string;
    timeout?: number;
    serviceUri?: ServiceUri;
    isServerSide?: boolean
};
export const serviceUriDefault: ServiceUri;
import License from "./License";
import Identity from "./Identity";
import Ecom from "./Ecom";
import Profile from "./Profile";
import Notifications from "./Notifications";
import NotificationsV1 from "./NotificationsV1";
import DigitalAssets from "./DigitalAssets";
import Rewards from "./Rewards";
import AiProxy from "./AiProxy";
import CloudLibrary from "./CloudLibrary";
