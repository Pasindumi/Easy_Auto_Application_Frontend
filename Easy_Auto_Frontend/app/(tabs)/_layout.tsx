import { Ionicons } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
    Animated,
    Dimensions,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { CommonActions } from "@react-navigation/native";

const { width } = Dimensions.get("window");
const PRIMARY = "#235CF8";
const INACTIVE = "#94A3B8";

import { useTranslation } from "react-i18next";

/**
 * Custom Floating Glass Tab Bar
 */
function CustomTabBar({ state, descriptors, navigation }: any) {
    const router = useRouter();
    const { t } = useTranslation();
    const insets = useSafeAreaInsets();
 
    // Calculate tab width (excluding margins)
    const MARGIN_H = 20;
    const barWidth = width - (MARGIN_H * 2);

    const visibleRoutes = state.routes.filter((r: any) => r.name !== "compare" && r.name !== "my-ads");
    
    // Construct the visual slots: [Home, Search, FAB, Chat, Profile]
    const slots = [
        visibleRoutes.find((r: any) => r.name === "index"),
        visibleRoutes.find((r: any) => r.name === "search"),
        "MY_ADS_FAB",
        visibleRoutes.find((r: any) => r.name === "chat"),
        visibleRoutes.find((r: any) => r.name === "profile"),
    ];

    const tabWidth = barWidth / slots.length;

    // Determine the visual index of the focused route
    const activeRouteName = state.routes[state.index].name;
    const activeVisualIndex = slots.findIndex((s: any) => 
        (s !== "MY_ADS_FAB" && s?.name === activeRouteName) || 
        (s === "MY_ADS_FAB" && activeRouteName === "my-ads")
    );

    // Animation for active indicator
    const translateX = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (activeVisualIndex !== -1) {
            Animated.spring(translateX, {
                toValue: activeVisualIndex * tabWidth,
                useNativeDriver: true,
                bounciness: 4,
                speed: 12,
            }).start();
        }
    }, [activeVisualIndex]);

    return (
        <View 
            pointerEvents="box-none" 
            style={[styles.floatingContainer, { bottom: insets.bottom + 10 }]}
        >
            <View style={[styles.barWrapper, { width: barWidth }]}>
                <View style={styles.glassBar}>
                    {/* Active Tab Indicator */}
                    {activeVisualIndex !== -1 && (
                        <Animated.View
                            style={[
                                styles.indicator,
                                { width: tabWidth - 10, transform: [{ translateX: Animated.add(translateX, 5) }] }
                            ]}
                        />
                    )}

                    {slots.map((item: any, index: number) => {
                        if (item === "MY_ADS_FAB") {
                            return (
                                <View key="fab-slot" style={styles.fabSlot}>
                                    <TouchableOpacity 
                                        activeOpacity={0.8}
                                        onPress={() => {
                                            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                                            navigation.navigate("my-ads");
                                        }}
                                        style={styles.fabContainer}
                                    >
                                        <View style={styles.simpleFab}>
                                            <Ionicons name="list" size={26} color="#FFF" />
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            );
                        }

                        const route = item;
                        if (!route) return null;

                        const { options } = descriptors[route.key];
                        const isFocused = activeRouteName === route.name;

                        const onPress = () => {
                            const event = navigation.emit({
                                type: 'tabPress',
                                target: route.key,
                                canPreventDefault: true,
                            });

                            if (!isFocused && !event.defaultPrevented) {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                navigation.dispatch(
                                    CommonActions.navigate({ name: route.name, merge: true })
                                );
                            }
                        };

                        const getIcon = (focused: boolean) => {
                            switch (route.name) {
                                case "index": return focused ? "home" : "home-outline";
                                case "search": return focused ? "search" : "search-outline";
                                case "chat": return focused ? "chatbubbles" : "chatbubbles-outline";
                                case "profile": return focused ? "person" : "person-outline";
                                default: return "square";
                            }
                        };

                        const getLabel = (routeName: string, titleObj: string) => {
                            switch (routeName) {
                                case "index": return t("tabs.home", "Home");
                                case "search": return t("tabs.search", "Search");
                                case "chat": return t("tabs.chat", "Chat");
                                case "profile": return t("tabs.profile", "Profile");
                                default: return titleObj || routeName;
                            }
                        };

                        return (
                            <Pressable
                                key={route.key}
                                onPress={onPress}
                                style={styles.tabItem}
                                hitSlop={{ top: 10, bottom: 10, left: 5, right: 5 }}
                            >
                                <Ionicons
                                    name={getIcon(isFocused) as any}
                                    size={isFocused ? 24 : 22}
                                    color={isFocused ? "#FFF" : INACTIVE}
                                />
                                <Text style={[
                                    styles.label,
                                    { color: isFocused ? "#FFF" : INACTIVE, fontWeight: isFocused ? "800" : "600" }
                                ]}>
                                    {getLabel(route.name, options.title)}
                                </Text>
                            </Pressable>
                        );
                    })}
                </View>
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
                tabBarStyle: {
                    position: 'absolute',
                    borderTopWidth: 0,
                    elevation: 0,
                    backgroundColor: 'transparent',
                    height: 100,
                    bottom: 0,
                    left: 0,
                    right: 0,
                }
            }}
        >
            <Tabs.Screen name="index" options={{ title: "Home" }} />
            <Tabs.Screen name="search" options={{ title: "Search" }} />
            <Tabs.Screen name="compare" options={{ title: "Compare" }} />
            <Tabs.Screen name="my-ads" options={{ title: "My Ads" }} />
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
    barWrapper: {
        flexDirection: "row",
        height: 64,
        backgroundColor: "#FFFFFF",
        borderRadius: 32,
        borderWidth: 1,
        borderColor: "rgba(0, 0, 0, 0.04)",
        // Premium Floating Shadow
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 10,
    },
    glassBar: {
        flexDirection: "row",
        flex: 1,
        paddingHorizontal: 5,
        alignItems: "center",
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
    fabSlot: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    fabContainer: {
        width: 52,
        height: 52,
        transform: [{ translateY: -10 }],
        zIndex: 1001,
    },
    simpleFab: {
        width: '100%',
        height: '100%',
        borderRadius: 26,
        backgroundColor: PRIMARY,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: PRIMARY,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    label: {
        fontSize: 10,
        letterSpacing: -0.2,
    }
});
