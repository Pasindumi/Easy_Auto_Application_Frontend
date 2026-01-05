import { Platform } from 'react-native';

// Use the ngrok URL for consistent access across real devices and emulators
export const API_URL = 'https://garfield-couped-leslie.ngrok-free.dev';

export const ENDPOINTS = {
    VEHICLE_CONFIG: `${API_URL}/api/vehicle-config`,
    CARS: `${API_URL}/api/cars`,
    AUTH: `${API_URL}/api/auth`,
};
