// dummydata/ads.ts
// Dummy ads moved out for easier reuse / backend swap.
// Keep the path consistent with imports in app/my-ads.tsx

export interface Ad {
  id: string;
  title: string;
  price: string;
  location: string;
  views: number;
  likes: number;
  messages: number;
  status: 'active' | 'draft' | 'expired' | 'paused';
  image: any; // Use require(...) for local images
}

export const ADS_DATA: Ad[] = [
  {
    id: '1',
    title: 'BMW 3 Series 2021',
    price: '$45,000',
    location: 'Malabe, Sri Lanka',
    views: 1200,
    likes: 50,
    messages: 15,
    status: 'active',
    image: require('@/assets/images/car1.jpg'),
  },
  {
    id: '2',
    title: 'BMW 3 Series 2021 (Black)',
    price: '$45,000',
    location: 'Malabe, Sri Lanka',
    views: 850,
    likes: 12,
    messages: 8,
    status: 'draft',
    image: require('@/assets/images/car.jpg'),
  },
  {
    id: '3',
    title: 'Nissan GTR R35',
    price: '$56,000',
    location: 'Galle, Sri Lanka',
    views: 2100,
    likes: 150,
    messages: 60,
    status: 'expired',
    image: require('@/assets/images/car4.jpg'),
  },
  {
    id: '4',
    title: 'Toyota Supra 2020',
    price: '$50,000',
    location: 'Colombo, Sri Lanka',
    views: 900,
    likes: 25,
    messages: 10,
    status: 'active',
    image: require('@/assets/images/car3.jpg'),
  },
  {
    id: '5',
    title: 'Honda Civic Type R',
    price: '$38,000',
    location: 'Kandy, Sri Lanka',
    views: 680,
    likes: 20,
    messages: 7,
    status: 'active',
    image: require('@/assets/images/car1.jpg'),
  },
];
