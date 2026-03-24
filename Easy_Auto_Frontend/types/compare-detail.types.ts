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
    location: string;
    sellerVerified: boolean;
    brand: string;
    model: string;
    attributes: { [key: string]: string };
}

export interface SimilarComparison {
    id: number;
    id1: string;
    id2: string;
    leftImage: string;
    rightImage: string;
    leftName: string;
    rightName: string;
}
