export default class CloudLibraryService extends Service {
    _serviceUri: any;
    getFile({ fileId }: CloudLibrary.FileInputParameter): Promise<CloudLibrary.File>;
}
export namespace CloudLibrary {
    export type File = {
        id: number;
        file_name: string;
        mime_type: string;
        size: number;
        method: string;
        url: string;
        headers?: {
            [x: string]: string;
        };
        expiry: string;
    };
    export type FileInputParameter = {
        fileId: string;
    };
}
import Service from './Service';
