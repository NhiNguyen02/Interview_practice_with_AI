import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import BackgroundContainer from '@/components/common/BackgroundContainer';
import OptionModal from '@/components/common/OptionModal';

type Mode = 'chat' | 'voice';

const DOMAIN_OPTIONS = ['IT', 'Kinh doanh', 'Marketing'];
const SPECIALTY_BY_DOMAIN: Record<string, string[]> = {
  IT: ['Software Engineering', 'Mobile', 'Data', 'DevOps'],
  'Kinh doanh': ['Sales', 'Account', 'Partnerships'],
  Marketing: ['Content', 'Performance', 'Brand'],
};
const EXP_OPTS = ['< 1 năm', '1-2 năm', '3-5 năm', '5+ năm'];
const TIME_OPTS = ['15', '20', '30', '45'];
const QA_OPTS = ['4', '6', '8', '10', '12'];

function SelectField({
  label,
  value,
  onPress,
}: {
  label: string;
  value: string;
  onPress: () => void;
}) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
        <View
          style={[styles.select, styles.cardBorder]}
        >
          <Text style={styles.selectText}>{value}</Text>
          <MaterialCommunityIcons name="chevron-down" size={20} color="#DFF9FF" />
        </View>
      </TouchableOpacity>
    </View>
  );
}

// Các tùy chọn dưới dạng OptionItem
const domainOptions = DOMAIN_OPTIONS.map(domain => ({ id: domain, label: domain }));
const getSpecialtyOptions = (domain: string) => (SPECIALTY_BY_DOMAIN[domain] || []).map(spec => ({ id: spec, label: spec }));
const expOptions = EXP_OPTS.map(exp => ({ id: exp, label: exp }));
const timeOptions = TIME_OPTS.map(time => ({ id: time, label: time }));
const qaOptions = QA_OPTS.map(qa => ({ id: qa, label: qa }));

export default function SetupInterviewScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { mode: modeParam } = useLocalSearchParams<{ mode?: string }>();
  const mode: Mode = (modeParam === 'chat' ? 'chat' : 'voice');

  // state
  const [domain, setDomain] = useState(DOMAIN_OPTIONS[0]);
//   const specialties = useMemo(() => SPECIALTY_BY_DOMAIN[domain] ?? [], [domain]);
  const [specialty, setSpecialty] = useState(SPECIALTY_BY_DOMAIN[DOMAIN_OPTIONS[0]][0]);
  const [exp, setExp] = useState(EXP_OPTS[1]);
  const [time, setTime] = useState('30');
  const [qa, setQa] = useState('8');

  // modal control
  const [modal, setModal] = useState<{ key: string | null }>({ key: null });

  const open = (key: string) => setModal({ key });
  const close = () => setModal({ key: null });

  const handleStartChat = () => {
    // TODO: truyền config vào màn phỏng vấn thực tế
    router.push({
    pathname: '/interview/chat',
    params: { specialty: specialty } // truyền tiêu đề tùy chọn
    });
  };

  const handleStartVoice = () => {
    // TODO: truyền config vào màn phỏng vấn thực tế
    router.push({
    pathname: '/interview/voice',
    params: { specialty: specialty, qIndex: 5, qTotal: 8 }, // truyền tiêu đề tùy chọn
  });
  };

  return (
    <BackgroundContainer withOverlay={false}>
      <SafeAreaView />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={22} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Thiết lập thông tin</Text>
        <View style={styles.headerBtn} />
      </View>

      <View style={{ paddingHorizontal: 16, paddingBottom: 24 }}>
        <Text style={styles.subtitle}>
          Hãy thiết lập thông tin của bạn trước khi bắt đầu luyện phỏng vấn!
        </Text>

        {/* Domain */}
        <SelectField
          label="Chọn lĩnh vực của bạn"
          value={domain}
          onPress={() => open('domain')}
        />

        {/* Specialty */}
        <SelectField
          label="Chọn chuyên môn của bạn"
          value={specialty}
          onPress={() => open('specialty')}
        />

        {/* Experience */}
        <SelectField
          label="Kinh nghiệm làm việc"
          value={exp}
          onPress={() => open('exp')}
        />

        {/* Only for interview mode: time & questions */}
        {mode === 'voice' && (
          <View style={styles.row2}>
            <View
              style={[styles.statBox, styles.cardBorder]}
            >
              <Text style={styles.statLabel}>Thời gian</Text>
              <TouchableOpacity onPress={() => open('time')}>
                <Text style={styles.statValue}>{time}</Text>
                <Text style={styles.statUnit}>Phút</Text>
              </TouchableOpacity>
            </View>

            <View
              style={[styles.statBox, styles.cardBorder]}
            >
              <Text style={styles.statLabel}>Câu hỏi</Text>
              <TouchableOpacity onPress={() => open('qa')}>
                <Text style={styles.statValue}>{qa}</Text>
                <Text style={styles.statUnit}>Câu hỏi</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Start button */}
        <TouchableOpacity style={styles.primaryBtn} onPress={mode === 'chat' ? handleStartChat : handleStartVoice} activeOpacity={0.9}>
          <Text style={styles.primaryBtnText}>
            {mode === 'voice' ? 'Bắt đầu phỏng vấn' : 'Bắt đầu luyện tập'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Modals */}
      <OptionModal
        visible={modal.key === 'domain'}
        title="Chọn lĩnh vực"
        options={domainOptions}
        onClose={close}
        onSelect={(item) => {
          setDomain(item.label);
          // reset specialty theo domain mới
          const first = (SPECIALTY_BY_DOMAIN[item.label] ?? [])[0];
          if (first) setSpecialty(first);
        }}
      />
      <OptionModal
        visible={modal.key === 'specialty'}
        title="Chọn chuyên môn"
        options={getSpecialtyOptions(domain)}
        onClose={close}
        onSelect={(item) => setSpecialty(item.label)}
      />
      <OptionModal
        visible={modal.key === 'exp'}
        title="Kinh nghiệm làm việc"
        options={expOptions}
        onClose={close}
        onSelect={(item) => setExp(item.label)}
      />
      <OptionModal
        visible={modal.key === 'time'}
        title="Thời lượng (phút)"
        options={timeOptions}
        onClose={close}
        onSelect={(item) => setTime(item.label)}
      />
      <OptionModal
        visible={modal.key === 'qa'}
        title="Số câu hỏi"
        options={qaOptions}
        onClose={close}
        onSelect={(item) => setQa(item.label)}
      />
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

  subtitle: {
    fontSize: 16,
    color: '#DFF9FF',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 16,
    lineHeight: 20,
  },

  cardBorder: { borderWidth: 1, borderColor: 'rgba(124, 243, 255, 0.45)' },

  fieldLabel: { fontSize: 16, color: '#DFF9FF', marginBottom: 6, fontWeight: '800' },
  select: {
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  selectText: { color: '#BEEFFF', fontSize: 16 },

  row2: { flexDirection: 'row', gap: 10, marginTop: 4, marginBottom: 8 },
  statBox: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: 'flex-start',
  },
  statLabel: { color: 'rgba(255,255,255,0.85)', marginBottom: 6 },
  statValue: { color: '#7CF3FF', fontSize: 26, fontWeight: '800', lineHeight: 28 },
  statUnit: { color: 'rgba(255,255,255,0.8)', marginTop: 2 },

  primaryBtn: {
    marginTop: 14,
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#69E6FF',
  },
  primaryBtnText: {fontSize: 16, color: '#fff', fontWeight: '800' },

  // modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#0B1C24',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  modalTitle: { color: '#FFFFFF', fontWeight: '800', fontSize: 16, marginBottom: 6 },
  modalItem: {
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.12)',
  },
  modalItemText: { color: '#DFF9FF', fontSize: 14 },
  modalClose: { alignSelf: 'flex-end', paddingVertical: 8 },
  modalCloseText: { color: '#7CF3FF', fontWeight: '700' },
});
