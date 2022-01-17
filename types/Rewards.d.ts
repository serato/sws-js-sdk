export default class RewardsService extends Service {
    getRewards(): Promise<Rewards.RewardList>;
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
}
import Service from "./Service";
