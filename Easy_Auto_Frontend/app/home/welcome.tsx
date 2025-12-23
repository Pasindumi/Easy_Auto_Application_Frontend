import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as React from 'react';
import { useEffect } from 'react';
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  FadeInDown,
  FadeInUp,
  ZoomIn,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Header from '@/components/Header';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function WelcomeScreen() {
  const router = useRouter();
  const floatingValue = useSharedValue(0);
  const buttonScale = useSharedValue(1);

  useEffect(() => {
    floatingValue.value = withRepeat(
      withTiming(1, { duration: 2000 }),
      -1,
      true
    );
  }, []);

  const animatedCarStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: floatingValue.value * -15 },
      { scale: 1 + floatingValue.value * 0.05 },
    ],
  }));

  const shadowStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: 1 - floatingValue.value * 0.2 },
    ],
    opacity: 0.3 - floatingValue.value * 0.1,
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const benefits = [
    { id: 1, text: 'Easy Buying & Selling', icon: 'checkmark-circle' },
    { id: 2, text: 'Secure Chat & Payment', icon: 'checkmark-circle' },
    { id: 3, text: 'Best Anytime', icon: 'checkmark-circle' },
    { id: 4, text: 'Free Support Plans', icon: 'checkmark-circle' },
    { id: 5, text: 'Verified Sellers', icon: 'checkmark-circle' },
    { id: 6, text: 'Website & Compare', icon: 'checkmark-circle' },
  ];

  const handlePressIn = () => {
    buttonScale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    buttonScale.value = withSpring(1);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#235CF8" />

      <Header showBack={true} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Welcome Text Section */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(800)}
          style={styles.welcomeSection}
        >
          <Text style={styles.welcomeText}>
            WELCOME TO <Text style={styles.easyAutoText}>EASYAUTO</Text>
          </Text>
        </Animated.View>

        {/* Car Image */}
        <Animated.View
          entering={ZoomIn.delay(400).duration(1000)}
          style={styles.imageContainer}
        >
          <LinearGradient
            colors={['#1a1a1a', '#333333']}
            style={styles.carImagePlaceholder}
          >
            <Animated.View style={animatedCarStyle}>
              <Ionicons name="car-sport" size={140} color="#235CF8" />
            </Animated.View>
            <Animated.View style={[styles.carShadow, shadowStyle]} />
          </LinearGradient>
        </Animated.View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          <Animated.View entering={FadeInUp.delay(600).duration(800)}>
            <Text style={styles.mainTitle}>
              FIND YOUR <Text style={styles.dreamCarText}>DREAM CAR</Text>
            </Text>
            <Text style={styles.subtitle}>
              Browse thousands of verified cars from trusted sellers near you.
            </Text>
          </Animated.View>


          {/* Benefits Section */}
          <Animated.View
            entering={FadeInUp.delay(800).duration(800)}
            style={styles.benefitsSection}
          >
            <View style={styles.benefitsContainer}>
              <Text style={styles.benefitsTitle}>Benefits of Using EasyAuto</Text>

              <View style={styles.benefitsGrid}>
                {benefits.map((benefit, index) => (
                  <Animated.View
                    key={benefit.id}
                    entering={FadeInDown.delay(1000 + index * 100).duration(500)}
                    style={styles.benefitItem}
                  >
                    <View style={styles.checkmarkContainer}>
                      <Ionicons
                        name="checkmark"
                        size={14}
                        color="#235CF8"
                      />
                    </View>
                    <Text style={styles.benefitText}>{benefit.text}</Text>
                  </Animated.View>
                ))}
              </View>
            </View>
          </Animated.View>

          {/* Continue Button */}
          <Animated.View entering={FadeInUp.delay(1200).duration(800)}>
            <AnimatedPressable
              style={[styles.continueButton, buttonAnimatedStyle]}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              onPress={() => {
                router.push('/settings/select-language');
              }}
            >
              <LinearGradient
                colors={['#235CF8', '#1a46c8']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientButton}
              >
                <Text style={styles.continueButtonText}>Continue</Text>
                <View style={styles.buttonIconContainer}>
                  <Ionicons name="arrow-forward" size={20} color="white" />
                </View>
              </LinearGradient>
            </AnimatedPressable>
          </Animated.View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    flex: 1,
  },
  welcomeSection: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  welcomeText: {
    fontSize: 20,
    color: '#333',
    fontWeight: '500',
    textAlign: 'center',
  },
  easyAutoText: {
    color: '#235CF8',
    fontWeight: 'bold',
  },
  imageContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  carImagePlaceholder: {
    width: 320,
    height: 220,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  carShadow: {
    position: 'absolute',
    bottom: 40,
    width: 120,
    height: 15,
    backgroundColor: 'black',
    borderRadius: 50,
  },
  mainContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  mainTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#235CF8',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  dreamCarText: {
    color: '#000000',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  benefitsSection: {
    marginBottom: 32,
  },
  benefitsContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  benefitsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  benefitsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    marginBottom: 16,
  },
  checkmarkContainer: {
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: '#EBF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  benefitText: {
    fontSize: 13,
    color: '#444',
    flex: 1,
    fontWeight: '600',
  },
  continueButton: {
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#235CF8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    backgroundColor: 'white',
  },
  gradientButton: {
    flexDirection: 'row',
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  buttonIconContainer: {
    marginLeft: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 4,
  },
});