import React, { useState } from 'react'
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import BackgroundContainer from '@/components/common/BackgroundContainer';
import Ionicons from '@expo/vector-icons/Ionicons';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { router } from 'expo-router';
const EmailVerification = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);

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
                        style={styles.otpInput}
                        keyboardType="numeric"
                        maxLength={1}
                        value={c}
                        onChangeText={(text) => {
                        let newCode = [...code];
                        newCode[i] = text;
                        setCode(newCode);
                        }}
                    />
                    ))}
                </View>

                <TouchableOpacity style={styles.button} onPress={() => router.push('/(auth)/resetPassword')}>
                    <Text style={styles.buttonText}>Xác thực</Text>
                </TouchableOpacity>

            </View>
            <Text style={styles.resendText}>
                Không nhận được mã?{" "}
            </Text>
            
            <Text style={{ color: "#4dd0e1" }}>Gửi mã lại sau 00:45</Text>
        </View>
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
