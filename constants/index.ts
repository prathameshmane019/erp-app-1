
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const SIZES = {
  // Screen dimensions
  screenWidth: width,
  screenHeight: height,

  // Spacing
  base: 8,
  small: 12,
  medium: 16,
  large: 24,
  xlarge: 32,

  // Font Sizes
  h1: 32,
  h2: 24,
  h3: 18,
  h4: 16,
  body: 14,
  caption: 12,
};

export const COLORS = {
  // Primary Palette
  primary: {
    lightest: '#E6E6FA',
    light: '#6200EE',
    main: '#4B0082',
    dark: '#301934',
  },
  
  // Secondary Palette
  secondary: {
    lightest: '#E0F2F1',
    light: '#03DAC6',
    main: '#009688',
    dark: '#00695C',
  },
  
  // Neutral Colors
  neutral: {
    white: '#FFFFFF',
    black: '#000000',
    gray: {
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#EEEEEE',
      300: '#E0E0E0',
      400: '#BDBDBD',
      500: '#9E9E9E',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
    },
  },
  
  // Status Colors
  status: {
    success: '#4CAF50',
    error: '#F44336',
    warning: '#FF9800',
    info: '#2196F3',
  },
  
  // Text Colors
  text: {
    primary: '#121212',
    secondary: '#666666',
    disabled: '#9E9E9E',
  },
  
  // Background Colors
  background: {
    default: '#F5F5F5',
    paper: '#FFFFFF',
  },
};

export const TYPOGRAPHY = {
  fontFamily: {
    regular: 'Roboto-Regular',
    medium: 'Roboto-Medium',
    bold: 'Roboto-Bold',
  },
  
  fontWeight: {
    thin: '100',
    light: '300',
    regular: '400',
    medium: '500',
    bold: '700',
    black: '900',
  },
  
  fontSize: {
    h1: 32,
    h2: 24,
    h3: 20,
    h4: 18,
    h5: 16,
    body1: 16,
    body2: 14,
    subtitle1: 16,
    subtitle2: 14,
    button: 14,
    caption: 12,
    overline: 10,
  },
};

export const SHADOW = {
  light: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  heavy: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
};

export const BORDERRADIUS = {
  small: 4,
  medium: 8,
  large: 12,
  round: 50,
};