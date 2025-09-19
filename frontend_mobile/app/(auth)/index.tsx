import { router } from 'expo-router';
import { useEffect } from 'react';

// Chuyển hướng từ /(auth) → /(auth)/login
export default function AuthIndex() {
  useEffect(() => {
    router.replace('/(auth)/login');
  }, []);
  return null;
}
