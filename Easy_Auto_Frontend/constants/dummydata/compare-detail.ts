import { ComparisonVehicle, SimilarComparison } from "../../types/compare-detail.types";

export const VEHICLE_1: ComparisonVehicle = {
    name: "Nissan Juke",
    year: "2020",
    image: 'https://i.ibb.co/HK5N2H0/juke.png',
    price: "Rs. 9,800,000",
    km: "38,000 km",
    transmission: "Automatic Transmission",
    fuelType: "Petrol",
    condition: "Used (Excellent)",
    fuelEconomy: "16 km/l",
    rating: 4,
};

export const VEHICLE_2: ComparisonVehicle = {
    name: "Mitsubishi Pajero",
    year: "2017",
    image: 'https://i.ibb.co/XytkH9z/pajero.png',
    price: "Rs. 11,500,000",
    km: "62,000 km",
    transmission: "Automatic Transmission",
    fuelType: "Diesel",
    condition: "Used (Good)",
    fuelEconomy: "9 km/l",
    rating: 4,
};

export const SIMILAR_COMPARISONS: SimilarComparison[] = [
    {
        id: 1,
        leftImage: 'https://i.ibb.co/YtPvCqN/range.png',
        rightImage: 'https://i.ibb.co/YtPvCqN/range.png',
        leftName: "Range Rover Sport",
        rightName: "Range Rover Evoque",
    },
    {
        id: 2,
        leftImage: 'https://i.ibb.co/YtPvCqN/range.png',
        rightImage: 'https://i.ibb.co/YtPvCqN/range.png',
        leftName: "Range Rover Sport",
        rightName: "Range Rover Evoque",
    },
    {
        id: 3,
        leftImage: 'https://i.ibb.co/YtPvCqN/range.png',
        rightImage: 'https://i.ibb.co/YtPvCqN/range.png',
        leftName: "Range Rover Sport",
        rightName: "Range Rover Evoque",
    },
    {
        id: 4,
        leftImage: 'https://i.ibb.co/YtPvCqN/range.png',
        rightImage: 'https://i.ibb.co/YtPvCqN/range.png',
        leftName: "Range Rover Sport",
        rightName: "Range Rover Evoque",
    },
];
