import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';

interface ThemeContextType {
    isDarkMode: boolean;
    toggleTheme: (value: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType>({
    isDarkMode: false,
    toggleTheme: () => { },
});

export const useTheme = () => useContext(ThemeContext);

export const CustomThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const systemColorScheme = useColorScheme();
    const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        loadTheme();
    }, []);

    const loadTheme = async () => {
        try {
            const savedTheme = await AsyncStorage.getItem('@dark_mode');
            if (savedTheme !== null) {
                setIsDarkMode(savedTheme === 'true');
            }
        } catch (e) {
            console.error("Error loading theme", e);
        } finally {
            setIsLoaded(true);
        }
    };

    const toggleTheme = async (value: boolean) => {
        setIsDarkMode(value);
        try {
            await AsyncStorage.setItem('@dark_mode', String(value));
        } catch (e) {
            console.error("Error saving theme", e);
        }
    };

    if (!isLoaded) return null;

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
