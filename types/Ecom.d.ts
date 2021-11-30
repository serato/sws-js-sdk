export default class Ecom extends Service {
    getSubscriptions(): Promise<any>;
    getOrders({ orderStatus }?: {
        orderStatus: any;
    }): Promise<any>;
    getCatalogProducts(): Promise<any>;
    addPaymentMethod({ nonce, deviceData, billingAddressId }?: {
        nonce: any;
        deviceData: any;
        billingAddressId: any;
    }): Promise<any>;
    paymentGatewayToken(): Promise<any>;
    getPaymentMethods(): Promise<any>;
    updateSubscription({ subscriptionId, paymentToken, numberOfBillingCycle }: {
        subscriptionId: string;
        paymentToken: string;
        numberOfBillingCycle: number;
    }): Promise<any>;
    deletePaymentMethod(paymentToken: any): Promise<any>;
    updatePaymentMethod({ paymentToken, nonce, deviceData, billingAddressId }: {
        paymentToken: string;
        nonce: string;
        deviceData: string;
        billingAddressId: string;
    }): Promise<any>;
    addSubscriptionPlanChangeRequest({ subscriptionId, catalogProductId, immediate }: {
        subscriptionId: string;
        catalogProductId: number;
    }): Promise<any>;
    getInvoice(orderId: any, invoiceId: any, accept?: string): Promise<any>;
    confirmSubscriptionPlanChangeRequest({ subscriptionId, planChangeRequestId }: {
        subscriptionId: string;
        planChangeRequestId: number;
    }): Promise<any>;
    retrySubscriptionCharge({ subscriptionId }: {
        subscriptionId: any;
    }): Promise<any>;
    cancelSubscription({ subscriptionId }: {
        subscriptionId: string;
    }): Promise<any>;
    getVouchers(): Promise<any>;
    assignVoucher({ voucherId }: string): Promise<any>;
    redeemVoucher({ voucherId }: string): Promise<any>;
    getRecommendations({ appName, appVersion, catalogCategory }?: {
        appName: string;
        appVersion: string;
        catalogCategory: string;
    }): Promise<any>;
}
import Service from "./Service";
