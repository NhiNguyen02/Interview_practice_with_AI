import { Button, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack, useRouter } from 'expo-router'

const SettingsLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen name="index" options={{ title: 'Settings' }} />
      <Stack.Screen
        name="edit-profile"
        options={{
          title: 'Edit Profile',
          // Ẩn tab bar cho màn này
          presentation: 'modal', // hoặc push
        }}
      />
    </Stack>
  );
}

export default SettingsLayout

const styles = StyleSheet.create({})