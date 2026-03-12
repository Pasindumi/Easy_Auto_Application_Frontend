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
import Toast from "../components/ui/Toast";
import { tokenCache } from "../utils/tokenCache";

import { useColorScheme } from "@/hooks/use-color-scheme";

import { GestureHandlerRootView } from "react-native-gesture-handler";

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || '';

export const unstable_settings = {
  // Start with the landing page first
  initialRouteName: "landing",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ClerkProvider
        publishableKey={CLERK_PUBLISHABLE_KEY}
        tokenCache={tokenCache}
      >
        <ClerkLoaded>
          <AuthProvider>
            <ToastProvider>
              <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
                <Stack>
                  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                  <Stack.Screen name="settings/select-language" options={{ headerShown: false }} />
                  <Stack.Screen name="packages/subscriptions" options={{ headerShown: false }} />
                  <Stack.Screen name="landing" options={{ headerShown: false, animation: 'fade' }} />

                  <Stack.Screen name="admin" options={{ headerShown: false }} />
                  <Stack.Screen
                    name="modals/modal"
                    options={{ presentation: "modal", title: "Modal" }}
                  />
                </Stack>
                <StatusBar style="auto" />
                <Toast />
              </ThemeProvider>
            </ToastProvider>
          </AuthProvider>
        </ClerkLoaded>
      </ClerkProvider>
    </GestureHandlerRootView>
  );
}
