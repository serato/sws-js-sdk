export default class NotificationsV1Service extends Service {
    _serviceUri: any;
    getNotifications({ hostAppName, hostAppVersion, hostAppOs, locale }?: NotificationsV1.GetNotificationsParams): Promise<NotificationsV1.NotificationList>;
}
export namespace NotificationsV1 {
    export type MessageType = 'sale' | 'generic' | 'none';
    export type MessageContentType = 'text/plain';
    export type MediaType = 'img' | 'video' | '';
    export type Schedule = {
        id: string;
        campaign_id: string;
        starts_at: string;
        ends_at: string;
    };
    export type Campaign = {
        id: string;
        name: string;
        description: string;
        current_schedule?: Schedule;
    };
    export type MessageV1Body = {
        content_type: MessageContentType;
        content: string;
    };
    export type MessageV1Action = {
        cta: string;
        url?: string;
    };
    export type MessageV2Action = {
        url: string;
    };
    export type Media = {
        type: MediaType;
        url: string;
        metadata?: {
            [x: string]: string;
        };
    };
    export type MessageV1 = {
        type: MessageType;
        title: string;
        body: MessageV1Body;
        actions: MessageV1Action[];
    };
    export type MessageV2 = {
        type: MessageType;
        title: string;
        actions: MessageV2Action[];
        media: Media;
    };
    export type MessageVersions = {
        v1: MessageV1;
        v2: MessageV2;
    };
    export type Message = {
        id: string;
        sequence: number;
        language: string;
        versions: MessageVersions;
    };
    export type Notification = {
        campaign: Campaign;
        message: Message;
    };
    export type NotificationList = {
        items: Notification[];
    };
    export type GetNotificationsParams = {
        hostAppName?: import("./Notifications").Notifications.AppName;
        hostAppVersion?: string;
        hostAppOs?: import("./Notifications").Notifications.OsName;
        locale?: string;
    };
}
import Service from './Service';
