import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef } from "react";
import {
    Animated,
    Dimensions,
    Easing,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const { width, height } = Dimensions.get("window");

function SplashScreen() {
    const scale = useRef(new Animated.Value(0.2)).current;
    const logoOpacity = useRef(new Animated.Value(0)).current;
    const buttonOpacity = useRef(new Animated.Value(0)).current;
    
    // Continuous animation values
    const floatY = useRef(new Animated.Value(0)).current;
    const screenShineX = useRef(new Animated.Value(-width * 2)).current;

    useEffect(() => {
        // 1. Initial entrance animation
        Animated.sequence([
            Animated.parallel([
                Animated.spring(scale, { toValue: 1, friction: 5, tension: 50, useNativeDriver: true }),
                Animated.timing(logoOpacity, { toValue: 1, duration: 800, useNativeDriver: true }),
            ]),
            Animated.timing(buttonOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
        ]).start(() => {
            // 2. Start continuous floating loop after entrance
            Animated.loop(
                Animated.sequence([
                    Animated.timing(floatY, { toValue: -8, duration: 1500, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
                    Animated.timing(floatY, { toValue: 0, duration: 1500, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
                ])
            ).start();

            // 3. Screen-wide diagonal shine animation
            Animated.loop(
                Animated.sequence([
                    Animated.timing(screenShineX, { 
                        toValue: width * 2, 
                        duration: 3000, 
                        easing: Easing.inOut(Easing.cubic), 
                        useNativeDriver: true 
                    }),
                    Animated.delay(1000), // wait 1 second before next sweep
                    Animated.timing(screenShineX, { toValue: -width * 2, duration: 0, useNativeDriver: true }),
                ])
            ).start();
        });
    }, []);

    return (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
            {/* Screen-Wide Shine Animation */}
            <Animated.View 
                style={[
                    StyleSheet.absoluteFillObject, 
                    { opacity: 0.20, transform: [{ translateX: screenShineX }] }
                ]}
            >
                <LinearGradient
                    colors={['transparent', '#FFFFFF', 'transparent']}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                    style={{
                        position: 'absolute',
                        top: -height,
                        bottom: -height,
                        width: 120,
                        transform: [{ skewX: '35deg' }]
                    }}
                />
            </Animated.View>

            <View style={sp.center}>
                {/* Floating App Logo */}
                <Animated.View style={[
                    sp.logoCard, 
                    { opacity: logoOpacity, transform: [{ scale }, { translateY: floatY }] }
                ]}>
                    <Image
                        source={require("../assets/applogonew.png")}
                        style={sp.logo}
                        contentFit="contain"
                    />
                </Animated.View>
            </View>

            <View style={sp.bottomContent}>
                <Animated.View style={{ opacity: buttonOpacity, width: "100%" }}>
                    <View style={sp.startBtn}>
                        <Text style={sp.startBtnTxt}>Continue</Text>
                        <Ionicons name="arrow-forward" size={16} color="#FFFFFF" style={{ marginLeft: 6 }} />
                    </View>
                </Animated.View>
            </View>
        </View>
    );
}

const sp = StyleSheet.create({
    center: {
        flex: 1, 
        alignItems: "center", 
        justifyContent: "center", 
        zIndex: 2,
    },
    logoCard: {
        alignItems: "center", 
        justifyContent: "center",
    },
    logo: { 
        width: 85, 
        height: 85 
    },
    bottomContent: {
        position: "absolute", 
        bottom: 0, 
        left: 0, 
        right: 0,
        paddingHorizontal: 32, 
        paddingBottom: 50, 
        zIndex: 10,
        alignItems: "center",
    },
    startBtn: {
        backgroundColor: "#235CF8",
        borderWidth: 1.5,
        borderColor: "#FFFFFF",
        paddingVertical: 14,
        borderRadius: 5,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    startBtnTxt: {
        color: "#FFFFFF",
        fontSize: 15,
        fontWeight: "800",
        letterSpacing: 0.5,
    },
});

export default function LandingPage() {
    const router = useRouter();

    const handleContinue = () => {
        // Immediate feedback
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
        
        // Immediate navigation
        router.replace("/(tabs)");
    };

    return (
        <View style={{ flex: 1, backgroundColor: "#235CF8" }}>
            <StatusBar style="light" />
            
            {/* Visual Layer */}
            <SplashScreen />

            {/* Interaction Layer - Absolute Topmost and highly responsive */}
            <TouchableOpacity 
                activeOpacity={0.6} // Clear visual feedback on tap
                onPress={handleContinue}
                style={StyleSheet.absoluteFill}
            />
        </View>
    );
}
