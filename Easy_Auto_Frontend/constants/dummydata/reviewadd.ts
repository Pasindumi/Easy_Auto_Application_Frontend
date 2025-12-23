export type Listing = 
{
  title: string;
  subtitle: string;
  price: string;
  views: number;
  brand: string;
  model: string;
  engine: string;
  fuelType: string;
  mileage: string;
  transmission: string;
  description: string;
  coverImage: string | number;
  gallery: (string | number)[];
  seller: { name: string; location: string; email: string };
};


export const dummyData: Listing = {
  title: 'TOYOTA YARIS CROSS',
  subtitle: 'The Smart Urban SUV',
  price: 'Rs 122,500,000',
  views: 1705,
  brand: 'Toyota',
  model: 'Yaris Cross',
  engine: '1496 CC',
  fuelType: 'Petrol/Hybrid',
  mileage: '28 kmpl',
  transmission: 'Auto',
  description:
    'The all-new Toyota Yaris Cross combines compact SUV styling with advanced safety and hybrid technology. Enjoy a comfortable ride with premium upholstery, smart connectivity, and excellent fuel efficiency.',
  coverImage: require('@/assets/images/review1.jpg'),
  gallery: [
    require('@/assets/images/review2.jpg'),
    require('@/assets/images/review3.jpg'),
    require('@/assets/images/review4.jpg'),
    require('@/assets/images/review5.jpg'),
    require('@/assets/images/review1.jpg'),
  ],
  seller: {
    name: 'SKY AUTOMOBILE PVT LTD',
    location: 'Negombo',
    email: 'skyautomobile@gmail.com',
  },
};
