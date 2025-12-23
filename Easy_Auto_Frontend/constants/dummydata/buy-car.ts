import { BuyCarItem, CarCategory } from "../../types/buy-car.types";

export const CATEGORIES: CarCategory[] = [
    { key: 'car', label: 'Car', icon: 'car-sport' },
    { key: 'van', label: 'Van', icon: 'car' },
    { key: 'cab', label: 'Cab', icon: 'taxi' },
    { key: 'suv', label: 'SUV', icon: 'car-sport' },
    { key: 'lorry', label: 'Lorry', icon: 'car' },
    { key: 'bus', label: 'Bus', icon: 'bus' },
];

export const SUV_CARS: BuyCarItem[] = [
    {
        id: '1',
        title: 'Toyota RAV4',
        year: '2020',
        km: '45,000 Km',
        location: 'Balangoda, Sri Lanka',
        price: 'Rs. 5.6Mn',
        image: require('@/assets/images/car.jpg'),
    },
    {
        id: '2',
        title: 'Nissan Patrol',
        year: '2018',
        km: '56,000 Km',
        location: 'Kurunegala, Sri Lanka',
        price: 'Rs. 6.4Mn',
        image: require('@/assets/images/car.jpg'),
    },
    {
        id: '3',
        title: 'Honda CRV',
        year: '2019',
        km: '38,000 Km',
        location: 'Galle, Sri Lanka',
        price: 'Rs. 5.0Mn',
        image: require('@/assets/images/car.jpg'),
    },
    {
        id: '4',
        title: 'Ford Everest',
        year: '2021',
        km: '22,000 Km',
        location: 'Colombo, Sri Lanka',
        price: 'Rs. 7.2Mn',
        image: require('@/assets/images/car.jpg'),
    },
    {
        id: '5',
        title: 'Nissan Patrol',
        year: '2018',
        km: '56,000 Km',
        location: 'Kurunegala, Sri Lanka',
        price: 'Rs. 6.4Mn',
        image: require('@/assets/images/car.jpg'),
    },
    {
        id: '6',
        title: 'Honda CRV',
        year: '2019',
        km: '38,000 Km',
        location: 'Galle, Sri Lanka',
        price: 'Rs. 5.0Mn',
        image: require('@/assets/images/car.jpg'),
    },
];

export const FILTER_OPTIONS = [
    { key: 'all', label: 'All' },
    { key: 'price-low', label: 'Price: Low to High' },
    { key: 'price-high', label: 'Price: High to Low' },
    { key: 'year-new', label: 'Newest First' },
    { key: 'year-old', label: 'Oldest First' },
];
