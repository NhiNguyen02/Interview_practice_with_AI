import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { useTheme } from '@/context/ThemeContext';
import BackgroundContainer from '@/components/common/BackgroundContainer';
import ConfirmPopup from '@/components/common/ConfirmPopup';

type Msg = {
  id: string;
  role: 'ai' | 'user';
  text: string;
};

export default function ChatScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { specialty } = useLocalSearchParams<{ specialty?: string }>();
  const title = specialty || 'Software Engineering';

  // mock hội thoại ban đầu
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: 'm1',
      role: 'ai',
      text:
        'Hãy mô tả kinh nghiệm của bạn với các phương pháp phát triển phần mềm Agile và cách bạn đã áp dụng chúng vào các dự án của mình.',
    },
    {
      id: 'm2',
      role: 'user',
      text:
        'Tôi đã sử dụng Scrum trong 2 năm gần đây, thường làm vai trò dev. Sprint 2 tuần, Daily 15 phút.',
    },
  ]);
  const [input, setInput] = useState('');
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const flatRef = useRef<FlatList<Msg>>(null);

  // đẩy tin và mô phỏng AI phản hồi
  const send = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    const me: Msg = { id: `${Date.now()}`, role: 'user', text: trimmed };
    setMessages((prev) => [...prev, me]);
    setInput('');
    // demo: AI reply ngắn
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-ai`,
          role: 'ai',
          text:
            'Cảm ơn bạn. Bạn có thể nêu ví dụ cụ thể về một sprint mà Agile giúp cải thiện chất lượng/tiến độ?',
        },
      ]);
      requestAnimationFrame(() => flatRef.current?.scrollToEnd({ animated: true }));
    }, 450);
    requestAnimationFrame(() => flatRef.current?.scrollToEnd({ animated: true }));
  };

  const renderItem = ({ item, index }: { item: Msg; index: number }) => {
    const isAI = item.role === 'ai';
    // const showActions = isAI && index === messages.length - 1; // hai nút tròn cạnh tin AI mới nhất
    return (
      <View style={[styles.row, isAI ? styles.left : styles.right]}>
        {isAI && (
          <View style={[styles.avatar, { backgroundColor: 'transparent' }]}>
            <Image 
              source={require('../../assets/images/robot.png')} 
              style={styles.avatarImage} 
              resizeMode="cover" 
            />
          </View>
        )}

        <LinearGradient
          colors={
            isAI
              ? ['rgba(86,0,255,0.55)', 'rgba(0,201,255,0.25)']
              : ['rgba(255,255,255,0.22)', 'rgba(255,255,255,0.12)']
          }
          start={{ x: 0.05, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.bubble, isAI ? styles.bubbleLeft : styles.bubbleRight]}
        >
          <Text style={[styles.text, { color: theme.colors.text }]}>{item.text}</Text>
        </LinearGradient>

        {!isAI && (
          <View style={[styles.avatar, { backgroundColor: 'transparent' }]}>
            <Image 
              source={require('../../assets/images/default-avatar.png')} 
              style={styles.avatarImage} 
              resizeMode="cover" 
            />
          </View>
        )}

        {/* nút nổi cạnh bong bóng AI (… và avatar) */}
        {/* {showActions && (
          <View style={styles.fabCol}>
            <TouchableOpacity style={styles.fabBtn} onPress={() => {}}>
              <MaterialCommunityIcons name="dots-horizontal" size={18} color="#00141A" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.fabBtn} onPress={() => {}}>
              <MaterialCommunityIcons name="account" size={18} color="#00141A" />
            </TouchableOpacity>
          </View>
        )} */}
      </View>
    );
  };

  return (
    <BackgroundContainer withOverlay={false}>
      <SafeAreaView />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={22} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]} numberOfLines={1}>
          {title}
        </Text>
        <TouchableOpacity style={styles.headerBtn} onPress={() => setShowEndConfirm(true)}>
          <MaterialCommunityIcons name="page-next-outline" size={20} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 12 : 0}
      >
        {/* Danh sách chat */}
        <FlatList
          ref={flatRef}
          data={messages}
          keyExtractor={(m) => m.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          onContentSizeChange={() => flatRef.current?.scrollToEnd({ animated: true })}
        />

        {/* Ô nhập */}
        <View style={styles.inputRow}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Nhập câu trả lời của bạn..."
            placeholderTextColor="rgba(255,255,255,0.7)"
            style={styles.input}
            multiline
          />
          <TouchableOpacity style={styles.sendBtn} onPress={send} activeOpacity={0.9}>
            <MaterialCommunityIcons name="send" size={36} color="#4ADEDE" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Popup xác nhận kết thúc cuộc phỏng vấn */}
      <ConfirmPopup
        visible={showEndConfirm}
        title="Kết thúc phỏng vấn"
        message="Bạn có chắc muốn kết thúc phỏng vấn và xem kết quả không?"
        confirmText="Xem kết quả"
        cancelText="Ở lại"
        onConfirm={() => {
          setShowEndConfirm(false);
          router.push('/interview/result');
        }}
        onCancel={() => setShowEndConfirm(false)}
      />
    </BackgroundContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(217, 217, 217, 0.15)',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  headerBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 16, fontWeight: '800' },

  listContent: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 12 },

  row: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 12 },
  left: { justifyContent: 'flex-start' },
  right: { justifyContent: 'flex-end' },

  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#7CF3FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 6,
    overflow: 'hidden', // Để đảm bảo hình ảnh không tràn ra ngoài vùng bo tròn
  },
  avatarImage: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },

  bubble: {
    maxWidth: '72%',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  bubbleLeft: { borderTopLeftRadius: 8 },
  bubbleRight: { borderTopRightRadius: 8, backgroundColor: 'rgba(255,255,255,0.15)' },

  text: { fontSize: 14, lineHeight: 20 },

  fabCol: {
    marginLeft: 8,
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#7CF3FF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 10,
    paddingBottom: 16,
    gap: 8,
  },
  input: {
    flex: 1,
    minHeight: 50,
    maxHeight: 120,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: 'rgba(255,255,255,0.22)',
    color: '#FFFFFF',
  },
  sendBtn: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
