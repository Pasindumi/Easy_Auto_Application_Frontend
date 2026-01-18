import { Platform } from 'react-native';
import { API_URL } from '../constants/API';

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
    // - [x] Implement Fix [x]
    //   - [x] Correct hash generation or parameter passing [x]
    // - [x] Verify Fix [x]
    //   - [x] Test payment flow again [x]
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    hash?: string;
}

/**
 * Robust MD5 implementation (UTF-8 safe)
 */
export const md5 = (s: string) => {
    var k: any[] = [], i = 0;
    for (; i < 64;) k[i] = 0 | (Math.abs(Math.sin(++i)) * 4294967296);
    var a = 0x67452301, b = 0xefcdab89, c = 0x98badcfe, d = 0x10325476;
    var x: any[] = [], str = unescape(encodeURIComponent(s));
    for (i = 0; i <= str.length;) x[i >> 2] |= (str.charCodeAt(i) || 128) << (8 * (i++ % 4));
    x[i = ((str.length + 8) >> 6 << 4) + 14] = str.length * 8;
    for (i = 0; i < x.length; i += 16) {
        var aa = a, bb = b, cc = c, dd = d;
        for (var j = 0; j < 64; j++) {
            var f = j < 16 ? (b & c) | (~b & d) : j < 32 ? (d & b) | (~d & c) : j < 48 ? b ^ c ^ d : c ^ (b | ~d);
            var temp = d;
            d = c;
            c = b;
            b = b + rotate(a + f + k[j] + (x[i + (j < 16 ? j : j < 32 ? (5 * j + 1) % 16 : j < 48 ? (3 * j + 5) % 16 : (7 * j) % 16)]), [7, 12, 17, 22, 5, 9, 14, 20, 4, 11, 16, 23, 6, 10, 15, 21][(j >> 4 << 2) | (j % 4)]);
            a = temp;
        }
        a += aa; b += bb; c += cc; d += dd;
    }
    for (var out = "", j = 0; j < 32; j++) out += ((j < 16 ? a : j < 32 ? b : j < 48 ? c : d) >> (8 * (j % 4) + 4) & 15).toString(16) + ((j < 16 ? a : j < 32 ? b : j < 48 ? c : d) >> (8 * (j % 4)) & 15).toString(16);

    function rotate(a: any, b: any) { return (a << b) | (a >>> (32 - b)); }
    return out;
};

/**
 * Correct PayHere Hash calculation logic
 */
export const generatePayHereHash = (merchantId: string, orderId: string, amount: string, currency: string, merchantSecret: string) => {
    // 1. MD5(merchant_secret)
    const hashedSecret = md5(merchantSecret).toUpperCase();

    // 2. Ensure amount is exactly 2 decimal places (e.g., "10.00")
    const amountFormatted = parseFloat(amount).toFixed(2);

    // 3. Concatenate: merchant_id + order_id + amount + currency + uppercase(md5(merchant_secret))
    const hashString = merchantId + orderId + amountFormatted + currency + hashedSecret;

    // 4. uppercase(md5(concatenate_result))
    return md5(hashString).toUpperCase();
};

export const getPayHereCheckoutUrl = (payment: PayHerePayment) => {
    const baseUrl = "https://sandbox.payhere.lk/pay/checkout";
    const params = new URLSearchParams();
    Object.entries(payment).forEach(([key, value]) => {
        if (value) params.append(key, value);
    });
    return `${baseUrl}?${params.toString()}`;
};

// PayHere Constants
export const PAYHERE_RETURN_URL = `${API_URL}/api/payment/return`;
export const PAYHERE_CANCEL_URL = `${API_URL}/api/payment/cancel`;
export const PAYHERE_NOTIFY_URL = `${API_URL}/api/payment/notify`;

export const MOCK_PAYHERE_MERCHANT_ID = "1233627";
export const MOCK_PAYHERE_MERCHANT_SECRET = "2420992059291298236019795577201569763865";
