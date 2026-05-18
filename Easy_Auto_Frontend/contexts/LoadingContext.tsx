import React, { createContext, useContext, useState, useEffect } from 'react';

interface LoadingContextType {
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
    showLoading: (duration?: number) => void;
}

const LoadingContext = createContext<LoadingContextType>({
    isLoading: false,
    setIsLoading: () => { },
    showLoading: () => { },
});

export const useLoading = () => useContext(LoadingContext);

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);

    const showLoading = (duration = 1000) => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
        }, duration);
    };

    return (
        <LoadingContext.Provider value={{ isLoading, setIsLoading, showLoading }}>
            {children}
        </LoadingContext.Provider>
    );
};
