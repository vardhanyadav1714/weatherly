/**
 * AnimatedWeatherIcon Component
 * Beautiful animated weather icons using SVG with smooth Reanimated animations.
 * Includes sun rays rotation, cloud floating, rain drops, snow falling, etc.
 */

import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withSequence,
    withTiming
} from 'react-native-reanimated';
import Svg, { Circle, Defs, G, Path, RadialGradient, Stop, LinearGradient as SvgLinearGradient } from 'react-native-svg';

interface AnimatedWeatherIconProps {
    condition: 'clear' | 'partly-cloudy' | 'cloudy' | 'rain' | 'storm' | 'snow' | 'mist';
    isDay?: boolean;
    size?: number;
    animated?: boolean;
}

const AnimatedG = Animated.createAnimatedComponent(G);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function AnimatedWeatherIcon({
    condition,
    isDay = true,
    size = 120,
    animated = true,
}: AnimatedWeatherIconProps) {
    // Animation values
    const rotation = useSharedValue(0);
    const sunScale = useSharedValue(1);
    const cloudX = useSharedValue(0);
    const cloudY = useSharedValue(0);
    const rainDrop1 = useSharedValue(0);
    const rainDrop2 = useSharedValue(0);
    const rainDrop3 = useSharedValue(0);
    const snowRotation = useSharedValue(0);
    const moonGlow = useSharedValue(0.3);

    useEffect(() => {
        if (!animated) return;

        // Sun rotation animation
        rotation.value = withRepeat(
            withTiming(360, { duration: 20000, easing: Easing.linear }),
            -1,
            false
        );

        // Sun pulse animation
        sunScale.value = withRepeat(
            withSequence(
                withTiming(1.1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
                withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            false
        );

        // Cloud floating animation
        cloudX.value = withRepeat(
            withSequence(
                withTiming(5, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
                withTiming(-5, { duration: 3000, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            false
        );

        cloudY.value = withRepeat(
            withSequence(
                withTiming(-3, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
                withTiming(3, { duration: 2000, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            false
        );

        // Rain drops animation
        const rainDuration = 800;
        rainDrop1.value = withRepeat(
            withTiming(1, { duration: rainDuration, easing: Easing.linear }),
            -1,
            false
        );
        rainDrop2.value = withDelay(
            200,
            withRepeat(
                withTiming(1, { duration: rainDuration, easing: Easing.linear }),
                -1,
                false
            )
        );
        rainDrop3.value = withDelay(
            400,
            withRepeat(
                withTiming(1, { duration: rainDuration, easing: Easing.linear }),
                -1,
                false
            )
        );

        // Snow rotation
        snowRotation.value = withRepeat(
            withTiming(360, { duration: 8000, easing: Easing.linear }),
            -1,
            false
        );

        // Moon glow
        moonGlow.value = withRepeat(
            withSequence(
                withTiming(0.6, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
                withTiming(0.3, { duration: 2000, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            false
        );
    }, [animated]);

    const sunRaysStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${rotation.value}deg` }],
    }));

    const sunCoreStyle = useAnimatedStyle(() => ({
        transform: [{ scale: sunScale.value }],
    }));

    const cloudStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: cloudX.value },
            { translateY: cloudY.value },
        ],
    }));

    const renderSun = () => (
        <Animated.View style={[styles.iconContainer, { width: size, height: size }]}>
            {/* Sun rays */}
            <Animated.View style={[StyleSheet.absoluteFill, sunRaysStyle]}>
                <Svg width={size} height={size} viewBox="0 0 100 100">
                    <Defs>
                        <RadialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
                            <Stop offset="0%" stopColor="#FFE082" stopOpacity="0.8" />
                            <Stop offset="100%" stopColor="#FFD700" stopOpacity="0" />
                        </RadialGradient>
                    </Defs>
                    {/* Glow */}
                    <Circle cx="50" cy="50" r="45" fill="url(#sunGlow)" />
                    {/* Sun rays */}
                    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => (
                        <Path
                            key={i}
                            d={`M50 20 L50 8`}
                            stroke="#FFD700"
                            strokeWidth="3"
                            strokeLinecap="round"
                            transform={`rotate(${angle} 50 50)`}
                        />
                    ))}
                </Svg>
            </Animated.View>
            {/* Sun core */}
            <Animated.View style={[StyleSheet.absoluteFill, sunCoreStyle]}>
                <Svg width={size} height={size} viewBox="0 0 100 100">
                    <Defs>
                        <RadialGradient id="sunCore" cx="50%" cy="30%" r="50%">
                            <Stop offset="0%" stopColor="#FFFACD" />
                            <Stop offset="50%" stopColor="#FFD700" />
                            <Stop offset="100%" stopColor="#FFA500" />
                        </RadialGradient>
                    </Defs>
                    <Circle cx="50" cy="50" r="22" fill="url(#sunCore)" />
                </Svg>
            </Animated.View>
        </Animated.View>
    );

    const renderMoon = () => (
        <View style={[styles.iconContainer, { width: size, height: size }]}>
            <Svg width={size} height={size} viewBox="0 0 100 100">
                <Defs>
                    <RadialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
                        <Stop offset="0%" stopColor="#E8E8E8" stopOpacity="0.5" />
                        <Stop offset="100%" stopColor="#C0C0C0" stopOpacity="0" />
                    </RadialGradient>
                    <RadialGradient id="moonSurface" cx="40%" cy="40%" r="60%">
                        <Stop offset="0%" stopColor="#FFFEF0" />
                        <Stop offset="60%" stopColor="#E8E8E8" />
                        <Stop offset="100%" stopColor="#C0C0C0" />
                    </RadialGradient>
                </Defs>
                <Circle cx="50" cy="50" r="40" fill="url(#moonGlow)" />
                <Circle cx="50" cy="50" r="25" fill="url(#moonSurface)" />
                {/* Moon craters */}
                <Circle cx="42" cy="45" r="4" fill="rgba(150,150,150,0.3)" />
                <Circle cx="55" cy="52" r="3" fill="rgba(150,150,150,0.2)" />
                <Circle cx="48" cy="58" r="2" fill="rgba(150,150,150,0.25)" />
            </Svg>
            {/* Stars */}
            {[
                { x: 15, y: 20, s: 2 },
                { x: 80, y: 15, s: 1.5 },
                { x: 85, y: 75, s: 2 },
                { x: 20, y: 80, s: 1.5 },
                { x: 75, y: 40, s: 1 },
            ].map((star, i) => (
                <View
                    key={i}
                    style={[
                        styles.star,
                        {
                            left: (star.x / 100) * size,
                            top: (star.y / 100) * size,
                            width: star.s * 2,
                            height: star.s * 2,
                            borderRadius: star.s,
                        },
                    ]}
                />
            ))}
        </View>
    );

    const renderCloud = (offsetX = 0, offsetY = 0, scale = 1) => (
        <Animated.View style={[cloudStyle, { transform: [{ translateX: offsetX }, { translateY: offsetY }, { scale }] }]}>
            <Svg width={size * 0.8} height={size * 0.5} viewBox="0 0 100 60">
                <Defs>
                    <SvgLinearGradient id="cloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <Stop offset="0%" stopColor="#FFFFFF" />
                        <Stop offset="100%" stopColor="#E8E8E8" />
                    </SvgLinearGradient>
                </Defs>
                <Path
                    d="M25 45 Q10 45 10 35 Q10 25 25 25 Q30 15 45 15 Q65 10 75 25 Q90 25 90 35 Q90 45 75 45 Z"
                    fill="url(#cloudGrad)"
                />
            </Svg>
        </Animated.View>
    );

    const renderPartlyCloudy = () => (
        <View style={[styles.iconContainer, { width: size, height: size }]}>
            <View style={{ position: 'absolute', top: 0, left: '10%' }}>
                {isDay ? renderSun() : renderMoon()}
            </View>
            <View style={{ position: 'absolute', bottom: '10%', right: 0 }}>
                {renderCloud()}
            </View>
        </View>
    );

    const renderRain = () => (
        <View style={[styles.iconContainer, { width: size, height: size }]}>
            <Animated.View style={cloudStyle}>
                <Svg width={size} height={size * 0.5} viewBox="0 0 100 50">
                    <Defs>
                        <SvgLinearGradient id="rainCloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <Stop offset="0%" stopColor="#A0A0A0" />
                            <Stop offset="100%" stopColor="#707070" />
                        </SvgLinearGradient>
                    </Defs>
                    <Path
                        d="M20 40 Q5 40 5 30 Q5 20 20 20 Q25 10 40 10 Q60 5 70 20 Q85 20 85 30 Q85 40 70 40 Z"
                        fill="url(#rainCloudGrad)"
                    />
                </Svg>
            </Animated.View>
            {/* Rain drops */}
            <Svg width={size} height={size * 0.5} style={{ position: 'absolute', bottom: 0 }}>
                {[
                    { x: 25, delay: rainDrop1 },
                    { x: 45, delay: rainDrop2 },
                    { x: 65, delay: rainDrop3 },
                ].map((drop, i) => (
                    <Path
                        key={i}
                        d={`M${drop.x} 5 L${drop.x - 3} 20`}
                        stroke="#5AC8FA"
                        strokeWidth="3"
                        strokeLinecap="round"
                        opacity={0.8}
                    />
                ))}
            </Svg>
        </View>
    );

    const renderCondition = () => {
        switch (condition) {
            case 'clear':
                return isDay ? renderSun() : renderMoon();
            case 'partly-cloudy':
                return renderPartlyCloudy();
            case 'cloudy':
            case 'mist':
                return (
                    <View style={[styles.iconContainer, { width: size, height: size }]}>
                        {renderCloud(0, -5, 1)}
                        {renderCloud(-10, 10, 0.8)}
                    </View>
                );
            case 'rain':
                return renderRain();
            case 'storm':
                return renderRain(); // TODO: Add lightning
            case 'snow':
                return (
                    <View style={[styles.iconContainer, { width: size, height: size }]}>
                        {renderCloud()}
                        {/* Snowflakes would go here */}
                    </View>
                );
            default:
                return isDay ? renderSun() : renderMoon();
        }
    };

    return <View style={{ width: size, height: size }}>{renderCondition()}</View>;
}

const styles = StyleSheet.create({
    iconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    star: {
        position: 'absolute',
        backgroundColor: '#FFFFFF',
        shadowColor: '#FFFFFF',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 3,
    },
});
