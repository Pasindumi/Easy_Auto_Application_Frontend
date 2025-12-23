// app/dummydata/payment.ts

export const paymentData = {
  summary: {
    coverImage: 'blueLogo.png', 
    title: 'Toyota Yaris Cross 2025',
    price: 'LKR 12,500,000',
    date: '2025-12-03',
    payout: '2025-12-15',
    invoice: '#INV00258',
  },
  seller: {
    name: 'Imasha Perera',
    contact: '+94 712345678',
    address: 'No. 101, Galle Road, Colombo',
    email: 'imasha@email.com',
  },
  orderItems: [
    { label: 'Premium Listing - 30 days', price: 2500 },
    { label: 'Extra Visibility package', price: 1000 },
    { label: 'Featured Product Boost', price: 1500 },
    { label: 'Seasonal Discount', price: -250 },
  ],
  note: 'Your listing will be live as soon as we have payment confirmation. Non-refundable. Please contact our support for disputes or refund.'
};
