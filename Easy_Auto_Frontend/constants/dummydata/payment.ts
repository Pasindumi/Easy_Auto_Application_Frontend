export const paymentData = {
    summary: {
        title: 'TOYOTA YARIS CROSS',
        price: 'Rs 122,500,000',
        coverImage: require('@/assets/images/review1.jpg'),
        date: '2025-12-03',
        payout: '2025-12-15',
        invoice: '#INV00258',
    },
    seller: {
        name: 'SKY AUTOMOBILE PVT LTD',
        contact: '+94 77 123 4567',
        address: 'No. 101, Galle Road, Colombo',
        email: 'skyautomobile@gmail.com',
    },
    orderItems: [
        { label: 'Premium Listing - 30 days', price: 2500 },
        { label: 'Extra Visibility package', price: 1000 },
        { label: 'Featured Product Boost', price: 1500 },
        { label: 'Seasonal Discount', price: -250 },
    ],
    note: 'Your listing will be live as soon as we have payment confirmation. Non-refundable. Please contact our support for disputes or refund.',
};
