/**
 * App Context - Global State Management
 * Manages theme (dark/light), temperature units, default city, and other app settings.
 * Uses AsyncStorage for persistence across app restarts.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

// Types
export type ThemeMode = 'dark' | 'light' | 'system';
export type TemperatureUnit = 'celsius' | 'fahrenheit';

interface AppSettings {
    themeMode: ThemeMode;
    temperatureUnit: TemperatureUnit;
    defaultCity: string;
    notifications: boolean;
    weatherAlerts: boolean;
    autoRefresh: boolean;
}

interface AppContextType {
    // Theme
    themeMode: ThemeMode;
    isDarkMode: boolean;
    setThemeMode: (mode: ThemeMode) => void;

    // Temperature
    temperatureUnit: TemperatureUnit;
    setTemperatureUnit: (unit: TemperatureUnit) => void;
    convertTemp: (celsius: number) => number;
    tempSymbol: string;

    // City
    defaultCity: string;
    setDefaultCity: (city: string) => void;

    // Notifications
    notifications: boolean;
    setNotifications: (enabled: boolean) => void;
    weatherAlerts: boolean;
    setWeatherAlerts: (enabled: boolean) => void;

    // Auto refresh
    autoRefresh: boolean;
    setAutoRefresh: (enabled: boolean) => void;

    // Loading state
    isLoading: boolean;
}

const defaultSettings: AppSettings = {
    themeMode: 'dark',
    temperatureUnit: 'celsius',
    defaultCity: 'Meerut',
    notifications: true,
    weatherAlerts: true,
    autoRefresh: true,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = '@weather_app_settings';

export function AppProvider({ children }: { children: ReactNode }) {
    const [settings, setSettings] = useState<AppSettings>(defaultSettings);
    const [isLoading, setIsLoading] = useState(true);

    // Load settings from storage on mount
    useEffect(() => {
        loadSettings();
    }, []);

    // Save settings whenever they change
    useEffect(() => {
        if (!isLoading) {
            saveSettings();
        }
    }, [settings]);

    const loadSettings = async () => {
        try {
            const stored = await AsyncStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                setSettings({ ...defaultSettings, ...parsed });
            }
        } catch (error) {
            console.error('Failed to load settings:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const saveSettings = async () => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
        } catch (error) {
            console.error('Failed to save settings:', error);
        }
    };

    // Theme helpers
    const isDarkMode = settings.themeMode === 'dark' ||
        (settings.themeMode === 'system' && true); // Default to dark for system

    const setThemeMode = (mode: ThemeMode) => {
        setSettings(prev => ({ ...prev, themeMode: mode }));
    };

    // Temperature helpers
    const setTemperatureUnit = (unit: TemperatureUnit) => {
        setSettings(prev => ({ ...prev, temperatureUnit: unit }));
    };

    const convertTemp = (celsius: number): number => {
        if (settings.temperatureUnit === 'fahrenheit') {
            return Math.round((celsius * 9 / 5) + 32);
        }
        return celsius;
    };

    const tempSymbol = settings.temperatureUnit === 'fahrenheit' ? '°F' : '°C';

    // City helpers
    const setDefaultCity = (city: string) => {
        setSettings(prev => ({ ...prev, defaultCity: city }));
    };

    // Notification helpers
    const setNotifications = (enabled: boolean) => {
        setSettings(prev => ({ ...prev, notifications: enabled }));
    };

    const setWeatherAlerts = (enabled: boolean) => {
        setSettings(prev => ({ ...prev, weatherAlerts: enabled }));
    };

    // Auto refresh helper
    const setAutoRefresh = (enabled: boolean) => {
        setSettings(prev => ({ ...prev, autoRefresh: enabled }));
    };

    const value: AppContextType = {
        themeMode: settings.themeMode,
        isDarkMode,
        setThemeMode,
        temperatureUnit: settings.temperatureUnit,
        setTemperatureUnit,
        convertTemp,
        tempSymbol,
        defaultCity: settings.defaultCity,
        setDefaultCity,
        notifications: settings.notifications,
        setNotifications,
        weatherAlerts: settings.weatherAlerts,
        setWeatherAlerts,
        autoRefresh: settings.autoRefresh,
        setAutoRefresh,
        isLoading,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
}

// Export a hook for just theme
export function useTheme() {
    const { themeMode, isDarkMode, setThemeMode } = useAppContext();
    return { themeMode, isDarkMode, setThemeMode };
}

// Export a hook for temperature
export function useTemperature() {
    const { temperatureUnit, setTemperatureUnit, convertTemp, tempSymbol } = useAppContext();
    return { temperatureUnit, setTemperatureUnit, convertTemp, tempSymbol };
}
