import React, { useEffect, useRef, useState } from 'react'
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native'
import BackgroundContainer from '@/components/common/BackgroundContainer';
import Ionicons from '@expo/vector-icons/Ionicons';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { router, useLocalSearchParams } from 'expo-router';
import InfoPopup from '@/components/common/InfoPopup';
import { verifyResetToken, forgotPassword } from '@/services/authService';
const EmailVerification = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef<Array<TextInput | null>>([]);
  const { email } = useLocalSearchParams<{ email?: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [warningTitle, setWarningTitle] = useState('');
  const [warningMessage, setWarningMessage] = useState('');
  const [secondsLeft, setSecondsLeft] = useState<number>(180);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const showWarningPopup = (title: string, message: string) => {
    setWarningTitle(title);
    setWarningMessage(message);
    setShowWarning(true);
  };

  const focusInput = (index: number) => {
    if (index >= 0 && index < inputsRef.current.length) {
      inputsRef.current[index]?.focus();
    }
  };

  const handleChange = (index: number, text: string) => {
    const digits = text.replace(/\D/g, '');
    const newCode = [...code];

    if (digits.length <= 1) {
      newCode[index] = digits;
      setCode(newCode);
      if (digits.length === 1) {
        focusInput(index + 1);
      }
      return;
    }

    let i = index;
    for (const d of digits) {
      if (i >= newCode.length) break;
      newCode[i] = d;
      i++;
    }
    setCode(newCode);
    focusInput(Math.min(i, newCode.length - 1));
  };

  const handleKeyPress = (index: number, key: string) => {
    if (key === 'Backspace') {
      if (code[index]) {
        const newCode = [...code];
        newCode[index] = '';
        setCode(newCode);
        return;
      }
      focusInput(index - 1);
    }
  };

  // Start 3-minute countdown for resend
  useEffect(() => {
    if (secondsLeft <= 0) return;
    timerRef.current = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000) as unknown as NodeJS.Timeout;
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [secondsLeft]);

  const formatMMSS = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <BackgroundContainer>
        <TouchableOpacity style={{paddingLeft:10, paddingTop:10}} onPress={() => {router.back()}}>
            <IconSymbol name='chevron.left' size={30} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.container}>
            <View style={styles.iconWrapper}>
                <Ionicons name="mail-outline" size={50} color="#FFFFFF" />
            </View>
            <Text style={styles.title}>Xác thực Email</Text>
            <Text style={styles.subtitle}>Nhập mã xác thực đã được gửi đến email của bạn</Text>
            <View style={styles.formContainer}>
                <Text style={styles.inputLabel}>Mã xác thực</Text>
                {/* OTP */}
                <View style={styles.otpContainer}>
                  {code.map((c, i) => (
                    <TextInput
                      key={i}
                      ref={(el) => (inputsRef.current[i] = el)}
                      style={styles.otpInput}
                      keyboardType="number-pad"
                      maxLength={1}
                      value={c}
                      onChangeText={(text) => handleChange(i, text)}
                      onKeyPress={({ nativeEvent }) => handleKeyPress(i, nativeEvent.key)}
                      returnKeyType={i === code.length - 1 ? 'done' : 'next'}
                    />
                  ))}
                </View>

                <TouchableOpacity
                  style={styles.button}
                  disabled={isSubmitting}
                  onPress={async () => {
                    const token = code.join("");
                    if (!email || token.length !== 6 || /\D/.test(token)) {
                      showWarningPopup('Lỗi', 'Vui lòng nhập đủ 6 số hợp lệ');
                      return;
                    }
                    try {
                      setIsSubmitting(true);
                      await verifyResetToken({ email: String(email), token });
                      router.push({ pathname: '/(auth)/resetPassword', params: { email: String(email), token } });
                    } catch (e: any) {
                      showWarningPopup('Lỗi', e?.message || 'Mã xác thực không hợp lệ hoặc đã hết hạn');
                    } finally {
                      setIsSubmitting(false);
                    }
                  }}>
                  {isSubmitting ? (
                    <ActivityIndicator color="#000" />
                  ) : (
                    <Text style={styles.buttonText}>Xác thực</Text>
                  )}
                </TouchableOpacity>

            </View>
            <Text style={styles.resendText}>Không nhận được mã?</Text>
            {secondsLeft > 0 ? (
              <Text style={{ color: '#4dd0e1' }}>Gửi mã lại sau {formatMMSS(secondsLeft)}</Text>
            ) : (
              <TouchableOpacity
                onPress={async () => {
                  if (!email) {
                    showWarningPopup('Lỗi', 'Thiếu địa chỉ email');
                    return;
                  }
                  try {
                    await forgotPassword({ email: String(email) });
                    // reset timer and clear current OTP fields
                    setSecondsLeft(180);
                    setCode(["", "", "", "", "", ""]);
                    showWarningPopup('Thông báo', 'Đã gửi lại mã xác thực đến email của bạn.');
                  } catch (e: any) {
                    showWarningPopup('Lỗi', e?.message || 'Không thể gửi lại mã. Vui lòng thử lại.');
                  }
                }}
                activeOpacity={0.7}
              >
                <Text style={{ color: '#4dd0e1', fontWeight: '700' }}>Gửi lại mã</Text>
              </TouchableOpacity>
            )}
        </View>
      <InfoPopup
        visible={showWarning}
        title={warningTitle}
        message={warningMessage}
        onClose={() => setShowWarning(false)}
        type="warning"
      />
    </BackgroundContainer>
  );
}

export default EmailVerification
const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 25 },
  iconWrapper: { marginBottom: 20, 
    width: 100, height: 100, 
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center', },
  title: { fontSize: 24, fontWeight: "bold", color: "#fff" },
  subtitle: { fontSize: 14, color: "#ccc", marginBottom: 20, textAlign: "center" },
  formContainer: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    maxWidth: 400,
  },
  inputLabel: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 8,
    fontWeight: '500',
  },
  otpContainer: { flexDirection: "row", justifyContent: "center", marginBottom: 20 },
  otpInput: {
    width: 45, height: 50, backgroundColor: "rgba(255,255,255,0.2)",
    color: "#fff", margin: 5, textAlign: "center", fontSize: 20, borderRadius: 10,
  },
  button: {
    backgroundColor: "#4dd0e1", paddingVertical: 15,
    borderRadius: 10, marginTop: 10, width: "100%", alignItems: "center",
  },
  buttonText: { color: "#FFFFFF", fontWeight: "bold", fontSize: 16 },
  resendText: { marginTop: 15, color: "#ccc", fontSize: 14, textAlign: "center" },
});
