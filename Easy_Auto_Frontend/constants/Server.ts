import { Platform } from 'react-native';

// Use the env var `EXPO_PUBLIC_API_URL` for consistent access across devices.
// Falls back to localhost for development
export const SERVER_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000';
