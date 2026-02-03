/**
 * Weatherly - Main Weather Screen
 * A stunning, premium weather experience with glassmorphic design,
 * animated weather icons, and smooth Reanimated 2 animations.
 */

import { Ionicons } from '@expo/vector-icons';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import Constants from 'expo-constants';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import GlassCard from '@/components/ui/GlassCard';
import HourlyForecast from '@/components/ui/HourlyForecast';
import WeatherStatsGrid, { createWeatherStats } from '@/components/ui/WeatherStatsGrid';
import {
  AnimationConfig,
  BorderRadius,
  Gradients,
  Spacing,
  Typography
} from '@/constants/theme';
import { useAppContext } from '@/context/AppContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const WEATHER_API_KEY = Constants.expoConfig?.extra?.weatherApiKey || 'd6362fb98fd64765ac1163448232309';

interface CurrentWeather {
  location: string;
  country: string;
  temperature: number;
  feels_like: number;
  humidity: number;
  pressure: number;
  wind_speed: number;
  wind_dir: string;
  description: string;
  icon: string;
  conditionCode: number;
  isDay: boolean;
  sunrise: string;
  sunset: string;
  uv: number;
  vis_km: number;
  cloud: number;
}

interface HourlyData {
  time: string;
  temp: number;
  icon: string;
  pop: number;
}

interface ForecastDay {
  date: string;
  day: string;
  maxTemp: number;
  minTemp: number;
  description: string;
  icon: string;
  pop: number;
  humidity: number;
  wind_speed: number;
}

// Weather condition to icon mapping
const getWeatherIconCode = (conditionCode: number, isDay: number) => {
  const iconMap: { [key: number]: string } = {
    1000: isDay ? '01d' : '01n',
    1003: isDay ? '02d' : '02n',
    1006: '03d', 1009: '04d', 1030: '50d',
    1063: '09d', 1066: '13d', 1087: '11d',
    1114: '13d', 1117: '13d', 1135: '50d',
    1150: '09d', 1153: '09d', 1180: '09d',
    1183: '09d', 1186: '10d', 1189: '10d',
    1192: '10d', 1195: '10d', 1240: '09d',
    1243: '10d', 1273: '11d', 1276: '11d',
  };
  return iconMap[conditionCode] || '01d';
};

const getWeatherIcon = (iconCode: string): keyof typeof Ionicons.glyphMap => {
  const iconMap: { [key: string]: keyof typeof Ionicons.glyphMap } = {
    '01d': 'sunny', '01n': 'moon',
    '02d': 'partly-sunny', '02n': 'cloudy-night',
    '03d': 'cloud', '03n': 'cloud',
    '04d': 'cloudy', '04n': 'cloudy',
    '09d': 'rainy', '09n': 'rainy',
    '10d': 'rainy', '10n': 'rainy',
    '11d': 'thunderstorm', '11n': 'thunderstorm',
    '13d': 'snow', '13n': 'snow',
    '50d': 'water', '50n': 'water',
  };
  return iconMap[iconCode] || 'partly-sunny';
};

const getBackgroundGradient = (temp: number, isDay: boolean): readonly [string, string, ...string[]] => {
  if (!isDay) return Gradients.clearNight;
  if (temp > 35) return ['#FF6B35', '#FF3B30', '#C62828'] as const;
  if (temp > 30) return Gradients.hot;
  if (temp > 20) return Gradients.warm;
  if (temp > 10) return Gradients.cool;
  return Gradients.freezing;
};

export default function WeatherScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  // Get settings from context
  const { convertTemp, tempSymbol, defaultCity, isDarkMode } = useAppContext();

  const [currentWeather, setCurrentWeather] = useState<CurrentWeather | null>(null);
  const [hourlyData, setHourlyData] = useState<HourlyData[]>([]);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [city, setCity] = useState(defaultCity);
  const [error, setError] = useState<string | null>(null);
  const [searchFocused, setSearchFocused] = useState(false);

  // Animations
  const heroScale = useSharedValue(0.9);
  const heroOpacity = useSharedValue(0);
  const tempScale = useSharedValue(0);
  const sunRotation = useSharedValue(0);
  const glowOpacity = useSharedValue(0.3);

  const fetchWeatherData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(city)}&days=3&aqi=no&alerts=no`
      );
      const data = await response.json();

      if (data.error) throw new Error(data.error.message);

      // Process current weather
      const processed: CurrentWeather = {
        location: data.location.name,
        country: data.location.country,
        temperature: Math.round(data.current.temp_c),
        feels_like: Math.round(data.current.feelslike_c),
        humidity: data.current.humidity,
        pressure: data.current.pressure_mb,
        wind_speed: data.current.wind_kph / 3.6,
        wind_dir: data.current.wind_dir,
        description: data.current.condition.text,
        icon: getWeatherIconCode(data.current.condition.code, data.current.is_day),
        conditionCode: data.current.condition.code,
        isDay: data.current.is_day === 1,
        sunrise: data.forecast.forecastday[0].astro.sunrise,
        sunset: data.forecast.forecastday[0].astro.sunset,
        uv: data.current.uv,
        vis_km: data.current.vis_km,
        cloud: data.current.cloud,
      };

      // Process hourly data (next 24 hours from current time)
      const currentHour = new Date().getHours();
      const todayHours = data.forecast.forecastday[0].hour.slice(currentHour);
      const tomorrowHours = data.forecast.forecastday[1]?.hour.slice(0, 24 - todayHours.length) || [];
      const allHours = [...todayHours, ...tomorrowHours].slice(0, 24);

      const processedHourly: HourlyData[] = allHours.map((h: any, i: number) => ({
        time: i === 0 ? 'Now' : new Date(h.time).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
        temp: Math.round(h.temp_c),
        icon: getWeatherIconCode(h.condition.code, h.is_day),
        pop: h.chance_of_rain,
      }));

      // Process forecast
      const processedForecast: ForecastDay[] = data.forecast.forecastday.map((day: any) => ({
        date: day.date,
        day: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
        maxTemp: Math.round(day.day.maxtemp_c),
        minTemp: Math.round(day.day.mintemp_c),
        description: day.day.condition.text,
        icon: getWeatherIconCode(day.day.condition.code, 1),
        pop: day.day.daily_chance_of_rain,
        humidity: day.day.avghumidity,
        wind_speed: day.day.maxwind_kph / 3.6,
      }));

      setCurrentWeather(processed);
      setHourlyData(processedHourly);
      setForecast(processedForecast);

      // Trigger entrance animations
      heroOpacity.value = withTiming(1, { duration: 600 });
      heroScale.value = withSpring(1, AnimationConfig.spring.gentle);
      tempScale.value = withDelay(200, withSpring(1, AnimationConfig.spring.bouncy));
      sunRotation.value = withRepeat(
        withTiming(360, { duration: 30000, easing: Easing.linear }),
        -1, false
      );
      glowOpacity.value = withRepeat(
        withSequence(
          withTiming(0.6, { duration: 2000 }),
          withTiming(0.3, { duration: 2000 })
        ),
        -1, true
      );

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch weather data';
      setError(errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, [city]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchWeatherData();
  }, [city]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setCity(searchQuery.trim());
      // Keep the search query visible after search
    }
  };

  // Animated styles
  const heroAnimatedStyle = useAnimatedStyle(() => ({
    opacity: heroOpacity.value,
    transform: [{ scale: heroScale.value }],
  }));

  const tempAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: tempScale.value }],
  }));

  const glowAnimatedStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  if (loading && !currentWeather) {
    return (
      <LinearGradient colors={Gradients.cool} style={styles.loadingContainer}>
        <Animated.View entering={FadeIn.duration(500)} style={styles.loadingContent}>
          <View style={styles.loadingIconContainer}>
            <Ionicons name="partly-sunny" size={64} color="#FFFFFF" />
          </View>
          <ActivityIndicator size="large" color="#FFFFFF" style={{ marginTop: 20 }} />
          <Text style={styles.loadingText}>Loading Weather Data...</Text>
          <Text style={styles.loadingCity}>{city}</Text>
        </Animated.View>
      </LinearGradient>
    );
  }

  const backgroundGradient = currentWeather
    ? getBackgroundGradient(currentWeather.temperature, currentWeather.isDay)
    : Gradients.cool;

  return (
    <LinearGradient colors={backgroundGradient} style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#FFFFFF"
            title="Pull to refresh"
            titleColor="#FFFFFF"
          />
        }
      >
        {/* Header with Menu & Search */}
        <View style={[styles.header, { paddingTop: insets.top + Spacing.sm }]}>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          >
            <Ionicons name="menu" size={28} color="#FFFFFF" />
          </TouchableOpacity>

          <Animated.View
            style={[
              styles.searchContainer,
              searchFocused && styles.searchContainerFocused,
            ]}
          >
            <BlurView intensity={60} tint="dark" style={styles.searchBlur}>
              <Ionicons name="search" size={18} color="rgba(255,255,255,0.6)" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search city..."
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearch}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                returnKeyType="search"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Ionicons name="close-circle" size={18} color="rgba(255,255,255,0.5)" />
                </TouchableOpacity>
              )}
            </BlurView>
          </Animated.View>

        </View>

        {error && !currentWeather ? (
          <View style={styles.errorContainer}>
            <Ionicons name="cloud-offline" size={80} color="rgba(255,255,255,0.5)" />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchWeatherData}>
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : currentWeather && (
          <>
            {/* Hero Weather Section */}
            <Animated.View style={[styles.heroSection, heroAnimatedStyle]}>
              {/* Glow effect behind icon */}
              <Animated.View style={[styles.heroGlow, glowAnimatedStyle]}>
                <LinearGradient
                  colors={currentWeather.isDay
                    ? ['rgba(255, 214, 10, 0.5)', 'rgba(255, 149, 0, 0.2)', 'transparent']
                    : ['rgba(90, 200, 250, 0.3)', 'rgba(88, 86, 214, 0.1)', 'transparent']
                  }
                  style={styles.heroGlowGradient}
                />
              </Animated.View>

              {/* Location */}
              <Animated.View entering={FadeInDown.delay(100)}>
                <View style={styles.locationContainer}>
                  <Ionicons name="location-sharp" size={18} color="#FFFFFF" />
                  <Text style={styles.locationText}>
                    {currentWeather.location}, {currentWeather.country}
                  </Text>
                </View>
              </Animated.View>

              {/* Weather Icon */}
              <Animated.View entering={FadeIn.delay(200)} style={styles.heroIconContainer}>
                <Ionicons
                  name={getWeatherIcon(currentWeather.icon)}
                  size={100}
                  color="#FFFFFF"
                  style={styles.heroIcon}
                />
              </Animated.View>

              {/* Temperature */}
              <Animated.View style={[styles.temperatureContainer, tempAnimatedStyle]}>
                <Text style={styles.temperatureText}>{convertTemp(currentWeather.temperature)}</Text>
                <Text style={styles.temperatureDegree}>{tempSymbol}</Text>
              </Animated.View>

              {/* Description */}
              <Animated.View entering={FadeInUp.delay(300)}>
                <Text style={styles.descriptionText}>{currentWeather.description}</Text>
                <Text style={styles.feelsLikeText}>
                  Feels like {convertTemp(currentWeather.feels_like)}°
                </Text>
              </Animated.View>

              {/* Hi/Lo Temps */}
              {forecast.length > 0 && (
                <Animated.View entering={FadeInUp.delay(400)} style={styles.hiLoContainer}>
                  <View style={styles.hiLoItem}>
                    <Ionicons name="arrow-up" size={14} color="#FF6B35" />
                    <Text style={styles.hiLoText}>{convertTemp(forecast[0].maxTemp)}°</Text>
                  </View>
                  <View style={styles.hiLoSeparator} />
                  <View style={styles.hiLoItem}>
                    <Ionicons name="arrow-down" size={14} color="#5AC8FA" />
                    <Text style={styles.hiLoText}>{convertTemp(forecast[0].minTemp)}°</Text>
                  </View>
                </Animated.View>
              )}
            </Animated.View>

            {/* Hourly Forecast */}
            {hourlyData.length > 0 && (
              <Animated.View entering={FadeInUp.delay(400)}>
                <HourlyForecast data={hourlyData} currentHour={0} convertTemp={convertTemp} />
              </Animated.View>
            )}

            {/* Weather Stats Grid */}
            <Animated.View entering={FadeInUp.delay(500)} style={styles.statsSection}>
              <Text style={styles.sectionTitle}>Weather Details</Text>
              <WeatherStatsGrid
                stats={createWeatherStats({
                  humidity: currentWeather.humidity,
                  pressure: currentWeather.pressure,
                  windSpeed: currentWeather.wind_speed,
                  windDir: currentWeather.wind_dir,
                  visibility: currentWeather.vis_km,
                  uv: currentWeather.uv,
                  feelsLike: currentWeather.feels_like,
                  cloud: currentWeather.cloud,
                }).slice(0, 4)}
              />
            </Animated.View>

            {/* Sunrise & Sunset */}
            <Animated.View entering={FadeInUp.delay(600)} style={styles.sunSection}>
              <GlassCard>
                <View style={styles.sunContent}>
                  <View style={styles.sunItem}>
                    <LinearGradient
                      colors={['#FFD60A', '#FF9500']}
                      style={styles.sunIconBg}
                    >
                      <Ionicons name="sunny" size={22} color="#FFFFFF" />
                    </LinearGradient>
                    <Text style={styles.sunLabel}>Sunrise</Text>
                    <Text style={styles.sunTime}>{currentWeather.sunrise}</Text>
                  </View>

                  <View style={styles.sunDivider}>
                    <View style={styles.sunLine} />
                    <View style={styles.sunDot} />
                    <View style={styles.sunLine} />
                  </View>

                  <View style={styles.sunItem}>
                    <LinearGradient
                      colors={['#5856D6', '#AF52DE']}
                      style={styles.sunIconBg}
                    >
                      <Ionicons name="moon" size={20} color="#FFFFFF" />
                    </LinearGradient>
                    <Text style={styles.sunLabel}>Sunset</Text>
                    <Text style={styles.sunTime}>{currentWeather.sunset}</Text>
                  </View>
                </View>
              </GlassCard>
            </Animated.View>

            {/* 5-Day Forecast */}
            <Animated.View entering={FadeInUp.delay(700)} style={styles.forecastSection}>
              <View style={styles.forecastHeader}>
                <Text style={styles.sectionTitle}>3-Day Forecast</Text>
                <TouchableOpacity
                  style={styles.seeAllButton}
                  onPress={() => (navigation as any).navigate('forecast')}
                >
                  <Text style={styles.seeAllText}>See All</Text>
                  <Ionicons name="chevron-forward" size={16} color="#5AC8FA" />
                </TouchableOpacity>
              </View>

              {forecast.slice(0, 3).map((day, index) => (
                <Animated.View
                  key={day.date}
                  entering={FadeInUp.delay(750 + index * 50)}
                >
                  <GlassCard style={styles.forecastCard}>
                    <View style={styles.forecastRow}>
                      <View style={styles.forecastDay}>
                        <Text style={styles.forecastDayText}>
                          {index === 0 ? 'Today' : day.day}
                        </Text>
                      </View>

                      <View style={styles.forecastCondition}>
                        <Ionicons
                          name={getWeatherIcon(day.icon)}
                          size={28}
                          color="#FFFFFF"
                        />
                        {day.pop > 20 && (
                          <View style={styles.forecastPop}>
                            <Ionicons name="water" size={10} color="#5AC8FA" />
                            <Text style={styles.forecastPopText}>{day.pop}%</Text>
                          </View>
                        )}
                      </View>

                      <View style={styles.forecastTemps}>
                        <Text style={styles.forecastHigh}>{convertTemp(day.maxTemp)}°</Text>
                        <Text style={styles.forecastLow}>{convertTemp(day.minTemp)}°</Text>
                      </View>
                    </View>
                  </GlassCard>
                </Animated.View>
              ))}
            </Animated.View>
          </>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    alignItems: 'center',
  },
  loadingIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...Typography.bodyMedium,
    color: '#FFFFFF',
    marginTop: Spacing.md,
  },
  loadingCity: {
    ...Typography.caption,
    color: 'rgba(255,255,255,0.6)',
    marginTop: Spacing.xs,
  },

  // Header
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
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flex: 1,
    marginHorizontal: Spacing.md,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  searchContainerFocused: {
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  searchBlur: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.25)',
    minHeight: 44,
  },
  searchInput: {
    flex: 1,
    ...Typography.bodyMedium,
    color: '#FFFFFF',
    marginLeft: Spacing.sm,
  },
  locationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Error
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xxl,
    minHeight: 400,
  },
  errorText: {
    ...Typography.bodyMedium,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginTop: Spacing.lg,
  },
  retryButton: {
    marginTop: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  retryButtonText: {
    ...Typography.labelLarge,
    color: '#FFFFFF',
  },

  // Hero Section
  heroSection: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
  },
  heroGlow: {
    position: 'absolute',
    top: 0,
    alignItems: 'center',
  },
  heroGlowGradient: {
    width: 300,
    height: 300,
    borderRadius: 150,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  locationText: {
    ...Typography.h4,
    color: '#FFFFFF',
    marginLeft: Spacing.xs,
  },
  heroIconContainer: {
    marginVertical: Spacing.md,
  },
  heroIcon: {
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 8,
  },
  temperatureContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  temperatureText: {
    fontSize: 120,
    fontWeight: '200',
    color: '#FFFFFF',
    lineHeight: 120,
    textShadowColor: 'rgba(0,0,0,0.15)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 8,
  },
  temperatureDegree: {
    ...Typography.h1,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 20,
  },
  descriptionText: {
    ...Typography.h3,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  feelsLikeText: {
    ...Typography.bodyMedium,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
  hiLoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.md,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  hiLoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hiLoText: {
    ...Typography.labelMedium,
    color: '#FFFFFF',
    marginLeft: 4,
  },
  hiLoSeparator: {
    width: 1,
    height: 16,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: Spacing.md,
  },

  // Stats Section
  statsSection: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.h4,
    color: '#FFFFFF',
    marginBottom: Spacing.md,
  },

  // Sun Section
  sunSection: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.md,
  },
  sunContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sunItem: {
    alignItems: 'center',
    flex: 1,
  },
  sunIconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  sunLabel: {
    ...Typography.caption,
    color: 'rgba(255,255,255,0.6)',
  },
  sunTime: {
    ...Typography.labelLarge,
    color: '#FFFFFF',
    marginTop: 2,
  },
  sunDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: Spacing.md,
  },
  sunLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  sunDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 8,
  },

  // Forecast Section
  forecastSection: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
  },
  forecastHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    ...Typography.labelMedium,
    color: '#5AC8FA',
    marginRight: 2,
  },
  forecastCard: {
    marginBottom: Spacing.sm,
  },
  forecastRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  forecastDay: {
    width: 60,
  },
  forecastDayText: {
    ...Typography.labelLarge,
    color: '#FFFFFF',
  },
  forecastCondition: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  forecastPop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: Spacing.sm,
  },
  forecastPopText: {
    ...Typography.caption,
    color: '#5AC8FA',
    marginLeft: 2,
  },
  forecastTemps: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  forecastHigh: {
    ...Typography.labelLarge,
    color: '#FFFFFF',
    width: 36,
    textAlign: 'right',
  },
  forecastLow: {
    ...Typography.labelLarge,
    color: 'rgba(255,255,255,0.5)',
    width: 36,
    textAlign: 'right',
  },
});