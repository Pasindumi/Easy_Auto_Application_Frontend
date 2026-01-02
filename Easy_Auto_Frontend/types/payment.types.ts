export type PaymentStatus = 'Successful' | 'Failed' | 'Refunded';

export interface Payment {
    id: string;
    date: string;
    plan: string;
    type: string;
    amount: string;
    status: PaymentStatus;
    card: string;
}

export interface PaymentSummaryData {
    totalPayments: number;
    successful: number;
    failed: number;
    refunded: number;
    totalSpent: string;
}

export interface CreditCard {
    id: string;
    type: string;
    number: string;
    holderName: string;
    expiryDate: string;
    icon: any;
    backgroundColor: string;
}

export interface PaymentMethod {
    id: string;
    name: string;
    icon: any;
}

export interface OrderItem {
    label: string;
    price: number;
}

export interface PaymentSeller {
    name: string;
    contact: string;
    address: string;
    email: string;
}

export interface PaymentDetailSummary {
    title: string;
    price: string;
    coverImage: any;
    date: string;
    payout: string;
    invoice: string;
}
