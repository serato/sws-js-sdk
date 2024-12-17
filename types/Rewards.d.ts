export default class RewardsService extends Service {
    _serviceUri: any;
    getRewards(): Promise<Rewards.RewardList>;
    getReferralCampaigns(): Promise<Rewards.CampaignList>;
    getReferralCampaign({ id }: {
        id: number;
    }): Promise<Rewards.Campaign>;
    getReferrerCampaignDetailsById({ id }: {
        id: number;
    }): Promise<Rewards.ReferrerCampaign>;
    getRefereeEligibilityByReferralCode({ code, userId }: {
        code: string;
        userId: number;
    }): Promise<Rewards.ReferralCodeActivity>;
    addReferralCampaignActivityLog({ code, referrerUserId, refereeUserId, voucherId, productId, voucherTypeId, voucherBatchId }: {
        code: string;
        referrerUserId: number;
        refereeUserId: number;
        voucherId: string;
        voucherTypeId: string;
        voucherBatchId: string;
        productId: number;
    }): Promise<Rewards.CampaignActivityLog>;
}
export namespace Rewards {
    export type OwnedStatus = "dj" | "wailshark" | "sample" | "serato_studio";
    export type CampaignGoal = {
        voucher_type_id: number;
        voucher_batch_id: string;
        Quantity: number;
    };
    export type CampaignRule = {
        voucher_type_id?: number;
        product_type_id?: number;
        owned: OwnedStatus;
    };
    export type RuleOfEligibility = {
        referral_incentive: CampaignRule[];
        referee: CampaignRule[];
    };
    export type CallToAction = {
        primary_cta: string;
        primary_cta_link: string;
        primary_cta_prefix: string;
        primary_cta_postfix: string;
        secondary_cta?: string;
        secondary_cta_link?: string;
    };
    export type TemplateLogo = {
        dark: string;
        light: string;
    };
    export type Template = {
        type: "light" | "dark";
        logos: TemplateLogo;
        background_colour?: string;
        background_image_url?: string;
    };
    export type Reward = {
        name: string;
        headline: string;
        description: string;
        unlocked: boolean;
        cta: CallToAction;
        latest_ribbon: boolean;
        tags: string[];
        template: Template;
    };
    export type RewardList = {
        items: Reward[];
    };
    export type ReferralCodeActivity = {
        eligible: boolean;
        activity: CampaignActivityLog[];
    };
    export type CampaignActivityLog = {
        id: number;
        referrer_user_id?: number;
        referee_user_id?: number;
        voucher_id?: string;
        product_id?: string;
        referral_campaign_code: string;
    };
    export type ReferrerCampaign = {
        referral_campaign: ReferrerCampaignDetail;
    };
    export type ReferrerCampaignDetail = {
        id: number;
        name: string;
        base_url: string;
        goals: CampaignGoal[];
        eligibility: RuleOfEligibility;
        referral_code: string;
        referee_activity: CampaignActivityLog[];
        referrer_activity: CampaignActivityLog[];
        eligible_for_referral_incentive: boolean;
    };
    export type Campaign = {
        id: number;
        name: string;
        goals: CampaignGoal[];
        incentives: CampaignGoal[];
        eligibility: RuleOfEligibility;
    };
    export type CampaignList = {
        items: Campaign[];
    };
}
import Service from './Service';
