/**
 * Forecast Details Screen
 * Detailed 3-day weather forecast with expandable cards,
 * hourly breakdown, and beautiful visualizations.
 */

import {
    BorderRadius,
    Gradients,
    Spacing,
    Typography
} from '@/constants/theme';
import { useAppContext } from '@/context/AppContext';
import { Ionicons } from '@expo/vector-icons';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import Constants from 'expo-constants';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, {
    FadeInDown
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const WEATHER_API_KEY = Constants.expoConfig?.extra?.weatherApiKey || 'd6362fb98fd64765ac1163448232309';

interface ForecastDay {
    date: string;
    dayName: string;
    maxTemp: number;
    minTemp: number;
    condition: string;
    icon: string;
    humidity: number;
    windSpeed: number;
    pop: number;
    sunrise: string;
    sunset: string;
    uv: number;
    hourly: {
        time: string;
        temp: number;
        condition: string;
        pop: number;
    }[];
}

export default function ForecastScreen() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();

    // Get settings from context
    const { convertTemp, tempSymbol, defaultCity, isDarkMode } = useAppContext();

    const [forecast, setForecast] = useState<ForecastDay[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedDay, setExpandedDay] = useState<number | null>(null);
    const [city] = useState(defaultCity);

    useEffect(() => {
        fetchForecast();
    }, []);

    const fetchForecast = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `https://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(city)}&days=3&aqi=no`
            );
            const data = await response.json();

            if (data.error) throw new Error(data.error.message);

            const processedForecast: ForecastDay[] = data.forecast.forecastday.map((day: any) => ({
                date: day.date,
                dayName: new Date(day.date).toLocaleDateString('en-US', { weekday: 'long' }),
                maxTemp: Math.round(day.day.maxtemp_c),
                minTemp: Math.round(day.day.mintemp_c),
                condition: day.day.condition.text,
                icon: day.day.condition.icon,
                humidity: day.day.avghumidity,
                windSpeed: day.day.maxwind_kph / 3.6,
                pop: day.day.daily_chance_of_rain,
                sunrise: day.astro.sunrise,
                sunset: day.astro.sunset,
                uv: day.day.uv,
                hourly: day.hour.filter((_: any, i: number) => i % 3 === 0).map((h: any) => ({
                    time: new Date(h.time).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
                    temp: Math.round(h.temp_c),
                    condition: h.condition.text,
                    pop: h.chance_of_rain,
                })),
            }));

            setForecast(processedForecast);
        } catch (error) {
            console.error('Forecast fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const getWeatherIcon = (condition: string): keyof typeof Ionicons.glyphMap => {
        const c = condition.toLowerCase();
        if (c.includes('sun') || c.includes('clear')) return 'sunny';
        if (c.includes('cloud') && c.includes('part')) return 'partly-sunny';
        if (c.includes('cloud')) return 'cloudy';
        if (c.includes('rain') || c.includes('drizzle')) return 'rainy';
        if (c.includes('thunder') || c.includes('storm')) return 'thunderstorm';
        if (c.includes('snow')) return 'snow';
        if (c.includes('fog') || c.includes('mist')) return 'water';
        return 'partly-sunny';
    };

    const toggleExpand = (index: number) => {
        setExpandedDay(expandedDay === index ? null : index);
    };

    const getMaxTemp = () => Math.max(...forecast.map(d => d.maxTemp));
    const getMinTemp = () => Math.min(...forecast.map(d => d.minTemp));

    const renderTempBar = (min: number, max: number) => {
        const globalMax = getMaxTemp();
        const globalMin = getMinTemp();
        const range = globalMax - globalMin || 1;
        const startPercent = ((min - globalMin) / range) * 100;
        const widthPercent = ((max - min) / range) * 100;

        return (
            <View style={styles.tempBarContainer}>
                <View style={[styles.tempBarTrack]}>
                    <LinearGradient
                        colors={['#5AC8FA', '#34C759', '#FF9500', '#FF3B30']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={[
                            styles.tempBarFill,
                            {
                                left: `${startPercent}%`,
                                width: `${Math.max(widthPercent, 10)}%`,
                            },
                        ]}
                    />
                </View>
            </View>
        );
    };

    if (loading) {
        return (
            <LinearGradient colors={Gradients.cool} style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FFFFFF" />
                <Text style={styles.loadingText}>Loading Forecast...</Text>
            </LinearGradient>
        );
    }

    return (
        <LinearGradient colors={Gradients.cool} style={styles.container}>
            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
                <TouchableOpacity
                    style={styles.menuButton}
                    onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
                >
                    <Ionicons name="menu" size={28} color="#FFFFFF" />
                </TouchableOpacity>
                <View style={styles.headerTextContainer}>
                    <Text style={styles.headerTitle}>3-Day Forecast</Text>
                    <Text style={styles.headerSubtitle}>{city}</Text>
                </View>
                <TouchableOpacity style={styles.refreshButton} onPress={fetchForecast}>
                    <Ionicons name="refresh" size={24} color="#FFFFFF" />
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: insets.bottom + Spacing.xxl }}
            >
                {/* Forecast Cards */}
                {forecast.map((day, index) => (
                    <Animated.View
                        key={day.date}
                        entering={FadeInDown.delay(index * 80).springify()}
                    >
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => toggleExpand(index)}
                        >
                            <BlurView intensity={60} tint="dark" style={styles.forecastCard}>
                                {/* Main Row */}
                                <View style={styles.cardMainRow}>
                                    <View style={styles.dayInfo}>
                                        <Text style={styles.dayName}>
                                            {index === 0 ? 'Today' : index === 1 ? 'Tomorrow' : day.dayName}
                                        </Text>
                                        <Text style={styles.dateText}>
                                            {new Date(day.date).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                            })}
                                        </Text>
                                    </View>

                                    <View style={styles.conditionContainer}>
                                        <Ionicons
                                            name={getWeatherIcon(day.condition)}
                                            size={32}
                                            color="#FFFFFF"
                                        />
                                        {day.pop > 20 && (
                                            <View style={styles.popBadge}>
                                                <Text style={styles.popBadgeText}>{day.pop}%</Text>
                                            </View>
                                        )}
                                    </View>

                                    <View style={styles.tempContainer}>
                                        <Text style={styles.maxTemp}>{convertTemp(day.maxTemp)}°</Text>
                                        <Text style={styles.minTemp}>{convertTemp(day.minTemp)}°</Text>
                                    </View>

                                    {renderTempBar(day.minTemp, day.maxTemp)}

                                    <Ionicons
                                        name={expandedDay === index ? 'chevron-up' : 'chevron-down'}
                                        size={20}
                                        color="rgba(255,255,255,0.5)"
                                    />
                                </View>

                                {/* Expanded Content */}
                                {expandedDay === index && (
                                    <Animated.View
                                        entering={FadeInDown.duration(300)}
                                        style={styles.expandedContent}
                                    >
                                        <View style={styles.divider} />

                                        <View style={styles.detailsGrid}>
                                            <View style={styles.detailItem}>
                                                <Ionicons name="water-outline" size={18} color="#5AC8FA" />
                                                <Text style={styles.detailValue}>{day.humidity}%</Text>
                                                <Text style={styles.detailLabel}>Humidity</Text>
                                            </View>
                                            <View style={styles.detailItem}>
                                                <Ionicons name="flag-outline" size={18} color="#34C759" />
                                                <Text style={styles.detailValue}>{day.windSpeed.toFixed(1)}m/s</Text>
                                                <Text style={styles.detailLabel}>Wind</Text>
                                            </View>
                                            <View style={styles.detailItem}>
                                                <Ionicons name="sunny-outline" size={18} color="#FFD60A" />
                                                <Text style={styles.detailValue}>{day.uv}</Text>
                                                <Text style={styles.detailLabel}>UV Index</Text>
                                            </View>
                                            <View style={styles.detailItem}>
                                                <Ionicons name="rainy-outline" size={18} color="#5AC8FA" />
                                                <Text style={styles.detailValue}>{day.pop}%</Text>
                                                <Text style={styles.detailLabel}>Rain</Text>
                                            </View>
                                        </View>

                                        <View style={styles.sunTimes}>
                                            <View style={styles.sunTimeItem}>
                                                <Ionicons name="sunny" size={16} color="#FFD60A" />
                                                <Text style={styles.sunTimeText}>{day.sunrise}</Text>
                                            </View>
                                            <View style={styles.sunTimeItem}>
                                                <Ionicons name="moon" size={16} color="#5AC8FA" />
                                                <Text style={styles.sunTimeText}>{day.sunset}</Text>
                                            </View>
                                        </View>

                                        {/* Hourly Preview */}
                                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                            <View style={styles.hourlyRow}>
                                                {day.hourly.map((hour, hIndex) => (
                                                    <View key={hIndex} style={styles.hourlyItem}>
                                                        <Text style={styles.hourlyTime}>{hour.time}</Text>
                                                        <Text style={styles.hourlyTemp}>{convertTemp(hour.temp)}°</Text>
                                                        {hour.pop > 0 && (
                                                            <Text style={styles.hourlyPop}>{hour.pop}%</Text>
                                                        )}
                                                    </View>
                                                ))}
                                            </View>
                                        </ScrollView>
                                    </Animated.View>
                                )}
                            </BlurView>
                        </TouchableOpacity>
                    </Animated.View>
                ))}
            </ScrollView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        ...Typography.bodyMedium,
        color: '#FFFFFF',
        marginTop: Spacing.md,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.lg,
        paddingBottom: Spacing.md,
    },
    menuButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTextContainer: {
        flex: 1,
        marginLeft: Spacing.md,
    },
    headerTitle: {
        ...Typography.h3,
        color: '#FFFFFF',
    },
    headerSubtitle: {
        ...Typography.bodySmall,
        color: 'rgba(255,255,255,0.7)',
    },
    refreshButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: Spacing.lg,
    },
    forecastCard: {
        borderRadius: BorderRadius.xl,
        marginBottom: Spacing.md,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        overflow: 'hidden',
        padding: Spacing.md,
    },
    cardMainRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dayInfo: {
        width: 80,
    },
    dayName: {
        ...Typography.labelLarge,
        color: '#FFFFFF',
    },
    dateText: {
        ...Typography.caption,
        color: 'rgba(255,255,255,0.6)',
    },
    conditionContainer: {
        width: 50,
        alignItems: 'center',
        position: 'relative',
    },
    popBadge: {
        position: 'absolute',
        bottom: -4,
        right: 0,
        backgroundColor: 'rgba(90, 200, 250, 0.3)',
        paddingHorizontal: 4,
        paddingVertical: 1,
        borderRadius: 4,
    },
    popBadgeText: {
        ...Typography.labelSmall,
        color: '#5AC8FA',
        fontSize: 8,
    },
    tempContainer: {
        flexDirection: 'row',
        width: 60,
        justifyContent: 'flex-end',
    },
    maxTemp: {
        ...Typography.labelLarge,
        color: '#FFFFFF',
        marginRight: 4,
    },
    minTemp: {
        ...Typography.labelLarge,
        color: 'rgba(255,255,255,0.5)',
    },
    tempBarContainer: {
        flex: 1,
        marginHorizontal: Spacing.sm,
    },
    tempBarTrack: {
        height: 4,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 2,
        overflow: 'hidden',
    },
    tempBarFill: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        borderRadius: 2,
    },
    expandedContent: {
        marginTop: Spacing.md,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
        marginBottom: Spacing.md,
    },
    detailsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: Spacing.md,
    },
    detailItem: {
        alignItems: 'center',
    },
    detailValue: {
        ...Typography.labelMedium,
        color: '#FFFFFF',
        marginTop: 4,
    },
    detailLabel: {
        ...Typography.caption,
        color: 'rgba(255,255,255,0.5)',
    },
    sunTimes: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: Spacing.md,
    },
    sunTimeItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: Spacing.lg,
    },
    sunTimeText: {
        ...Typography.bodySmall,
        color: 'rgba(255,255,255,0.7)',
        marginLeft: 6,
    },
    hourlyRow: {
        flexDirection: 'row',
    },
    hourlyItem: {
        alignItems: 'center',
        marginRight: Spacing.lg,
        minWidth: 50,
    },
    hourlyTime: {
        ...Typography.caption,
        color: 'rgba(255,255,255,0.5)',
    },
    hourlyTemp: {
        ...Typography.labelMedium,
        color: '#FFFFFF',
        marginTop: 4,
    },
    hourlyPop: {
        ...Typography.labelSmall,
        color: '#5AC8FA',
        marginTop: 2,
    },
});
