import React, { useEffect } from "react";
import "../src/i18n"; // Initialize i18n
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { ClerkProvider, ClerkLoaded } from "@clerk/clerk-expo";
import { AuthProvider } from "../contexts/AuthContext";
import { ToastProvider } from "../contexts/ToastContext";
import { LoadingProvider, useLoading } from "../contexts/LoadingContext";
import Toast from "../components/ui/Toast";
import { tokenCache } from "../utils/tokenCache";

import { usePathname, useRouter } from "expo-router";

import { useColorScheme } from "@/hooks/use-color-scheme";

import { CustomThemeProvider, useTheme } from "../contexts/ThemeContext";

import { GestureHandlerRootView } from "react-native-gesture-handler";

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || '';



function InnerLayout() {
  const { isDarkMode } = useTheme();
  const { isLoading, setIsLoading } = useLoading();
  const router = useRouter();

  // Force route to index on fresh app load to bypass sticky router state
  useEffect(() => {
    setTimeout(() => {
      router.replace('/');
    }, 0);
  }, []);

  return (
    <ThemeProvider value={isDarkMode ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="settings/select-language" options={{ headerShown: false }} />
        <Stack.Screen name="packages/subscriptions" options={{ headerShown: false }} />
        <Stack.Screen name="packages/boost-ad" options={{ headerShown: false }} />
        <Stack.Screen name="packages/packages" options={{ headerShown: false }} />
        <Stack.Screen name="landing" options={{ headerShown: false, animation: 'fade' }} />


        {/* Payments Section */}
        <Stack.Screen name="payments/payment-history" options={{ headerShown: false }} />
        <Stack.Screen name="payments/payment" options={{ headerShown: false }} />
        <Stack.Screen name="payments/invoice" options={{ headerShown: false }} />
        <Stack.Screen name="payments/payment-detail" options={{ headerShown: false }} />
        <Stack.Screen name="payments/payment-methods" options={{ headerShown: false }} />
        <Stack.Screen name="payments/successful-payment" options={{ headerShown: false }} />
        <Stack.Screen name="offers" options={{ headerShown: false }} />
        <Stack.Screen name="support/about" options={{ headerShown: false }} />
        <Stack.Screen name="support/privacy-policy" options={{ headerShown: false }} />
        <Stack.Screen name="support/help-center" options={{ headerShown: false }} />
        <Stack.Screen name="support/contact-us" options={{ headerShown: false }} />
        <Stack.Screen name="support/help-support" options={{ headerShown: false }} />
        <Stack.Screen name="cars/compare-cars-detail" options={{ headerShown: false }} />

        <Stack.Screen
          name="modals/modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
      </Stack>
      <StatusBar style="auto" />
      <Toast />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ClerkProvider
        publishableKey={CLERK_PUBLISHABLE_KEY}
        tokenCache={tokenCache}
      >
        <ClerkLoaded>
          <AuthProvider>
            <ToastProvider>
              <LoadingProvider>
                <CustomThemeProvider>
                  <InnerLayout />
                </CustomThemeProvider>
              </LoadingProvider>
            </ToastProvider>
          </AuthProvider>
        </ClerkLoaded>
      </ClerkProvider>
    </GestureHandlerRootView>
  );
}
