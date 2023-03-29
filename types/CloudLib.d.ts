export default class CloudLibService extends Service {
  getFiles({ fileId }: { fileId: string }): Promise<CloudLib.FileDetail>;
}

export namespace CloudLib {
  export type FileDetail = {
    id: string;
    file_name: string;
    mime_type: string;
    size: number;
    download:DownloadDetail
  }
  export type DownloadDetail = {
    request: RequestDetail;
    expiry: string
  }
  export type RequestDetail = {
    method: string;
    url: string;
  }
}

import Service from "./Service";