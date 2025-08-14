import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackgroundContainer from '../../components/common/BackgroundContainer';

export default function RegisterScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { signUp, isLoading } = useAuth();
  const { theme } = useTheme();

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleRegister = async () => {
    // Reset error
    setError('');

    // Validate inputs
    if (!username || !email || !password || !confirmPassword) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (!validateEmail(email)) {
      setError('Email không hợp lệ');
      return;
    }

    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    try {
      const success = await signUp(email, password, username);
      if (success) {
        // Đăng ký thành công, điều hướng sẽ được xử lý bởi AuthContext
      } else {
        setError('Có lỗi xảy ra khi đăng ký');
      }
    } catch (e) {
      setError('Có lỗi xảy ra khi đăng ký');
      console.error(e);
    }
  };

  const goToLogin = () => {
    router.replace('/auth/login');
  };

  return (
    <BackgroundContainer>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.contentContainer}>
            <View style={styles.headerContainer}>
              <TouchableOpacity 
                style={styles.backButton}
                onPress={goToLogin}
              >
                <Text style={[styles.backButtonText, { color: theme.colors.primary }]}>
                  ← Quay lại
                </Text>
              </TouchableOpacity>
              <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
                Tạo tài khoản
              </Text>
            </View>

            <View style={styles.formContainer}>
              <TextInput
                style={[
                  styles.input, 
                  { 
                    backgroundColor: theme.colors.background,
                    borderColor: theme.colors.primary,
                    color: theme.colors.text
                  }
                ]}
                placeholder="Tên người dùng"
                placeholderTextColor={theme.colors.textSecondary}
                onChangeText={setUsername}
                value={username}
                autoCapitalize="none"
              />
              
              <TextInput
                style={[
                  styles.input, 
                  { 
                    backgroundColor: theme.colors.background,
                    borderColor: theme.colors.primary,
                    color: theme.colors.text
                  }
                ]}
                placeholder="Email"
                placeholderTextColor={theme.colors.textSecondary}
                onChangeText={setEmail}
                value={email}
                autoCapitalize="none"
                keyboardType="email-address"
              />
              
              <TextInput
                style={[
                  styles.input, 
                  { 
                    backgroundColor: theme.colors.background,
                    borderColor: theme.colors.primary,
                    color: theme.colors.text
                  }
                ]}
                placeholder="Mật khẩu"
                placeholderTextColor={theme.colors.textSecondary}
                onChangeText={setPassword}
                value={password}
                secureTextEntry
              />
              
              <TextInput
                style={[
                  styles.input, 
                  { 
                    backgroundColor: theme.colors.background,
                    borderColor: theme.colors.primary,
                    color: theme.colors.text
                  }
                ]}
                placeholder="Xác nhận mật khẩu"
                placeholderTextColor={theme.colors.textSecondary}
                onChangeText={setConfirmPassword}
                value={confirmPassword}
                secureTextEntry
              />
              
              {error ? (
                <Text style={[styles.errorText, { color: theme.colors.error }]}>
                  {error}
                </Text>
              ) : null}

              <TouchableOpacity
                style={[styles.registerButton, { backgroundColor: theme.colors.primary }]}
                onPress={handleRegister}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.registerButtonText}>Đăng ký</Text>
                )}
              </TouchableOpacity>

              <View style={styles.termsContainer}>
                <Text style={[styles.termsText, { color: theme.colors.textSecondary }]}>
                  Bằng cách đăng ký, bạn đồng ý với {' '}
                  <Text style={[styles.termsLink, { color: theme.colors.primary }]}>
                    Điều khoản sử dụng
                  </Text>
                  {' '} và {' '}
                  <Text style={[styles.termsLink, { color: theme.colors.primary }]}>
                    Chính sách bảo mật
                  </Text>
                  {' '} của chúng tôi.
                </Text>
              </View>
            </View>

            <View style={styles.footerContainer}>
              <Text style={[styles.hasAccountText, { color: theme.colors.textSecondary }]}>
                Đã có tài khoản?
              </Text>
              <TouchableOpacity onPress={goToLogin}>
                <Text style={[styles.loginText, { color: theme.colors.primary }]}>
                  Đăng nhập
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </BackgroundContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  headerContainer: {
    marginBottom: 30,
  },
  backButton: {
    marginBottom: 16,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  input: {
    height: 56,
    marginBottom: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 12,
    fontSize: 16,
  },
  errorText: {
    marginBottom: 16,
    textAlign: 'center',
  },
  registerButton: {
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginTop: 8,
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  termsContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  termsText: {
    fontSize: 12,
    textAlign: 'center',
  },
  termsLink: {
    fontWeight: '600',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 40,
  },
  hasAccountText: {
    fontSize: 14,
    marginRight: 8,
  },
  loginText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
