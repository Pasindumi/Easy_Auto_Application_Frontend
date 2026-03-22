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
        small: 0.5,
        medium: 0.8,
        large: 1.0
    };
    const scale = scaleMap[size];
    const rotateAnim = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
        }).start();

        const animation = Animated.loop(
            Animated.timing(rotateAnim, {
                toValue: 1,
                duration: 1200,
                easing: Easing.bezier(0.4, 0, 0.2, 1),
                useNativeDriver: true,
            })
        );
        animation.start();

        return () => animation.stop();
    }, []);

    const rotationInterpolation = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    // 12 pills like in standard iOS activity indicator
    const pills = [];
    const pillCount = 12;

    for (let i = 0; i < pillCount; i++) {
        // Opacity staggered based on index
        const opacity = (i + 1) / pillCount; 
        const rotation = i * (360 / pillCount);
        
        pills.push(
            <View
                key={i}
                style={[
                    styles.pill,
                    {
                        backgroundColor: COLORS.primary, // Using primary blue
                        opacity: opacity,
                        transform: [
                            { rotate: `${rotation}deg` },
                            { translateY: -28 } // Radius distance from center
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
            !fullScreen && { paddingVertical: size === 'small' ? 8 : (size === 'medium' ? 24 : 40) },
            style,
            { opacity: fadeAnim }
        ]}>
            <View style={[
                styles.loaderWrapper,
                { transform: [{ scale }] }
            ]}>
                {/* Rotating Spinner Container */}
                <Animated.View style={[
                    styles.spinnerContainer,
                    { transform: [{ rotate: rotationInterpolation }] }
                ]}>
                    {pills}
                </Animated.View>

                {/* Logo in the center - doesn't rotate */}
                <View style={styles.logoWrapper}>
                    <Image
                        source={require('../../assets/logoB.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </View>
            </View>
            
            {message && size !== 'small' && (
                <Text style={styles.message}>{message}</Text>
            )}
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
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        zIndex: 9999,
        paddingVertical: 0,
    },
    loaderWrapper: {
        width: 100,
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    spinnerContainer: {
        width: 100,
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
    },
    pill: {
        width: 5,
        height: 14,
        borderRadius: 3,
        position: 'absolute',
    },
    logoWrapper: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
    },
    logo: {
        width: 32,
        height: 32,
        opacity: 0.9,
    },
    message: {
        marginTop: 20,
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.primary,
        letterSpacing: -0.2,
    },
});

export default Loading;
