import React, { useEffect } from "react";
import "../src/i18n"; // Initialize i18n
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { ClerkProvider, ClerkLoaded } from "@clerk/clerk-expo";
import { AuthProvider } from "../contexts/AuthContext";
import { ToastProvider } from "../contexts/ToastContext";
import { LoadingProvider, useLoading } from "../contexts/LoadingContext";
import Toast from "../components/ui/Toast";
import { tokenCache } from "../utils/tokenCache";
import { useEffect } from "react";
import * as Notifications from "expo-notifications";

import { usePathname, useRouter } from "expo-router";

import { useColorScheme } from "@/hooks/use-color-scheme";

import { CustomThemeProvider, useTheme } from "../contexts/ThemeContext";

import { GestureHandlerRootView } from "react-native-gesture-handler";

// Configure notification handler for foreground notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || '';



function InnerLayout() {
  const { isDarkMode } = useTheme();
  const { isLoading, setIsLoading } = useLoading();
  const router = useRouter();

  // Handle notification tap navigation
  useEffect(() => {
    // Handle notification tap when app is running
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data;
      console.log('[Notification] Tapped:', data);
      
      // Navigate based on notification data
      if (data?.screen) {
        switch (data.screen) {
          case 'Dashboard':
            router.push('/(tabs)');
            break;
          case 'Packages':
            router.push('/packages/packages');
            break;
          case 'Notifications':
            router.push('/notifications');
            break;
          default:
            try {
              router.push(data.screen as any);
            } catch (e) {
              console.log('[Notification] Unknown screen:', data.screen);
            }
        }
      } else if (data?.type) {
        // Navigate based on notification type
        switch (data.type) {
          case 'PACKAGE_PURCHASE':
            router.push('/(tabs)');
            break;
          case 'PACKAGE_EXPIRY':
          case 'AD_LIMIT_WARNING':
            router.push('/packages/packages');
            break;
          default:
            router.push('/notifications');
        }
      }
    });

    // Check if app was opened from a notification
    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (response) {
        const data = response.notification.request.content.data;
        console.log('[Notification] App opened from notification:', data);
        // Handle navigation after a short delay to ensure app is ready
        setTimeout(() => {
          if (data?.screen) {
            router.push(data.screen as any);
          }
        }, 1000);
      }
    });

    return () => subscription.remove();
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
