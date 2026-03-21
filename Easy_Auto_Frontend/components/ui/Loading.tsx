import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Easing,
    Image,
    StyleSheet,
    Text,
    View,
    ViewStyle,
} from 'react-native';
import COLORS from '../../constants/Colors';

interface LoadingProps {
    message?: string;
    style?: ViewStyle;
    fullScreen?: boolean;
    size?: 'small' | 'medium' | 'large';
}

const Loading: React.FC<LoadingProps> = ({
    message = "Please wait...",
    style,
    fullScreen = false,
    size = 'medium'
}) => {
    // Scale factors
    const scaleMap = {
        small: 0.4,
        medium: 0.60,
        large: 0.80
    };
    const scale = scaleMap[size];
    const rotateAnim = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();

        const rotation = Animated.loop(
            Animated.timing(rotateAnim, {
                toValue: 1,
                duration: 1500,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        );

        const pulse = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.1,
                    duration: 1000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        );

        rotation.start();
        pulse.start();

        return () => {
            rotation.stop();
            pulse.stop();
        };
    }, []);

    const rotationInterpolation = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    // Generate 12 pills like in the image
    const pills = [];
    const colors = [
        '#0033CC', '#0044DD', '#0055EE', '#0066FF',
        '#3388FF', '#66AAFF', '#99CCFF', '#CCE6FF',
        '#E6F2FF', '#FFFFFF', '#CCE6FF', '#99CCFF'
    ];

    for (let i = 0; i < 12; i++) {
        const rotation = i * 30; // 360 / 12
        pills.push(
            <View
                key={i}
                style={[
                    styles.pill,
                    {
                        backgroundColor: colors[i],
                        transform: [
                            { rotate: `${rotation}deg` },
                            { translateY: -20 } // Distance from center
                        ]
                    }
                ]}
            />
        );
    }

    return (
        <Animated.View style={[
            styles.container,
            fullScreen && styles.fullScreen,
            !fullScreen && { paddingVertical: size === 'small' ? 4 : (size === 'medium' ? 16 : 30) },
            style,
            { opacity: fadeAnim }
        ]}>
            <View style={[
                styles.loaderWrapper,
                { transform: [{ scale }] }
            ]}>
                {/* Rotating Spinner (12 Pills) */}
                <Animated.View style={[
                    styles.spinnerContainer,
                    { transform: [{ rotate: rotationInterpolation }] }
                ]}>
                    {pills}
                </Animated.View>

                {/* Logo in the center */}
                <View style={styles.logoContainer}>
                    <Animated.View style={{
                        transform: [
                            { scale: pulseAnim },
                            { rotate: rotationInterpolation } // Logo also rotates
                        ]
                    }}>
                        <Image
                            source={require('../../assets/logoB.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                    </Animated.View>
                </View>
            </View>
            {message && size !== 'small' && <Text style={styles.message}>{message}</Text>}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    fullScreen: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        zIndex: 9999,
        paddingVertical: 0,
    },
    loaderWrapper: {
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
    },
    spinnerContainer: {
        width: 54,
        height: 54,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
    },
    pill: {
        width: 4,
        height: 10,
        borderRadius: 2,
        position: 'absolute',
    },
    logoContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        width: 18,
        height: 18,
    },
    message: {
        fontSize: 15,
        color: COLORS.primary,
        fontWeight: '600',
        marginTop: 20,
        letterSpacing: 0.5,
    },
});

export default Loading;
