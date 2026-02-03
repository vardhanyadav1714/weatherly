/**
 * Settings Screen - Simplified & Functional
 * Only includes features that actually work.
 */

import {
    BorderRadius,
    Gradients,
    Spacing,
    Typography,
} from '@/constants/theme';
import { useAppContext } from '@/context/AppContext';
import { Ionicons } from '@expo/vector-icons';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SettingsScreen() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();

    // Get settings from context
    const {
        temperatureUnit,
        setTemperatureUnit,
        defaultCity,
        setDefaultCity,
    } = useAppContext();

    // Local state for city input
    const [cityInput, setCityInput] = useState(defaultCity);

    const handleCityChange = () => {
        if (cityInput.trim()) {
            setDefaultCity(cityInput.trim());
            Alert.alert('✅ Success', `Default city changed to "${cityInput.trim()}". Restart the app for changes to take effect.`);
        }
    };

    const handleRateApp = () => {
        Alert.alert('⭐ Rate App', 'Thank you for using Weatherly! Ratings would be available when published to app stores.');
    };

    const handlePrivacy = () => {
        Alert.alert('🔒 Privacy Policy', 'Weatherly respects your privacy. We only collect weather data for your selected locations. No personal data is shared with third parties.');
    };

    const handleContact = () => {
        Alert.alert('📧 Contact Support', 'For support, please email:\nvardhan.yadav.1714@gmail.com');
    };

    const cardBg = 'rgba(255, 255, 255, 0.08)';
    const cardBorder = 'rgba(255, 255, 255, 0.1)';
    const textColor = '#FFFFFF';
    const secondaryTextColor = 'rgba(255,255,255,0.6)';

    const renderSection = (title: string, children: React.ReactNode, delay: number = 0) => (
        <Animated.View
            entering={FadeInDown.delay(delay).springify()}
            style={styles.section}
        >
            <Text style={[styles.sectionTitle, { color: secondaryTextColor }]}>{title}</Text>
            <View style={[styles.sectionContent, { backgroundColor: cardBg, borderColor: cardBorder }]}>
                {children}
            </View>
        </Animated.View>
    );

    const renderSettingRow = (
        icon: keyof typeof Ionicons.glyphMap,
        title: string,
        subtitle?: string,
        rightComponent?: React.ReactNode,
        onPress?: () => void
    ) => (
        <TouchableOpacity
            style={styles.settingRow}
            onPress={onPress}
            activeOpacity={onPress ? 0.7 : 1}
        >
            <View style={styles.settingIcon}>
                <Ionicons name={icon} size={22} color="#5AC8FA" />
            </View>
            <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { color: textColor }]}>{title}</Text>
                {subtitle && <Text style={[styles.settingSubtitle, { color: secondaryTextColor }]}>{subtitle}</Text>}
            </View>
            {rightComponent}
        </TouchableOpacity>
    );

    return (
        <LinearGradient colors={Gradients.stormy} style={styles.container}>
            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
                <TouchableOpacity
                    style={styles.menuButton}
                    onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
                >
                    <Ionicons name="menu" size={28} color={textColor} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: textColor }]}>Settings</Text>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: insets.bottom + Spacing.xxl }}
            >
                {/* Temperature Unit - FUNCTIONAL */}
                {renderSection('Temperature Unit', (
                    <View style={styles.unitSelector}>
                        <Text style={[styles.unitLabel, { color: textColor }]}>Display Temperature In</Text>
                        <View style={styles.unitButtons}>
                            <TouchableOpacity
                                style={[
                                    styles.unitButton,
                                    temperatureUnit === 'celsius' && styles.unitButtonActive,
                                ]}
                                onPress={() => setTemperatureUnit('celsius')}
                            >
                                <Text style={[
                                    styles.unitButtonText,
                                    temperatureUnit === 'celsius' && styles.unitButtonTextActive,
                                ]}>°C</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.unitButton,
                                    temperatureUnit === 'fahrenheit' && styles.unitButtonActive,
                                ]}
                                onPress={() => setTemperatureUnit('fahrenheit')}
                            >
                                <Text style={[
                                    styles.unitButtonText,
                                    temperatureUnit === 'fahrenheit' && styles.unitButtonTextActive,
                                ]}>°F</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ), 100)}

                {/* Default Location - FUNCTIONAL */}
                {renderSection('Default Location', (
                    <View style={styles.locationInput}>
                        <Ionicons name="location-outline" size={20} color="#5AC8FA" />
                        <TextInput
                            style={[styles.cityInput, { color: textColor }]}
                            value={cityInput}
                            onChangeText={setCityInput}
                            placeholder="Enter your city name"
                            placeholderTextColor={secondaryTextColor}
                            onSubmitEditing={handleCityChange}
                            returnKeyType="done"
                        />
                        <TouchableOpacity style={styles.saveButton} onPress={handleCityChange}>
                            <Text style={styles.saveButtonText}>Save</Text>
                        </TouchableOpacity>
                    </View>
                ), 200)}

                {/* About - FUNCTIONAL */}
                {renderSection('About', (
                    <>
                        {renderSettingRow(
                            'information-circle-outline',
                            'Version',
                            '2.0.0 (Build 2024.12)',
                        )}
                        <View style={[styles.divider, { backgroundColor: cardBorder }]} />
                        {renderSettingRow(
                            'star-outline',
                            'Rate App',
                            'Leave a review',
                            <Ionicons name="chevron-forward" size={20} color={secondaryTextColor} />,
                            handleRateApp
                        )}
                        <View style={[styles.divider, { backgroundColor: cardBorder }]} />
                        {renderSettingRow(
                            'document-text-outline',
                            'Privacy Policy',
                            undefined,
                            <Ionicons name="chevron-forward" size={20} color={secondaryTextColor} />,
                            handlePrivacy
                        )}
                        <View style={[styles.divider, { backgroundColor: cardBorder }]} />
                        {renderSettingRow(
                            'mail-outline',
                            'Contact Support',
                            undefined,
                            <Ionicons name="chevron-forward" size={20} color={secondaryTextColor} />,
                            handleContact
                        )}
                    </>
                ), 300)}

                {/* Credits */}
                <Animated.View
                    entering={FadeInDown.delay(400).springify()}
                    style={styles.credits}
                >
                    <LinearGradient
                        colors={['#5AC8FA', '#007AFF']}
                        style={styles.creditsLogo}
                    >
                        <Ionicons name="partly-sunny" size={20} color="#FFFFFF" />
                    </LinearGradient>
                    <Text style={[styles.creditsTitle, { color: textColor }]}>Weatherly</Text>
                    <Text style={[styles.creditsSubtitle, { color: secondaryTextColor }]}>Powered by WeatherAPI.com</Text>
                    <Text style={[styles.creditsCopyright, { color: secondaryTextColor, opacity: 0.5 }]}>© 2024 All Rights Reserved</Text>
                </Animated.View>
            </ScrollView>
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
    headerTitle: {
        ...Typography.h2,
        flex: 1,
        textAlign: 'center',
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: Spacing.lg,
    },
    section: {
        marginBottom: Spacing.lg,
    },
    sectionTitle: {
        ...Typography.labelLarge,
        marginBottom: Spacing.sm,
        marginLeft: Spacing.sm,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    sectionContent: {
        borderRadius: BorderRadius.lg,
        overflow: 'hidden',
        borderWidth: 1,
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.md,
    },
    settingIcon: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: 'rgba(90, 200, 250, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: Spacing.md,
    },
    settingInfo: {
        flex: 1,
    },
    settingTitle: {
        ...Typography.bodyMedium,
    },
    settingSubtitle: {
        ...Typography.caption,
        marginTop: 2,
    },
    divider: {
        height: 1,
        marginLeft: 72,
    },
    unitSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: Spacing.md,
    },
    unitLabel: {
        ...Typography.bodyMedium,
    },
    unitButtons: {
        flexDirection: 'row',
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: BorderRadius.md,
        padding: 4,
    },
    unitButton: {
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.sm,
        borderRadius: BorderRadius.sm,
    },
    unitButtonActive: {
        backgroundColor: 'rgba(90, 200, 250, 0.4)',
    },
    unitButtonText: {
        ...Typography.labelLarge,
        color: 'rgba(255,255,255,0.5)',
    },
    unitButtonTextActive: {
        color: '#5AC8FA',
        fontWeight: '700',
    },
    locationInput: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.md,
    },
    cityInput: {
        flex: 1,
        ...Typography.bodyMedium,
        marginLeft: Spacing.md,
        marginRight: Spacing.md,
    },
    saveButton: {
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        backgroundColor: 'rgba(90, 200, 250, 0.3)',
        borderRadius: BorderRadius.sm,
    },
    saveButtonText: {
        ...Typography.labelMedium,
        color: '#5AC8FA',
        fontWeight: '600',
    },
    credits: {
        alignItems: 'center',
        marginVertical: Spacing.xxl,
    },
    creditsLogo: {
        width: 48,
        height: 48,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    creditsTitle: {
        ...Typography.h4,
    },
    creditsSubtitle: {
        ...Typography.bodySmall,
        marginTop: 4,
    },
    creditsCopyright: {
        ...Typography.caption,
        marginTop: Spacing.md,
    },
});
