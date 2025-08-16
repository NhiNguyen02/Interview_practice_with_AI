import React from 'react';
import { Stack } from 'expo-router';
import { useTheme } from '../../../context/ThemeContext';

export default function HistoryLayout() {
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
          title: 'Lịch sử phỏng vấn',
        }}
      />
      {/* <Stack.Screen
        name="practice"
        options={{
          title: 'Luyện tập phỏng vấn',
          presentation: 'modal',
        }}
      /> */}
      <Stack.Screen
        name="details/[id]"
        options={{
          title: 'Chi tiết phỏng vấn',
        }}
      />
      <Stack.Screen
        name="answer/[questionId]"
        options={{
          title: 'Chi tiết câu trả lời',
        }}
      />
    </Stack>
  );
}
