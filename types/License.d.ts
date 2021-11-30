export default class License extends Service {
    getLicenses({ appName, appVersion, term }?: {
        appName: string;
        appVersion: string;
        term: string;
    }): Promise<any>;
    getProductType(productTypeId: number): Promise<any>;
    getProductTypes({ appName, appVersion, term }?: {
        appName: string;
        appVersion: string;
        term: string;
    }): Promise<any>;
    getProducts({ appName, appVersion, term, showLicenceActivations }?: {
        appName: string;
        appVersion: string;
        term: string;
    }): Promise<any>;
    addProduct({ hostMachineId, productTypeId, productSerialNumber }?: {
        hostMachineId: string;
        productTypeId: number;
        productSerialNumber: string;
    }): Promise<any>;
    updateProduct({ productId, ilokUserId }?: {
        productId: string;
        ilokUserId: string;
    }): Promise<any>;
    addLicenseAuthorization({ action, appName, appVersion, hostMachineId, hostMachineName, licenseId, systemTime }?: {
        action: string;
        appName: string;
        appVersion: string;
        hostMachineId: string;
        hostMachineName: string;
        licenseId: number;
        systemTime: string;
    }): Promise<any>;
    updateLicenseAuthorization({ authorizationId, statusCode }?: {
        authorizationId: number;
        statusCode: number;
    }): Promise<any>;
}
import Service from "./Service";
