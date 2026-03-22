import { Ionicons } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import { CommonActions } from '@react-navigation/native';
import React, { useEffect, useRef } from "react";
import {
    Animated,
    Dimensions,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");
const PRIMARY = "#235CF8";
const INACTIVE = "#94A3B8";

// Extract tab item into Memoized Component to prevent full bar re-renders
const TabItem = React.memo(({ route, isFocused, onPress, options }: any) => {
    const getIcon = (focused: boolean) => {
        switch (route.name) {
            case "index":   return focused ? "home" : "home-outline";
            case "search":  return focused ? "search" : "search-outline";
            case "chat":    return focused ? "chatbubbles" : "chatbubbles-outline";
            case "profile": return focused ? "person" : "person-outline";
            default:        return "square";
        }
    };

    return (
        <Pressable 
            onPress={onPress} 
            style={({ pressed }) => [
                styles.tabItem,
                { opacity: pressed ? 0.7 : 1 }
            ]}
            hitSlop={{ top: 20, bottom: 20, left: 10, right: 10 }}
        >
            <Ionicons 
                name={getIcon(isFocused) as any} 
                size={isFocused ? 24 : 22} 
                color={isFocused ? "#FFF" : INACTIVE} 
            />
            <Text style={[
                styles.label, 
                { color: isFocused ? "#FFF" : INACTIVE, fontWeight: isFocused ? "bold" : "600" }
            ]}>
                {options.title || route.name}
            </Text>
        </Pressable>
    );
});

/**
 * Custom Floating Glass Tab Bar with Central FAB
 */
function CustomTabBar({ state, descriptors, navigation }: any) {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    
    // Filter out hidden routes (e.g., 'compare')
    const visibleRoutes = state.routes.filter((r: any) => r.name !== "compare");
    
    // Visually divide the bar into 5 slots
    const MARGIN_H = 20;
    const barWidth = width - (MARGIN_H * 2);
    const tabWidth = barWidth / 5; // 5 slots total

    // Create a new array that represents the 5 visual slots
    const slots = [
        visibleRoutes.find((r:any) => r.name === 'index'),
        visibleRoutes.find((r:any) => r.name === 'search'),
        'FAB',
        visibleRoutes.find((r:any) => r.name === 'chat'),
        visibleRoutes.find((r:any) => r.name === 'profile'),
    ];

    // Animation for active indicator
    const translateX = useRef(new Animated.Value(0)).current;

    // Find visual index of currently active route
    const currentRoute = state.routes[state.index];
    const activeVisualIndex = slots.findIndex(s => s && typeof s !== 'string' && s.key === currentRoute?.key);
    
    const indicatorOpacity = useRef(new Animated.Value(activeVisualIndex !== -1 ? 1 : 0)).current;

    useEffect(() => {
        if (activeVisualIndex !== -1) {
            Animated.parallel([
                Animated.timing(indicatorOpacity, { toValue: 1, duration: 150, useNativeDriver: true }),
                Animated.spring(translateX, {
                    toValue: activeVisualIndex * tabWidth,
                    useNativeDriver: true,
                    bounciness: 4,
                    speed: 12,
                })
            ]).start();
        } else {
            Animated.timing(indicatorOpacity, { toValue: 0, duration: 150, useNativeDriver: true }).start();
        }
    }, [activeVisualIndex, tabWidth]);

    const handleSellPress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        router.push("/cars/select-type" as any);
    };

    return (
        <View 
            pointerEvents="box-none" 
            style={[styles.floatingContainer, { bottom: insets.bottom + 5 }]}
        >
            <View style={[styles.glassBar, { width: barWidth }]}>
                {/* Active Tab Indicator (Sliding Background) */}
                <Animated.View 
                    pointerEvents="none"
                    style={[
                        styles.indicator, 
                        { width: tabWidth - 10, opacity: indicatorOpacity, transform: [{ translateX: Animated.add(translateX, 5) }] }
                    ]} 
                />

                {slots.map((slot, index) => {
                    if (slot === 'FAB') {
                        return (
                            <View key="fab" style={styles.fabContainer}>
                                <TouchableOpacity 
                                    activeOpacity={0.9} 
                                    onPress={handleSellPress}
                                    style={styles.fabButtonShadow}
                                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                >
                                    <LinearGradient
                                        colors={["#FF3B30", "#D92020"]}
                                        style={styles.fabGradient}
                                    >
                                        <Ionicons name="camera" size={26} color="#FFF" style={{ marginLeft: 1 }} />
                                    </LinearGradient>
                                </TouchableOpacity>
                                <Text style={styles.fabLabel}>Sell</Text>
                            </View>
                        );
                    }

                    const route = slot as any;
                    if (!route) return <View key={`empty-${index}`} style={styles.tabItem} />;

                    const { options } = descriptors[route.key];
                    const isFocused = state.index === state.routes.findIndex((r:any) => r.key === route.key);

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });
                        if (!isFocused && !event.defaultPrevented) {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            navigation.dispatch({
                                ...CommonActions.navigate(route.name, route.params),
                                target: state.key,
                            });
                        }
                    };

                    return (
                        <TabItem 
                            key={route.key} 
                            route={route} 
                            isFocused={isFocused} 
                            onPress={onPress} 
                            options={options} 
                        />
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
                tabBarStyle: {
                    position: 'absolute',
                    borderTopWidth: 0,
                    elevation: 0,
                    backgroundColor: 'transparent',
                    height: 120, // Extra safe for floating bar + FAB + Safe Area
                    bottom: 0,
                    left: 0,
                    right: 0,
                }
            }}
        >
            <Tabs.Screen name="index" options={{ title: "Home" }} />
            <Tabs.Screen name="search" options={{ title: "Search" }} />
            <Tabs.Screen name="compare" options={{ href: null, title: "Compare" } as any} />
            <Tabs.Screen name="chat" options={{ title: "Chat" }} />
            <Tabs.Screen name="profile" options={{ title: "Profile" }} />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    floatingContainer: {
        position: "absolute",
        left: 0,
        right: 0,
        alignItems: "center",
        zIndex: 9999,
        justifyContent: 'flex-end',
        paddingBottom: 5,
    },
    glassBar: {
        flexDirection: "row",
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        borderRadius: 30,
        height: 64,
        paddingHorizontal: 5,
        alignItems: "center",
        // Precise Border
        borderWidth: 1.5,
        borderColor: "rgba(255, 255, 255, 0.7)",
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
        height: 64, // Direct height match to glassBar
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        backgroundColor: 'transparent', // Crucial for hit testing on some devices
    },
    label: {
        fontSize: 10,
        letterSpacing: -0.2,
    },
    fabContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-start",
        height: "100%",
        position: "relative",
    },
    fabButtonShadow: {
        shadowColor: "#D92020",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.5,
        shadowRadius: 12,
        elevation: 10,
        transform: [{ translateY: -22 }],
    },
    fabGradient: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 3,
        borderColor: "#FFF",
    },
    fabLabel: {
        fontSize: 10,
        fontWeight: "800",
        color: "#D92020",
        position: "absolute",
        bottom: 8,
    }
});
