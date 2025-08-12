import { Button, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router';

const SettingsScreen = () => {
  const router = useRouter();

  return (
    <View>
      <Button title="Edit Profile" onPress={() => router.push('/(tabs)/settings/EditProfile')} />
    </View>
  );
}

export default SettingsScreen

const styles = StyleSheet.create({})