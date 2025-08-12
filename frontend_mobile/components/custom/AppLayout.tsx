// components/AppLayout.tsx
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