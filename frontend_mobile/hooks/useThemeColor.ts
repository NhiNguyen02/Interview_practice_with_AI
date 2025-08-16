import { useTheme } from '../context/ThemeContext';

/**
 * Custom hook để lấy màu dựa trên theme
 * @param colorName Tên của màu cần lấy từ theme
 * @param props Optional override colors cho light và dark mode
 * @returns Màu tương ứng với theme hiện tại
 */
export default function useThemeColor(
  colorName: string,
  props?: { light?: string; dark?: string }
) {
  const { theme } = useTheme();
  const isDarkMode = theme.dark;

  // Use prop color if provided, otherwise use theme color
  if (props) {
    const colorFromProps = isDarkMode ? props.dark : props.light;
    if (colorFromProps) {
      return colorFromProps;
    }
  }

  // Return theme color based on color name
  if (colorName in theme.colors) {
    return theme.colors[colorName as keyof typeof theme.colors];
  }
  
  // Fallback to text color
  return theme.colors.text;
}
