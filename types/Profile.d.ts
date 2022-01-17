export default class ProfileService extends Service {
    getProfiles({ emailAddress }: {
        emailAddress: string;
    }): Promise<Profile.ProfileList>;
    getProfile({ useMe }?: {
        useMe?: boolean;
    }): Promise<Profile.Profile>;
    updateProfile({ globalContactStatus, firstName, lastName, djName, locale, address1, address2, city, region, postcode, countryCode, notifyTracked, notifyPrivate, autoRead, autoSubscribe, threadsPerPage, language, displayName, company }: {
        globalContactStatus?: number;
        firstName?: string;
        lastName?: string;
        djName?: string;
        locale?: string;
        address1?: string;
        address2?: string;
        city?: string;
        region?: string;
        postcode?: number;
        countryCode?: string;
        notifyTracked?: boolean;
        notifyPrivate?: boolean;
        autoRead?: boolean;
        autoSubscribe?: boolean;
        threadsPerPage?: number;
        language?: string;
        displayName?: string;
        company?: string;
    }): Promise<Profile.Profile>;
    createUploadUrl({ uploadType, contentType }: {
        uploadType: string;
        contentType: string;
    }): Promise<Profile.FileUploadUrl>;
    updateAvatar(): Promise<Profile.Avatar>;
    deleteAvatar(): Promise<Profile.Avatar>;
    getAllBetaPrograms(): Promise<Profile.BetaProgramList>;
    getBetaPrograms(): Promise<Profile.UserBetaProgramList>;
    addBetaProgram({ betaProgramId }: {
        betaProgramId: string;
    }): Promise<Profile.UserBetaProgram>;
    deleteBetaProgram({ betaProgramId }: {
        betaProgramId: boolean;
    }): Promise<any>;
    validateAllBetaPrograms(): Promise<Profile.UserBetaProgramList>;
    addSurvey({ survey }: {
        survey: any;
    }): Promise<any>;
    getPartnerPromotions(): Promise<Profile.PartnerPromotionCodeList>;
    partnerPromotionAddUser({ userId, promotionName }: {
        userId: string;
        promotionName: string;
    }): Promise<Profile.PartnerPromotionCode>;
}
export namespace Profile {
    export type Avatar = {
        ts: number;
        thumb: string;
        mid: string;
        full: string;
    };
    export type TwitchChannel = {
        id: string;
        display_name: string;
        name: string;
        url: string;
        logo: string;
        description: string;
    };
    export type TwitchExtension = {
        id: string;
        name: string;
    };
    export type Twitch = {
        channel: TwitchChannel;
        extensions: TwitchExtension[];
    };
    export type Profile = {
        user_id: number;
        email_address: string;
        global_contact_status: number;
        notify_tracked?: boolean;
        notify_private_message?: boolean;
        auto_subscribe?: boolean;
        auto_read?: boolean;
        threads_per_page?: number;
        language?: string;
        first_name?: string;
        last_name?: string;
        dj_name?: string;
        locale?: string;
        address_1?: string;
        address_2?: string;
        city?: string;
        region?: string;
        postcode?: string;
        country_code?: string;
        company?: string;
        date_created: string;
        date_updated: string;
        display_name?: string;
        avatar: Avatar;
        edit_avatar_disabled?: number;
        twitch?: Twitch;
    };
    export type ProfileList = {
        items: Profile[];
    };
    export type FileUploadUrl = {
        method: string;
        url: string;
        expires: string;
    };
    export type BetaProgram = {
        id: string;
        name: string;
        active: boolean;
        qualifying_license_type_ids: string[];
        memberships_groups?: string[];
        download_url: string;
    };
    export type BetaProgramList = {
        items: BetaProgram[];
    };
    export type UserBetaProgram = {
        beta_program: BetaProgram;
        active: boolean;
        banned: boolean;
    };
    export type UserBetaProgramList = {
        items: UserBetaProgram[];
    };
    export type PartnerPromotionCode = {
        user_id: number;
        promotion_code: string;
        promotion_name: string;
        user_added_at: string;
    };
    export type PartnerPromotionCodeList = {
        items: PartnerPromotionCode[];
    };
}
import Service from "./Service";
