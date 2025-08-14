import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image,
  TouchableOpacity,
  StatusBar 
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../../context/ThemeContext';
import { useAuth } from '../../../context/AuthContext';
import BackgroundContainer from '../../../components/common/BackgroundContainer';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { user } = useAuth();
  const [greeting, setGreeting] = useState('Chào buổi sáng');
  
  // Cập nhật lời chào dựa vào thời gian trong ngày
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Chào buổi sáng');
    } else if (hour < 18) {
      setGreeting('Chào buổi chiều');
    } else {
      setGreeting('Chào buổi tối');
    }
  }, []);
  
  // Các phương thức xử lý
  const handleStartInterview = () => {
    router.push('/interview');
  };
  
  const handleViewHistory = () => {
    router.push('/(tabs)/history');
  };
  
  const handleViewProgress = () => {
    router.push('/(tabs)/progress');
  };
  
  return (
    <BackgroundContainer withOverlay={false}>
      <StatusBar barStyle="light-content" />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{greeting},</Text>
            <Text style={styles.userName}>{user?.username || 'Người dùng'}</Text>
          </View>
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => router.push('/(tabs)/settings')}
          >
            {user?.profilePicture ? (
              <Image 
                source={{ uri: user.profilePicture }}
                style={styles.profileImage} 
              />
            ) : (
              <Image 
                source={require('../../../assets/images/default-avatar.png')}
                style={styles.profileImage} 
              />
            )}
          </TouchableOpacity>
        </View>
        
        {/* Main Action Button - Interview Practice */}
        <TouchableOpacity 
          style={styles.mainActionButton}
          onPress={handleStartInterview}
        >
          <LinearGradient
            colors={['rgba(94, 231, 217, 0.8)', 'rgba(74, 211, 197, 0.9)']}
            style={styles.gradientButton}
          >
            <MaterialCommunityIcons name="microphone" size={24} color="#fff" />
            <Text style={styles.mainActionText}>Bắt đầu phỏng vấn</Text>
          </LinearGradient>
        </TouchableOpacity>
        
        {/* Stats Overview */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: theme.colors.card }]}>
            <View style={styles.statHeader}>
              <Text style={styles.statTitle}>Phỏng vấn đã hoàn thành</Text>
              <MaterialCommunityIcons name="check-circle" size={20} color="#5ee7d9" />
            </View>
            <Text style={styles.statValue}>12</Text>
            <TouchableOpacity style={styles.statLink} onPress={handleViewHistory}>
              <Text style={styles.statLinkText}>Xem lịch sử</Text>
              <MaterialCommunityIcons name="chevron-right" size={16} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
          
          <View style={[styles.statCard, { backgroundColor: theme.colors.card }]}>
            <View style={styles.statHeader}>
              <Text style={styles.statTitle}>Điểm trung bình</Text>
              <MaterialCommunityIcons name="star" size={20} color="#FFD700" />
            </View>
            <Text style={styles.statValue}>8.5</Text>
            <TouchableOpacity style={styles.statLink} onPress={handleViewProgress}>
              <Text style={styles.statLinkText}>Xem tiến độ</Text>
              <MaterialCommunityIcons name="chevron-right" size={16} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Recent Activity */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Hoạt động gần đây</Text>
            <TouchableOpacity onPress={handleViewHistory}>
              <Text style={styles.seeAllText}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>
          
          {/* Recent activity items */}
          <View style={[styles.activityItem, { backgroundColor: theme.colors.card }]}>
            <View style={styles.activityLeftContent}>
              <MaterialCommunityIcons name="file-document-outline" size={24} color={theme.colors.primary} />
              <View style={styles.activityTextContainer}>
                <Text style={styles.activityTitle}>Phỏng vấn React Native</Text>
                <Text style={styles.activityDate}>10/08/2025 - 15:30</Text>
              </View>
            </View>
            <Text style={styles.activityScore}>8/10</Text>
          </View>
          
          <View style={[styles.activityItem, { backgroundColor: theme.colors.card }]}>
            <View style={styles.activityLeftContent}>
              <MaterialCommunityIcons name="file-document-outline" size={24} color={theme.colors.primary} />
              <View style={styles.activityTextContainer}>
                <Text style={styles.activityTitle}>Phỏng vấn JavaScript</Text>
                <Text style={styles.activityDate}>05/08/2025 - 10:15</Text>
              </View>
            </View>
            <Text style={styles.activityScore}>7/10</Text>
          </View>
        </View>
        
        {/* Bottom spacing to avoid tab bar overlay */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </BackgroundContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
  },
  userName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileButton: {
    height: 48,
    width: 48,
    borderRadius: 24,
    backgroundColor: '#5ee7d9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    height: 48,
    width: 48,
    borderRadius: 24,
  },
  mainActionButton: {
    marginVertical: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  gradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
  },
  mainActionText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    width: '48%',
    borderRadius: 16,
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  statTitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    flex: 1,
  },
  statValue: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  statLink: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statLinkText: {
    color: '#5ee7d9',
    fontSize: 12,
    marginRight: 5,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  seeAllText: {
    color: '#5ee7d9',
    fontSize: 14,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  activityLeftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityTextContainer: {
    marginLeft: 12,
  },
  activityTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  activityDate: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
  },
  activityScore: {
    color: '#5ee7d9',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomSpacer: {
    height: 80, // Space to avoid tab bar overlay
  }
});
