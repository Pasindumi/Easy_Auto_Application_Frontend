import { Platform } from 'react-native';

// Use the ngrok URL for consistent access across real devices and emulators
export const API_URL = 'https://odorful-nondomestically-jamee.ngrok-free.dev';

const API_BASE_URL = `${API_URL}/api`;

export const ENDPOINTS = {
    VEHICLE_CONFIG: {
        TYPES: `${API_BASE_URL}/vehicle-config/types`,
        ATTRIBUTES: `${API_BASE_URL}/vehicle-config/attributes`,
        BRANDS: `${API_BASE_URL}/vehicle-config/brands`,
        MODELS: `${API_BASE_URL}/vehicle-config/models`,
        CONDITIONS: `${API_BASE_URL}/vehicle-config/conditions`,
    },
    CARS: `${API_BASE_URL}/cars`,
    AUTH: `${API_BASE_URL}/auth`,
    PRICING: `${API_BASE_URL}/pricing`,
};
