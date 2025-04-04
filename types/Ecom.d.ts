export default class EcomService extends Service {
    getSubscriptions(): Promise<Ecom.SubscriptionList>;
    getOrders({ orderStatus }?: {
        orderStatus?: Ecom.OrderStatus;
    }): Promise<Ecom.OrderList>;
    getCatalogProducts(): Promise<Ecom.CatalogProductList>;
    addPaymentMethod({ nonce, deviceData, billingAddressId }: {
        nonce: string;
        deviceData?: string;
        billingAddressId?: string;
    }): Promise<Ecom.PaymentMethod>;
    paymentGatewayToken({ provider }: {
        provider: string;
    }): Promise<Ecom.PaymentGatewayToken>;
    getPaymentMethods(): Promise<Ecom.PaymentMethodList>;
    updateSubscription({ subscriptionId, paymentToken, numberOfBillingCycle }: {
        subscriptionId: string;
        paymentToken: string;
        numberOfBillingCycle: number;
    }): Promise<Ecom.Subscription>;
    deletePaymentMethod(paymentToken: any): Promise<any>;
    updatePaymentMethod({ paymentToken, nonce, deviceData, billingAddressId }: {
        paymentToken: string;
        nonce: string;
        deviceData: string;
        billingAddressId: string;
    }): Promise<Ecom.PaymentMethod>;
    addSubscriptionPlanChangeRequest({ subscriptionId, catalogProductId, immediate }: {
        subscriptionId: string;
        catalogProductId: number;
        immediate?: boolean;
    }): Promise<Ecom.SubscriptionPlanChange>;
    getInvoice(orderId: string, invoiceId: string, accept?: Ecom.InvoiceMimeType): Promise<any>;
    confirmSubscriptionPlanChangeRequest({ subscriptionId, planChangeRequestId }: {
        subscriptionId: string;
        planChangeRequestId: number;
    }): Promise<Ecom.SubscriptionPlanChange>;
    retrySubscriptionCharge({ subscriptionId }: {
        subscriptionId: string;
    }): Promise<Ecom.Subscription>;
    cancelSubscription({ subscriptionId }: {
        subscriptionId: string;
    }): Promise<Ecom.Subscription>;
    getVouchers(): Promise<Ecom.VoucherList>;
    assignVoucher({ voucherId }: {
        voucherId: string;
    }): Promise<Ecom.UserVoucher>;
    redeemVoucher({ voucherId }: {
        voucherId: string;
    }): Promise<Ecom.UserVoucher>;
    getRecommendations({ appName, appVersion, catalogCategory }?: {
        appName?: string;
        appVersion?: string;
        catalogCategory?: string;
    }): Promise<Ecom.RecommendationsList>;
    getProductVoucherOrders(): Promise<Ecom.ProductVoucherOrderList>;
    blacklistProductVoucherOrders({ productVoucherOrderId }: {
        productVoucherOrderId: number;
    }): Promise<Ecom.ProductVoucherOrder>;
    downloadProductVoucherOrder({ productVoucherOrderId }: {
        productVoucherOrderId: number;
    }): Promise<Blob>
    getProductVoucherOrderById({ productVoucherOrderId }: {
        productVoucherOrderId: number;
    }): Promise<Ecom.ProductVoucherOrder>;
    updateProductVoucherOrder({ productVoucherOrderId, vendorName, moneyworksId, poNumber }: {
        productVoucherOrderId: number;
        vendorName: string;
        moneyworksId: string | null;
        poNumber: string | null;
    }): Promise<Ecom.ProductVoucherOrder>;
    getVoucherDetailsById({ voucherId }: {
        voucherId: string;
    }): Promise<Ecom.VoucherDetails>;
    createProductVoucherOrder({ vendorName, poNumber, moneyworksId, language, fileType, voucherBatches }: {
        vendorName: string;
        poNumber: string|null;
        moneyworksId: string|null;
        language: Ecom.ProductVoucherOrderLanguage;
        fileType: Ecom.ProductVoucherOrderFileType;
        voucherBatches: Ecom.ProductVoucherBatchParams[];
    }): Promise<Ecom.ProductVoucherOrder>;
    generateProductVoucherOrder({ productVoucherOrderId }: {
        productVoucherOrderId: number;
    }) : Promise<Ecom.ProductVoucherOrder>;
    getProductVoucherTypes(): Promise<Ecom.ProductVoucherTypeList>;
    updateBillingAddress(
        params: {
            countryCode: string;
            firstName?: string;
            lastName?: string;
            region?: string;
            postCode?: string;
            city?: string;
            company?:string;
            address?: string;
            addressExtended?: string;
        }
    ): Promise<Ecom.BillingAddress>;
}
export namespace Ecom {
    export type SubscriptionGroup = "dj" | "serato_producer_suite";
    export type SubscriptionStatus = "Active" | "Canceled" | "Past Due" | "Expired" | "Pending" | "Expiring";
    export type DiscountSource = "order_promotion" | "voucher_promotion" | "voucher_retail" | "voucher_offer";
    export type OrderStatus = "complete" | "pending_payment" | "cancel" | "fraud";
    export type CatalogProductFeature = "dj" | "dvs" | "video" | "fx" | "pnt_dj" | "flip" | "play" | "studio";
    export type PaymentMethodType = "CreditCard" | "PayPal";
    export type SubscriptionPlanChangeStatus = "complete" | "pending" | "invalid";
    export type VoucherTypeCategory = "promotion" | "retention-offer" | "upsell-offer, `retail";
    export type InvoiceMimeType = "application/json" | "application/pdf" | "text/html";
    export type ProductVoucherOrderStatus = 'pending' | 'in progress' | 'success' | 'failed';
    export type ProductVoucherOrderLanguage = 'en' | 'es' | 'de' | 'fr' | 'pt' | 'pl' | 'ko' | 'blank';
    export type ProductVoucherOrderFileType = 'pdf_and_csv' | 'csv';
    export type ProductVoucherTypeType = 'promotion' | 'retention-offer' | 'upsell-offer' | 'retail';
    export type PaymentProvider = 'braintree';
    export type Discount = {
        name: string;
        amount: number;
        current_billing_cycle: number;
        number_of_billing_cycles: number;
        source: DiscountSource;
    };
    export type SubscriptionPlan = {
        id: string;
        name: string;
        billing_frequency: number;
        active: boolean;
    };
    export type Subscription = {
        id: string;
        user_id: number;
        product_id: string;
        discounts: Discount[];
        current_billing_cycle: number;
        number_of_billing_cycle: number;
        next_billing_date: string;
        first_billing_date: string;
        payment_method_token: string;
        group: SubscriptionGroup;
        plan: SubscriptionPlan;
        next_billing_period_amount: number;
        price: number;
        remaining_days?: number;
        days_until_activation?: number;
        status: SubscriptionStatus;
        tll_product_type_ids?: number[];
        changing_to: string;
        remaining_credit: number;
    };
    export type SubscriptionList = {
        items: Subscription[];
    };
    export type TargetSubscription = {
        next_billing_date: string;
        group: SubscriptionGroup;
        plan: SubscriptionPlan;
        next_billing_period_amount: number;
        actual_plan_price?: number;
    };
    export type SubscriptionPlanChange = {
        id: string;
        user_id: number;
        target_subscription: TargetSubscription;
        current_subscription: Subscription;
        order_id?: string;
        transaction_id?: string;
        status: SubscriptionPlanChangeStatus;
        created_at: string;
        updated_at: string;
        immediate: boolean;
    };
    export type CatalogCategory = {
        id: number;
        name: string;
        description: string;
    };
    export type SubscriptionOptions = {
        allow_concurrent_subscription: number[];
        allow_change_to: number[];
    };
    export type CatalogProduct = {
        id: number;
        name: string;
        subscription: boolean;
        time_limited: boolean;
        trial: boolean;
        available: boolean;
        price: number;
        promotional_price?: number;
        categories: CatalogCategory[];
        subscription_group?: SubscriptionGroup;
        subscription_plan?: SubscriptionPlan;
        product_type_group_id?: number;
        subscription_options?: SubscriptionOptions;
        feature_set: CatalogProductFeature[];
    };
    export type CatalogProductList = {
        items: CatalogProduct[];
    };
    export type OrderItem = {
        id: string;
        quantity: number;
        base_price: number;
        special_price?: number;
        tax_rate: number;
        tax_amount: number;
        total_amount: number;
        catalog_product: CatalogProduct;
    };
    export type Order = {
        id: string;
        user_id: number;
        first_name: string;
        last_name: string;
        address_1?: string;
        address_2?: string;
        city?: string;
        state?: string;
        region_id?: number;
        zip?: string;
        country_code: string;
        items: OrderItem[];
        total_amount: number;
        tax_amount: number;
        invoices: number[];
        status: OrderStatus;
        created_at: string;
        updated_at: string;
    };
    export type OrderList = {
        items: Order[];
    };
    export type PaymentMethod = {
        id: number;
        token: string;
        user_id: number;
        image_url?: string;
        type: PaymentMethodType;
        email?: string;
        payer_id?: string;
        card_type?: string;
        masked_number?: string;
        expiration_date?: string;
        expiration_month?: string;
        expiration_year?: string;
        expired?: boolean;
        created_at: string;
        updated_at: string;
        billing_address_id?: string;
    };
    export type PaymentMethodList = {
        items: PaymentMethod[];
    };
    export type PaymentGatewayToken = {
        client_token: string;
        paypal_environment: string;
        provider: PaymentProvider;
    };
    export type VoucherType = {
        name: string;
        title?: string;
        description?: string;
        type: VoucherTypeCategory;
        short_description?: string;
    };
    export type VoucherRedeemsToProductType = {
        id: number;
    };
    export type VoucherRedeemsToSubscriptionDiscount = {
        subscription_id: number;
        amount: number;
        number_of_billing_cycles: number;
        is_replacement: boolean;
    };
    export type VoucherRedeemsToSubscriptionUpgrade = {
        target_product_type_id: number;
    };
    export type VoucherRedeemsTo = {
        product_type?: VoucherRedeemsToProductType;
        subscription_discount?: VoucherRedeemsToSubscriptionDiscount;
        subscription_upgrade?: VoucherRedeemsToSubscriptionUpgrade;
    };
    export type UserVoucher = {
        id: string;
        user_id: number;
        product_id?: string;
        subscription_id?: string;
        redeemed_by_user_id?: number;
        redeemed_at?: string;
        created_at: string;
        expires_at?: string;
        expires_in_days?: number;
        voucher_type: VoucherType;
        is_redeemable: boolean;
        redeems_to?: VoucherRedeemsTo;
    };
    export type VoucherDetails = {
        voucher_id: string;
        user_id: number | null;
        product_id: string | null;
        subscription_id: string | null;
        redeemed_at: string | null;
        product_voucher_order: ProductVoucherOrder | null;
        product_voucher_batch: ProductVoucherBatch | null;
    };
    export type VoucherList = {
        items: UserVoucher[];
    };
    export type ProductVoucherOrder = {
        id: number;
        vendor_name: string;
        po_number: string;
        moneyworks_id: string;
        voucher_batches: ProductVoucherBatch[];
        created_at: string;
        created_by: number;
        product_vouchers_created_at: string;
        blacklisted_at: string;
        language: ProductVoucherOrderLanguage;
        status: ProductVoucherOrderStatus;
        file_type: ProductVoucherOrderFileType;
    };
    export type ProductVoucherOrderList = {
        items: ProductVoucherOrder[];
    };
    export type ProductVoucherBatch = {
        id: string;
        product_name: string;
        size: number;
    };
    export type ProductVoucherBatchParams = {
        product_voucher_type_id: number;
        quantity: number;
    }
    export type ProductVoucherType = {
        id: number,
        title: string,
        type: ProductVoucherTypeType
    };
    export type ProductVoucherTypeList = {
        items: ProductVoucherType[];
    }
    export type RecommendationsList = {
        items: CatalogProduct[];
    };
    export type BillingAddress = {
        country_code: string;
        first_name?: string;
        last_name?: string;
        region?: string;
        post_code?: string;
        city?: string;
        company?: string;
        address?: string;
        address_extended?: string;
    }
}
import Service from './Service';
