import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { Platform, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const PRIMARY  = "#235CF8";
const INACTIVE = "#94A3B8";

export default function TabLayout() {
    const insets = useSafeAreaInsets();

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: PRIMARY,
                tabBarInactiveTintColor: INACTIVE,
                tabBarStyle: {
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: "#FFFFFF",
                    borderTopWidth: 0,
                    height: Platform.OS === "ios" ? 72 + insets.bottom : 72,
                    paddingBottom: Platform.OS === "ios" ? Math.max(insets.bottom, 8) : 8,
                    paddingTop: 8,
                    shadowColor: "#0F172A",
                    shadowOffset: { width: 0, height: -3 },
                    shadowOpacity: 0.08,
                    shadowRadius: 16,
                    elevation: 20,
                },
                tabBarLabelStyle: {
                    fontSize: 10,
                    fontWeight: "700",
                    letterSpacing: 0.2,
                    marginTop: 2,
                },
                tabBarIconStyle: {
                    marginBottom: 0,
                },
            }}
        >
            {/* Home */}
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    tabBarIcon: ({ focused, color }) => (
                        <Ionicons name={focused ? "home" : "home-outline"} size={23} color={color} />
                    ),
                }}
            />

            {/* Search */}
            <Tabs.Screen
                name="search"
                options={{
                    title: "Search",
                    tabBarIcon: ({ focused, color }) => (
                        <Ionicons name={focused ? "search" : "search-outline"} size={23} color={color} />
                    ),
                }}
            />

            {/* Compare — Floating Centre */}
            <Tabs.Screen
                name="compare"
                options={{
                    title: "",
                    tabBarIcon: ({ focused }) => (
                        <View
                            pointerEvents="none"
                            style={{
                                marginTop: -24,
                                width: 54,
                                height: 54,
                                borderRadius: 27,
                                backgroundColor: PRIMARY,
                                alignItems: "center",
                                justifyContent: "center",
                                borderWidth: 3,
                                borderColor: "#fff",
                                shadowColor: PRIMARY,
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: focused ? 0.45 : 0.28,
                                shadowRadius: 12,
                                elevation: focused ? 18 : 12,
                            }}
                        >
                            <Ionicons name="swap-horizontal" size={24} color="#fff" />
                        </View>
                    ),
                }}
            />

            {/* Chat */}
            <Tabs.Screen
                name="chat"
                options={{
                    title: "Chat",
                    tabBarIcon: ({ focused, color }) => (
                        <Ionicons name={focused ? "chatbubbles" : "chatbubbles-outline"} size={23} color={color} />
                    ),
                }}
            />

            {/* Profile */}
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    tabBarIcon: ({ focused, color }) => (
                        <Ionicons name={focused ? "person-circle" : "person-circle-outline"} size={23} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
