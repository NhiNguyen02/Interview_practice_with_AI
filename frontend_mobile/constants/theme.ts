// Light theme colors
export const COLORS = {
  light: {
    primary: '#5A31F4',
    secondary: '#4ADEDE',
    tertiary: '#0EA5E9',
    background: '#F9FAFB',
    card: '#FFFFFF',
    text: '#111827',
    textSecondary: '#B0B3B8',
    border: '#E5E7EB',
    notification: '#EF4444',
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
    bottomNav: '#FFFFFF',
    white: '#FFFFFF',
    info: '#3B82F6',
  },
  // Dark theme colors
  dark: {
    primary: '#6D28D9',
    secondary: '#4ADEDE',
    tertiary: '#0EA5E9',
    background: '#111827',
    card: '#1F2937',
    text: '#F9FAFB',
    textSecondary: '#D1D5DB',
    border: '#374151',
    notification: '#EF4444',
    success: '#10B981',
    error: '#F87171',
    warning: '#FBBF24',
    bottomNav: '#37206B',
    white: '#FFFFFF',
    info: '#3B82F6',
  }
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const TYPOGRAPHY = {
  fontSizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
  },
  fontWeights: {
    regular: '400',
    medium: '500',
    bold: '700',
  },
  // Định nghĩa font family
  fontFamilies: {
    default: 'System',
    mono: 'SpaceMono',
    // Thêm font tùy chỉnh mới
    primary: 'Montserrat-Regular',
    primaryBold: 'Montserrat-Bold',
    primaryItalic: 'Montserrat-Italic',
    primaryBoldItalic: 'Montserrat-BoldItalic',
    // Có thể sử dụng tên ngắn gọn hơn
    montserrat: 'Montserrat',
    
    // Font đang được áp dụng
    inter: 'Inter',
  },
  // Predefined text styles
  styles: {
    title: {
      fontSize: 32,
      fontWeight: '700',
      // fontFamily: 'Montserrat-Bold', // Sử dụng font tùy chỉnh
      fontFamily: 'Inter', // Sử dụng font tùy chỉnh
    },
    heading: {
      fontSize: 24,
      fontWeight: '600',
      // fontFamily: 'Montserrat-Bold', // Sử dụng font tùy chỉnh
      fontFamily: 'Inter', // Sử dụng font tùy chỉnh
    },
    subheading: {
      fontSize: 20,
      fontWeight: '600',
      // fontFamily: 'Montserrat-Bold', // Sử dụng font tùy chỉnh
      fontFamily: 'Inter', // Sử dụng font tùy chỉnh
    },
    body: {
      fontSize: 16,
      fontWeight: '400',
      // fontFamily: 'Montserrat-Regular', // Sử dụng font tùy chỉnh
      fontFamily: 'Inter', // Sử dụng font tùy chỉnh
    },
    caption: {
      fontSize: 14,
      fontWeight: '400',
      // fontFamily: 'Montserrat-Regular', // Sử dụng font tùy chỉnh
      fontFamily: 'Inter', // Sử dụng font tùy chỉnh
    },
    button: {
      fontSize: 18,
      fontWeight: '600',
      // fontFamily: 'Montserrat-Bold', // Sử dụng font tùy chỉnh
      fontFamily: 'Inter', // Sử dụng font tùy chỉnh
    },
    link: {
      fontSize: 16,
      fontWeight: '600',
      // fontFamily: 'Montserrat-Regular', // Sử dụng font tùy chỉnh
      fontFamily: 'Inter', // Sử dụng font tùy chỉnh
      textDecorationLine: 'underline',
    },
  },
};

export const SHADOWS = {
  light: {
    small: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 1,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.15,
      shadowRadius: 3.84,
      elevation: 3,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.2,
      shadowRadius: 5.46,
      elevation: 6,
    },
  },
  dark: {
    small: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.3,
      shadowRadius: 2,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.4,
      shadowRadius: 3.84,
      elevation: 4,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.5,
      shadowRadius: 5.46,
      elevation: 8,
    },
  },
};

// Tạo lightTheme và darkTheme từ các thành phần riêng lẻ
export const lightTheme = {
  dark: false,
  colors: COLORS.light,
  typography: TYPOGRAPHY,
  spacing: SPACING,
  shadows: SHADOWS.light,
};

export const darkTheme = {
  dark: true,
  colors: COLORS.dark,
  typography: TYPOGRAPHY,
  spacing: SPACING,
  shadows: SHADOWS.dark,
};

// Default export required by Expo Router
const theme = {
  light: lightTheme,
  dark: darkTheme,
  COLORS,
  SPACING,
  TYPOGRAPHY,
  SHADOWS,
};

export default theme;