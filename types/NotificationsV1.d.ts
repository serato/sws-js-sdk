export default class NotificationsV1Service extends Service {
    getNotifications({ hostAppName, hostAppVersion, hostAppOs, locale }?: GetNotificationsParams): Promise<NotificationV1List>;
}
export type MessageType = 'sale' | 'generic' | 'none';
export type MessageContentType = 'text/plain';
export type MediaType = 'img' | 'video' | '';
export type Schedule = {
    id: string;
    campaign_id: string;
    starts_at: string;
    ends_at: string;
};
export type CampaignV1 = {
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
export type MediaV1 = {
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
    media: MediaV1;
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
export type NotificationV1 = {
    campaign: CampaignV1;
    message: Message;
};
export type NotificationV1List = {
    items: NotificationV1[];
};
export type GetNotificationsParams = {
    hostAppName?: AppName;
    hostAppVersion?: string;
    hostAppOs?: OsName;
    locale?: string;
};
import Service from "./Service";
