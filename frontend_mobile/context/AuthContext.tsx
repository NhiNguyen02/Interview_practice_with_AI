/**
 * AuthContext.tsx
 * 
 * File này quản lý trạng thái xác thực người dùng trong ứng dụng.
 * - Xử lý đăng nhập, đăng ký và đăng xuất
 * - Lưu trữ thông tin người dùng và token xác thực
 * - Kiểm tra trạng thái xác thực khi khởi động ứng dụng
 * - Điều hướng người dùng dựa trên trạng thái xác thực
 */
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

// Định nghĩa kiểu dữ liệu cho người dùng
type User = {
  id: string;
  username: string;
  email: string;
  profilePicture?: string;  // Ảnh đại diện (tùy chọn)
};

// Định nghĩa kiểu dữ liệu cho AuthContext
type AuthContextType = {
  user: User | null;         // Thông tin người dùng hiện tại hoặc null nếu chưa đăng nhập
  isLoading: boolean;        // Trạng thái đang tải (kiểm tra session, API calls...)
  signIn: (email: string, password: string) => Promise<boolean>;  // Hàm đăng nhập
  signUp: (email: string, password: string, username: string) => Promise<boolean>;  // Hàm đăng ký
  signOut: () => Promise<void>;  // Hàm đăng xuất
  isAuthenticated: boolean;  // Trạng thái đã xác thực hay chưa
};

// Tạo context với các giá trị mặc định
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  signIn: async () => false,
  signUp: async () => false,
  signOut: async () => {},
  isAuthenticated: false,
});

// Storage keys
const USER_STORAGE_KEY = '@preptalk_user';
const TOKEN_STORAGE_KEY = '@preptalk_token';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user data from storage on app start
  useEffect(() => {
    const loadUserFromStorage = async () => {
      try {
        const userString = await AsyncStorage.getItem(USER_STORAGE_KEY);
        const token = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);

        if (userString && token) {
          const userData = JSON.parse(userString);
          setUser(userData);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserFromStorage();
  }, []);

  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Thay thế đoạn code này bằng API call thực tế của bạn
      // const response = await authService.login(email, password);
      
      // Đây là mock data để thử nghiệm
      await new Promise(resolve => setTimeout(resolve, 1000)); // Giả lập API delay
      
      const mockUser = {
        id: 'user123',
        username: 'bich-nhan',
        email: email,
        profilePicture: 'https://www.svgrepo.com/show/452030/avatar-default.svg'
      };

      const mockToken = 'sample-auth-token-123456';
      
      // Lưu thông tin user và token vào storage
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(mockUser));
      await AsyncStorage.setItem(TOKEN_STORAGE_KEY, mockToken);
      
      setUser(mockUser);
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, username: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Thay thế đoạn code này bằng API call thực tế của bạn
      // const response = await authService.register(email, password, username);
      
      // Đây là mock data để thử nghiệm
      await new Promise(resolve => setTimeout(resolve, 1000)); // Giả lập API delay
      
      const mockUser = {
        id: 'user' + Math.floor(Math.random() * 1000),
        username: username,
        email: email,
      };

      const mockToken = 'sample-auth-token-' + Math.random().toString(36).substring(7);
      
      // Lưu thông tin user và token vào storage
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(mockUser));
      await AsyncStorage.setItem(TOKEN_STORAGE_KEY, mockToken);
      
      setUser(mockUser);
      
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      setIsLoading(true);
      
      // Xóa dữ liệu user khỏi storage
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
      await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
      
      // Cập nhật state
      setUser(null);
      
      // Điều hướng về màn hình đăng nhập 
      router.replace('./auth/index');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoading,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook để sử dụng context
export const useAuth = () => useContext(AuthContext);

export default AuthContext;