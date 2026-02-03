/**
 * WeatherStatsGrid Component
 * A polished grid of weather statistics with beautiful cards.
 */

import { Spacing, Typography } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - Spacing.lg * 2 - Spacing.md) / 2;

interface StatItem {
    icon: keyof typeof Ionicons.glyphMap;
    value: string;
    label: string;
    color: string;
    unit?: string;
}

interface WeatherStatsGridProps {
    stats: StatItem[];
    animated?: boolean;
}

export default function WeatherStatsGrid({
    stats,
    animated = true,
}: WeatherStatsGridProps) {
    return (
        <View style={styles.container}>
            <View style={styles.grid}>
                {stats.map((stat, index) => (
                    <Animated.View
                        key={index}
                        entering={animated ? FadeInUp.delay(index * 80).springify() : undefined}
                        style={styles.cardWrapper}
                    >
                        <View style={styles.card}>
                            <View style={[styles.iconContainer, { backgroundColor: `${stat.color}20` }]}>
                                <Ionicons name={stat.icon} size={24} color={stat.color} />
                            </View>
                            <View style={styles.valueContainer}>
                                <Text style={styles.value}>
                                    {stat.value}
                                    <Text style={styles.unit}>{stat.unit || ''}</Text>
                                </Text>
                                <Text style={styles.label}>{stat.label}</Text>
                            </View>
                        </View>
                    </Animated.View>
                ))}
            </View>
        </View>
    );
}

// Preset stat configurations
export const createWeatherStats = (data: {
    humidity: number;
    pressure: number;
    windSpeed: number;
    windDir: string;
    visibility: number;
    uv: number;
    feelsLike: number;
    cloud: number;
}): StatItem[] => [
        {
            icon: 'water-outline',
            value: `${data.humidity}`,
            unit: '%',
            label: 'Humidity',
            color: '#38BDF8',
        },
        {
            icon: 'speedometer-outline',
            value: `${data.pressure}`,
            unit: 'hPa',
            label: 'Pressure',
            color: '#A78BFA',
        },
        {
            icon: 'flag-outline',
            value: `${data.windSpeed.toFixed(1)}`,
            unit: 'm/s',
            label: data.windDir,
            color: '#4ADE80',
        },
        {
            icon: 'eye-outline',
            value: `${data.visibility}`,
            unit: 'km',
            label: 'Visibility',
            color: '#FB923C',
        },
    ];

const styles = StyleSheet.create({
    container: {
        marginVertical: Spacing.sm,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    cardWrapper: {
        width: CARD_WIDTH,
        marginBottom: Spacing.md,
    },
    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        padding: Spacing.lg,
        minHeight: 110,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Spacing.sm,
    },
    valueContainer: {
        alignItems: 'center',
    },
    value: {
        fontSize: 22,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    unit: {
        fontSize: 14,
        fontWeight: '400',
        color: 'rgba(255, 255, 255, 0.6)',
    },
    label: {
        ...Typography.caption,
        color: 'rgba(255, 255, 255, 0.5)',
        marginTop: 4,
        textAlign: 'center',
    },
});
