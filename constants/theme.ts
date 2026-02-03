/**
 * Premium Weather App Theme
 * A modern glassmorphic design system with curated color palettes,
 * gradient presets, and animation configurations.
 */

import { Platform } from 'react-native';

// ============================================================================
// COLOR PALETTE
// ============================================================================

// Primary brand colors
const primaryColors = {
  blue: '#007AFF',
  purple: '#5856D6',
  cyan: '#5AC8FA',
  teal: '#64D2FF',
  indigo: '#5E5CE6',
};

// Weather mood colors
const weatherColors = {
  sunny: {
    primary: '#FFD60A',
    secondary: '#FF9500',
    accent: '#FF6B35',
  },
  cloudy: {
    primary: '#8E8E93',
    secondary: '#636366',
    accent: '#48484A',
  },
  rainy: {
    primary: '#5AC8FA',
    secondary: '#007AFF',
    accent: '#5856D6',
  },
  stormy: {
    primary: '#5856D6',
    secondary: '#AF52DE',
    accent: '#FF2D55',
  },
  snowy: {
    primary: '#E5E5EA',
    secondary: '#D1D1D6',
    accent: '#C7C7CC',
  },
  night: {
    primary: '#1C1C1E',
    secondary: '#2C2C2E',
    accent: '#3A3A3C',
  },
};

// Semantic colors
const semanticColors = {
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  info: '#5AC8FA',
};

// Temperature colors (for gauges and indicators)
const temperatureColors = {
  freezing: '#00C7BE', // Below 0°C
  cold: '#5AC8FA',      // 0-10°C
  cool: '#34C759',      // 10-20°C
  warm: '#FF9500',      // 20-30°C
  hot: '#FF3B30',       // 30-40°C
  extreme: '#FF2D55',   // Above 40°C
};

// ============================================================================
// GRADIENT PRESETS
// ============================================================================

export const Gradients = {
  // Weather-based gradients
  clearDay: ['#4A90E2', '#5AC8FA', '#87CEEB'] as const,
  clearNight: ['#0F2027', '#203A43', '#2C5364'] as const,
  cloudy: ['#4B6CB7', '#6B8DD2', '#8FA4E5'] as const,
  rainy: ['#373B44', '#4286F4', '#5C9CE5'] as const,
  stormy: ['#1F1C2C', '#3B2667', '#5B3A8C'] as const,
  snowy: ['#E6DADA', '#D1D1D6', '#F5F5F7'] as const,
  sunset: ['#FF512F', '#F09819', '#FFD93D'] as const,
  sunrise: ['#FF8E53', '#FFC86A', '#FFE082'] as const,
  aurora: ['#00C9FF', '#92FE9D', '#00F5A0'] as const,

  // Temperature-based gradients
  hot: ['#FF9500', '#FF5E3A', '#FF2D55'] as const,
  warm: ['#4CD964', '#5AC8FA', '#007AFF'] as const,
  cool: ['#5AC8FA', '#007AFF', '#5856D6'] as const,
  cold: ['#007AFF', '#5856D6', '#4B6CB7'] as const,
  freezing: ['#667DB6', '#0082C8', '#00B4DB'] as const,

  // UI gradients
  glass: ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)'] as const,
  darkGlass: ['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.1)'] as const,
  cardShine: ['rgba(255,255,255,0.2)', 'rgba(255,255,255,0)'] as const,
  
  // Premium accent gradients
  premium: ['#667EEA', '#764BA2'] as const,
  gold: ['#D4A574', '#C9966E', '#A67C52'] as const,
  neon: ['#00F5A0', '#00D9F5'] as const,
};

// ============================================================================
// GLASSMORPHISM STYLES
// ============================================================================

export const GlassStyles = {
  light: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderColor: 'rgba(255, 255, 255, 0.3)',
    blurIntensity: 60,
  },
  medium: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    blurIntensity: 80,
  },
  dark: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    blurIntensity: 100,
  },
  frosted: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderColor: 'rgba(255, 255, 255, 0.4)',
    blurIntensity: 120,
  },
};

// ============================================================================
// SHADOWS
// ============================================================================

export const Shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  glow: (color: string) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  }),
  innerGlow: {
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 1,
  },
};

// ============================================================================
// SPACING
// ============================================================================

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

// ============================================================================
// BORDER RADIUS
// ============================================================================

export const BorderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  full: 9999,
  card: 20,
  button: 12,
  input: 16,
};

// ============================================================================
// TYPOGRAPHY
// ============================================================================

const fontFamilies = Platform.select({
  ios: {
    light: 'System',
    regular: 'System',
    medium: 'System',
    semibold: 'System',
    bold: 'System',
  },
  android: {
    light: 'Roboto',
    regular: 'Roboto',
    medium: 'Roboto',
    semibold: 'Roboto',
    bold: 'Roboto',
  },
  default: {
    light: 'System',
    regular: 'System',
    medium: 'System',
    semibold: 'System',
    bold: 'System',
  },
});

export const Typography = {
  // Display styles - for hero temperature
  displayLarge: {
    fontSize: 96,
    fontWeight: '200' as const,
    letterSpacing: -2,
    lineHeight: 96,
  },
  displayMedium: {
    fontSize: 72,
    fontWeight: '300' as const,
    letterSpacing: -1,
    lineHeight: 76,
  },
  displaySmall: {
    fontSize: 56,
    fontWeight: '300' as const,
    letterSpacing: -0.5,
    lineHeight: 60,
  },

  // Headings
  h1: {
    fontSize: 32,
    fontWeight: '700' as const,
    letterSpacing: 0.25,
    lineHeight: 40,
  },
  h2: {
    fontSize: 28,
    fontWeight: '600' as const,
    letterSpacing: 0,
    lineHeight: 36,
  },
  h3: {
    fontSize: 24,
    fontWeight: '600' as const,
    letterSpacing: 0.15,
    lineHeight: 32,
  },
  h4: {
    fontSize: 20,
    fontWeight: '600' as const,
    letterSpacing: 0.15,
    lineHeight: 28,
  },

  // Body text
  bodyLarge: {
    fontSize: 18,
    fontWeight: '400' as const,
    letterSpacing: 0.5,
    lineHeight: 26,
  },
  bodyMedium: {
    fontSize: 16,
    fontWeight: '400' as const,
    letterSpacing: 0.25,
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400' as const,
    letterSpacing: 0.25,
    lineHeight: 20,
  },

  // Labels and captions
  labelLarge: {
    fontSize: 14,
    fontWeight: '600' as const,
    letterSpacing: 0.1,
    lineHeight: 20,
  },
  labelMedium: {
    fontSize: 12,
    fontWeight: '500' as const,
    letterSpacing: 0.5,
    lineHeight: 16,
  },
  labelSmall: {
    fontSize: 10,
    fontWeight: '500' as const,
    letterSpacing: 0.5,
    lineHeight: 14,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    letterSpacing: 0.4,
    lineHeight: 16,
  },
};

// ============================================================================
// ANIMATION TIMING
// ============================================================================

export const AnimationConfig = {
  // Duration presets
  duration: {
    instant: 100,
    fast: 200,
    normal: 300,
    slow: 500,
    verySlow: 800,
    splash: 2000,
  },

  // Spring configurations for Reanimated
  spring: {
    gentle: {
      damping: 20,
      stiffness: 100,
      mass: 1,
    },
    bouncy: {
      damping: 10,
      stiffness: 150,
      mass: 0.8,
    },
    stiff: {
      damping: 30,
      stiffness: 300,
      mass: 1,
    },
    wobbly: {
      damping: 8,
      stiffness: 180,
      mass: 0.6,
    },
  },

  // Stagger delays for list animations
  stagger: {
    fast: 50,
    normal: 100,
    slow: 150,
  },
};

// ============================================================================
// THEME COLORS (Light/Dark mode)
// ============================================================================

const tintColorLight = '#007AFF';
const tintColorDark = '#5AC8FA';

export const Colors = {
  light: {
    text: '#11181C',
    textSecondary: '#687076',
    textTertiary: '#9BA1A6',
    background: '#F5F5F7',
    surface: '#FFFFFF',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    border: 'rgba(0, 0, 0, 0.1)',
    divider: 'rgba(0, 0, 0, 0.05)',
  },
  dark: {
    text: '#ECEDEE',
    textSecondary: '#9BA1A6',
    textTertiary: '#636366',
    background: '#0A0A0A',
    surface: '#1C1C1E',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    border: 'rgba(255, 255, 255, 0.1)',
    divider: 'rgba(255, 255, 255, 0.05)',
  },
  // Shared colors that don't change with theme
  shared: {
    white: '#FFFFFF',
    black: '#000000',
    transparent: 'transparent',
    overlay: 'rgba(0, 0, 0, 0.5)',
    ...primaryColors,
    ...semanticColors,
    temperature: temperatureColors,
    weather: weatherColors,
  },
};

// ============================================================================
// FONTS (Platform-specific)
// ============================================================================

export const Fonts = Platform.select({
  ios: {
    sans: 'System',
    serif: 'Georgia',
    rounded: 'SF Pro Rounded',
    mono: 'SF Mono',
    display: 'SF Pro Display',
  },
  android: {
    sans: 'Roboto',
    serif: 'serif',
    rounded: 'Roboto',
    mono: 'monospace',
    display: 'Roboto',
  },
  web: {
    sans: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', system-ui, sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
    display: "'SF Pro Display', system-ui, sans-serif",
  },
  default: {
    sans: 'System',
    serif: 'serif',
    rounded: 'System',
    mono: 'monospace',
    display: 'System',
  },
});

// ============================================================================
// WEATHER ICON MAPPING (for consistent icon usage)
// ============================================================================

export const WeatherIcons = {
  clear: {
    day: 'sunny',
    night: 'moon',
  },
  partlyCloudy: {
    day: 'partly-sunny',
    night: 'cloudy-night',
  },
  cloudy: 'cloudy',
  overcast: 'cloud',
  mist: 'water',
  rain: 'rainy',
  snow: 'snow',
  thunderstorm: 'thunderstorm',
  wind: 'flag',
  fog: 'water',
};

// ============================================================================
// DRAWER CONFIGURATION
// ============================================================================

export const DrawerConfig = {
  width: 280,
  backgroundColor: 'rgba(20, 20, 30, 0.95)',
  itemHeight: 56,
  iconSize: 24,
  activeColor: '#5AC8FA',
  inactiveColor: 'rgba(255, 255, 255, 0.7)',
};

// ============================================================================
// CARD SIZES
// ============================================================================

export const CardSizes = {
  statCard: {
    width: '47%' as const,
    height: 100,
  },
  hourlyCard: {
    width: 70,
    height: 120,
  },
  forecastCard: {
    height: 80,
  },
  heroCard: {
    minHeight: 280,
  },
};
