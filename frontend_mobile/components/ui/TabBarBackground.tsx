/**
 * TabBarBackground.tsx
 * 
 * Component xử lý nền của thanh tab điều hướng (tab bar) trong ứng dụng.
 * - Đây là một shim (thành phần giả) cho web và Android nơi tab bar thường không trong suốt
 * - Trên iOS, component này sẽ được thay thế bằng phiên bản native với hiệu ứng trong suốt/mờ
 * - Cung cấp hàm useBottomTabOverflow() để xử lý độ tràn của tab bar
 * - Giúp đảm bảo giao diện nhất quán giữa các nền tảng iOS, Android và web
 * - Hỗ trợ hiệu ứng blur/translucent trên iOS khi được sử dụng đúng cách
 */

// This is a shim for web and Android where the tab bar is generally opaque.
export default undefined;

export function useBottomTabOverflow() {
  return 0;
}
