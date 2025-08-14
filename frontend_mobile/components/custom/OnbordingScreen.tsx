/**
 * OnbordingScreen.tsx
 * 
 * Component hiển thị màn hình hướng dẫn sử dụng cho người dùng lần đầu.
 * - Giới thiệu các tính năng chính của ứng dụng
 * - Hướng dẫn cách sử dụng
 * - Hiển thị sau SplashScreen và trước khi vào màn hình chính
 * - Chỉ hiển thị một lần khi người dùng mới cài đặt ứng dụng
 */
import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
interface OnboardingScreenProps {
  onFinish: () => void | Promise<void>;
}

const OnbordingScreen = ({ onFinish }: OnboardingScreenProps) => {
  return (
    <View>
      <Text>OnbordingScreen</Text>
    </View>
  )
}

export default OnbordingScreen

const styles = StyleSheet.create({})