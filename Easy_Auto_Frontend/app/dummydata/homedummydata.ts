export const CATEGORIES = [
    { name: "All", count: 24 },
    { name: "SUV", count: 8 },
    { name: "Sedan", count: 10 },
    { name: "Hatchback", count: 4 },
    { name: "Sports", count: 2 },
];

export const TRENDING_CARS = [
    {
        id: 1,
        model: "Nissan GTR R35",
        location: "Badulla, Sri Lanka",
        mileage: "180,000Km",
        price: "$75,000",
        image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop",
        status: "Hot Deal",
        rating: 4.8,
        fuelEfficiency: "12 km/l",
        transmission: "Manual",
        dealer: "AutoMax Dealers",
        verifiedDealer: true,
        views: 12,
        isNewArrival: false,
        stockLeft: 3,
        year: 2020,
        images: 5,
    },
    {
        id: 2,
        model: "Range Rover Sport",
        location: "Colombo, Sri Lanka",
        mileage: "120,000Km",
        price: "$85,000",
        image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&h=600&fit=crop",
        status: "Certified",
        rating: 4.9,
        fuelEfficiency: "10 km/l",
        transmission: "Automatic",
        dealer: "Premium Motors",
        verifiedDealer: true,
        views: 8,
        isNewArrival: true,
        stockLeft: null,
        year: 2021,
        images: 8,
    },
    {
        id: 3,
        model: "Toyota Camry",
        location: "Kandy, Sri Lanka",
        mileage: "95,000Km",
        price: "$28,000",
        image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&h=600&fit=crop",
        status: "New",
        rating: 4.7,
        fuelEfficiency: "15 km/l",
        transmission: "Automatic",
        dealer: "Toyota Lanka",
        verifiedDealer: true,
        views: 15,
        isNewArrival: true,
        stockLeft: null,
        year: 2023,
        images: 6,
    },
    {
        id: 4,
        model: "BMW 3 Series",
        location: "Galle, Sri Lanka",
        mileage: "150,000Km",
        price: "$45,000",
        image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop",
        status: "Hot Deal",
        rating: 4.6,
        fuelEfficiency: "13 km/l",
        transmission: "Automatic",
        dealer: "BMW Premium",
        verifiedDealer: true,
        views: 20,
        isNewArrival: false,
        stockLeft: 2,
        year: 2019,
        images: 7,
    },
    {
        id: 5,
        model: "Mercedes C-Class",
        location: "Negombo, Sri Lanka",
        mileage: "110,000Km",
        price: "$52,000",
        image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop",
        status: "Certified",
        rating: 4.8,
        fuelEfficiency: "12 km/l",
        transmission: "Automatic",
        dealer: "Mercedes Elite",
        verifiedDealer: true,
        views: 18,
        isNewArrival: false,
        stockLeft: null,
        year: 2020,
        images: 9,
    },
];

export const RECOMMENDED_CARS = [
    {
        id: 1,
        name: "Nissan Juke 2025",
        distance: "2.5km away",
        price: "$4,000",
        image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&h=600&fit=crop",
        status: "New",
        rating: 4.6,
        reason: "Similar to your saved cars",
        matchScore: 95,
        fuelEfficiency: "18 km/l",
        transmission: "Automatic",
    },
    {
        id: 2,
        name: "Honda Civic 2024",
        distance: "5.2km away",
        price: "$3,500",
        image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop",
        status: "Certified",
        rating: 4.5,
        reason: "Based on your searches",
        matchScore: 88,
        fuelEfficiency: "20 km/l",
        transmission: "Manual",
    },
    {
        id: 3,
        name: "BMW 3 Series",
        distance: "3.8km away",
        price: "$12,000",
        image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop",
        status: "Hot Deal",
        rating: 4.9,
        reason: "Popular in your area",
        matchScore: 92,
        fuelEfficiency: "15 km/l",
        transmission: "Automatic",
    },
];

export const RECENTLY_VIEWED = [
    {
        id: 1,
        name: "Toyota Camry 2023",
        price: "$25,000",
        image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&h=600&fit=crop",
        viewedAt: "2 hours ago",
    },
    {
        id: 2,
        name: "Honda Accord 2024",
        price: "$28,000",
        image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop",
        viewedAt: "5 hours ago",
    },
    {
        id: 3,
        name: "Mazda CX-5",
        price: "$32,000",
        image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop",
        viewedAt: "1 day ago",
    },
];

export const FEATURED_BRANDS = [
    {
        name: "Toyota",
        logo: require("@/assets/images/vehicle logo/toyota.svg"),
        carCount: 1234,
        featured: true,
    },
    {
        name: "Honda",
        logo: require("@/assets/images/vehicle logo/honda.svg"),
        carCount: 987,
        featured: true,
    },
    {
        name: "BMW",
        logo: null,
        carCount: 756,
        featured: true,
    },
    {
        name: "Mercedes",
        logo: null,
        carCount: 654,
        featured: true,
    },
];

export const ALL_BRANDS = [
    {
        name: "Toyota",
        logo: require("@/assets/images/vehicle logo/toyota.svg"),
        carCount: 1234,
    },
    {
        name: "Honda",
        logo: require("@/assets/images/vehicle logo/honda.svg"),
        carCount: 987,
    },
    {
        name: "Jeep",
        logo: require("@/assets/images/vehicle logo/jeep.svg"),
        carCount: 456,
    },
    {
        name: "Hyundai",
        logo: require("@/assets/images/vehicle logo/hyundai.svg"),
        carCount: 789,
    },
    {
        name: "Nissan",
        logo: require("@/assets/images/vehicle logo/nissan.svg"),
        carCount: 654,
    },
    { name: "BMW", logo: null, carCount: 756 },
    { name: "Mercedes", logo: null, carCount: 654 },
    {
        name: "Volkswagen",
        logo: require("@/assets/images/vehicle logo/volkswagen.svg"),
        carCount: 543,
    },
    {
        name: "KIA",
        logo: require("@/assets/images/vehicle logo/kia.svg"),
        carCount: 432,
    },
    { name: "Audi", logo: null, carCount: 321 },
    {
        name: "Tesla",
        logo: require("@/assets/images/vehicle logo/tesla.svg"),
        carCount: 234,
    },
    {
        name: "Land Rover",
        logo: require("@/assets/images/vehicle logo/land.svg"),
        carCount: 189,
    },
];

export const COMPARISONS = [
    {
        id: 1,
        car1: {
            name: "Toyota",
            model: "Glanza",
            price: "Rs.13.11 Lakh onwards",
            image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=300&h=200&fit=crop",
        },
        car2: {
            name: "Range Rover",
            model: "Evoque",
            price: "Rs.12.45 Lakh onwards",
            image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=300&h=200&fit=crop",
        },
    },
    {
        id: 2,
        car1: {
            name: "BMW",
            model: "3 Series",
            price: "Rs.45.50 Lakh onwards",
            image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=300&h=200&fit=crop",
        },
        car2: {
            name: "Mercedes",
            model: "C-Class",
            price: "Rs.42.30 Lakh onwards",
            image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=300&h=200&fit=crop",
        },
    },
];

export const TESTIMONIALS = [
    {
        name: "Tharushi Silva",
        rating: 5,
        quote: "Found my dream benz in just 2 days! Great platform and amazing deals.",
        avatar: "👩",
        date: "2 days ago",
    },
    {
        name: "John Doe",
        rating: 5,
        quote: "Excellent service and great selection of cars. Highly recommended!",
        avatar: "👨",
        date: "1 week ago",
    },
];

export const DAILY_DEALS = [
    {
        id: 1,
        name: "BMW 5 Series",
        originalPrice: "$45,000",
        dealPrice: "$38,000",
        discount: "15% OFF",
        image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop",
    },
    {
        id: 2,
        name: "Mercedes E-Class",
        originalPrice: "$50,000",
        dealPrice: "$42,000",
        discount: "16% OFF",
        image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&h=300&fit=crop",
    },
];

export const NOTIFICATIONS = [
    {
        id: 1,
        title: "New car matches your search",
        message: "5 new listings for Toyota Camry",
        time: "2 min ago",
        type: "match",
        unread: true,
    },
    {
        id: 2,
        title: "Price drop alert",
        message: "BMW 3 Series price reduced by $2,000",
        time: "15 min ago",
        type: "price",
        unread: true,
    },
    {
        id: 3,
        title: "Deal of the day",
        message: "Special offer on Honda Civic",
        time: "1 hour ago",
        type: "deal",
        unread: false,
    },
];

export const WISHLIST_ITEMS = [
    {
        id: 1,
        name: "Toyota Camry 2024",
        price: "$25,000",
        image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=200&h=150&fit=crop",
        addedAt: "2 days ago",
    },
    {
        id: 2,
        name: "Honda Civic 2023",
        price: "$22,000",
        image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=200&h=150&fit=crop",
        addedAt: "5 days ago",
    },
    {
        id: 3,
        name: "BMW 3 Series",
        price: "$35,000",
        image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=200&h=150&fit=crop",
        addedAt: "1 week ago",
    },
];
export const FLASH_SALES = [
    {
        id: 1,
        title: "MEGA LIGHTNING DEAL",
        subtitle: "Premium Sedans - Flat 25% Off",
        timer: "02:14:55",
        color: "#BF360C", // Darker Orange-Red
        icon: "⚡"
    },
    {
        id: 2,
        title: "NIGHT OWL SPECIAL",
        subtitle: "Luxury SUVs - Extra $5000 Off",
        timer: "05:12:10",
        color: "#7B1FA2", // Darker Purple
        icon: "🌙"
    },
    {
        id: 3,
        title: "WEEKEND WARRIOR",
        subtitle: "Off-Road Jeeps - Free Insurance",
        timer: "48:00:00",
        color: "#2E7D32", // Darker Green
        icon: "🚜"
    }
];
