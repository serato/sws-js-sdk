export default class SwsClient extends Sws {
    private _accessTokenUpdatedHandler;
    public createAuthorizationRequest(redirectUrl: string, refreshTokenId?: string): Promise<AuthorizationRequest>;
    set accessTokenUpdatedHandler(arg: AccessTokenUpdatedHandler);
    get accessTokenUpdatedHandler(): AccessTokenUpdatedHandler;
    private createAuthState;
    createCodeChallenge(method?: string): Promise<CodeChallenge>;
    private getCrypto;
    private getCryptoSubtle;
    private createRandomString;
    private sha256;
    private bufferToBase64UrlEncoded;
    private urlEncodeB64;
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
    codeChallenge: CodeChallenge;
    url: string;
};
import Sws from "./Sws";
