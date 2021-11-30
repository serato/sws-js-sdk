export class SwsClient extends Sws {
    _accessTokenUpdatedHandler: () => void;
    set accessTokenUpdatedHandler(arg: AccessTokenUpdatedHandler);
    get accessTokenUpdatedHandler(): AccessTokenUpdatedHandler;
}
export type AccessTokenUpdatedHandler = (accessToken: string, accessTokenExpires: Date, refreshToken: string, refreshTokenExpires: Date) => void;
import Sws from "./Sws";
