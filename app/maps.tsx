/**
 * Weather Maps Screen
 * Interactive weather map placeholder with stylish design.
 */

import {
    BorderRadius,
    Gradients,
    Spacing,
    Typography,
} from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, {
    Easing,
    FadeInDown,
    FadeInUp,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Defs, Path, RadialGradient, Stop } from 'react-native-svg';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const mapLayers = [
    { id: 'temperature', label: 'Temperature', icon: 'thermometer-outline', color: '#FF6B35' },
    { id: 'precipitation', label: 'Precipitation', icon: 'rainy-outline', color: '#5AC8FA' },
    { id: 'wind', label: 'Wind', icon: 'flag-outline', color: '#34C759' },
    { id: 'clouds', label: 'Clouds', icon: 'cloud-outline', color: '#8E8E93' },
    { id: 'pressure', label: 'Pressure', icon: 'speedometer-outline', color: '#AF52DE' },
];

export default function MapsScreen() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const [selectedLayer, setSelectedLayer] = useState('temperature');

    // Animation for the pulsing effect
    const pulseScale = useSharedValue(1);

    React.useEffect(() => {
        pulseScale.value = withRepeat(
            withSequence(
                withTiming(1.1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
                withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            true
        );
    }, []);

    const pulseStyle = useAnimatedStyle(() => ({
        transform: [{ scale: pulseScale.value }],
    }));

    return (
        <LinearGradient colors={Gradients.rainy} style={styles.container}>
            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
                <TouchableOpacity
                    style={styles.menuButton}
                    onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
                >
                    <Ionicons name="menu" size={28} color="#FFFFFF" />
                </TouchableOpacity>
                <View style={styles.headerTextContainer}>
                    <Text style={styles.headerTitle}>Weather Maps</Text>
                    <Text style={styles.headerSubtitle}>Interactive Radar</Text>
                </View>
                <TouchableOpacity style={styles.layerButton}>
                    <Ionicons name="layers-outline" size={24} color="#FFFFFF" />
                </TouchableOpacity>
            </View>

            {/* Map Placeholder */}
            <Animated.View
                entering={FadeInUp.delay(100).springify()}
                style={styles.mapContainer}
            >
                <BlurView intensity={40} tint="dark" style={styles.mapPlaceholder}>
                    {/* Animated Globe/Radar Effect */}
                    <Animated.View style={[styles.radarContainer, pulseStyle]}>
                        <Svg width={200} height={200} viewBox="0 0 200 200">
                            <Defs>
                                <RadialGradient id="radarGrad" cx="50%" cy="50%" r="50%">
                                    <Stop offset="0%" stopColor="#5AC8FA" stopOpacity="0.3" />
                                    <Stop offset="50%" stopColor="#5AC8FA" stopOpacity="0.1" />
                                    <Stop offset="100%" stopColor="#5AC8FA" stopOpacity="0" />
                                </RadialGradient>
                            </Defs>
                            <Circle cx="100" cy="100" r="90" fill="url(#radarGrad)" />
                            <Circle cx="100" cy="100" r="70" stroke="#5AC8FA" strokeWidth="1" fill="none" strokeOpacity="0.3" />
                            <Circle cx="100" cy="100" r="50" stroke="#5AC8FA" strokeWidth="1" fill="none" strokeOpacity="0.4" />
                            <Circle cx="100" cy="100" r="30" stroke="#5AC8FA" strokeWidth="1" fill="none" strokeOpacity="0.5" />
                            <Circle cx="100" cy="100" r="5" fill="#5AC8FA" />
                            {/* Radar sweep line */}
                            <Path
                                d="M100 100 L100 10"
                                stroke="#5AC8FA"
                                strokeWidth="2"
                                strokeLinecap="round"
                                opacity="0.7"
                            />
                        </Svg>
                    </Animated.View>

                    <View style={styles.comingSoonContainer}>
                        <Text style={styles.comingSoonTitle}>Interactive Maps</Text>
                        <Text style={styles.comingSoonText}>Coming Soon</Text>
                        <Text style={styles.comingSoonDesc}>
                            Real-time weather radar, satellite imagery, and more
                        </Text>
                    </View>

                    {/* Location marker */}
                    <View style={styles.locationMarker}>
                        <LinearGradient
                            colors={['#FF6B35', '#FF3B30']}
                            style={styles.markerDot}
                        />
                        <Text style={styles.markerText}>Meerut</Text>
                    </View>
                </BlurView>
            </Animated.View>

            {/* Layer Selector */}
            <Animated.View
                entering={FadeInDown.delay(200).springify()}
                style={styles.layerSelector}
            >
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.layerScrollContent}
                >
                    {mapLayers.map((layer, index) => (
                        <Animated.View
                            key={layer.id}
                            entering={FadeInUp.delay(300 + index * 50).springify()}
                        >
                            <TouchableOpacity
                                style={[
                                    styles.layerChip,
                                    selectedLayer === layer.id && {
                                        backgroundColor: `${layer.color}30`,
                                        borderColor: layer.color,
                                    },
                                ]}
                                onPress={() => setSelectedLayer(layer.id)}
                            >
                                <Ionicons
                                    name={layer.icon as keyof typeof Ionicons.glyphMap}
                                    size={18}
                                    color={selectedLayer === layer.id ? layer.color : 'rgba(255,255,255,0.6)'}
                                />
                                <Text
                                    style={[
                                        styles.layerChipText,
                                        selectedLayer === layer.id && { color: layer.color },
                                    ]}
                                >
                                    {layer.label}
                                </Text>
                            </TouchableOpacity>
                        </Animated.View>
                    ))}
                </ScrollView>
            </Animated.View>

            {/* Feature List */}
            <Animated.View
                entering={FadeInDown.delay(400).springify()}
                style={styles.featuresContainer}
            >
                <Text style={styles.featuresTitle}>Features</Text>
                <View style={styles.featuresList}>
                    {[
                        { icon: 'navigate-outline', text: 'Real-time weather tracking' },
                        { icon: 'pulse-outline', text: 'Animated radar overlays' },
                        { icon: 'alarm-outline', text: 'Severe weather alerts' },
                        { icon: 'location-outline', text: 'Custom location markers' },
                    ].map((feature, index) => (
                        <View key={index} style={styles.featureItem}>
                            <View style={styles.featureIcon}>
                                <Ionicons
                                    name={feature.icon as keyof typeof Ionicons.glyphMap}
                                    size={20}
                                    color="#5AC8FA"
                                />
                            </View>
                            <Text style={styles.featureText}>{feature.text}</Text>
                        </View>
                    ))}
                </View>
            </Animated.View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    layerButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    mapContainer: {
        flex: 1,
        marginHorizontal: Spacing.lg,
        marginVertical: Spacing.md,
    },
    mapPlaceholder: {
        flex: 1,
        borderRadius: BorderRadius.xl,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    radarContainer: {
        position: 'absolute',
        opacity: 0.6,
    },
    comingSoonContainer: {
        alignItems: 'center',
        zIndex: 10,
    },
    comingSoonTitle: {
        ...Typography.h2,
        color: '#FFFFFF',
        marginBottom: Spacing.xs,
    },
    comingSoonText: {
        ...Typography.labelLarge,
        color: '#5AC8FA',
        backgroundColor: 'rgba(90, 200, 250, 0.2)',
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
        borderRadius: BorderRadius.full,
        overflow: 'hidden',
        marginBottom: Spacing.md,
    },
    comingSoonDesc: {
        ...Typography.bodySmall,
        color: 'rgba(255,255,255,0.6)',
        textAlign: 'center',
        paddingHorizontal: Spacing.xl,
    },
    locationMarker: {
        position: 'absolute',
        bottom: 40,
        alignItems: 'center',
    },
    markerDot: {
        width: 16,
        height: 16,
        borderRadius: 8,
        marginBottom: 4,
    },
    markerText: {
        ...Typography.labelSmall,
        color: 'rgba(255,255,255,0.7)',
    },
    layerSelector: {
        paddingVertical: Spacing.md,
    },
    layerScrollContent: {
        paddingHorizontal: Spacing.lg,
    },
    layerChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderRadius: BorderRadius.full,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
        marginRight: Spacing.sm,
    },
    layerChipText: {
        ...Typography.labelMedium,
        color: 'rgba(255,255,255,0.7)',
        marginLeft: Spacing.xs,
    },
    featuresContainer: {
        paddingHorizontal: Spacing.lg,
        paddingBottom: Spacing.xxl,
    },
    featuresTitle: {
        ...Typography.h4,
        color: '#FFFFFF',
        marginBottom: Spacing.md,
    },
    featuresList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    featureItem: {
        width: '48%',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    featureIcon: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: 'rgba(90, 200, 250, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: Spacing.sm,
    },
    featureText: {
        ...Typography.bodySmall,
        color: 'rgba(255,255,255,0.7)',
        flex: 1,
    },
});
