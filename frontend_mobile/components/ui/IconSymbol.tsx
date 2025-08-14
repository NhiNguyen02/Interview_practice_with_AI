/**
 * IconSymbol.tsx
 * 
 * Component biểu diễn biểu tượng (icon) đa nền tảng trong ứng dụng.
 * - Sử dụng SF Symbols trên iOS và MaterialIcons trên Android/Web
 * - Cung cấp trải nghiệm nhất quán trên các nền tảng khác nhau
 * - Tối ưu hóa việc sử dụng tài nguyên hệ thống
 * - Cho phép ánh xạ từ tên SF Symbols sang tên MaterialIcons tương ứng
 * - Hỗ trợ tùy chỉnh kích thước, màu sắc và style
 */

// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight, SymbolViewProps } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  // Thêm mapping cho các biểu tượng trong tab bar
  'chart.bar.fill': 'bar-chart',
  'clock.fill': 'history',
  'bookmark.fill': 'bookmark',
  'gear': 'settings',
} as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
