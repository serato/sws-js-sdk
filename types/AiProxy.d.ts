export default class AiProxyService extends Service {
  generateImage({ prompt, provider, resolution, responseFormat }:AiProxy.GenerateImageParams): Promise<AiProxy.Image>;
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
}
import Service from "./Service";