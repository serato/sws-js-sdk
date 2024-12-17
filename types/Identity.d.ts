export default class IdentityService extends Service {
    _serviceUri: any;
    tokenExchange(code: string, redirectUri: string, codeVerifier: string): Promise<Identity.UserLogin>;
    tokenRefresh(refreshToken: RawToken, useRotation?: boolean): Promise<Identity.UserTokens>;
    getUser(): Promise<Identity.User>;
    login({ emailAddress, password, deviceId, deviceName }: {
        emailAddress: string;
        password: string;
        deviceId?: string;
        deviceName?: string;
    }): Promise<Identity.UserLogin>;
    logout({ refreshToken, refreshTokenIds, disableLogin }?: {
        refreshToken: Identity.RawToken;
        refreshTokenIds: string;
        disableLogin: boolean;
    }): Promise<any>;
    addUser({ emailAddress, password, firstName, lastName, timestamp, locale }: {
        emailAddress: string;
        password: string;
        firstName?: string;
        lastName?: string;
        timestamp?: string;
        locale?: string;
    }): Promise<Identity.User>;
    deactivateUser(): Promise<Identity.OkMessage>;
    changeEmailAddress({ emailAddress, redirectUri }: {
        emailAddress: string;
        redirectUri?: string;
    }): Promise<any>;
    updateUser({ emailAddress }: {
        emailAddress: string;
    }): Promise<Identity.User>;
    getUsers({ emailAddress, includeEmailAddressHistory }: {
        emailAddress: string;
        includeEmailAddressHistory?: string;
    }): Promise<UserList>;
}
export namespace Identity {
    export type RawToken = string;
    export type Scopes = {
        [x: string]: string[];
    };
    export type RefreshToken = {
        token: RawToken;
        expires_at: number;
        type: "Bearer";
    };
    export type AccessToken = {
        token: RawToken;
        expires_at: number;
        type: "Bearer";
        scopes: Scopes;
    };
    export type UserTokens = {
        access: AccessToken;
        refresh: RefreshToken;
    };
    export type User = {
        id: number;
        email_address: string;
        first_name?: string;
        last_name?: string;
        date_created: string;
        locale: string;
        password_last_updated?: string;
    };
    export type UserLogin = {
        user: User;
        tokens: UserTokens;
    };
    export type OkMessage = {
        message: string;
    };
}
import Service from './Service';
