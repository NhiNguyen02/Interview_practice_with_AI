/**
 * InfoPopup.tsx
 * 
 * Component hiển thị popup thông báo thông tin cho người dùng.
 * - Hiển thị thông báo với nhiều loại khác nhau: info, success, warning, error
 * - Tùy chỉnh được màu sắc, biểu tượng theo loại thông báo
 * - Cung cấp nút đóng và có thể đóng bằng cách tap bên ngoài popup
 * - Sử dụng PopupBackgroundContainer để tạo hiệu ứng overlay mờ
 * - Có animation hiển thị và ẩn đi mượt mà
 */
import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import PopupBackgroundContainer from './PopupBackgroundContainer';
import { IconWrapper } from './IconWrapper';

interface InfoPopupProps {
  visible: boolean;
  title: string;
  message: string;
  buttonText?: string;
  onClose: () => void;
  type?: 'info' | 'success' | 'warning' | 'error';
  overlayOpacity?: number;
}

const InfoPopup: React.FC<InfoPopupProps> = ({
  visible,
  title,
  message,
  buttonText = 'OK',
  onClose,
  type = 'info',
  overlayOpacity = 0.5
}) => {
  const { theme } = useTheme();
  
  // Sử dụng kiểu text sáng vì luôn có background image tối
  const textColor = '#FFFFFF';
  const textSecondaryColor = '#EEEEEE';
  
  // Determine icon and color based on type
  const getIconConfig = () => {
    switch (type) {
      case 'success':
        return { 
          name: 'checkmark-circle',
          color: '#10B981', // Green color for success
          backgroundColor: 'rgba(16, 185, 129, 0.1)'
        };
      case 'warning':
        return { 
          name: 'warning',
          color: '#F59E0B', // Amber color for warning
          backgroundColor: 'rgba(245, 158, 11, 0.1)'
        };
      case 'error':
        return { 
          name: 'close-circle',
          color: '#EF4444', // Red color for error
          backgroundColor: 'rgba(239, 68, 68, 0.1)'
        };
      default:
        return { 
          name: 'information-circle',
          color: '#3B82F6', // Blue color for info
          backgroundColor: 'rgba(59, 130, 246, 0.1)'
        };
    }
  };
  
  const iconConfig = getIconConfig();
  
  return (
    <PopupBackgroundContainer
      visible={visible}
      onClose={onClose}
      backgroundImage={require('../../assets/images/background.jpg')}
      useBackgroundImage={true}
      overlayOpacity={overlayOpacity}
      maxWidth={320}
    >
      {/* Icon */}
      <View style={[
        styles.iconContainer,
        { backgroundColor: iconConfig.backgroundColor }
      ]}>
        <IconWrapper 
          Component={Ionicons}
          name={iconConfig.name as any} 
          size={32} 
          color={iconConfig.color} 
        />
      </View>
      
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

      {/* Button */}
      <TouchableOpacity 
        style={[
          styles.button,
          { backgroundColor: theme.colors.primary }
        ]} 
        onPress={onClose}
      >
        <Text style={styles.buttonText}>
          {buttonText}
        </Text>
      </TouchableOpacity>
    </PopupBackgroundContainer>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
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
  button: {
    width: '100%',
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  }
});

export default InfoPopup;
