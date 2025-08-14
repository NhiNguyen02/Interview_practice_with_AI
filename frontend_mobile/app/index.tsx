import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

/**
 * Entry point của ứng dụng
 * - Kiểm tra trạng thái đăng nhập
 * - Điều hướng đến màn hình phù hợp
 */
export default function App() {
  const { isAuthenticated, isLoading } = useAuth();
  const { theme } = useTheme();

  // Hiển thị loading indicator khi đang kiểm tra
  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  // Điều hướng dựa trên trạng thái đăng nhập
  
  // 1. Nếu chưa đăng nhập, chuyển đến trang đăng nhập
  if (!isAuthenticated) {
    return <Redirect href="/auth/login" />;
  }
  
  // 2. Nếu đã đăng nhập, luôn chuyển đến tabs chính
  return <Redirect href="./(tabs)" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});