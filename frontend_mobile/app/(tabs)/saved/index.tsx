import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../../context/ThemeContext';
import BackgroundContainer from '../../../components/common/BackgroundContainer';


export default function SavedScreen() {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  
  return (
    <BackgroundContainer withOverlay={false}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Đã lưu</Text>
      </View>

      {/* Search bar */}
      <View style={[styles.searchContainer, { backgroundColor: theme.colors.card }]}>
        <MaterialCommunityIcons name="magnify" size={22} color={theme.colors.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: theme.colors.text }]}
          placeholder="Tìm kiếm kịch bản phỏng vấn..."
          placeholderTextColor={theme.colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
  </BackgroundContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 90, // Thêm padding để tránh tabBar che phủ nội dung
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    height: 46,
    borderRadius: 23,
    marginHorizontal: 20,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    paddingLeft: 10,
    fontSize: 16,
  },
});