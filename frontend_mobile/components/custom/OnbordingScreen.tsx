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