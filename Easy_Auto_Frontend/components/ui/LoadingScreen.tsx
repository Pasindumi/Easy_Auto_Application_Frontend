import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    withSequence,
    Easing,
    interpolate,
    Extrapolate
} from 'react-native-reanimated';
import { COLORS } from '../../constants/Colors';
import { useTheme } from '../../contexts/ThemeContext';

const { width, height } = Dimensions.get('window');

const LoadingScreen = () => {
    const { isDarkMode } = useTheme();
    const animationValue = useSharedValue(0);

    useEffect(() => {
        animationValue.value = withRepeat(
            withTiming(1, {
                duration: 1500,
                easing: Easing.bezier(0.4, 0, 0.2, 1),
            }),
            -1,
            true
        );
    }, []);

    const animatedLogoStyle = useAnimatedStyle(() => {
        const scale = interpolate(
            animationValue.value,
            [0, 1],
            [0.9, 1.1],
            Extrapolate.CLAMP
        );
        const opacity = interpolate(
            animationValue.value,
            [0, 1],
            [0.7, 1],
            Extrapolate.CLAMP
        );

        return {
            transform: [{ scale }],
            opacity,
        };
    });

    const animatedContainerStyle = useAnimatedStyle(() => {
        const rotate = interpolate(
            animationValue.value,
            [0, 1],
            [0, 10],
            Extrapolate.CLAMP
        );

        return {
            // Subtle rotation if needed
        };
    });

    return (
        <View style={[
            styles.container,
            { backgroundColor: isDarkMode ? COLORS.secondary : COLORS.background }
        ]}>
            <Animated.View style={[styles.logoContainer, animatedLogoStyle]}>
                <Image
                    source={require('../../assets/logoB.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </Animated.View>

            {/* Premium Interactive Element: Animated ring */}
            <Animated.View style={[
                styles.ring,
                { borderColor: COLORS.primary },
                useAnimatedStyle(() => ({
                    transform: [{ scale: interpolate(animationValue.value, [0, 1], [1, 1.5]) }],
                    opacity: interpolate(animationValue.value, [0, 1], [0.3, 0]),
                }))
            ]} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
    },
    logoContainer: {
        width: 180,
        height: 180,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: '100%',
        height: '100%',
    },
    ring: {
        position: 'absolute',
        width: 200,
        height: 200,
        borderRadius: 100,
        borderWidth: 3,
    }
});

export default LoadingScreen;
