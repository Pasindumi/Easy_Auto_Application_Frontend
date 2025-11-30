import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated, Easing, Platform, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { HapticTab } from "@/components/haptic-tab";

// Modern Minimalist Tab Icon Component
const ModernTabIcon = ({
  focused,
  iconName,
  iconNameOutline,
}: {
  focused: boolean;
  iconName: string;
  iconNameOutline: string;
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(focused ? 1 : 0.6)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: focused ? 1.1 : 1,
        useNativeDriver: true,
        tension: 300,
        friction: 20,
      }),
      Animated.timing(opacityAnim, {
        toValue: focused ? 1 : 0.5,
        duration: 200,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, [focused, scaleAnim, opacityAnim]);

  return (
    <Animated.View
      style={{
        alignItems: "center",
        justifyContent: "center",
        transform: [{ scale: scaleAnim }],
        opacity: opacityAnim,
      }}
    >
      <Ionicons
        name={focused ? (iconName as any) : (iconNameOutline as any)}
        size={22}
        color={focused ? "#235CF8" : "#9CA3AF"}
      />
    </Animated.View>
  );
};

// Elegant Center Compare Button
const CompareButton = ({ focused }: { focused: boolean }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const shadowAnim = useRef(new Animated.Value(focused ? 1 : 0.7)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: focused ? 1.05 : 1,
        useNativeDriver: true,
        tension: 300,
        friction: 15,
      }),
      Animated.timing(shadowAnim, {
        toValue: focused ? 1 : 0.7,
        duration: 200,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }),
    ]).start();
  }, [focused, scaleAnim, shadowAnim]);

  const shadowOpacity = shadowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.15, 0.3],
  });

  return (
    <View
      style={{
        width: 56,
        height: 56,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Shadow Layer */}
      <Animated.View
        style={{
          position: "absolute",
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: "#235CF8",
          shadowColor: "#235CF8",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: shadowOpacity,
          shadowRadius: 12,
          elevation: focused ? 8 : 6,
        }}
      />
      {/* Button */}
      <Animated.View
        style={{
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: "#235CF8",
          justifyContent: "center",
          alignItems: "center",
          transform: [{ scale: scaleAnim }],
        }}
      >
        <Ionicons name="swap-horizontal" size={24} color="#FFFFFF" />
      </Animated.View>
    </View>
  );
};

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        // Modern Color Scheme
        tabBarActiveTintColor: "#235CF8",
        tabBarInactiveTintColor: "#9CA3AF",
        headerShown: false,

        // Clean Typography
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "600",
          marginTop: 4,
          marginBottom: 0,
          letterSpacing: 0.3,
          opacity: 1,
          height: "auto",
        },

        // Icon Styling
        tabBarIconStyle: {
          marginTop: 0,
          marginBottom: 0,
        },

        // Clean Tab Bar Container
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 0.5,
          borderTopColor: "rgba(0, 0, 0, 0.06)",
          height: Platform.OS === "ios" ? 68 + insets.bottom : 68,
          minHeight: Platform.OS === "ios" ? 68 + insets.bottom : 68,
          paddingBottom:
            Platform.OS === "ios" ? Math.max(insets.bottom, 10) : 10,
          paddingTop: 8,
          paddingHorizontal: 0,
          position: "absolute",
          elevation: 8,
          shadowColor: "rgba(0, 0, 0, 0.05)",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 1,
          shadowRadius: 8,
        },

        // Tab Item Styling
        tabBarItemStyle: {
          paddingVertical: 4,
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
          minHeight: 68,
          height: "100%",
        },
      }}
    >
      {/* Home Tab */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarLabel: "Home",
          tabBarAccessibilityLabel: "Home tab",
          tabBarShowLabel: true,
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: "600",
            marginTop: 4,
            marginBottom: 0,
            letterSpacing: 0.3,
            opacity: 1,
            height: "auto",
          },
          tabBarIcon: ({ focused }) => (
            <ModernTabIcon
              focused={focused}
              iconName="grid"
              iconNameOutline="grid-outline"
            />
          ),
          tabBarButton: (props) => <HapticTab {...props} />,
          tabBarItemStyle: {
            paddingVertical: 4,
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
            minHeight: 68,
            height: "100%",
          },
        }}
      />

      {/* Search Tab */}
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarLabel: "Search",
          tabBarAccessibilityLabel: "Search tab",
          tabBarShowLabel: true,
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: "600",
            marginTop: 4,
            marginBottom: 0,
            letterSpacing: 0.3,
            opacity: 1,
            height: "auto",
          },
          tabBarIcon: ({ focused }) => (
            <ModernTabIcon
              focused={focused}
              iconName="search"
              iconNameOutline="search-outline"
            />
          ),
          tabBarButton: (props) => <HapticTab {...props} />,
          tabBarItemStyle: {
            paddingVertical: 4,
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
            minHeight: 68,
            height: "100%",
          },
        }}
      />

      {/* Compare Tab - Elegant Center Button */}
      <Tabs.Screen
        name="compare"
        options={{
          title: "Compare",
          tabBarLabel: "",
          tabBarAccessibilityLabel: "Compare cars tab",
          tabBarShowLabel: false,
          tabBarLabelStyle: {
            height: 0,
            width: 0,
            opacity: 0,
            fontSize: 0,
            margin: 0,
            padding: 0,
            display: "none",
          },
          tabBarIcon: ({ focused }) => (
            <View style={{ marginTop: -12 }}>
              <CompareButton focused={focused} />
            </View>
          ),
          tabBarButton: (props) => <HapticTab {...props} />,
          tabBarIconStyle: {
            marginTop: 0,
            marginBottom: 0,
          },
          tabBarItemStyle: {
            paddingVertical: 4,
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
            minHeight: 68,
            height: "100%",
          },
        }}
      />

      {/* Chat Tab */}
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          tabBarLabel: "Chat",
          tabBarAccessibilityLabel: "Chat tab",
          tabBarShowLabel: true,
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: "600",
            marginTop: 4,
            marginBottom: 0,
            letterSpacing: 0.3,
            opacity: 1,
            height: "auto",
          },
          tabBarIcon: ({ focused }) => (
            <ModernTabIcon
              focused={focused}
              iconName="chatbubbles"
              iconNameOutline="chatbubbles-outline"
            />
          ),
          tabBarButton: (props) => <HapticTab {...props} />,
          tabBarItemStyle: {
            paddingVertical: 4,
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
            minHeight: 68,
            height: "100%",
          },
        }}
      />

      {/* Profile Tab */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarLabel: "Profile",
          tabBarAccessibilityLabel: "Profile tab",
          tabBarShowLabel: true,
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: "600",
            marginTop: 4,
            marginBottom: 0,
            letterSpacing: 0.3,
            opacity: 1,
            height: "auto",
          },
          tabBarIcon: ({ focused }) => (
            <ModernTabIcon
              focused={focused}
              iconName="person-circle"
              iconNameOutline="person-circle-outline"
            />
          ),
          tabBarButton: (props) => <HapticTab {...props} />,
          tabBarItemStyle: {
            paddingVertical: 4,
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
            minHeight: 68,
            height: "100%",
          },
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
