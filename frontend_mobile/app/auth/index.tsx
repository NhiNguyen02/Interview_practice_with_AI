import { Redirect } from 'expo-router';

// Chuyển hướng từ /auth đến /auth/login
export default function AuthIndex() {
  return <Redirect href="/auth/login" />;
}
