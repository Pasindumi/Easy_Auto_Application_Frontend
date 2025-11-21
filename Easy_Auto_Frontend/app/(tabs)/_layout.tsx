import { MaterialIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { View } from "react-native";

import { HapticTab } from "@/components/haptic-tab";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#235CF8",
        tabBarInactiveTintColor: "#9BA1A6",
        headerShown: false,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginTop: 4,
          marginBottom: 0,
          letterSpacing: 0.2,
        },
        tabBarIconStyle: {
          marginTop: 0,
          marginBottom: 0,
        },
        tabBarStyle: {
          backgroundColor: "transparent",
          borderTopWidth: 0,
          height: 72,
          paddingBottom: 12,
          paddingTop: 10,
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
              shadowColor: "#000",
              shadowOffset: { width: 0, height: -4 },
              shadowOpacity: 0.1,
              shadowRadius: 12,
              elevation: 12,
            }}
          />
        ),
        tabBarItemStyle: {
          paddingVertical: 0,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 6,
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
            <MaterialIcons
              name={focused ? "dashboard" : "dashboard"}
              size={24}
              color={focused ? "#235CF8" : "#718096"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarLabel: "Search",
          tabBarIcon: ({ focused }) => (
            <MaterialIcons
              name={focused ? "manage-search" : "manage-search"}
              size={24}
              color={focused ? "#235CF8" : "#718096"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="compare"
        options={{
          title: "",
          tabBarLabel: "",
          tabBarShowLabel: false,
          tabBarIcon: () => (
            <View
              style={{
                width: 60,
                height: 60,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#235CF8",
                borderRadius: 30,
                shadowColor: "#235CF8",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.35,
                shadowRadius: 10,
                elevation: 10,
              }}
            >
              <MaterialIcons
                name="compare-arrows"
                size={28}
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
                    top: -22,
                    width: 60,
                    height: 60,
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
            <MaterialIcons
              name={focused ? "forum" : "forum"}
              size={24}
              color={focused ? "#235CF8" : "#718096"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarLabel: "Profile",
          tabBarIcon: ({ focused }) => (
            <MaterialIcons
              name={focused ? "account-circle" : "account-circle"}
              size={24}
              color={focused ? "#235CF8" : "#718096"}
            />
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
