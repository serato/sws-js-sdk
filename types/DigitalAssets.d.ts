export default class DigitalAssets extends Service {
    get({ hostAppName, hostAppVersion, type, releaseType, releaseDate, latestOnly }?: string): Promise<any>;
    getDownloadUrl({ assetId, resourceId }?: string): Promise<any>;
}
import Service from "./Service";
