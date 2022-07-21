export default class RewardsService extends Service {
    getRewards(): Promise<Rewards.RewardList>;
    getReferralCampaigns(): Promise<Rewards.CampaignList>;
    getReferralCampaign({ id: number }): Promise<Rewards.Campaign>;
    getReferrerCampaignDetailsById({ id: number }): Promise<Rewards.ReferrerCampaign>;
    getRefereeEligibilityByReferralCode({code: string, userId: number}): Promise<Rewards.ReferralCodeActivity>;
    addReferralCampaignActivityLog({
        referrerUserId,
        refereeUserId,
        voucherId,
        productId,
        voucherTypeId,
        voucherBatchId
    }: AddCampaignLogParams): Promise<Rewards.CampaignLog>;
}
export namespace Rewards {
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
        type: 'light' | 'dark';
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
    export type CampaignGoal = {
        voucher_type_id: number;
        voucher_batch_id: string;
        quantity: number;
    }
    export type CampaignRule = {
        voucher_type_id?: number;
        product_type_id?: number;
        owned: 'current' | 'not_current' | 'never';
    }
    export type Campaign = {
        id: number;
        name: string;
        base_url: string;
        goals: CampaignGoal[];
        incentives: CampaignGoal[];
        eligibility: {
            referral_incentive: CampaignRule[];
            referee: CampaignRule[]
        }
    }
    export type CampaignList = {
        items: Campaign[];
    }
    export type Activity = {
        user_id: number;
        voucher_id: string;
        timestamp: string;
    }
    export type ReferrerCampaignDetail = {
        id: number;
        name: string;
        base_url: string;
        goals: CampaignGoal[];
        incentives: CampaignGoal[];
        eligibility: {
            referral_incentive: CampaignRule[];
            referee: CampaignRule[]
        }
        referral_code: string,
        referee_activity: Activity[],
        referrer_activity: Activity[],
        eligible_for_referral_incentive: boolean
    }
    export type ReferrerCampaign = {
        items: referral_campaign
    }
    export type ReferralCodeActivity = {
        eligible: boolean;
        activity: Activity[];
    }
    export type CampaignLog = {
        id: number;
        referral_campaign_code: string;
        referrer_user_id: number;
        product_id?: number;
        voucher_id?: string;
        timestamp: string
    }
    export type AddCampaignLogParams = {
        referrerUserId?: number;
        refereeUserId?: number;
        voucherId?: string;
        productId?: number;
    };
}
import Service from "./Service";
