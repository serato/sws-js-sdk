export default class Sws {
    constructor({ appId, secret, timeout, serviceUri }: SwsConfiguration);
    _appId: string;
    _secret: string;
    _timeout: number;
    _accessToken: string;
    _refreshToken: string;
    _serviceUri: {
        id: string;
        license: string;
        ecom: string;
        notifications: string;
        profile: string;
        da: string;
        rewards: string;
    };
    _service: {
        license: License;
        id: Identity;
        ecom: Ecom;
        notifications: Notifications;
        profile: Profile;
        da: DigitalAssets;
        rewards: Rewards;
    };
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
    _userId: number;
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
    get da(): DigitalAssets;
    get rewards(): Rewards;
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
};
export type SwsConfiguration = {
    appId: string;
    secret?: string;
    timeout?: number;
    serviceUri?: ServiceUri;
};
export const serviceUriDefault: ServiceUri;
import License from "./License";
import Identity from "./Identity";
import Ecom from "./Ecom";
import Notifications from "./Notifications";
import Profile from "./Profile";
import DigitalAssets from "./DigitalAssets";
import Rewards from "./Rewards";
