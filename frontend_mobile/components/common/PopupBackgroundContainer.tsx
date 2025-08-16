import React from 'react';
import { 
  View, 
  StyleSheet, 
  Modal, 
  TouchableWithoutFeedback, 
  ImageBackground, 
  ImageSourcePropType,
  StyleProp,
  ViewStyle,
  Dimensions
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';

const { height } = Dimensions.get('window');

interface PopupBackgroundContainerProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  backgroundImage?: ImageSourcePropType;
  useBackgroundImage?: boolean;
  overlayOpacity?: number;
  containerStyle?: StyleProp<ViewStyle>;
  maxWidth?: number;
  maxHeight?: number;
  centerContent?: boolean;
  disableTouchOutside?: boolean;
}

/**
 * PopupBackgroundContainer.tsx
 * 
 * Container có thể tái sử dụng cho tất cả các popup với nền tùy chỉnh.
 * - Tạo popup modal với overlay mờ và animation
 * - Hỗ trợ hình nền tùy chỉnh cho popup
 * - Cho phép đóng popup khi tap bên ngoài vùng nội dung
 * - Hỗ trợ tùy chỉnh kích thước, kiểu, độ mờ của overlay
 * - Đóng vai trò là base component cho các loại popup khác (InfoPopup, ConfirmPopup, WarningPopup...)
 * 
 * @param visible - Điều khiển hiển thị/ẩn popup
 * @param onClose - Hàm được gọi khi click bên ngoài popup
 * @param children - Nội dung hiển thị bên trong popup
 * @param backgroundImage - Hình ảnh nền cho popup (tuỳ chọn)
 * @param useBackgroundImage - Có sử dụng hình nền hay không (mặc định: false)
 * @param overlayOpacity - Độ mờ của overlay phía sau popup (mặc định: 0.5)
 * @param containerStyle - Style bổ sung cho container popup
 * @param maxWidth - Chiều rộng tối đa của popup (mặc định: 380)
 * @param maxHeight - Chiều cao tối đa của popup (mặc định: height * 0.7)
 * @param centerContent - Căn giữa nội dung trong popup hay không (mặc định: true)
 * @param disableTouchOutside - Khi true, không đóng popup khi click bên ngoài (mặc định: false)
 */
const PopupBackgroundContainer: React.FC<PopupBackgroundContainerProps> = ({
  visible,
  onClose,
  children,
  backgroundImage,
  useBackgroundImage = false,
  overlayOpacity = 0.5,
  containerStyle,
  maxWidth = 380,
  maxHeight = height * 0.7,
  centerContent = true,
  disableTouchOutside = false
}) => {
  const { theme } = useTheme();
  const useImageBg = useBackgroundImage && backgroundImage;
  
  // Handle backdrop press
  const handleBackdropPress = () => {
    if (!disableTouchOutside) {
      onClose();
    }
  };

  // Common content styles based on props
  const contentContainerStyle = [
    styles.contentContainer,
    centerContent && styles.centerContent,
    { maxHeight }
  ];

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={handleBackdropPress}>
        <View style={[
          styles.overlay,
          { backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})` }
        ]}>
          <TouchableWithoutFeedback>
            {useImageBg ? (
              <ImageBackground 
                source={backgroundImage!}
                resizeMode="cover"
                style={[
                  styles.container,
                  { maxWidth },
                  containerStyle,
                  theme.shadows.medium
                ]}
                imageStyle={styles.imageStyle}
              >
                {/* Semi-transparent overlay for better content visibility */}
                <View style={[
                  StyleSheet.absoluteFillObject,
                  styles.imageOverlay,
                  { backgroundColor: theme.dark ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.7)' }
                ]} />
                
                <View style={contentContainerStyle}>
                  {children}
                </View>
              </ImageBackground>
            ) : (
              <View style={[
                styles.container,
                { 
                  maxWidth,
                  backgroundColor: theme.dark ? '#1E1E1E' : '#FFFFFF'
                },
                containerStyle,
                theme.shadows.medium
              ]}>
                <View style={contentContainerStyle}>
                  {children}
                </View>
              </View>
            )}
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  imageStyle: {
    borderRadius: 12,
  },
  imageOverlay: {
    borderRadius: 12,
  },
  contentContainer: {
    padding: 20,
    width: '100%',
  },
  centerContent: {
    alignItems: 'center',
  }
});

export default PopupBackgroundContainer;
