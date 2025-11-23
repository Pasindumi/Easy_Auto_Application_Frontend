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
        tabBarActiveTintColor: "#235CF8",
        tabBarInactiveTintColor: "#718096",
        headerShown: false,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginTop: 4,
          marginBottom: 0,
          letterSpacing: 0.1,
        },
        tabBarIconStyle: {
          marginTop: 0,
          marginBottom: 0,
        },
        tabBarStyle: {
          backgroundColor: "transparent",
          borderTopWidth: 0,
          height: 68 + (Platform.OS === "ios" ? insets.bottom : 0),
          paddingBottom:
            Platform.OS === "ios" ? Math.max(insets.bottom, 10) : 10,
          paddingTop: 8,
          paddingHorizontal: 0,
          marginHorizontal: 0,
          elevation: 0,
          shadowColor: "transparent",
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0,
          shadowRadius: 0,
        },
        tabBarBackground: () => (
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "#FFFFFF",
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: -4 },
              shadowOpacity: 0.08,
              shadowRadius: 16,
              elevation: 12,
              borderTopWidth: 0.5,
              borderTopColor: "rgba(0, 0, 0, 0.05)",
            }}
          />
        ),
        tabBarItemStyle: {
          paddingVertical: 2,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 8,
          flex: 1,
          minWidth: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarLabel: "Home",
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  backgroundColor: focused
                    ? "rgba(35, 92, 248, 0.12)"
                    : "transparent",
                }}
              >
                <MaterialIcons
                  name={focused ? "dashboard" : "home"}
                  size={focused ? 24 : 22}
                  color={focused ? "#235CF8" : "#718096"}
                />
              </View>
              {focused && (
                <View
                  style={{
                    marginTop: 4,
                    width: 28,
                    height: 3,
                    borderRadius: 2,
                    backgroundColor: "#235CF8",
                  }}
                />
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarLabel: "Search",
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  backgroundColor: focused
                    ? "rgba(35, 92, 248, 0.12)"
                    : "transparent",
                }}
              >
                <MaterialIcons
                  name={focused ? "manage-search" : "search"}
                  size={focused ? 24 : 22}
                  color={focused ? "#235CF8" : "#718096"}
                />
              </View>
              {focused && (
                <View
                  style={{
                    marginTop: 4,
                    width: 28,
                    height: 3,
                    borderRadius: 2,
                    backgroundColor: "#235CF8",
                  }}
                />
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="compare"
        options={{
          title: "",
          tabBarLabel: "",
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                width: 52,
                height: 52,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: focused ? "#235CF8" : "#235CF8",
                borderRadius: 26,
                shadowColor: "#235CF8",
                shadowOffset: { width: 0, height: focused ? 8 : 6 },
                shadowOpacity: focused ? 0.45 : 0.3,
                shadowRadius: focused ? 14 : 12,
                elevation: focused ? 14 : 12,
                borderWidth: 3,
                borderColor: "#FFFFFF",
                transform: [{ scale: focused ? 1.05 : 1 }],
              }}
            >
              <MaterialIcons
                name="compare-arrows"
                size={focused ? 28 : 26}
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
                    top: -18,
                    width: 52,
                    height: 52,
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
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          tabBarLabel: "Chat",
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  backgroundColor: focused
                    ? "rgba(35, 92, 248, 0.12)"
                    : "transparent",
                }}
              >
                <MaterialIcons
                  name={focused ? "forum" : "chat-bubble-outline"}
                  size={focused ? 24 : 22}
                  color={focused ? "#235CF8" : "#718096"}
                />
              </View>
              {focused && (
                <View
                  style={{
                    marginTop: 4,
                    width: 28,
                    height: 3,
                    borderRadius: 2,
                    backgroundColor: "#235CF8",
                  }}
                />
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarLabel: "Profile",
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  backgroundColor: focused
                    ? "rgba(35, 92, 248, 0.12)"
                    : "transparent",
                }}
              >
                <MaterialIcons
                  name={focused ? "account-circle" : "person-outline"}
                  size={focused ? 24 : 22}
                  color={focused ? "#235CF8" : "#718096"}
                />
              </View>
              {focused && (
                <View
                  style={{
                    marginTop: 4,
                    width: 28,
                    height: 3,
                    borderRadius: 2,
                    backgroundColor: "#235CF8",
                  }}
                />
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="signup"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
