import { MaterialIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { Platform, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { HapticTab } from "@/components/haptic-tab";

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        // Color scheme: Refined shades for premium look
        tabBarActiveTintColor: "#235CF8",
        tabBarInactiveTintColor: "#9CA3AF", // Refined gray for better contrast
        headerShown: false,
        tabBarShowLabel: true, // Ensure labels are always visible
        // Label typography: Enhanced for readability and premium feel
        tabBarLabelStyle: {
          fontSize: 12, // Optimal size for readability
          fontWeight: "600",
          marginTop: 5, // Balanced spacing between icon and label
          marginBottom: 0,
          letterSpacing: 0.1,
        },
        tabBarIconStyle: {
          marginTop: 0,
          marginBottom: 0,
        },
        // Tab bar container: Full-width with no side margins
        // Design decision: Removed all horizontal margins/padding to span full width
        tabBarStyle: {
          backgroundColor: "transparent",
          borderTopWidth: 0,
          height: Platform.OS === "ios" ? 68 + insets.bottom : 68, // Refined height
          paddingBottom: Platform.OS === "ios" ? Math.max(insets.bottom, 6) : 6,
          paddingTop: 8, // Consistent top padding
          paddingHorizontal: 0, // No horizontal padding to span full width
          paddingLeft: 0,
          paddingRight: 0,
          marginHorizontal: 0, // No horizontal margins
          marginLeft: 0,
          marginRight: 0,
          position: "absolute",
          elevation: 0,
          shadowColor: "transparent",
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0,
          shadowRadius: 0,
        },
        // Background: Premium white with smooth rounded top corners spanning full width
        // Design decision: Rounded top corners (24px) create modern, premium aesthetic
        // Background extends to edges with no side gaps
        tabBarBackground: () => (
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0, // Extends to left edge
              right: 0, // Extends to right edge
              bottom: 0,
              backgroundColor: "#FFFFFF",
              borderTopLeftRadius: 24, // Smooth rounded corners
              borderTopRightRadius: 24,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: -4 }, // Subtle upward shadow
              shadowOpacity: 0.08, // Refined shadow opacity
              shadowRadius: 20,
              elevation: 12,
              borderTopWidth: 0.5, // Very subtle top border
              borderTopColor: "rgba(0, 0, 0, 0.05)", // Refined border opacity
            }}
          />
        ),
        // Tab item: Improved spacing and alignment for full-width layout
        tabBarItemStyle: {
          paddingVertical: 4, // Vertical padding for better touch targets
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 4, // Minimal horizontal padding
          flex: 1,
          minWidth: 0,
          maxWidth: "100%",
        },
      }}
    >
      {/* Home Tab - Clean, professional icon with always-visible label */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarLabel: "Home",
          tabBarShowLabel: true, // Ensure label is always visible
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                width: 44, // Optimized touch target size
                height: 44,
                borderRadius: 12, // Refined corner radius
                backgroundColor: focused
                  ? "rgba(35, 92, 248, 0.12)" // Subtle active background
                  : "transparent",
              }}
            >
              <MaterialIcons
                name="home" // Clean, professional icon
                size={focused ? 25 : 23} // Slightly larger when active
                color={focused ? "#235CF8" : "#9CA3AF"}
              />
            </View>
          ),
        }}
      />

      {/* Search Tab - Professional search icon with always-visible label */}
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarLabel: "Search",
          tabBarShowLabel: true, // Ensure label is always visible
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                width: 44,
                height: 44,
                borderRadius: 12,
                backgroundColor: focused
                  ? "rgba(35, 92, 248, 0.12)"
                  : "transparent",
              }}
            >
              <MaterialIcons
                name="search" // Clean, professional icon
                size={focused ? 25 : 23}
                color={focused ? "#235CF8" : "#9CA3AF"}
              />
            </View>
          ),
        }}
      />

      {/* Compare Tab - Premium floating action button */}
      {/* Design decision: Elevated center button creates visual hierarchy */}
      {/* Label is hidden for this special floating button */}
      <Tabs.Screen
        name="compare"
        options={{
          title: "Compare",
          tabBarLabel: "Compare",
          tabBarShowLabel: false, // Hidden for floating button design
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                width: 54, // Refined size for premium feel
                height: 54,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#235CF8",
                borderRadius: 27, // Perfect circle
                shadowColor: "#235CF8",
                shadowOffset: { width: 0, height: focused ? 6 : 4 }, // Dynamic shadow
                shadowOpacity: focused ? 0.35 : 0.25, // Enhanced shadow when active
                shadowRadius: focused ? 14 : 12,
                elevation: focused ? 12 : 10,
                borderWidth: 3.5, // White border for premium separation
                borderColor: "#FFFFFF",
              }}
            >
              <MaterialIcons
                name="compare-arrows" // Clean, professional icon
                size={26}
                color="#FFFFFF"
              />
            </View>
          ),
          tabBarButton: (props) => {
            const { style, ...otherProps } = props;
            return (
              <HapticTab
                {...otherProps}
                style={[
                  style,
                  {
                    top: -18, // Elevated position for premium feel
                    width: 54,
                    height: 54,
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 0,
                    margin: 0,
                    flex: 1,
                  },
                ]}
              />
            );
          },
          tabBarIconStyle: {
            marginTop: 0,
            marginBottom: 0,
          },
        }}
      />

      {/* Chat Tab - Professional messaging icon with always-visible label */}
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          tabBarLabel: "Chat",
          tabBarShowLabel: true, // Ensure label is always visible
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                width: 44,
                height: 44,
                borderRadius: 12,
                backgroundColor: focused
                  ? "rgba(35, 92, 248, 0.12)"
                  : "transparent",
              }}
            >
              <MaterialIcons
                name="chat" // Clean, professional icon
                size={focused ? 25 : 23}
                color={focused ? "#235CF8" : "#9CA3AF"}
              />
            </View>
          ),
        }}
      />

      {/* Profile Tab - Professional account icon with always-visible label */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarLabel: "Profile",
          tabBarShowLabel: true, // Ensure label is always visible
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                width: 44,
                height: 44,
                borderRadius: 12,
                backgroundColor: focused
                  ? "rgba(35, 92, 248, 0.12)"
                  : "transparent",
              }}
            >
              <MaterialIcons
                name="person" // Clean, professional icon
                size={focused ? 25 : 23}
                color={focused ? "#235CF8" : "#9CA3AF"}
              />
            </View>
          ),
        }}
      />

      {/* Hidden signup route */}
      <Tabs.Screen
        name="signup"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
