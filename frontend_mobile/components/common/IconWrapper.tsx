import React from 'react';
import { Text } from 'react-native';

/**
 * IconWrapper - Hỗ trợ hiển thị icon tránh lỗi "Text strings must be rendered within a <Text> component"
 * 
 * @param Component - Component icon (Ionicons, FontAwesome5, etc.)
 * @param name - Tên của icon
 * @param size - Kích thước icon
 * @param color - Màu sắc icon
 * @param style - Style bổ sung (nếu có)
 */
export const IconWrapper = ({ 
  Component, 
  name, 
  size, 
  color, 
  style 
}: { 
  Component: any; 
  name: any; 
  size: number; 
  color: string;
  style?: any;
}) => (
  <Text style={[{ color: 'transparent' }, style]}>
    <Component name={name} size={size} color={color} />
  </Text>
);

export default IconWrapper;
