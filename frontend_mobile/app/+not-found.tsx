import BackgroundContainer from '@/components/common/BackgroundContainer';
import { Link, Stack, router } from 'expo-router';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function NotFoundScreen() {
  // Hàm xử lý quay lại trang trước đó
  const handleGoBack = () => {
    router.back();
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Không tìm thấy trang', headerShown: false }} />
      <BackgroundContainer withOverlay={false}>
        <View style={styles.container}>
          <Text style={styles.title}>Không tìm thấy trang bạn đang tìm kiếm.</Text>
          
          {/* Nút quay lại trang trước */}
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <Ionicons name="arrow-back" size={24} color="#5ee7d9" />
            <Text style={styles.backButtonText}>Quay lại trang trước</Text>
          </TouchableOpacity>

          {/* Nút về trang chủ */}
          <Link href="/(tabs)/home" style={styles.link}>
            <Text style={styles.linkText}>Về trang chủ!</Text>
          </Link>
        </View>
      </BackgroundContainer>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 15,
    paddingVertical: 15,
    paddingHorizontal: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5ee7d9',
    marginLeft: 10,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
    paddingHorizontal: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  linkText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5ee7d9',
  },
});
