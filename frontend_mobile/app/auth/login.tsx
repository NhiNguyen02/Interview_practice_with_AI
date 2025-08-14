import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackgroundContainer from '../../components/common/BackgroundContainer';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signIn, isLoading } = useAuth();
  const { theme } = useTheme();

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Vui lòng nhập email và mật khẩu');
      return;
    }

    try {
      const success = await signIn(email, password);
      if (success) {
        // Đăng nhập thành công, điều hướng sẽ được xử lý bởi AuthContext
      } else {
        setError('Email hoặc mật khẩu không chính xác');
      }
    } catch (e) {
      setError('Có lỗi xảy ra khi đăng nhập');
      console.error(e);
    }
  };

  const handleForgotPassword = () => {
    // Điều hướng đến màn hình quên mật khẩu với đường dẫn tuyệt đối
    router.navigate('/auth/forgot-password');
  };

  const handleCreateAccount = () => {
    // Điều hướng đến màn hình đăng ký với đường dẫn tuyệt đối
    router.navigate('/auth/register');
  };

  return (
    <BackgroundContainer>
      <SafeAreaView style={styles.container}>
        <View style={styles.contentContainer}>
          <View style={styles.logoContainer}>
            <Image 
              source={require('../../assets/images/logo.jpg')} 
              style={styles.logo} 
              resizeMode="contain"
            />
            <Text style={[styles.appName, { color: theme.colors.primary }]}>
              PrepTalk
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
              AI Interview Practice
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
            
            {error ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : null}

            <TouchableOpacity
              style={[styles.loginButton, { backgroundColor: theme.colors.primary }]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.loginButtonText}>Đăng nhập</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.forgotPasswordButton}
              onPress={handleForgotPassword}
            >
              <Text style={[styles.forgotPasswordText, { color: theme.colors.primary }]}>
                Quên mật khẩu?
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footerContainer}>
            <Text style={[styles.noAccountText, { color: theme.colors.textSecondary }]}>
              Chưa có tài khoản?
            </Text>
            <TouchableOpacity onPress={handleCreateAccount}>
              <Text style={[styles.createAccountText, { color: theme.colors.primary }]}>
                Tạo tài khoản mới
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </BackgroundContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  logo: {
    width: 100,
    height: 100,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    marginTop: 8,
  },
  formContainer: {
    marginTop: 40,
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
    color: '#EF4444',
    marginBottom: 16,
    textAlign: 'center',
  },
  loginButton: {
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginTop: 8,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  forgotPasswordButton: {
    alignItems: 'center',
    marginTop: 16,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '600',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 40,
  },
  noAccountText: {
    fontSize: 14,
    marginRight: 8,
  },
  createAccountText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
