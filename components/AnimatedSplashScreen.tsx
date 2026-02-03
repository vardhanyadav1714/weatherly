/**
 * AnimatedSplashScreen Component
 * A stunning animated splash screen with multiple weather elements,
 * particle effects, and smooth sequenced animations.
 */

import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming
} from 'react-native-reanimated';
import Svg, { Circle, Defs, G, Path, RadialGradient, Stop } from 'react-native-svg';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface AnimatedSplashScreenProps {
  onAnimationComplete: () => void;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedG = Animated.createAnimatedComponent(G);

export default function AnimatedSplashScreen({ onAnimationComplete }: AnimatedSplashScreenProps) {
  // Animation values
  const progress = useSharedValue(0);
  const sunScale = useSharedValue(0);
  const sunRotation = useSharedValue(0);
  const sunGlow = useSharedValue(0);
  const cloudX = useSharedValue(-100);
  const cloudY = useSharedValue(50);
  const cloud2X = useSharedValue(SCREEN_WIDTH + 100);
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.5);
  const titleY = useSharedValue(50);
  const titleOpacity = useSharedValue(0);
  const subtitleOpacity = useSharedValue(0);
  const fadeOut = useSharedValue(1);
  const scaleOut = useSharedValue(1);

  // Particle positions for stars/sparkles
  const particles = Array.from({ length: 8 }, () => ({
    x: useSharedValue(Math.random() * SCREEN_WIDTH),
    y: useSharedValue(Math.random() * SCREEN_HEIGHT * 0.4),
    opacity: useSharedValue(0),
    scale: useSharedValue(0),
  }));

  useEffect(() => {
    // Main animation sequence
    const startAnimations = () => {
      // Sun entrance
      sunScale.value = withDelay(
        200,
        withSpring(1, { damping: 12, stiffness: 100 })
      );

      // Sun rotation
      sunRotation.value = withDelay(
        200,
        withRepeat(
          withTiming(360, { duration: 20000, easing: Easing.linear }),
          -1,
          false
        )
      );

      // Sun glow pulse
      sunGlow.value = withDelay(
        500,
        withRepeat(
          withSequence(
            withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
            withTiming(0.5, { duration: 1500, easing: Easing.inOut(Easing.ease) })
          ),
          -1,
          true
        )
      );

      // Cloud 1 slide in
      cloudX.value = withDelay(
        400,
        withSpring(SCREEN_WIDTH * 0.15, { damping: 15, stiffness: 50 })
      );
      cloudY.value = withDelay(
        400,
        withRepeat(
          withSequence(
            withTiming(40, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
            withTiming(60, { duration: 2000, easing: Easing.inOut(Easing.ease) })
          ),
          -1,
          true
        )
      );

      // Cloud 2 slide in
      cloud2X.value = withDelay(
        600,
        withSpring(SCREEN_WIDTH * 0.55, { damping: 15, stiffness: 50 })
      );

      // Particles sparkle
      particles.forEach((particle, i) => {
        particle.opacity.value = withDelay(
          800 + i * 100,
          withRepeat(
            withSequence(
              withTiming(1, { duration: 500 }),
              withTiming(0.3, { duration: 500 })
            ),
            -1,
            true
          )
        );
        particle.scale.value = withDelay(
          800 + i * 100,
          withSpring(1, { damping: 10 })
        );
      });

      // Logo entrance
      logoOpacity.value = withDelay(
        1000,
        withTiming(1, { duration: 500 })
      );
      logoScale.value = withDelay(
        1000,
        withSpring(1, { damping: 12, stiffness: 100 })
      );

      // Title entrance
      titleOpacity.value = withDelay(
        1200,
        withTiming(1, { duration: 500 })
      );
      titleY.value = withDelay(
        1200,
        withSpring(0, { damping: 15 })
      );

      // Subtitle entrance
      subtitleOpacity.value = withDelay(
        1400,
        withTiming(1, { duration: 500 })
      );

      // Final fade out
      fadeOut.value = withDelay(
        2200,
        withTiming(0, { duration: 600, easing: Easing.out(Easing.ease) })
      );
      scaleOut.value = withDelay(
        2200,
        withTiming(1.2, { duration: 600, easing: Easing.out(Easing.ease) }, () => {
          runOnJS(onAnimationComplete)();
        })
      );
    };

    startAnimations();
  }, []);

  // Animated styles
  const containerStyle = useAnimatedStyle(() => ({
    opacity: fadeOut.value,
    transform: [{ scale: scaleOut.value }],
  }));

  const sunContainerStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: sunScale.value },
      { rotate: `${sunRotation.value}deg` },
    ],
  }));

  const sunGlowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(sunGlow.value, [0, 1], [0.3, 0.8]),
    transform: [{ scale: interpolate(sunGlow.value, [0, 1], [1, 1.2]) }],
  }));

  const cloudStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: cloudX.value },
      { translateY: cloudY.value },
    ],
  }));

  const cloud2Style = useAnimatedStyle(() => ({
    transform: [
      { translateX: cloud2X.value },
      { translateY: interpolate(cloudY.value, [40, 60], [55, 45]) },
    ],
  }));

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleY.value }],
  }));

  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
  }));

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <LinearGradient
        colors={['#0F2027', '#203A43', '#2C5364']}
        style={StyleSheet.absoluteFill}
      />

      {/* Stars/Particles */}
      {particles.map((particle, i) => (
        <Animated.View
          key={i}
          style={[
            styles.particle,
            useAnimatedStyle(() => ({
              left: particle.x.value,
              top: particle.y.value,
              opacity: particle.opacity.value,
              transform: [{ scale: particle.scale.value }],
            })),
          ]}
        />
      ))}

      {/* Sun Glow Background */}
      <Animated.View style={[styles.sunGlow, sunGlowStyle]}>
        <LinearGradient
          colors={['rgba(255, 214, 10, 0.4)', 'rgba(255, 149, 0, 0.1)', 'transparent']}
          style={styles.sunGlowGradient}
        />
      </Animated.View>

      {/* Main content area */}
      <View style={styles.contentArea}>
        {/* Sun */}
        <Animated.View style={[styles.sunContainer, sunContainerStyle]}>
          <Svg width={120} height={120} viewBox="0 0 100 100">
            <Defs>
              <RadialGradient id="sunCoreGrad" cx="50%" cy="30%" r="50%">
                <Stop offset="0%" stopColor="#FFFEF0" />
                <Stop offset="40%" stopColor="#FFD700" />
                <Stop offset="100%" stopColor="#FF8C00" />
              </RadialGradient>
            </Defs>
            {/* Sun rays */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => (
              <Path
                key={i}
                d="M50 18 L50 5"
                stroke="#FFD700"
                strokeWidth="4"
                strokeLinecap="round"
                transform={`rotate(${angle} 50 50)`}
                opacity={0.9}
              />
            ))}
            {/* Sun core */}
            <Circle cx="50" cy="50" r="25" fill="url(#sunCoreGrad)" />
          </Svg>
        </Animated.View>

        {/* Cloud 1 */}
        <Animated.View style={[styles.cloud, cloudStyle]}>
          <Svg width={100} height={60} viewBox="0 0 100 60">
            <Defs>
              <RadialGradient id="cloudGrad" cx="50%" cy="30%" r="70%">
                <Stop offset="0%" stopColor="#FFFFFF" />
                <Stop offset="100%" stopColor="#E8E8E8" />
              </RadialGradient>
            </Defs>
            <Path
              d="M20 45 Q5 45 5 35 Q5 22 22 22 Q28 10 45 12 Q65 8 75 22 Q92 22 92 35 Q92 45 77 45 Z"
              fill="url(#cloudGrad)"
            />
          </Svg>
        </Animated.View>

        {/* Cloud 2 */}
        <Animated.View style={[styles.cloud2, cloud2Style]}>
          <Svg width={80} height={50} viewBox="0 0 100 60">
            <Defs>
              <RadialGradient id="cloudGrad2" cx="50%" cy="30%" r="70%">
                <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
                <Stop offset="100%" stopColor="#D0D0D0" stopOpacity="0.7" />
              </RadialGradient>
            </Defs>
            <Path
              d="M20 45 Q5 45 5 35 Q5 22 22 22 Q28 10 45 12 Q65 8 75 22 Q92 22 92 35 Q92 45 77 45 Z"
              fill="url(#cloudGrad2)"
            />
          </Svg>
        </Animated.View>
      </View>

      {/* Logo */}
      <Animated.View style={[styles.logoContainer, logoStyle]}>
        <LinearGradient
          colors={['#5AC8FA', '#007AFF', '#5856D6']}
          style={styles.logoGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Svg width={40} height={40} viewBox="0 0 100 100">
            <Circle cx="35" cy="40" r="18" fill="#FFD700" />
            <Path
              d="M40 65 Q25 65 25 55 Q25 45 38 45 Q43 35 55 36 Q70 34 78 48 Q88 48 88 55 Q88 65 76 65 Z"
              fill="#FFFFFF"
            />
          </Svg>
        </LinearGradient>
      </Animated.View>

      {/* Title */}
      <Animated.View style={[styles.titleContainer, titleStyle]}>
        <Text style={styles.title}>Weatherly</Text>
      </Animated.View>

      {/* Subtitle */}
      <Animated.Text style={[styles.subtitle, subtitleStyle]}>
        Powered by WeatherAPI
      </Animated.Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  particle: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },
  sunGlow: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.15,
  },
  sunGlowGradient: {
    width: 300,
    height: 300,
    borderRadius: 150,
  },
  contentArea: {
    height: 250,
    width: SCREEN_WIDTH,
    position: 'relative',
    marginBottom: 40,
  },
  sunContainer: {
    position: 'absolute',
    top: 20,
    left: SCREEN_WIDTH * 0.5 - 60,
  },
  cloud: {
    position: 'absolute',
    top: 80,
  },
  cloud2: {
    position: 'absolute',
    top: 120,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logoGradient: {
    width: 80,
    height: 80,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#5AC8FA',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 10,
  },
  titleContainer: {
    marginBottom: 8,
  },
  title: {
    fontSize: 42,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
});