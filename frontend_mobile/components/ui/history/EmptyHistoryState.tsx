import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

interface EmptyHistoryStateProps {
  onStartPractice?: () => void;
}

const EmptyHistoryState: React.FC<EmptyHistoryStateProps> = ({ onStartPractice }) => {
  const { theme } = useTheme();
  const router = useRouter();

  const handleStartPractice = () => {
    if (onStartPractice) {
      onStartPractice();
    } else {
      // Điều hướng đến màn hình luyện tập
      router.push('./(tabs)/practice');
    }
  };

  return (
    <View style={styles.container}>
      {/* Hình ảnh minh họa */}
      <Image 
        source={require('../../../assets/images/empty-history.png')} 
        style={styles.image}
        resizeMode="contain"
      />

      {/* Tiêu đề */}
      <Text style={[styles.title, { color: theme.colors.text }]}>
        Chưa có lịch sử phỏng vấn
      </Text>

      {/* Thông điệp */}
      <Text style={[styles.message, { color: theme.colors.textSecondary }]}>
        Hãy bắt đầu phiên luyện tập đầu tiên 
        để xem bạn tiến bộ như thế nào theo
        thời gian!
      </Text>

      {/* Nút bắt đầu phỏng vấn */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#5ee7d9' }]}
        onPress={handleStartPractice}
      >
        <Ionicons name="play" size={18} color="#fff" />
        <Text style={styles.buttonText}>
          Bắt đầu phiên phỏng vấn đầu tiên
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  image: {
    width: 180,
    height: 180,
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  }
});

export default EmptyHistoryState;
