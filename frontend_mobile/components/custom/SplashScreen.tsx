// SplashScreen.tsx
import { StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import Animated, { useSharedValue, withTiming, withSpring, useAnimatedStyle } from 'react-native-reanimated';
import AppLayout from './AppLayout';

interface SplashScreenProps {
  onFinish: () => void;
  background: any; // ảnh đã preload
}

const SplashScreen = ({ onFinish, background }: SplashScreenProps) => {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 800 });
    scale.value = withSpring(1, { damping: 10 });

    const timer = setTimeout(onFinish, 2000);
    return () => clearTimeout(timer);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <AppLayout>
      <Animated.View style={[styles.container, animatedStyle]}>
        <Animated.Image
          source={require('../../assets/images/Logo_Icon.png')}
          style={[styles.logo, animatedStyle]}
          resizeMode="contain"
        />
        <Animated.Text style={[styles.title, animatedStyle]}>
          PrepTalk
        </Animated.Text>
        <Animated.Text style={[styles.des, animatedStyle]}>
          Interview Practice Application with {'\n'}
          Real-Time AI Voice Agent
        </Animated.Text>
      </Animated.View>
    </AppLayout>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%', gap:10 },
  logo: { width: 150, height: 150},
  title: { fontSize: 36,fontWeight:"bold", color: '#fff' },
  des:{
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  }
});
