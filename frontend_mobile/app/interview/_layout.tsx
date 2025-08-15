import React from 'react';
import { Stack } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';

export default function InterviewLayout() {
  const { theme } = useTheme();

  return (
    <Stack
      screenOptions={{
        contentStyle: {
          backgroundColor: theme.colors.background,
        },
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Phỏng vấn',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="setup"
        options={{
          title: 'Thiết lập thông tin',
        }}
      />
      <Stack.Screen
        name="chat"
        options={{
          title: 'Chat với AI',
        }}
      /> 
      <Stack.Screen
        name="voice"
        options={{
          title: 'Phỏng vấn với AI',
        }}
      />
      <Stack.Screen
        name="result"
        options={{
          title: 'Kết quả phỏng vấn',
        }}
      />
    </Stack>
  );
}
