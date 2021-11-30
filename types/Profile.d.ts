export default class Profile extends Service {
    getProfiles({ emailAddress }?: {
        emailAddress: string;
    }): Promise<any>;
    getProfile({ useMe }?: {
        useMe: boolean;
    }): Promise<any>;
    updateProfile({ globalContactStatus, firstName, lastName, djName, locale, address1, address2, city, region, postcode, countryCode, notifyTracked, notifyPrivate, autoRead, autoSubscribe, threadsPerPage, language, displayName, company }?: {
        globalContactStatus: number;
        firstName: string;
        lastName: string;
        djName: string;
        locale: string;
        address1: string;
        address2: string;
        city: string;
        region: string;
        postcode: number;
        countryCode: string;
        notifyTracked: boolean;
        notifyPrivate: boolean;
        autoRead: boolean;
        autoSubscribe: boolean;
        threadsPerPage: number;
        language: string;
        displayName: string;
        company: string;
    }): Promise<any>;
    createUploadUrl({ uploadType, contentType }?: {
        uploadType: string;
        contentType: string;
    }): Promise<any>;
    updateAvatar(): Promise<any>;
    deleteAvatar(): Promise<any>;
    getAllBetaPrograms(): Promise<any>;
    getBetaPrograms(): Promise<any>;
    addBetaProgram({ betaProgramId }?: {
        betaProgramId: string;
    }): Promise<any>;
    deleteBetaProgram({ betaProgramId }?: {
        betaProgramId: boolean;
    }): Promise<any>;
    validateAllBetaPrograms(): Promise<any>;
    addSurvey({ survey }?: {
        survey: any;
    }): Promise<any>;
    getPartnerPromotions(): Promise<any>;
    partnerPromotionAddUser({ userId, promotionName }?: {
        userId: string;
        promotionName: string;
    }): Promise<any>;
}
import Service from "./Service";
