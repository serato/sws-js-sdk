export default class SwsClient extends Sws {
    constructor({ appId, secret, timeout, serviceUri, isServerSide }: import("./Sws").SwsConfiguration, useTokenRotation?: boolean);
    private _accessTokenUpdatedHandler;
    private _accessTokenRefreshPromise;
    private _useTokenRotation;
    public createAuthorizationRequest(redirectUrl: string, refreshTokenId?: string): Promise<AuthorizationRequest>;
    set accessTokenUpdatedHandler(f: AccessTokenUpdatedHandler);
    get accessTokenUpdatedHandler(): AccessTokenUpdatedHandler;
    private createAuthState;
    private createCodeChallenge;
    private getCrypto;
    private getCryptoSubtle;
    private createRandomString;
    private sha256;
    private bufferToBase64UrlEncodedString;
    private fetchNewAccessTokenAndRetryRequest;
}
export type AccessTokenUpdatedHandler = (accessToken: string, accessTokenExpires: Date, refreshToken: string, refreshTokenExpires: Date) => void;
export type CodeChallengeMethod = "s256";
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
import Sws from './Sws';
