import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import BackgroundContainer from '../../components/common/BackgroundContainer';
import { IconWrapper } from '../../components/common/IconWrapper';
import InfoPopup from '../../components/common/InfoPopup';
import { resetPassword as resetPasswordApi } from '@/services/authService';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { email, token } = useLocalSearchParams<{ email?: string; token?: string }>();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showWarning, setShowWarning] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [warningTitle, setWarningTitle] = useState('');
  const [warningMessage, setWarningMessage] = useState('');

  const showWarningPopup = (title: string, message: string) => {
    setWarningTitle(title);
    setWarningMessage(message);
    setShowWarning(true);
  };

  const handleReset = async () => {
    if (!email || !token) {
      showWarningPopup('Lỗi', 'Thiếu thông tin email hoặc mã xác thực');
      return;
    }
    if (!newPassword || !confirmPassword) {
      showWarningPopup('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
      return;
    }
    if (newPassword !== confirmPassword) {
      showWarningPopup('Lỗi', 'Mật khẩu xác nhận không khớp');
      return;
    }
    if (newPassword.length < 6) {
      showWarningPopup('Lỗi', 'Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }
    try {
      setIsSubmitting(true);
      await resetPasswordApi({ email: String(email), token: String(token), password: newPassword });
      setShowSuccess(true);
    } catch (error: any) {
      showWarningPopup('Lỗi', error?.message || 'Không thể đặt lại mật khẩu. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BackgroundContainer withOverlay={false}>
      <StatusBar barStyle="light-content" />

      <InfoPopup
        visible={showWarning}
        title={warningTitle}
        message={warningMessage}
        onClose={() => setShowWarning(false)}
        type="warning"
      />

      <InfoPopup
        visible={showSuccess}
        title="Thành công"
        message="Mật khẩu của bạn đã được đặt lại thành công!"
        onClose={() => {
          setShowSuccess(false);
          router.replace('/(auth)/login');
        }}
        type="success"
      />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>
            <View style={styles.header}>
              <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <IconWrapper Component={Ionicons} name="arrow-back" size={24} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Đặt lại mật khẩu</Text>
              <View style={styles.backButton} />
            </View>

            <View style={[styles.contentContainer, { paddingHorizontal: 24 }]}>
              <View style={styles.iconContainer}>
                <IconWrapper Component={Ionicons} name="refresh" size={30} color="#fff" />
              </View>
              <Text style={styles.title}>Tạo mật khẩu mới</Text>
              <Text style={styles.subtitle}>Nhập mật khẩu mới cho tài khoản {email || ''}</Text>

              <View style={styles.formContainer}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Mật khẩu mới</Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      placeholder="Nhập mật khẩu mới"
                      placeholderTextColor="rgba(255,255,255,0.5)"
                      secureTextEntry={!showNewPassword}
                      value={newPassword}
                      onChangeText={setNewPassword}
                    />
                    <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowNewPassword(!showNewPassword)}>
                      <IconWrapper Component={Ionicons} name={showNewPassword ? 'eye-off' : 'eye'} size={20} color="#fff" />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Xác nhận mật khẩu mới</Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      placeholder="Nhập lại mật khẩu mới"
                      placeholderTextColor="rgba(255,255,255,0.5)"
                      secureTextEntry={!showConfirmPassword}
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                    />
                    <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                      <IconWrapper Component={Ionicons} name={showConfirmPassword ? 'eye-off' : 'eye'} size={20} color="#fff" />
                    </TouchableOpacity>
                  </View>
                </View>

                <TouchableOpacity
                  style={[styles.resetButton, isSubmitting && styles.resetButtonDisabled]}
                  disabled={isSubmitting}
                  onPress={handleReset}
                >
                  {isSubmitting ? (
                    <ActivityIndicator color="#000" />
                  ) : (
                    <Text style={styles.resetButtonText}>Đặt lại mật khẩu</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </BackgroundContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: { flex: 1, justifyContent: 'flex-start' },
  header: {
    paddingTop: 12,
    paddingBottom: 12,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff', textAlign: 'center', flex: 1 },
  contentContainer: { alignItems: 'center' },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(94, 231, 217, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  subtitle: { fontSize: 16, color: 'rgba(255,255,255,0.7)', textAlign: 'center', marginBottom: 30 },
  formContainer: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    maxWidth: 420,
  },
  inputGroup: { marginBottom: 16 },
  inputLabel: { fontSize: 14, color: '#fff', marginBottom: 8, fontWeight: '500' },
  inputContainer: {
    flexDirection: 'row',
    height: 50,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  input: { flex: 1, color: '#fff', fontSize: 16 },
  eyeIcon: { paddingHorizontal: 8, height: 50, justifyContent: 'center' },
  resetButton: {
    height: 50,
    backgroundColor: '#5ee7d9',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  resetButtonDisabled: { opacity: 0.7 },
  resetButtonText: { color: '#000', fontSize: 16, fontWeight: '600' },
});

