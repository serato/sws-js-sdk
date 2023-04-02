export default class CloudLibraryService extends Service {
  getFile({ fileId }: FileInputParameter): Promise<CloudLibrary.File>;
}

export namespace CloudLibrary {
  export type File = {
    id: string;
    file_name: string;
    mime_type: string;
    size: number;
    download:{
      request: {
        method: 'GET' | 'POST' | 'PUT' | 'DELETE';
        url: string;
        headers?: {
          [headerName: string]: string
        }
      };
      expiry: string
    }
  }
  
  export type FileInputParameter = {
    fileId: string
  }
}

import Service from "./Service";