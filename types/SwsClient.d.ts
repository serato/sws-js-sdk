// import { SwsConfiguration } from './Sws';
export default class SwsClient extends Sws {
    private _accessTokenUpdatedHandler;
    private _accessTokenRefreshPromise;
    // private _useTokenRotation;
    // constructor(config: SwsConfiguration, useTokenRotation?: boolean);
    public createAuthorizationRequest(redirectUrl: string, refreshTokenId?: string): Promise<AuthorizationRequest>;
    set accessTokenUpdatedHandler(arg: AccessTokenUpdatedHandler);
    get accessTokenUpdatedHandler(): AccessTokenUpdatedHandler;
    private createAuthState;
    private createCodeChallenge;
    private getCrypto;
    private getCryptoSubtle;
    private createRandomString;
    private sha256;
    private bufferToString;
    private fetchNewAccessTokenAndRetryRequest;
}
export type AccessTokenUpdatedHandler = (accessToken: string, accessTokenExpires: Date, refreshToken: string, refreshTokenExpires: Date) => void;
export type CodeChallengeMethod = 's256';
export type CodeChallenge = {
    method: CodeChallengeMethod;
    challenge: string;
    verifier: string;
};
export type AuthorizationRequest = {
    state: string;
    codeVerifier: string;
    url: string;
};
import Sws from "./Sws";
