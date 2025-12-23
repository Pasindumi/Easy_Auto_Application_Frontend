export interface ComparisonVehicle {
    name: string;
    year: string;
    image: string;
    price: string;
    km: string;
    transmission: string;
    fuelType: string;
    condition: string;
    fuelEconomy: string;
    rating: number;
}

export interface SimilarComparison {
    id: number;
    leftImage: string;
    rightImage: string;
    leftName: string;
    rightName: string;
}
