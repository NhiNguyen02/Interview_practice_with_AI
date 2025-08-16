import React from 'react';
import { View, ViewProps } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export type ThemedViewProps = ViewProps & {
  darkColor?: string;
  lightColor?: string;
  colorName?: string; // optional color name from theme (background, card, etc.)
};

export default function ThemedView(props: ThemedViewProps) {
  const { style, lightColor, darkColor, colorName = 'background', ...otherProps } = props;
  const { theme } = useTheme();

  // Get color from props or from theme
  const getThemeColor = () => {
    if (theme.dark && darkColor) return darkColor;
    if (!theme.dark && lightColor) return lightColor;
    
    // Use specified color from theme
    return theme.colors[colorName as keyof typeof theme.colors] || theme.colors.background;
  };

  const backgroundColor = getThemeColor();

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}

