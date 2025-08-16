/**
 * LanguageContext.tsx
 * 
 * File này quản lý ngôn ngữ hiển thị của ứng dụng.
 * - Cho phép người dùng chọn và thay đổi ngôn ngữ
 * - Lưu trữ cài đặt ngôn ngữ vào bộ nhớ cục bộ (AsyncStorage)
 * - Hỗ trợ đa ngôn ngữ: Việt, Anh, Nhật, Hàn, Trung, Pháp, Đức, Tây Ban Nha, Ý, Nga
 * - Cung cấp hook useLanguage() để các component con có thể dễ dàng sử dụng và thay đổi ngôn ngữ
 */
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Các ngôn ngữ được hỗ trợ trong ứng dụng
export type SupportedLanguage = 'vi' | 'en' | 'ja' | 'ko' | 'zh' | 'fr' | 'de' | 'es' | 'it' | 'ru';

// Key để lưu trữ cài đặt ngôn ngữ trong AsyncStorage
const LANGUAGE_STORAGE_KEY = 'app_language';

// Định nghĩa kiểu dữ liệu cho LanguageContext
interface LanguageContextType {
  language: SupportedLanguage;  // Ngôn ngữ hiện tại đang được sử dụng
  changeLanguage: (language: SupportedLanguage) => Promise<void>;  // Hàm để thay đổi ngôn ngữ
}

// Tạo context với giá trị mặc định
const LanguageContext = createContext<LanguageContextType>({
  language: 'vi', // Mặc định là tiếng Việt
  changeLanguage: async () => {},
});

// Hook tùy chỉnh để các component khác có thể dễ dàng sử dụng ngôn ngữ
export const useLanguage = () => useContext(LanguageContext);

// Provider component - Bọc các component con và cung cấp ngôn ngữ cho chúng
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State quản lý ngôn ngữ hiện tại
  const [language, setLanguage] = useState<SupportedLanguage>('vi');
  
  // Tải ngôn ngữ từ lưu trữ cục bộ khi component được mount
  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
        if (savedLanguage) {
          setLanguage(savedLanguage as SupportedLanguage);
        }
      } catch (error) {
        console.error('Error loading language:', error);
      }
    };

    loadLanguage();
  }, []);

  // Hàm thay đổi ngôn ngữ và lưu vào AsyncStorage
  const changeLanguage = async (newLanguage: SupportedLanguage) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, newLanguage);
      setLanguage(newLanguage);
      
      // Ở đây bạn có thể thêm logic để thay đổi ngôn ngữ trong i18n library
      // Ví dụ: i18n.changeLanguage(newLanguage);
      
      console.log(`Language changed to ${newLanguage}`);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };
  
  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;
