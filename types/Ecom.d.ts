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
    paymentGatewayToken(): Promise<Ecom.PaymentGatewayToken>;
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
    getCart({ cartId }: {
        cartId: string;
    }): Promise<Ecom.Cart>;
    createCart({ products, couponCode }: {
        products: Ecom.ProductItem[];
        couponCode?: string;
    }): Promise<Ecom.Cart>;
    updateCartBillingAddress({ cartId, billingAddress }: {
        cartId: string;
        billingAddress?: Omit<Ecom.CartBillingAddress, 'country_code'>;
    }): Promise<Ecom.Cart>;
    updateCartCouponCode({ cartId, couponCode }: {
        cartId: string;
        couponCode?: string | null;
    }): Promise<Ecom.Cart>;
}
export namespace Ecom {
    export type SubscriptionGroup = 'dj' | 'wailshark' | 'sample' | 'serato_studio';
    export type SubscriptionStatus = 'Active' | 'Canceled' | 'Past Due' | 'Expired' | 'Pending' | 'Expiring';
    export type DiscountSource = 'order_promotion' | 'voucher_promotion' | 'voucher_retail' | 'voucher_offer';
    export type OrderStatus = 'complete' | 'pending_payment' | 'cancel' | 'fraud';
    export type CatalogProductFeature = 'dj' | 'dvs' | 'video' | 'fx' | 'pnt_dj' | 'flip' | 'play' | 'studio';
    export type PaymentMethodType = 'CreditCard' | 'PayPal';
    export type SubscriptionPlanChangeStatus = 'complete' | 'pending' | 'invalid';
    export type VoucherTypeCategory = 'promotion' | 'retention-offer' | 'upsell-offer, `retail';
    export type InvoiceMimeType = 'application/json' | 'application/pdf' | 'text/html';
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
        token: string;
        paypal_environment: string;
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
    export type VoucherList = {
        items: UserVoucher[];
    };
    export type RecommendationsList = {
        items: CatalogProduct[];
    };
    export type CartBillingAddress = {
        first_name?: string;
        last_name?: string;
        company?: string;
        address?: string;
        address_extended?: string;
        city?: string;
        post_code?: string;
        region?: string;
        country_code: string;
    };
    export type Promotion = {
        description: string;
        discount_fixed_amount?: number;
        discount_percentage?: number;
        billing_cycle_duration?: number;
    };
    export type ProductType = {
        id: number;
        name: string;
        subscription_start_date?: string;
        subscription_billing_period?: number;
        prepaid_credit_in_days?: number;
    };
    export type CartItem = {
        id: number;
        product_type: ProductType;
        quantity: number;
        base_amount: number;
        total_amount: number;
        tax_amount: number;
        tax_rate: number;
        error_code?: number;
        subscription_start_date?: string;
        prepaid_credit_in_days?: number;
        subscription_billing_period?: number;
        promotion?: Promotion[];
    };
    export type Cart = {
        uuid: string;
        items: CartItem[];
        total_amount: number;
        subtotal_amount: number;
        tax_amount: number;
        currency: string;
        created_at: string;
        updated_at: string;
        billing_address?: CartBillingAddress;
        coupon_code?: string;
    };
    export type ProductItem = {
        product_type_id: number;
        quantity: number;
    };
}
import Service from "./Service";
