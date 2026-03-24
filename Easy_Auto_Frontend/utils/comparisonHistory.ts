import AsyncStorage from '@react-native-async-storage/async-storage';
import { SimilarComparison } from '../types/compare-detail.types';

const HISTORY_KEY = 'car_comparison_history';
const MAX_HISTORY = 10;

export const saveComparisonToHistory = async (comparison: Omit<SimilarComparison, 'id'>) => {
    try {
        const existingHistoryStr = await AsyncStorage.getItem(HISTORY_KEY);
        let history: SimilarComparison[] = existingHistoryStr ? JSON.parse(existingHistoryStr) : [];

        // Check if this specific comparison (same IDs) already exists to avoid duplicates
        // We'll need unique IDs/slugs for better comparison, but for now let's use names if IDs aren't available
        const isDuplicate = history.some(item =>
            (item.leftName === comparison.leftName && item.rightName === comparison.rightName) ||
            (item.leftName === comparison.rightName && item.rightName === comparison.leftName)
        );

        if (isDuplicate) {
            // Move to front if duplicate
            history = history.filter(item =>
                !(item.leftName === comparison.leftName && item.rightName === comparison.rightName) &&
                !(item.leftName === comparison.rightName && item.rightName === comparison.leftName)
            );
        }

        const newId = Date.now();
        const newComparison: SimilarComparison = {
            id: newId,
            ...comparison
        };

        history.unshift(newComparison);

        // Keep only last N items
        if (history.length > MAX_HISTORY) {
            history = history.slice(0, MAX_HISTORY);
        }

        await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch (error) {
        console.error('Error saving comparison history:', error);
    }
};

export const getComparisonHistory = async (): Promise<SimilarComparison[]> => {
    try {
        const historyStr = await AsyncStorage.getItem(HISTORY_KEY);
        return historyStr ? JSON.parse(historyStr) : [];
    } catch (error) {
        console.error('Error getting comparison history:', error);
        return [];
    }
};

export const clearComparisonHistory = async () => {
    try {
        await AsyncStorage.removeItem(HISTORY_KEY);
    } catch (error) {
        console.error('Error clearing comparison history:', error);
    }
};
