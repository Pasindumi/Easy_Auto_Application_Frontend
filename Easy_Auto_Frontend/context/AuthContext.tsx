import React, { createContext, useContext, useState, useEffect } from "react";
import * as SecureStore from 'expo-secure-store';
import { ENDPOINTS } from "../constants/API";

interface User {
    id: string;
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
    isPremium?: boolean;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; message?: string; error?: string }>;
    register: (name: string, email: string, phone: string, password: string) => Promise<{ success: boolean; message?: string; error?: string }>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    login: async () => ({ success: false, error: "Not implemented" }),
    register: async () => ({ success: false, error: "Not implemented" }),
    logout: () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const loadStoredAuth = async () => {
            try {
                const storedUser = await SecureStore.getItemAsync('user');
                const storedToken = await SecureStore.getItemAsync('token');
                if (storedUser && storedToken) {
                    setUser(JSON.parse(storedUser));
                    setToken(storedToken);
                }
            } catch (e) {
                console.error('Error loading stored auth:', e);
            }
        };
        loadStoredAuth();
    }, []);

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const response = await fetch(`${ENDPOINTS.AUTH}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Login failed");
            }

            setUser(data.user);
            setToken(data.token);
            await SecureStore.setItemAsync('token', data.token);
            await SecureStore.setItemAsync('user', JSON.stringify(data.user));
            return { success: true, message: data.message };
        } catch (error: any) {
            console.error(error);
            return { success: false, error: error.message };
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (name: string, email: string, phone: string, password: string) => {
        setIsLoading(true);
        try {
            const response = await fetch(`${ENDPOINTS.AUTH}/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email, phone, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Signup failed");
            }

            setUser(data.user);
            setToken(data.token);
            await SecureStore.setItemAsync('token', data.token);
            await SecureStore.setItemAsync('user', JSON.stringify(data.user));
            return { success: true, message: data.message };
        } catch (error: any) {
            console.error(error);
            return { success: false, error: error.message };
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        setUser(null);
        setToken(null);
        await SecureStore.deleteItemAsync('token');
        await SecureStore.deleteItemAsync('user');
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthenticated: !!user,
                isLoading,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
