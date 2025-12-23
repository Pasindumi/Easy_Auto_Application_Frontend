// app/dummydata/rent.ts

export const RENTAL_PACKAGES = [
  {
    id: '1',
    duration: 'Daily',
    price: 'From Rs. 4,000/day',
    description: 'Perfect for short trips',
  },
  {
    id: '2',
    duration: 'Weekly',
    price: 'From Rs. 24,000/week',
    description: 'Save 15% on weekly rentals',
  },
  {
    id: '3',
    duration: 'Monthly',
    price: 'From Rs. 80,000/month',
    description: 'Best value for long term',
  },
];

// app/dummydata/availableCars.ts

export const RENTAL_CARS = [
  {
    id: '1',
    name: 'Toyota Camry 2023',
    price: 'Rs. 5,000/day',
    features: ['Automatic', 'AC', 'GPS'],
    image: require('@/assets/images/car.jpg'),
  },
  {
    id: '2',
    name: 'Honda Civic 2022',
    price: 'Rs. 4,500/day',
    features: ['Automatic', 'AC'],
    image: require('@/assets/images/car.jpg'),
  },
  {
    id: '3',
    name: 'BMW 3 Series 2023',
    price: 'Rs. 12,000/day',
    features: ['Automatic', 'AC', 'GPS', 'Premium'],
    image: require('@/assets/images/car.jpg'),
  },
  {
    id: '4',
    name: 'Nissan Altima 2022',
    price: 'Rs. 4,000/day',
    features: ['Automatic', 'AC'],
    image: require('@/assets/images/car.jpg'),
  },
];

