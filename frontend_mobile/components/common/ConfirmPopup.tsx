/**
 * ConfirmPopup.tsx
 * 
 * Component hiển thị popup xác nhận hành động của người dùng.
 * - Cung cấp giao diện xác nhận với 2 nút: xác nhận và hủy
 * - Hỗ trợ chế độ destructive cho các hành động nguy hiểm (như xóa dữ liệu)
 * - Cho phép tùy chỉnh nội dung text các nút
 * - Sử dụng PopupBackgroundContainer để tạo hiệu ứng overlay mờ
 * - Thiết kế phù hợp với theme sáng/tối của ứng dụng
 */
import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import PopupBackgroundContainer from './PopupBackgroundContainer';

interface ConfirmPopupProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDestructive?: boolean;
  overlayOpacity?: number;
}

const ConfirmPopup: React.FC<ConfirmPopupProps> = ({
  visible,
  title,
  message,
  confirmText = 'Xác nhận',
  cancelText = 'Huỷ',
  onConfirm,
  onCancel,
  isDestructive = false,
  overlayOpacity = 0.5
}) => {
  const { theme } = useTheme();

  // Sử dụng kiểu dark text vì chúng ta luôn có background image
  const textColor = theme.dark ? '#FFFFFF' : '#FFFFFF';
  const textSecondaryColor = theme.dark ? '#EEEEEE' : '#EEEEEE';
  
  return (
    <PopupBackgroundContainer
      visible={visible}
      onClose={onCancel}
      backgroundImage={require('../../assets/images/background.jpg')}
      useBackgroundImage={true}
      overlayOpacity={overlayOpacity}
      maxWidth={350}
    >
      {/* Title */}
      <Text style={[
        styles.title, 
        { color: textColor }
      ]}>
        {title}
      </Text>

      {/* Message */}
      <Text style={[
        styles.message, 
        { color: textSecondaryColor }
      ]}>
        {message}
      </Text>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[
            styles.button, 
            styles.cancelButton,
            { 
              borderColor: '#FFFFFF',
              backgroundColor: 'rgba(0,0,0,0.3)'
            }
          ]} 
          onPress={onCancel}
        >
          <Text style={[
            styles.buttonText, 
            { color: '#FFFFFF' }
          ]}>
            {cancelText}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[
            styles.button, 
            styles.confirmButton, 
            { backgroundColor: isDestructive ? '#ff6b6b' : theme.colors.primary }
          ]} 
          onPress={onConfirm}
        >
          <Text style={styles.confirmButtonText}>
            {confirmText}
          </Text>
        </TouchableOpacity>
      </View>
    </PopupBackgroundContainer>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    marginRight: 10,
    borderWidth: 1,
  },
  confirmButton: {
    marginLeft: 10,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ConfirmPopup;
