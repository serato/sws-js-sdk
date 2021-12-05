export default class DigitalAssetsService extends Service {
    get({ hostAppName, hostAppVersion, hostOs, type, releaseType, releaseDate, latestOnly }?: {
        hostAppName?: HostApplicationName;
        hostAppVersion?: string;
        hostOs?: HostOs;
        type?: ResourceType;
        releaseType?: ReleaseType;
        releaseDate?: string;
        latestOnly?: number;
    }): Promise<AssetList>;
    getDownloadUrl({ assetId, resourceId }: {
        assetId: number;
        resourceId: number;
    }): Promise<AssetDownload>;
}
export type HostApplicationName = 'serato_dj_pro' | 'serato_dj_lite' | 'serato_sample' | 'serato_studio' | 'scratch_live' | 'pitchntime_le' | 'pitchntime_pro';
export type ReleaseType = 'release' | 'publicbeta' | 'privatebeta';
export type HostOs = 'win' | 'mac';
export type ResourceType = 'application_installer' | 'content_pack';
export type HostApplication = {
    name: HostApplicationName;
    min_version?: string;
    max_version?: string;
};
export type Resource = {
    id?: number;
    name: string;
    type: ResourceType | 'manual' | 'quick_start_guide';
    host_os_compatibility: ('win' | 'mac' | 'cc1')[];
    file_name: string;
    mime_type: string;
    file_size?: number;
    url?: string;
    secured_by?: string[];
    "": string;
};
export type Asset = {
    id: number;
    name: string;
    type: 'application_installer' | 'content_pack';
    release_type: ReleaseType;
    version: string;
    host_app_compatibility: HostApplication[];
    release_date: string;
    resources: Resource[];
    webpage_url?: string;
    meta?: {
        [x: string]: any;
    };
};
export type AssetList = {
    items: Asset[];
};
export type AssetDownload = {
    resource_id: number;
    mime_type: string;
    file_size: string;
    url: string;
    url_expires: string;
};
import Service from "./Service";
