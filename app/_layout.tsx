import AnimatedSplashScreen from '@/components/AnimatedSplashScreen';
import CustomDrawerContent from '@/components/CustomDrawerContent';
import { DrawerConfig } from '@/constants/theme';
import { AppProvider } from '@/context/AppContext';
import { Ionicons } from '@expo/vector-icons';
import { Drawer } from 'expo-router/drawer';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useState } from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [appReady, setAppReady] = useState(false);
  const [showCustomSplash, setShowCustomSplash] = useState(true);

  useEffect(() => {
    async function prepare() {
      try {
        // Artificial delay to show the splash screen
        await new Promise(resolve => setTimeout(resolve, 1500));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppReady(true);
      }
    }

    prepare();
  }, []);

  const handleSplashAnimationComplete = () => {
    setShowCustomSplash(false);
    SplashScreen.hideAsync();
  };

  // Show custom splash screen with animations
  if (showCustomSplash && appReady) {
    return (
      <>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <AnimatedSplashScreen onAnimationComplete={handleSplashAnimationComplete} />
      </>
    );
  }

  // Show nothing while preparing
  if (!appReady) {
    return null;
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <AppProvider>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <Drawer
          drawerContent={(props) => <CustomDrawerContent {...props} />}
          screenOptions={{
            headerShown: false,
            drawerType: 'slide',
            drawerStyle: {
              width: DrawerConfig.width,
              backgroundColor: 'transparent',
            },
            overlayColor: 'rgba(0, 0, 0, 0.7)',
            swipeEnabled: true,
            swipeEdgeWidth: 50,
          }}
        >
          <Drawer.Screen
            name="(tabs)"
            options={{
              drawerLabel: 'Weather',
              drawerIcon: ({ color, size }) => (
                <Ionicons name="partly-sunny" size={size} color={color} />
              ),
            }}
          />
          <Drawer.Screen
            name="forecast"
            options={{
              drawerLabel: 'Forecast',
              drawerIcon: ({ color, size }) => (
                <Ionicons name="calendar" size={size} color={color} />
              ),
            }}
          />
          <Drawer.Screen
            name="maps"
            options={{
              drawerItemStyle: { display: 'none' },
            }}
          />
          <Drawer.Screen
            name="settings"
            options={{
              drawerLabel: 'Settings',
              drawerIcon: ({ color, size }) => (
                <Ionicons name="settings" size={size} color={color} />
              ),
            }}
          />
          <Drawer.Screen
            name="modal"
            options={{
              drawerItemStyle: { display: 'none' },
            }}
          />
        </Drawer>
      </AppProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F2027',
  },
});