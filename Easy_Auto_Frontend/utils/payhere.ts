import { Platform } from 'react-native';

export interface PayHerePayment {
    merchant_id: string;
    return_url: string;
    cancel_url: string;
    notify_url: string;
    order_id: string;
    items: string;
    amount: string;
    currency: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    hash?: string; // Optional for sandbox, required for production
}

/**
 * Constructs the PayHere Sandbox Checkout URL with query parameters.
 * Note: For production, using a hidden form or the PayHere JS SDK (for web) is recommended.
 * For React Native, we can open the URL in a browser/webview.
 */
export const getPayHereCheckoutUrl = (payment: PayHerePayment) => {
    const baseUrl = "https://sandbox.payhere.lk/pay/checkout";

    // Construct query parameters
    const params = new URLSearchParams();
    Object.entries(payment).forEach(([key, value]) => {
        if (value) params.append(key, value);
    });

    return `${baseUrl}?${params.toString()}`;
};

export const MOCK_PAYHERE_MERCHANT_ID = "1211149"; // Replace with actual Sandbox Merchant ID
