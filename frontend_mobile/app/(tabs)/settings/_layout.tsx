import React from 'react';
import { Stack } from 'expo-router';
import { useTheme } from '../../../context/ThemeContext';

export default function AuthLayout() {
  const { theme } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: theme.colors.background,
        },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Cài đặt',
        }}
      />
      <Stack.Screen
        name="edit-profile"
        options={{
          title: 'Chỉnh sửa hồ sơ',
        }}
      />
      <Stack.Screen
        name="change-language"
        options={{
          title: 'Đổi ngôn ngữ',
        }}
      />
      <Stack.Screen
        name="reset-password"
        options={{
          title: 'Đặt lại mật khẩu',
        }}
      />
      <Stack.Screen
        name="notification-settings"
        options={{
          title: 'Cài đặt thông báo',
        }}
      />
      <Stack.Screen
        name="information"
        options={{
          title: 'Thông tin',
        }}
      />
    </Stack>
  );
}
