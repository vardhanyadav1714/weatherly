/**
 * GlassCard Component
 * A polished glassmorphic card with subtle styling.
 */

import { AnimationConfig } from '@/constants/theme';
import React from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';

interface GlassCardProps {
    children: React.ReactNode;
    style?: ViewStyle;
    pressable?: boolean;
    onPress?: () => void;
    noPadding?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function GlassCard({
    children,
    style,
    pressable = false,
    onPress,
    noPadding = false,
}: GlassCardProps) {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePressIn = () => {
        if (pressable) {
            scale.value = withSpring(0.98, AnimationConfig.spring.gentle);
        }
    };

    const handlePressOut = () => {
        if (pressable) {
            scale.value = withSpring(1, AnimationConfig.spring.gentle);
        }
    };

    const containerStyle = [
        styles.container,
        noPadding ? styles.noPadding : styles.withPadding,
        style,
    ];

    if (pressable) {
        return (
            <AnimatedPressable
                style={[containerStyle, animatedStyle]}
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
            >
                {children}
            </AnimatedPressable>
        );
    }

    return (
        <View style={containerStyle}>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 24,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        overflow: 'hidden',
    },
    withPadding: {
        padding: 20,
    },
    noPadding: {
        padding: 0,
    },
});
