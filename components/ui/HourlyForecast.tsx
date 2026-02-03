/**
 * HourlyForecast Component
 * A beautiful horizontal scrolling carousel for hourly weather forecast
 * with smooth scrolling and polished card design.
 */

import { Spacing, Typography } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';

interface HourlyData {
    time: string;
    temp: number;
    icon: string;
    pop?: number;
}

interface HourlyForecastProps {
    data: HourlyData[];
    currentHour?: number;
    convertTemp?: (temp: number) => number;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function HourlyForecast({ data, currentHour = 0, convertTemp }: HourlyForecastProps) {
    // Use convertTemp if provided, otherwise return temp as-is
    const displayTemp = (temp: number) => convertTemp ? convertTemp(temp) : temp;
    const getWeatherIcon = (iconCode: string): keyof typeof Ionicons.glyphMap => {
        const iconMap: { [key: string]: keyof typeof Ionicons.glyphMap } = {
            '01d': 'sunny',
            '01n': 'moon',
            '02d': 'partly-sunny',
            '02n': 'cloudy-night',
            '03d': 'cloud',
            '03n': 'cloud',
            '04d': 'cloudy',
            '04n': 'cloudy',
            '09d': 'rainy',
            '09n': 'rainy',
            '10d': 'rainy',
            '10n': 'rainy',
            '11d': 'thunderstorm',
            '11n': 'thunderstorm',
            '13d': 'snow',
            '13n': 'snow',
            '50d': 'water',
            '50n': 'water',
        };
        return iconMap[iconCode] || 'partly-sunny';
    };

    const getIconColor = (iconCode: string): string => {
        if (iconCode.includes('01d')) return '#FFD60A'; // Sunny
        if (iconCode.includes('01n')) return '#A78BFA'; // Moon - purple
        if (iconCode.includes('02')) return '#60A5FA'; // Partly cloudy
        if (iconCode.includes('09') || iconCode.includes('10')) return '#38BDF8'; // Rain
        if (iconCode.includes('11')) return '#FBBF24'; // Thunder
        if (iconCode.includes('13')) return '#E0E7FF'; // Snow
        if (iconCode.includes('50')) return '#94A3B8'; // Mist
        return '#94A3B8'; // Default
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Hourly Forecast</Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                decelerationRate="fast"
                snapToInterval={88}
            >
                {data.slice(0, 12).map((hour, index) => {
                    const isNow = index === 0;
                    return (
                        <Animated.View
                            key={index}
                            entering={FadeInRight.delay(index * 50).springify()}
                        >
                            {isNow ? (
                                <LinearGradient
                                    colors={['#3B82F6', '#1D4ED8']}
                                    style={styles.cardNow}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                >
                                    <Text style={styles.timeTextNow}>Now</Text>
                                    <Ionicons
                                        name={getWeatherIcon(hour.icon)}
                                        size={28}
                                        color="#FFFFFF"
                                        style={styles.icon}
                                    />
                                    <Text style={styles.tempTextNow}>{displayTemp(hour.temp)}°</Text>
                                </LinearGradient>
                            ) : (
                                <View style={styles.card}>
                                    <Text style={styles.timeText}>{hour.time}</Text>
                                    <Ionicons
                                        name={getWeatherIcon(hour.icon)}
                                        size={26}
                                        color={getIconColor(hour.icon)}
                                        style={styles.icon}
                                    />
                                    <Text style={styles.tempText}>{displayTemp(hour.temp)}°</Text>
                                </View>
                            )}
                        </Animated.View>
                    );
                })}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: Spacing.lg,
    },
    title: {
        ...Typography.h4,
        color: '#FFFFFF',
        marginBottom: Spacing.md,
        paddingHorizontal: Spacing.lg,
    },
    scrollContent: {
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
    },
    card: {
        width: 72,
        paddingVertical: 16,
        paddingHorizontal: 8,
        marginHorizontal: 6,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.12)',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: 110,
    },
    cardNow: {
        width: 72,
        paddingVertical: 16,
        paddingHorizontal: 8,
        marginHorizontal: 6,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: 110,
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    timeText: {
        ...Typography.labelSmall,
        color: 'rgba(255, 255, 255, 0.6)',
        fontWeight: '500',
    },
    timeTextNow: {
        ...Typography.labelSmall,
        color: '#FFFFFF',
        fontWeight: '600',
    },
    icon: {
        marginVertical: 8,
    },
    tempText: {
        ...Typography.bodyMedium,
        color: '#FFFFFF',
        fontWeight: '600',
    },
    tempTextNow: {
        ...Typography.bodyMedium,
        color: '#FFFFFF',
        fontWeight: '700',
    },
});
