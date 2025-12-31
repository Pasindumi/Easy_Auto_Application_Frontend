import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
    isPremium?: boolean;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    register: (name: string, email: string, phone: string, password: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    login: async () => ({ success: false, error: "Not implemented" }),
    register: async () => ({ success: false, error: "Not implemented" }),
    logout: () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const API_URL = "http://192.168.1.29:5000/api/auth"; // Update with your local IP or localhost

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/login`, {
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
            // Store token if needed: await SecureStore.setItemAsync('token', data.token);
            return { success: true };
        } catch (error) {
            console.error(error);
            return { success: false, error: error.message };
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (name: string, email: string, phone: string, password: string) => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/signup`, {
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
            // Store token if needed: await SecureStore.setItemAsync('token', data.token);
            return { success: true };
        } catch (error) {
            console.error(error);
            return { success: false, error: error.message };
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        // await SecureStore.deleteItemAsync('token');
    };

    return (
        <AuthContext.Provider
            value={{
                user,
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
