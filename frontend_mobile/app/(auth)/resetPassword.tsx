// ResetPasswordScreen.js
import BackgroundContainer from "@/components/common/BackgroundContainer";
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import { IconSymbol } from "@/components/ui/IconSymbol";
import { router } from "expo-router";


export default function ResetPasswordScreen() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <BackgroundContainer>
        <TouchableOpacity style={{paddingLeft:10, paddingTop:10}} onPress={() => {router.back()}}>
            <IconSymbol name='chevron.left' size={30} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.container}>
            <View style={styles.iconWrapper}>
                <Ionicons name="key-outline" size={50} color="#fff" />
            </View>
            <Text style={styles.title}>Đặt lại mật khẩu</Text>
            <Text style={styles.subtitle}>Nhập mật khẩu mới</Text>

            <View style={styles.formContainer}>
                {/* New Password */}
                <Text style={styles.inputLabel}>Nhập mật khẩu mới</Text>
                <View style={styles.inputWrapper}>
                    <TextInput
                    style={styles.input}
                    placeholder="Nhập mật khẩu mới"
                    placeholderTextColor="#ccc"
                    secureTextEntry={!showPassword}
                    value={newPassword}
                    onChangeText={setNewPassword}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={22} color="#ccc" />
                    </TouchableOpacity>
                </View>

                {/* Confirm Password */}
                <Text style={styles.inputLabel}>Nhập lại mật khẩu mới</Text>
                <View style={styles.inputWrapper}>
                    <TextInput
                    style={styles.input}
                    placeholder="Nhập lại mật khẩu mới"
                    placeholderTextColor="#ccc"
                    secureTextEntry={!showConfirmPassword}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    />
                    <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                    <Ionicons name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} size={22} color="#ccc" />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Đặt lại mật khẩu</Text>
                </TouchableOpacity>
            </View>
        </View>
    </BackgroundContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 25 },
  iconWrapper: { marginBottom: 20,
    width: 100, height: 100, 
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center', 
   },
  title: { fontSize: 24, fontWeight: "bold", color: "#fff" },
  subtitle: { fontSize: 14, color: "#ccc", marginBottom: 20 },
   formContainer: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    maxWidth: 400,
  },
  otpContainer: { flexDirection: "row", justifyContent: "center", marginBottom: 20 },
  otpInput: {
    width: 40, height: 50, backgroundColor: "rgba(255,255,255,0.2)",
    color: "#fff", margin: 5, textAlign: "center", fontSize: 20, borderRadius: 10,
  },
  inputLabel: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 8,
    fontWeight: '500',
  },
  inputWrapper: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 10,
    paddingHorizontal: 10, marginBottom: 15, width: "100%",
  },
  input: { flex: 1, color: "#fff", height: 50 },
  button: {
    backgroundColor: "#4dd0e1", paddingVertical: 15,
    borderRadius: 10, marginTop: 10, width: "100%", alignItems: "center",
  },
  buttonText: { color: "#FFFFFF", fontWeight: "bold", fontSize: 16 },
});
