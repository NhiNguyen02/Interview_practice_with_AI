import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import BackgroundContainer from '@/components/common/BackgroundContainer';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

function Bullet({ text }: { text: string }) {
  return (
    <View style={styles.bulletRow}>
      <MaterialCommunityIcons name="check-circle-outline" size={18} color="#7CF3FF" />
      <Text style={styles.bulletText}>{text}</Text>
    </View>
  );
}

function ModeCard({
  title,
  iconName,
  description,
  bullets,
  buttonText,
  onPress,
}: {
  title: string;
  iconName: keyof typeof MaterialCommunityIcons.glyphMap;
  description: string;
  bullets: string[];
  buttonText: string;
  onPress: () => void;
}) {
  return (
    <View style={[styles.card, styles.cardBorder]}>
      <View style={styles.cardIconWrap}>
        <View style={styles.iconCircle}>
          <MaterialCommunityIcons name={iconName} size={42} color="#fff" />
        </View>
      </View>

      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardDesc}>{description}</Text>

      <View style={{ marginTop: 8 }}>
        {bullets.map((b, i) => (
          <Bullet text={b} key={`${title}-${i}`} />
        ))}
      </View>

      <TouchableOpacity style={styles.primaryBtn} onPress={onPress} activeOpacity={0.9}>
        <Text style={styles.primaryBtnText}>{buttonText}</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function InterviewScreen() {
  const { theme } = useTheme();
  const router = useRouter();

  return (
    <BackgroundContainer withOverlay={false}>
      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={22} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Chế độ phỏng vấn</Text>
        <TouchableOpacity style={styles.headerBtn}>
          <MaterialCommunityIcons name="dots-horizontal" size={22} color={theme.colors.text} />
        </TouchableOpacity>
      </View>
      
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        <Text style={[styles.pageTitle, { color: theme.colors.text }]}>Chọn chế độ luyện tập</Text>

        {/* Card 1: Chat với AI */}
        <ModeCard
          title="Chat với AI"
          iconName="wechat"
          description="Luyện tập với các câu hỏi cơ bản, nhận phản hồi chi tiết và cải thiện từng kỹ năng một cách dễ hiểu."
          bullets={[
            'Phản hồi chi tiết',
            'Không giới hạn thời gian',
            'Luyện theo chủ đề',
          ]}
          buttonText="Bắt đầu luyện tập"
          // Mode "Chat với AI"
          onPress={() => router.push({ pathname: '/interview/setup', params: { mode: 'chat' } })}

        />

        {/* Card 2: Phỏng vấn với AI */}
        <ModeCard
          title="Phỏng vấn với AI"
          iconName="robot-happy-outline"
          description="Trải nghiệm phỏng vấn thực tế với AI thông minh và câu hỏi linh hoạt."
          bullets={[
            'Phỏng vấn thời gian thực',
            'Câu hỏi linh hoạt',
            'Đánh giá tổng thể',
          ]}
          buttonText="Thử thách bản thân"
          // Mode "Phỏng vấn với AI"
          onPress={() => router.push({ pathname: '/interview/setup', params: { mode: 'voice' } })}
        />
      </ScrollView>
    </BackgroundContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(217, 217, 217, 0.15)',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    marginBottom: 8,
  },
  headerBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: '800' },

  pageTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 10,
    paddingHorizontal: 16,
    textAlign: 'center',
  },

  card: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 18,
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  cardBorder: { borderWidth: 1, borderColor: 'rgba(124, 243, 255, 0.55)' },

  cardIconWrap: { alignItems: 'center', marginBottom: 10 },
  iconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#7CF3FF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  cardTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '800', marginBottom: 6, textAlign: 'center' },
  cardDesc: { color: 'rgba(255,255,255,0.85)', fontSize: 15, lineHeight: 20, textAlign: 'center' },

  bulletRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 , justifyContent: 'center'},
  bulletText: { color: '#DFF9FF', fontSize: 13.5 },

  primaryBtn: {
    marginTop: 12,
    height: 46,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#69E6FF',
  },
  primaryBtnText: { color: '#fff', fontWeight: '800', fontSize: 16 },
});
