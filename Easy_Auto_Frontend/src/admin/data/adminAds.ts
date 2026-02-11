// Admin Ads Management Dummy Data
// Centralized data for ads management page

export type AdStatus = "all" | "active" | "pending" | "rejected" | "expired";

export interface Ad {
  id: string;
  title: string;
  price: string;
  priceNum: number;
  location: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  views: number;
  likes: number;
  messages: number;
  status: "active" | "pending" | "rejected" | "expired";
  postedDate: string;
  expiryDate: string;
  description: string;
  mileage: string;
  year: number;
  fuelType: string;
  transmission: string;
  image: any;
}

// Admin Ads Data
export const ADMIN_ADS_DATA: Ad[] = [
  {
    id: "1",
    title: "BMW 3 Series 2021",
    price: "$45,000",
    priceNum: 45000,
    location: "Malabe, Sri Lanka",
    userName: "John Doe",
    userEmail: "john@example.com",
    userPhone: "+94 77 123 4567",
    views: 1200,
    likes: 50,
    messages: 15,
    status: "pending",
    postedDate: "2024-12-05",
    expiryDate: "2025-01-05",
    description:
      "Well-maintained BMW 3 Series with full service history. Single owner, accident-free.",
    mileage: "45,000 km",
    year: 2021,
    fuelType: "Petrol",
    transmission: "Automatic",
    image: require("../../../assets/images/car.jpg"),
  },
  {
    id: "2",
    title: "Mercedes-Benz C-Class",
    price: "$52,000",
    priceNum: 52000,
    location: "Colombo, Sri Lanka",
    userName: "Jane Smith",
    userEmail: "jane@example.com",
    userPhone: "+94 77 234 5678",
    views: 850,
    likes: 32,
    messages: 8,
    status: "active",
    postedDate: "2024-12-04",
    expiryDate: "2025-01-04",
    description:
      "Luxury sedan in pristine condition. Premium features and excellent performance.",
    mileage: "32,000 km",
    year: 2022,
    fuelType: "Diesel",
    transmission: "Automatic",
    image: require("../../../assets/images/car.jpg"),
  },
  {
    id: "3",
    title: "Nissan GTR R35",
    price: "$56,000",
    priceNum: 56000,
    location: "Galle, Sri Lanka",
    userName: "Mike Johnson",
    userEmail: "mike@example.com",
    userPhone: "+94 77 345 6789",
    views: 2100,
    likes: 150,
    messages: 60,
    status: "rejected",
    postedDate: "2024-12-03",
    expiryDate: "2025-01-03",
    description:
      "High-performance sports car. Modified with aftermarket parts.",
    mileage: "28,000 km",
    year: 2020,
    fuelType: "Petrol",
    transmission: "Automatic",
    image: require("../../../assets/images/car.jpg"),
  },
  {
    id: "4",
    title: "Toyota Supra 2020",
    price: "$50,000",
    priceNum: 50000,
    location: "Kandy, Sri Lanka",
    userName: "Sarah Williams",
    userEmail: "sarah@example.com",
    userPhone: "+94 77 456 7890",
    views: 900,
    likes: 25,
    messages: 10,
    status: "active",
    postedDate: "2024-12-02",
    expiryDate: "2025-01-02",
    description:
      "Iconic sports car in excellent condition. Low mileage, well maintained.",
    mileage: "15,000 km",
    year: 2020,
    fuelType: "Petrol",
    transmission: "Automatic",
    image: require("../../../assets/images/car.jpg"),
  },
  {
    id: "5",
    title: "Honda Civic Type R",
    price: "$38,000",
    priceNum: 38000,
    location: "Negombo, Sri Lanka",
    userName: "David Brown",
    userEmail: "david@example.com",
    userPhone: "+94 77 567 8901",
    views: 680,
    likes: 20,
    messages: 7,
    status: "pending",
    postedDate: "2024-12-01",
    expiryDate: "2025-01-01",
    description: "Hot hatch with aggressive styling. Perfect for enthusiasts.",
    mileage: "22,000 km",
    year: 2021,
    fuelType: "Petrol",
    transmission: "Manual",
    image: require("../../../assets/images/car.jpg"),
  },
  {
    id: "6",
    title: "Audi A4 2022",
    price: "$48,000",
    priceNum: 48000,
    location: "Gampaha, Sri Lanka",
    userName: "Emily Davis",
    userEmail: "emily@example.com",
    userPhone: "+94 77 678 9012",
    views: 1500,
    likes: 75,
    messages: 22,
    status: "expired",
    postedDate: "2024-11-28",
    expiryDate: "2024-12-28",
    description:
      "Premium sedan with advanced technology. Comfortable and efficient.",
    mileage: "18,000 km",
    year: 2022,
    fuelType: "Diesel",
    transmission: "Automatic",
    image: require("../../../assets/images/car.jpg"),
  },
];
