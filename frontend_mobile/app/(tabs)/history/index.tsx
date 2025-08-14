import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput,
  FlatList,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../../context/ThemeContext';
import { useRouter } from 'expo-router';
import BackgroundContainer from '../../../components/common/BackgroundContainer';
import EmptyHistoryState from '../../../components/ui/history/EmptyHistoryState';

// Định nghĩa type cho lịch sử phỏng vấn
type HistoryItem = {
  id: string;
  date: string;
  title: string;
  score: string;
};

// Mock data cho lịch sử phỏng vấn
const historyData: HistoryItem[] = [
  { id: '1', date: '10/08/2025', title: 'Phỏng vấn React Native', score: '8/10' },
  { id: '2', date: '05/08/2025', title: 'Phỏng vấn JavaScript', score: '7/10' },
  { id: '3', date: '01/08/2025', title: 'Phỏng vấn Frontend', score: '9/10' },
  { id: '4', date: '25/07/2025', title: 'Phỏng vấn UX/UI', score: '6/10' },
  { id: '5', date: '20/07/2025', title: 'Phỏng vấn Backend', score: '8/10' },
];

export default function HistoryScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Giả lập trạng thái không có dữ liệu
  // Đặt thành true để xem danh sách lịch sử, false để xem trạng thái trống
  const hasHistory = false;

  const renderHistoryItem = ({ item }: { item: HistoryItem }) => (
    <View style={[styles.historyItem, { backgroundColor: theme.colors.card }]}>
      <View>
        <Text style={[styles.historyTitle, { color: theme.colors.text }]}>{item.title}</Text>
        <Text style={[styles.historyDate, { color: theme.colors.textSecondary }]}>{item.date}</Text>
      </View>
      <Text style={[styles.historyScore, { color: theme.colors.primary }]}>{item.score}</Text>
    </View>
  );

  // Hàm xử lý khi bắt đầu phỏng vấn từ trạng thái trống
  const handleStartPractice = () => {
    router.push('./practice');
  };
  
  return (
    <BackgroundContainer withOverlay={false}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Lịch sử phỏng vấn</Text>
      </View>

      {/* Search bar */}
      <View style={[styles.searchContainer, { backgroundColor: theme.colors.card }]}>
        <MaterialCommunityIcons name="magnify" size={22} color={theme.colors.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: theme.colors.text }]}
          placeholder="Tìm kiếm lịch sử phỏng vấn..."
          placeholderTextColor={theme.colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      
      {hasHistory ? (
        <FlatList
          data={historyData}
          renderItem={renderHistoryItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyStateContainer}>
          <EmptyHistoryState onStartPractice={handleStartPractice} />
        </View>
      )}
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
    textAlign: 'center',
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
  // Styles cho phần danh sách lịch sử
  listContent: {
    padding: 16,
    paddingBottom: 90,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    marginHorizontal: 16,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  historyDate: {
    fontSize: 14,
  },
  historyScore: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
  }
});