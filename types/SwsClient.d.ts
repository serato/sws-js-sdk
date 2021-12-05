export default class SwsClient extends Sws {
    private _accessTokenUpdatedHandler;
    set accessTokenUpdatedHandler(arg: AccessTokenUpdatedHandler);
    get accessTokenUpdatedHandler(): AccessTokenUpdatedHandler;
}
export type AccessTokenUpdatedHandler = (accessToken: string, accessTokenExpires: Date, refreshToken: string, refreshTokenExpires: Date) => void;
import Sws from "./Sws";
