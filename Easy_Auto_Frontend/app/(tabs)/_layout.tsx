import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
    Animated,
    Dimensions,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";

const { width } = Dimensions.get("window");
const PRIMARY = "#235CF8";
const INACTIVE = "#94A3B8";

/**
 * Custom Floating Glass Tab Bar
 */
function CustomTabBar({ state, descriptors, navigation }: any) {
    const insets = useSafeAreaInsets();
    
    // Calculate tab width (excluding margins)
    const MARGIN_H = 20;
    const barWidth = width - (MARGIN_H * 2);
    const tabWidth = barWidth / state.routes.length;

    // Animation for active indicator
    const translateX = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.spring(translateX, {
            toValue: state.index * tabWidth,
            useNativeDriver: true,
            bounciness: 4,
            speed: 12,
        }).start();
    }, [state.index]);

    return (
        <View style={[styles.floatingContainer, { bottom: insets.bottom + 10 }]}>
            <View style={styles.glassBar}>
                {/* Active Tab Indicator (Sliding Background) */}
                <Animated.View 
                    style={[
                        styles.indicator, 
                        { width: tabWidth - 10, transform: [{ translateX: Animated.add(translateX, 5) }] }
                    ]} 
                />

                {state.routes.map((route: any, index: number) => {
                    const { options } = descriptors[route.key];
                    const isFocused = state.index === index;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            navigation.navigate(route.name);
                        }
                    };

                    const getIcon = (focused: boolean) => {
                        switch (route.name) {
                            case "index":   return focused ? "home" : "home-outline";
                            case "search":  return focused ? "search" : "search-outline";
                            case "compare": return "swap-horizontal";
                            case "chat":    return focused ? "chatbubbles" : "chatbubbles-outline";
                            case "profile": return focused ? "person" : "person-outline";
                            default:        return "square";
                        }
                    };

                    return (
                        <Pressable
                            key={route.key}
                            onPress={onPress}
                            style={styles.tabItem}
                        >
                            <Ionicons 
                                name={getIcon(isFocused) as any} 
                                size={isFocused ? 22 : 21} 
                                color={isFocused ? "#FFF" : INACTIVE} 
                            />
                            <Text style={[
                                styles.label, 
                                { color: isFocused ? "#FFF" : INACTIVE, fontWeight: isFocused ? "800" : "600" }
                            ]}>
                                {options.title || route.name}
                            </Text>
                        </Pressable>
                    );
                })}
            </View>
        </View>
    );
}

export default function TabLayout() {
    return (
        <Tabs
            tabBar={(props) => <CustomTabBar {...props} />}
            screenOptions={{
                headerShown: false,
            }}
        >
            <Tabs.Screen name="index" options={{ title: "Home" }} />
            <Tabs.Screen name="search" options={{ title: "Search" }} />
            <Tabs.Screen name="compare" options={{ title: "Compare" }} />
            <Tabs.Screen name="chat" options={{ title: "Chat" }} />
            <Tabs.Screen name="profile" options={{ title: "Profile" }} />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    floatingContainer: {
        position: "absolute",
        left: 20,
        right: 20,
        alignItems: "center",
        zIndex: 1000,
    },
    glassBar: {
        flexDirection: "row",
        backgroundColor: "rgba(255, 255, 255, 0.92)",
        borderRadius: 30,
        height: 64,
        paddingHorizontal: 5,
        alignItems: "center",
        // Precise Border
        borderWidth: 1.5,
        borderColor: "rgba(255, 255, 255, 0.5)",
        // Premium Shadow
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.12,
        shadowRadius: 20,
        elevation: 15,
    },
    indicator: {
        position: "absolute",
        height: 50,
        backgroundColor: PRIMARY,
        borderRadius: 22,
        zIndex: -1,
        // Indicator Shadow
        shadowColor: PRIMARY,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    tabItem: {
        flex: 1,
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
    },
    label: {
        fontSize: 10,
        letterSpacing: -0.2,
    }
});
