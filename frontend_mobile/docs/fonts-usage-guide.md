# Sử dụng Font Trong React Native với Expo

Dự án này đã được cấu hình để sử dụng font tùy chỉnh với Expo. Dưới đây là hướng dẫn cách sử dụng font trong ứng dụng của bạn.

## Cấu trúc Font

Font đã được cấu hình trong các file sau:

- `app/_layout.tsx`: Nơi tải font với useFonts hook của Expo
- `constants/theme.ts`: Định nghĩa các kiểu font và kích thước
- `utils/typography.ts`: Utility tạo style cho text
- `components/ui/CustomText.tsx`: Component Text tùy chỉnh sử dụng font từ theme

## Cách sử dụng Font

### Phương pháp 1: Sử dụng CustomText component

```jsx
import CustomText from '../components/ui/CustomText';

// Trong component của bạn:
<CustomText variant="titleLarge">Tiêu đề lớn</CustomText>
<CustomText variant="bodyMedium">Nội dung thường</CustomText>
<CustomText variant="button">Nút</CustomText>
```

### Phương pháp 2: Sử dụng TextStyles utility

```jsx
import { TextStyles } from '../utils/typography';
import { Text } from 'react-native';

// Trong component của bạn:
<Text style={TextStyles.titleLarge}>Tiêu đề lớn</Text>
<Text style={TextStyles.bodyMedium}>Nội dung thường</Text>
```

### Phương pháp 3: Sử dụng font trực tiếp từ theme (đang áp dụng)

```jsx
import { TYPOGRAPHY } from '../constants/theme';
import { Text } from 'react-native';

// Trong component của bạn:
<Text style={{ fontFamily: TYPOGRAPHY.fontFamilies.primary }}>Text thường</Text>
<Text style={{ fontFamily: TYPOGRAPHY.fontFamilies.primaryBold }}>Text đậm</Text>
```

## Font Types

Các kiểu font được hỗ trợ:

- `primary`: Font thường (Regular)
- `primaryBold`: Font đậm (Bold)
- `primaryItalic`: Font nghiêng (Italic)
- `primaryBoldItalic`: Font đậm và nghiêng (Bold Italic)

## Text Styles

CustomText component hỗ trợ các kiểu variant:

- `titleLarge`, `titleMedium`, `titleSmall`: Các kiểu tiêu đề
- `headingLarge`, `headingMedium`, `headingSmall`: Các kiểu đề mục
- `bodyLarge`, `bodyMedium`, `bodySmall`: Các kiểu văn bản thông thường
- `captionLarge`, `captionMedium`, `captionSmall`: Các kiểu chú thích
- `button`, `buttonSmall`: Kiểu text cho nút

## Thêm Font Mới

Để thêm font mới:

1. Đặt file font (.ttf hoặc .otf) vào thư mục `assets/fonts/`
2. Thêm font vào `useFonts` trong `app/_layout.tsx`:

```js
const [loaded] = useFonts({
  'NewFont-Regular': require('../assets/fonts/NewFont-Regular.ttf'),
  // Thêm các font khác...
});
```

3. Cập nhật `constants/theme.ts` để đưa font mới vào hệ thống:

```js
fontFamilies: {
  // Các font hiện có...
  newFont: 'NewFont-Regular',
}
```

## Component Demo

Xem cách sử dụng font tại component demo:
`components/examples/FontDemo.tsx`

---

© 2023 Interview Practice with AI. Tất cả bản quyền được bảo lưu.
