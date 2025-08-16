import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

type TextType = 'title' | 'heading' | 'subheading' | 'body' | 'caption' | 'button' | 'link';

export type ThemedTextProps = TextProps & {
  darkColor?: string;
  lightColor?: string;
  type?: TextType;
};

export function ThemedText(props: ThemedTextProps) {
  const { style, lightColor, darkColor, type = 'body', ...otherProps } = props;
  const { theme } = useTheme();

  const color = theme.dark
    ? darkColor || theme.colors.text
    : lightColor || theme.colors.text;

  // Use StyleSheet.create with a function call to avoid TypeScript errors
  const styles = StyleSheet.create({
    text: {
      color,
      ...getTextStyle(type),
    },
  });

  return <Text style={[styles.text, style]} {...otherProps} />;
}

// Helper function for getting text styles based on type
function getTextStyle(type: string) {
  switch (type) {
    case 'title':
      return {
        fontSize: 32,
        fontWeight: '700' as const,
      };
    case 'heading':
      return {
        fontSize: 24,
        fontWeight: '600' as const,
      };
    case 'subheading':
      return {
        fontSize: 20,
        fontWeight: '500' as const,
      };
    case 'body':
      return {
        fontSize: 16,
        fontWeight: '400' as const,
      };
    case 'caption':
      return {
        fontSize: 14,
        fontWeight: '400' as const,
      };
    case 'button':
      return {
        fontSize: 18,
        fontWeight: '500' as const,
      };
    case 'link':
      return {
        fontSize: 16,
        fontWeight: '500' as const,
        textDecorationLine: 'underline' as const,
      };
    default:
      return {
        fontSize: 16,
        fontWeight: '400' as const,
      };
  }
}
