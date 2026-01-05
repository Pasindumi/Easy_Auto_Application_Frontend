export interface CarFormState {
    title: string;
    brand: string;
    model: string;
    year: string;
    condition: string;
    mileage: string;
    fuelType: string;
    transmission: string;
    engineCapacity: string;
    price: string;
    description: string;
    contactNumber: string;
    email: string;
    location: string;
    negotiable: boolean;
    vehicle_type?: string;
    vehicle_type_id?: string; // New field
    bodyType?: string;
    dynamicAttributes?: { attribute_id: string; value: any }[]; // New field
}
