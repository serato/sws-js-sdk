export default class LicenseService extends Service {
    _serviceUri: any;
    getLicenses({ appName, appVersion, term }?: {
        appName?: string;
        appVersion?: string;
        term?: string;
    }): Promise<License.LicenseList>;
    getProductType(productTypeId: number): Promise<License.ProductType>;
    getProductTypes({ appName, appVersion, term }?: {
        appName?: string;
        appVersion?: string;
        term?: string;
    }): Promise<License.ProductTypeList>;
    getProducts({ appName, appVersion, term, showLicenceActivations }?: {
        appName?: string;
        appVersion?: string;
        term?: string;
        showLicenceActivations?: 'true' | 'false';
    }): Promise<License.ProductList>;
    addProduct({ hostMachineId, productTypeId, productSerialNumber }: {
        hostMachineId?: string;
        productTypeId?: number;
        productSerialNumber?: string;
    }): Promise<License.Product>;
    updateProduct({ productId, ilokUserId }: {
        productId: string;
        ilokUserId: string;
    }): Promise<License.Product>;
    addLicenseAuthorization({ action, appName, appVersion, hostMachineId, hostMachineName, licenseId, systemTime }?: {
        action: string;
        appName: string;
        appVersion: string;
        hostMachineId: string;
        hostMachineName: string;
        licenseId: number;
        systemTime: string;
    }): Promise<License.LicenseAuthorizationList>;
    updateLicenseAuthorization({ authorizationId, statusCode }: {
        authorizationId: number;
        statusCode: number;
    }): Promise<License.RefreshTokenList>;
}
export namespace License {
    export type RlmLicenseFileContents = string;
    export type LicenseTerm = 'permanent' | 'subscription' | 'trial' | 'timelimited';
    export type HostApplicationId = 'dj' | 'dj_lite' | 'serato_sample' | 'wailshark' | 'serato_studio';
    export type HostApplication = {
        id: HostApplicationId;
        version: string;
    };
    export type HostMachine = {
        hardware_id: string;
        canonical_hardware_id: string;
        name: string;
        activated_at: string;
    };
    export type Activation = {
        app: HostApplication;
        machine: HostMachine;
    };
    export type RlmSchema = {
        name: string;
        version: string;
        options?: string;
    };
    export type LicenseType = {
        id: number;
        name: string;
        term: LicenseTerm;
        expires_days?: number;
        rlm_schema?: RlmSchema;
    };
    export type IlokToken = {
        token: string;
        user_id?: string;
        url: string;
    };
    export type License = {
        id: string;
        user_id?: number;
        activations: Activation[];
        activation_limit: number;
        license_type: LicenseType;
        valid_to?: string;
        expires_in_days?: number;
        rlm_license_file?: RlmLicenseFileContents;
        ilok?: IlokToken;
        subscription_status?: import("./Ecom").Ecom.SubscriptionStatus;
        deleted: boolean;
    };
    export type LicenseList = {
        items: License[];
    };
    export type ProductLicenseType = {
        count: number;
        license_type: LicenseType;
    };
    export type ProductType = {
        id: number;
        name: string;
        license_types?: ProductLicenseType[];
        trial_resets?: string[];
        upgrade_from?: number[];
        upgrade_to?: number[];
    };
    export type ProductTypeList = {
        items: ProductType[];
    };
    export type Product = {
        id: string;
        date_created: string;
        user_id?: number;
        licenses: License[];
        product_type: ProductType;
        magento_order_id?: number;
        magento_order_item_id?: number;
        checkout_order_id?: number;
        checkout_order_item_id?: number;
        deleted: boolean;
        subscription_status?: import("./Ecom").Ecom.SubscriptionStatus;
    };
    export type ProductList = {
        items: Product[];
    };
    export type LicenseAuthorizationList = {
        authorization_id: number;
        licenses: License[];
    };
    export type RefreshTokenList = {
        result: 'true';
        refresh_token_id: string[];
    };
}
import Service from './Service';
