export default class AiProxyService extends Service {
  generateImage({ prompt, provider, resolution, responseFormat }: AiProxy.GenerateImageParams): Promise<AiProxy.Image>;
  getProviderStatus({ provider }: { provider: string }): Promise<AiProxy.ProviderStatus>;
}

export namespace AiProxy {
  export type GenerateImageParams = {
    prompt: string;
    provider?: string;
    resolution?: string;
    responseFormat?: string;
  };
  export type Image = {
    created: number;
    b64_image?: string;
    image_url?: string;
  }
  export type ProviderStatus = {
    created: number;
    provider: string;
    eligibility: EligibilityStatus;
  }
  export type EligibilityStatus = {
    generate_images: boolean;
  }
}
import Service from "./Service";