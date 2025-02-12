export default class NotificationsService extends Service {
    getCampaigns({ status }?: Notifications.GetCampaignsParams): Promise<Notifications.CampaignList>;
    createCampaign({ name, anonymous, description, startsAt, endsAt }: Notifications.CreateCampaignParams): Promise<Notifications.Campaign>;
    updateCampaign({ campaignId, name, anonymous, description, status, startsAt, endsAt }: Notifications.UpdateCampaignParams): Promise<Notifications.Campaign>;
    getNotifications(): Promise<Notifications.NotificationList>;
    getMeNotifications({ hostAppName, hostAppVersion, hostOsName, hostOsVersion, locale, deviceId, useAuth }: Notifications.GetMeNotificationsParams): Promise<Notifications.NotificationList>;
    createNotification({ name, campaignId, type, priority, templateName, templateOption, isPersistent, isTakeover, startsAt, endsAt }: Notifications.CreateNotificationParams): Promise<Notifications.Notification>;
    updateNotification({ notificationId, name, templateOption, type, priority, templateName, startsAt, endsAt, status, isPersistent, isTakeover, campaignId }: Notifications.UpdateNotificationParams): Promise<Notifications.Notification>;
    cloneNotification({ notificationId }: Notifications.CloneNotificationParams): Promise<Notifications.Notification>;
    createHostSpecification({ notificationId, appName, appVersionMin, appVersionMax, osName, osVersionMin, osVersionMax }: Notifications.CreateHostSpecificationParams): Promise<Notifications.Host>;
    updateHostSpecification({ notificationId, hostId, appName, appVersionMin, appVersionMax, osName, osVersionMin, osVersionMax }: Notifications.UpdateHostSpecificationParams): Promise<Notifications.Host>;
    deleteHostSpecification({ notificationId, hostId }: Notifications.DeleteHostSpecificationParams): Promise<any>;
    createOrUpdateNotificationContent({ notificationId, language, content }: Notifications.CreateUpdateContentParams): Promise<Notifications.Content>;
    getNotificationTemplates(): Promise<Notifications.TemplateList>;
    createTestUser({ userId, enabled }: Notifications.CreateTestUserParams): Promise<Notifications.TestUser>;
    getTestUsers(): Promise<Notifications.TestUserList>;
    deleteTestUser({ userId }: Notifications.DeleteTestUserParams): Promise<any>;
}
export namespace Notifications {
    export type Status = 'active' | 'draft' | 'archived' | 'testing';
    export type NotificationType = 'licensing' | 'system' | 'promotion' | 'streaming' | 'device_connection';
    export type TextContentType = 'text/plain' | 'text/html' | 'text/markdown';
    export type MediaContentType = 'image/jpeg' | 'image/gif' | 'image/png' | 'image/webp';
    export type OsName = 'mac' | 'win';
    export type AppName = 'serato_dj_pro' | 'serato_dj_lite' | 'serato_sample' | 'serato_studio' | 'my_account' | 'express_checkout' | 'serato_com' | 'mega_nav'| 'serato_hex_fx';
    export type Language = 'en' | 'de' | 'fr' | 'es' | 'pt' | 'it' | 'ja' | 'zh';
    export type TemplateOptions = 'dark' | 'light' | 'dark-orange-button' | 'light-orange-button';
    export type MediaSource = {
        small?: string;
        medium: string;
        large?: string;
    };
    export type Metadata = {
        [x: string]: any;
    };
    export type Campaign = {
        id: string;
        name: string;
        description?: string;
        uuid: string;
        anonymous: boolean;
        status: Status;
        starts_at?: string;
        ends_at?: string;
        created_at: string;
        updated_at: string;
    };
    export type CampaignList = {
        items: Campaign[];
    };
    export type Host = {
        id: string;
        app_name: AppName;
        app_version_min: string;
        app_version_max: string;
        os_name: OsName;
        os_version_min: string;
        os_version_max: string;
    };
    export type Text = {
        id: string;
        mime_type: TextContentType;
        content: string;
        metadata: Metadata;
    };
    export type Media = {
        id: string;
        mime_type: MediaContentType;
        src: MediaSource;
        metadata: Metadata;
    };
    export type Action = {
        id: string;
        label: string;
        url: string;
        metadata: Metadata;
    };
    export type Content = {
        language: Language;
        text: Text[];
        media?: Media[];
        actions?: Action[];
    };
    export type Notification = {
        id: string;
        name: string;
        campaign: Campaign;
        compatible_hosts: Host[];
        languages: Language[];
        type?: NotificationType;
        priority: number;
        template_name?: string;
        template_option?: string;
        is_takeover: boolean;
        content: Content[];
        is_persistent: boolean;
        status: Status;
        starts_at?: string;
        ends_at?: string;
        created_at: string;
        updated_at: string;
    };
    export type NotificationList = {
        items: Notification[];
    };
    export type TemplateHost = {
        app_name: AppName;
        app_version_min: string;
        app_version_max: string;
    };
    export type TemplateMetaData = {
        metadata_id: string;
        required: boolean;
        order: number;
    };
    export type Template = {
        name: string;
        description: string;
        is_takeover: boolean;
        compatible_hosts: TemplateHost[];
        options: TemplateOptions[];
        text_items?: TemplateMetaData[];
        action_items?: TemplateMetaData[];
        media_items?: TemplateMetaData[];
    };
    export type TemplateList = {
        items: Template[];
    };
    export type TestUser = {
        user_id: number;
        enabled: boolean;
        created_at: string;
        updated_at: string;
    };
    export type TestUserList = {
        users: TestUser[];
    };
    export type GetCampaignsParams = {
        status?: Status;
    };
    export type CreateCampaignParams = {
        name: string;
        anonymous: boolean;
        description?: string;
        startsAt?: string;
        endsAt?: string;
    };
    export type UpdateCampaignParams = {
        campaignId: string;
        name?: string;
        anonymous?: boolean;
        description?: string;
        status?: Status;
        startsAt?: string;
        endsAt?: string;
    };
    export type CreateNotificationParams = {
        name: string;
        campaignId: string;
        type?: NotificationType;
        priority?: number;
        templateName?: string;
        templateOption?: string;
        isPersistent: boolean;
        isTakeover?: boolean;
        startsAt?: string;
        endsAt?: string;
    };
    export type GetMeNotificationsParams = {
        hostAppName: string,
        hostAppVersion?: string,
        hostOsName?: string,
        hostOsVersion?: string,
        locale?: string,
        deviceId: string,
        useAuth?: boolean
    };
    export type UpdateNotificationParams = {
        notificationId: string;
        name?: string;
        type?: NotificationType;
        priority?: number;
        templateName?: string;
        templateOption?: string;
        startsAt?: string;
        endsAt?: string;
        status?: Status;
        isPersistent?: boolean;
        isTakeover?: boolean;
        campaignId?: string;
    };
    export type CloneNotificationParams = {
        notificationId: string;
    };
    export type CreateHostSpecificationParams = {
        notificationId: string;
        appName: AppName;
        appVersionMin?: string;
        appVersionMax?: string;
        osName?: OsName;
        osVersionMin?: string;
        osVersionMax?: string;
    };
    export type UpdateHostSpecificationParams = {
        notificationId: string;
        hostId: string;
        appName: AppName;
        appVersionMin?: string;
        appVersionMax?: string;
        osName?: OsName;
        osVersionMin?: string;
        osVersionMax?: string;
    };
    export type DeleteHostSpecificationParams = {
        notificationId: string;
        hostId: string;
    };
    export type CreateTestUserParams = {
        userId: number;
        enabled?: boolean;
    };
    export type DeleteTestUserParams = {
        userId: number;
    };
    export type TextParam = {
        mime_type: TextContentType;
        content: string;
        metadata: Metadata;
    };
    export type MediaParam = {
        mime_type: MediaContentType;
        src: MediaSource;
        metadata: Metadata;
    };
    export type ActionParam = {
        label: string;
        url?: string;
        metadata: Metadata;
    };
    export type ContentParam = {
        text?: TextParam[];
        media?: MediaParam[];
        actions?: ActionParam[];
    };
    export type CreateUpdateContentParams = {
        notificationId: string;
        language: Language;
        content: ContentParam;
    };
}
import Service from "./Service";
