/**
 * OptionModal.tsx
 * 
 * Component modal hiển thị danh sách các tùy chọn người dùng có thể chọn.
 * - Sử dụng PopupBackgroundContainer làm nền tảng
 * - Hiển thị danh sách các lựa chọn với icon (tùy chọn)
 * - Hỗ trợ phân nhóm các tùy chọn
 * - Tùy chọn header, title và footer
 * - Đóng modal khi chọn một tùy chọn (có thể cấu hình)
 */
import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  StyleProp,
  ViewStyle,
  TextStyle,
  ImageSourcePropType
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import PopupBackgroundContainer from './PopupBackgroundContainer';
import { useTheme } from '../../context/ThemeContext';

// Kiểu dữ liệu cho mỗi option
export interface OptionItem {
  id: string | number;
  label: string;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  iconColor?: string;
  disabled?: boolean;
  danger?: boolean; // Đánh dấu tùy chọn nguy hiểm (thường là màu đỏ)
  description?: string; // Mô tả thêm dưới label
}

// Kiểu dữ liệu cho nhóm option (có thể có hoặc không)
export interface OptionGroup {
  title?: string;
  items: OptionItem[];
}

interface OptionModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (item: OptionItem) => void;
  // Có thể cung cấp mảng các option hoặc mảng các nhóm option
  options: OptionItem[] | OptionGroup[];
  title?: string;
  closeAfterSelect?: boolean; // Đóng modal sau khi chọn
  headerComponent?: React.ReactNode; // Component tùy chỉnh ở header
  footerComponent?: React.ReactNode; // Component tùy chỉnh ở footer
  // Props truyền vào PopupBackgroundContainer
  backgroundImage?: ImageSourcePropType;
  useBackgroundImage?: boolean;
  overlayOpacity?: number;
  containerStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  optionStyle?: StyleProp<ViewStyle>;
  optionTextStyle?: StyleProp<TextStyle>;
  groupTitleStyle?: StyleProp<TextStyle>;
  // Mở rộng
  showIcons?: boolean; // Hiển thị icon (nếu có)
  closeIconName?: keyof typeof MaterialCommunityIcons.glyphMap; // Tên icon đóng
}

const OptionModal: React.FC<OptionModalProps> = ({
  visible,
  onClose,
  onSelect,
  options,
  title,
  closeAfterSelect = true,
  headerComponent,
  footerComponent,
  backgroundImage,
  useBackgroundImage = true,
  overlayOpacity = 0.5,
  containerStyle,
  titleStyle,
  optionStyle,
  optionTextStyle,
  groupTitleStyle,
  showIcons = true,
  closeIconName = 'close'
}) => {
  const { theme } = useTheme();
  
  // Hàm kiểm tra xem options là mảng OptionItem hay mảng OptionGroup
  const isGroupedOptions = (opts: OptionItem[] | OptionGroup[]): opts is OptionGroup[] => {
    return opts.length > 0 && 'items' in opts[0];
  };

  // Xử lý khi người dùng chọn một tùy chọn
  const handleSelect = (item: OptionItem) => {
    if (item.disabled) return;
    
    onSelect(item);
    if (closeAfterSelect) {
      onClose();
    }
  };

  // Sử dụng màu chữ sáng trên nền tối (tương tự như InfoPopup)
  const textColor = useBackgroundImage ? '#FFFFFF' : theme.colors.text;
  const textSecondaryColor = useBackgroundImage ? '#EEEEEE' : theme.colors.textSecondary;

  return (
    <PopupBackgroundContainer
      visible={visible}
      onClose={onClose}
      backgroundImage={backgroundImage || require('../../assets/images/backgroundPopup.jpg')}
      useBackgroundImage={useBackgroundImage}
      overlayOpacity={overlayOpacity}
      containerStyle={[{ maxWidth: 380, maxHeight: '80%' }, containerStyle]}
      centerContent={false}
    >
      {/* Header với title và nút đóng */}
      <View style={styles.header}>
        {title ? (
          <Text style={[
            styles.title, 
            { color: textColor },
            titleStyle
          ]}>
            {title}
          </Text>
        ) : null}
        
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <MaterialCommunityIcons 
            name={closeIconName} 
            size={22} 
            color={textColor} 
          />
        </TouchableOpacity>
      </View>

      {/* Header component tùy chỉnh (nếu có) */}
      {headerComponent}

      {/* Danh sách các tùy chọn */}
      <ScrollView style={styles.optionsContainer} showsVerticalScrollIndicator={false}>
        {isGroupedOptions(options) ? (
          // Render nhóm các tùy chọn
          options.map((group, groupIndex) => (
            <View key={`group-${groupIndex}`} style={styles.group}>
              {group.title ? (
                <Text style={[
                  styles.groupTitle,
                  { color: textColor },
                  groupTitleStyle
                ]}>
                  {group.title}
                </Text>
              ) : null}

              {group.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={`item-${item.id}`}
                  style={[
                    styles.option,
                    item.disabled && styles.disabledOption,
                    optionStyle
                  ]}
                  onPress={() => handleSelect(item)}
                  disabled={item.disabled}
                  activeOpacity={item.disabled ? 1 : 0.7}
                >
                  {showIcons && item.icon ? (
                    <MaterialCommunityIcons
                      name={item.icon}
                      size={22}
                      color={item.iconColor || (item.danger ? theme.colors.error : theme.colors.primary)}
                      style={styles.optionIcon}
                    />
                  ) : null}
                  
                  <View style={styles.optionTextContainer}>
                    <Text style={[
                      styles.optionText,
                      { color: item.disabled ? textSecondaryColor : 
                              item.danger ? theme.colors.error : textColor },
                      optionTextStyle
                    ]}>
                      {item.label}
                    </Text>
                    
                    {item.description ? (
                      <Text style={[
                        styles.optionDescription,
                        { color: item.disabled ? textSecondaryColor : textSecondaryColor }
                      ]}>
                        {item.description}
                      </Text>
                    ) : null}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ))
        ) : (
          // Render danh sách đơn giản các tùy chọn
          options.map((item) => (
            <TouchableOpacity
              key={`item-${item.id}`}
              style={[
                styles.option,
                item.disabled && styles.disabledOption,
                optionStyle
              ]}
              onPress={() => handleSelect(item)}
              disabled={item.disabled}
              activeOpacity={item.disabled ? 1 : 0.7}
            >
              {showIcons && item.icon ? (
                <MaterialCommunityIcons
                  name={item.icon}
                  size={22}
                  color={item.iconColor || (item.danger ? theme.colors.error : theme.colors.primary)}
                  style={styles.optionIcon}
                />
              ) : null}
              
              <View style={styles.optionTextContainer}>
                <Text style={[
                  styles.optionText,
                  { color: item.disabled ? textSecondaryColor : 
                          item.danger ? theme.colors.error : textColor },
                  optionTextStyle
                ]}>
                  {item.label}
                </Text>
                
                {item.description ? (
                  <Text style={[
                    styles.optionDescription,
                    { color: item.disabled ? textSecondaryColor : textSecondaryColor }
                  ]}>
                    {item.description}
                  </Text>
                ) : null}
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Footer component tùy chỉnh (nếu có) */}
      {footerComponent}
    </PopupBackgroundContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  optionsContainer: {
    width: '100%',
  },
  group: {
    marginBottom: 16,
  },
  groupTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 4,
  },
  disabledOption: {
    opacity: 0.6,
  },
  optionIcon: {
    marginRight: 12,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  optionDescription: {
    fontSize: 12,
    marginTop: 2,
  },
});

export default OptionModal;
