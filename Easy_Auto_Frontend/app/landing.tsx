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
        Animated.sequence([
            Animated.parallel([
                Animated.spring(scale, { toValue: 1, friction: 5, tension: 50, useNativeDriver: true }),
                Animated.timing(logoOpacity, { toValue: 1, duration: 800, useNativeDriver: true }),
            ]),
            Animated.timing(buttonOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
        ]).start(() => {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(floatY, { toValue: -8, duration: 1500, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
                    Animated.timing(floatY, { toValue: 0, duration: 1500, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
                ])
            ).start();

            Animated.loop(
                Animated.sequence([
                    Animated.timing(screenShineX, { 
                        toValue: width * 2, 
                        duration: 3000, 
                        easing: Easing.inOut(Easing.cubic), 
                        useNativeDriver: true 
                    }),
                    Animated.delay(1000),
                    Animated.timing(screenShineX, { toValue: -width * 2, duration: 0, useNativeDriver: true }),
                ])
            ).start();
        });
    }, []);

    return (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
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
        // Use try-catch to ensure any error doesn't kill the app
        try {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
            // Use absolute path and ensure it's a replace
            router.replace("/(tabs)");
        } catch (e) {
            console.error("Navigation error", e);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: "#235CF8" }}>
            <StatusBar style="light" />
            
            {/* Visuals */}
            <SplashScreen />

            {/* HIGH-PRIORITY INVISIBLE TOUCH LAYER */}
            <TouchableOpacity 
                activeOpacity={0.5} 
                onPress={handleContinue}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 99999,
                    elevation: 99999,
                    backgroundColor: 'transparent'
                }}
            />
        </View>
    );
}
