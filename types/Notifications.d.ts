export default class Notifications extends Service {
    getNotifications({ hostAppName, hostAppVersion, hostAppOs, locale }: {
        hostAppName?: string | null;
        hostAppVersion?: string | null;
        hostAppOs?: string | null;
        locale?: string | null;
    }): Promise<any>;
    getCampaigns({ status }: {
        status?: string | null;
    }): Promise<any>;
    createCampaign({ name, anonymous, description, startsAt, endsAt }: {
        name: string;
        anonymous: boolean;
        description?: string | null;
        startsAt?: Date | null;
        endsAt?: Date | null;
    }): Promise<any>;
    updateCampaign({ campaignId, name, anonymous, description, status, startsAt, endsAt }: {
        campaignId: string;
        name?: string | null;
        anonymous?: boolean | null;
        description?: string | null;
        status?: string | null;
        startsAt?: Date | null;
        endsAt?: Date | null;
    }): Promise<any>;
    adminGetNotifications(): Promise<any>;
    createNotification({ name, campaignId, type, priority, templateName, templateOption, isPersistent, isTakeover, startsAt, endsAt }: {
        name: string;
        campaignId: string;
        type: string;
        priority: number;
        templateName: string;
        templateOption: string;
        isPersistent: boolean;
        isTakeover: boolean;
        startsAt: Date | null;
        endsAt: Date | null;
    }): Promise<any>;
    updateNotification({ name, notificationId, templateOption, type, priority, templateName, startsAt, endsAt, status, isPersistent, isTakeover, campaignId }: {
        name: string | null;
        notificationId: string;
        type?: string;
        priority?: number;
        templateName?: string;
        templateOption?: string;
        startsAt?: Date | null;
        endsAt?: Date | null;
        status?: string | null;
        isPersistent: boolean;
        isTakeover: boolean;
        campaignId: number | null;
    }): Promise<any>;
    cloneNotification({ notificationId }: {
        notificationId: string;
    }): Promise<any>;
    getHostSpecifications({ notificationId }: {
        notificationId: string;
    }): Promise<any>;
    createHostSpecification({ notificationId, appName, appVersionMin, appVersionMax, osName, osVersionMin, osVersionMax }: {
        notificationId: string;
        appName: string;
        appVersionMin?: string | null;
        appVersionMax?: string | null;
        osName?: string | null;
        osVersionMin?: string | null;
        osVersionMax?: string | null;
    }): Promise<any>;
    updateHostSpecification({ notificationId, hostId, appName, appVersionMin, appVersionMax, osName, osVersionMin, osVersionMax }: {
        notificationId: string;
        hostId: string;
        appName?: string | null;
        appVersionMin?: string | null;
        appVersionMax?: string | null;
        osName?: string | null;
        osVersionMin?: string | null;
        osVersionMax?: string | null;
    }): Promise<any>;
    deleteHostSpecification({ notificationId, hostId }: {
        notificationId: string;
        hostId: string;
    }): Promise<any>;
    createOrUpdateNotificationContent({ notificationId, language, content }: {
        notificationId: string;
        language: string;
        content: {
            text?: any[];
            media?: any[];
            actions?: any[];
        };
    }): Promise<any>;
    getNotificationTemplates(): Promise<any>;
    createTestUser({ userId, enabled }: Int): Promise<any>;
    getTestUsers(): Promise<any>;
    deleteTestUser({ userId }: string): Promise<any>;
}
import Service from "./Service";
