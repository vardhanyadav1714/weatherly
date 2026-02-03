/**
 * CustomDrawerContent Component
 * A premium glassmorphic side drawer with animated menu items
 * and smooth transitions. Only shows functional items.
 */

import {
    BorderRadius,
    Gradients,
    Spacing,
    Typography
} from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Animated, {
    FadeInLeft
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface CustomDrawerContentProps {
    navigation: any;
    state: any;
    descriptors: any;
}

export default function CustomDrawerContent(props: CustomDrawerContentProps) {
    const insets = useSafeAreaInsets();
    const { navigation, state } = props;

    // Only functional menu items
    const menuItems = [
        { name: 'index', label: 'Weather', icon: 'partly-sunny' as const, route: '(tabs)' },
        { name: 'forecast', label: '3-Day Forecast', icon: 'calendar' as const, route: 'forecast' },
        { name: 'settings', label: 'Settings', icon: 'settings' as const, route: 'settings' },
    ];

    const currentRoute = state.routes[state.index]?.name || 'index';

    return (
        <LinearGradient
            colors={['rgba(15, 20, 35, 0.98)', 'rgba(25, 35, 55, 0.95)']}
            style={styles.container}
        >
            {/* Header with profile */}
            <Animated.View
                entering={FadeInLeft.delay(100).springify()}
                style={[styles.header, { paddingTop: insets.top + Spacing.md }]}
            >
                <LinearGradient
                    colors={Gradients.premium}
                    style={styles.avatarGradient}
                >
                    <View style={styles.avatarContainer}>
                        <Ionicons name="partly-sunny" size={32} color="#FFFFFF" />
                    </View>
                </LinearGradient>
                <View style={styles.headerText}>
                    <Text style={styles.appTitle}>Weatherly</Text>
                    <Text style={styles.appSubtitle}>Your daily forecast</Text>
                </View>
            </Animated.View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Menu Items */}
            <View style={styles.menuContainer}>
                {menuItems.map((item, index) => {
                    const isActive = currentRoute === item.route ||
                        (item.route === '(tabs)' && currentRoute === '(tabs)');

                    return (
                        <Animated.View
                            key={item.name}
                            entering={FadeInLeft.delay(150 + index * 50).springify()}
                        >
                            <TouchableOpacity
                                style={[styles.menuItem, isActive && styles.menuItemActive]}
                                onPress={() => navigation.navigate(item.route)}
                                activeOpacity={0.7}
                            >
                                <View style={[styles.iconWrapper, isActive && styles.iconWrapperActive]}>
                                    <Ionicons
                                        name={item.icon}
                                        size={22}
                                        color={isActive ? '#5AC8FA' : 'rgba(255,255,255,0.7)'}
                                    />
                                </View>
                                <Text style={[styles.menuLabel, isActive && styles.menuLabelActive]}>
                                    {item.label}
                                </Text>
                                {isActive && (
                                    <View style={styles.activeIndicator} />
                                )}
                            </TouchableOpacity>
                        </Animated.View>
                    );
                })}
            </View>

            {/* Bottom Section - App Info Only */}
            <View style={[styles.bottomSection, { paddingBottom: insets.bottom + Spacing.lg }]}>
                <View style={styles.divider} />

                <Animated.View
                    entering={FadeInLeft.delay(400).springify()}
                    style={styles.appInfo}
                >
                    <View style={styles.appBrand}>
                        <LinearGradient
                            colors={['#5AC8FA', '#007AFF']}
                            style={styles.appLogo}
                        >
                            <Ionicons name="partly-sunny" size={16} color="#FFFFFF" />
                        </LinearGradient>
                        <Text style={styles.appName}>Weatherly</Text>
                    </View>
                    <Text style={styles.versionText}>Version 2.0.0</Text>
                    <Text style={styles.poweredText}>Powered by WeatherAPI</Text>
                </Animated.View>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: Spacing.lg,
        paddingBottom: Spacing.lg,
    },
    avatarGradient: {
        width: 64,
        height: 64,
        borderRadius: 32,
        padding: 2,
        marginBottom: Spacing.md,
    },
    avatarContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerText: {
        marginBottom: Spacing.sm,
    },
    appTitle: {
        ...Typography.h3,
        color: '#FFFFFF',
    },
    appSubtitle: {
        ...Typography.bodySmall,
        color: 'rgba(255,255,255,0.6)',
        marginTop: 2,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
        marginHorizontal: Spacing.lg,
        marginVertical: Spacing.sm,
    },
    menuContainer: {
        flex: 1,
        paddingHorizontal: Spacing.md,
        paddingTop: Spacing.md,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.md,
        borderRadius: BorderRadius.lg,
        marginBottom: Spacing.xs,
    },
    menuItemActive: {
        backgroundColor: 'rgba(90, 200, 250, 0.1)',
    },
    iconWrapper: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: Spacing.md,
    },
    iconWrapperActive: {
        backgroundColor: 'rgba(90, 200, 250, 0.15)',
    },
    menuLabel: {
        ...Typography.bodyMedium,
        color: 'rgba(255,255,255,0.7)',
        flex: 1,
    },
    menuLabelActive: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
    activeIndicator: {
        width: 4,
        height: 20,
        backgroundColor: '#5AC8FA',
        borderRadius: 2,
        marginLeft: Spacing.sm,
    },
    bottomSection: {
        paddingHorizontal: Spacing.lg,
    },
    appInfo: {
        alignItems: 'center',
        marginTop: Spacing.lg,
    },
    appBrand: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.xs,
    },
    appLogo: {
        width: 28,
        height: 28,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: Spacing.sm,
    },
    appName: {
        ...Typography.labelLarge,
        color: '#FFFFFF',
    },
    versionText: {
        ...Typography.caption,
        color: 'rgba(255,255,255,0.4)',
    },
    poweredText: {
        ...Typography.caption,
        color: 'rgba(255,255,255,0.3)',
        marginTop: 4,
    },
});
