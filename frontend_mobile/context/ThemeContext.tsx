/**
 * ThemeContext.tsx
 * 
 * File này quản lý theme (giao diện sáng/tối) của ứng dụng.
 * - Cho phép người dùng chọn theme sáng, tối hoặc theo cài đặt hệ thống
 * - Lưu trữ cài đặt theme vào bộ nhớ cục bộ (AsyncStorage)
 * - Cung cấp hook useTheme() để các component con có thể dễ dàng truy cập theme
 */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme } from '../constants/theme';

// Các chế độ theme có thể chọn: sáng, tối hoặc theo hệ thống
type ThemeMode = 'light' | 'dark' | 'system';

// Định nghĩa kiểu dữ liệu cho ThemeContext
interface ThemeContextType {
  theme: typeof lightTheme;      // Theme hiện tại (chứa colors, spacing, typography...)
  themeMode: ThemeMode;          // Chế độ theme đang chọn ('light', 'dark' hoặc 'system')
  setThemeMode: (mode: ThemeMode) => void;  // Hàm để thay đổi chế độ theme
  toggleTheme: () => void;       // Hàm để chuyển đổi nhanh giữa sáng và tối
}

// Key để lưu trữ cài đặt theme trong AsyncStorage
const THEME_MODE_STORAGE_KEY = '@preptalk_theme_mode';

// Tạo context với các giá trị mặc định
const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  themeMode: 'system',
  setThemeMode: () => {},
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // Get device color scheme
  const colorScheme = useColorScheme();
  
  // State for theme mode
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');
  
  // Determine active theme based on themeMode and system preference
  const activeTheme = themeMode === 'system' 
    ? colorScheme === 'dark' ? darkTheme : lightTheme
    : themeMode === 'dark' ? darkTheme : lightTheme;

  // Load saved theme mode from storage
  useEffect(() => {
    const loadThemeMode = async () => {
      try {
        const savedThemeMode = await AsyncStorage.getItem(THEME_MODE_STORAGE_KEY);
        if (savedThemeMode) {
          setThemeMode(savedThemeMode as ThemeMode);
        }
      } catch (error) {
        console.error('Error loading theme mode:', error);
      }
    };

    loadThemeMode();
  }, []);

  // Save theme mode to storage when it changes
  const changeThemeMode = async (mode: ThemeMode) => {
    try {
      await AsyncStorage.setItem(THEME_MODE_STORAGE_KEY, mode);
      setThemeMode(mode);
    } catch (error) {
      console.error('Error saving theme mode:', error);
    }
  };

  // Toggle between light and dark mode
  const toggleTheme = () => {
    if (themeMode === 'light') {
      changeThemeMode('dark');
    } else if (themeMode === 'dark') {
      changeThemeMode('light');
    } else {
      // If system, switch to opposite of current system theme
      changeThemeMode(colorScheme === 'dark' ? 'light' : 'dark');
    }
  };

  return (
    <ThemeContext.Provider 
      value={{
        theme: activeTheme,
        themeMode,
        setThemeMode: changeThemeMode,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook để sử dụng theme context
export const useTheme = () => useContext(ThemeContext);

export default ThemeContext;
