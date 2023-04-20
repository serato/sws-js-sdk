export default class AiProxy extends Service {
    generateImage({ prompt, provider, resolution, responseFormat }: {
        prompt: string;
        provider?: string;
        resolution?: string;
        responseFormat?: string;
    }): Promise<AiProxy.Image>;
    getProviderStatus({ provider }: {
        provider: string;
    }): Promise<AiProxy.ProviderStatus>;
}
export namespace AiProxy {
    export type Image = {
        created: number;
        b64_image?: string;
        image_url?: string;
    };
    export type EligibilityStatus = {
        generate_images: boolean;
    };
    export type ProviderStatus = {
        created: number;
        provider: string;
        eligibility: EligibilityStatus;
    };
}
import Service from "./Service";
