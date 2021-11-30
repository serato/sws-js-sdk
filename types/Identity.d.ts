export default class Identity extends Service {
    tokenRefresh(refreshToken: string): Promise<any>;
    getUser(): Promise<any>;
    login({ emailAddress, password, deviceId, deviceName }?: {
        emailAddress: string;
        password: string;
        deviceId: string;
        deviceName: string;
    }): Promise<any>;
    logout({ refreshToken, refreshTokenIds, disableLogin }?: {
        refreshToken: string;
        refreshTokenIds: string;
        disableLogin: boolean;
    }): Promise<any>;
    addUser({ emailAddress, password, firstName, lastName, timestamp, locale }?: {
        emailAddress: string;
        password: string;
        firstName: string;
        lastName: string;
        timestamp: string;
        locale: string;
    }): Promise<any>;
    deactivateUser(): Promise<any>;
    changeEmailAddress({ emailAddress, redirectUri }?: {
        emailAddress: string;
        redirectUri: string;
    }): Promise<any>;
}
import Service from "./Service";
