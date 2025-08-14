/**
 * AppLayout.tsx
 * 
 * Component layout cơ bản cho các màn hình trong ứng dụng.
 * - Tạo giao diện nền nhất quán với hình nền đẹp mắt
 * - Cung cấp container chung cho nội dung các màn hình
 * - Giúp giữ tính đồng nhất trong thiết kế UI của ứng dụng
 * - Được sử dụng bởi các màn hình khác như SplashScreen, OnboardingScreen
 */
import { ImageBackground, StyleSheet, View } from 'react-native';
import React from 'react';

 function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ImageBackground
      source={require('../../assets/images/background.png')}
      style={styles.bg}
      resizeMode="cover"
    >
      <View style={styles.container}>{children}</View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    width: '100%',
    height: '100%', },
  container: { flex: 1}
});

export default AppLayout;