import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from './locales/en.json';
import si from './locales/si.json';
import ta from './locales/ta.json';

const RESOURCES = {
    en: { translation: en },
    si: { translation: si },
    ta: { translation: ta },
};

const LANGUAGE_DETECTOR = {
    type: 'languageDetector',
    async: true,
    detect: async (callback: (lang: string) => void) => {
        try {
            const savedLanguage = await AsyncStorage.getItem('user-language');
            if (savedLanguage) {
                return callback(savedLanguage);
            }

            const locales = Localization.getLocales();
            if (locales && locales.length > 0) {
                // Check if device language is supported
                const deviceLanguage = locales[0].languageCode;
                if (['en', 'si', 'ta'].includes(deviceLanguage)) {
                    return callback(deviceLanguage ?? 'en');
                }
            }

            return callback('en'); // Default fallback
        } catch (error) {
            console.log('Error reading language', error);
            return callback('en');
        }
    },
    init: () => { },
    cacheUserLanguage: async (language: string) => {
        try {
            await AsyncStorage.setItem('user-language', language);
        } catch (error) {
            console.log('Error saving language', error);
        }
    },
};

i18n
    .use(LANGUAGE_DETECTOR as any)
    .use(initReactI18next)
    .init({
        resources: RESOURCES,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
        react: {
            useSuspense: false,
        },
    });

export default i18n;
