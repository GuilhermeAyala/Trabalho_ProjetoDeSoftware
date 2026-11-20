import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { colors, typography } from '@/theme';
import type { BloodCenter } from '@/types/domain';
import { PrimaryButton } from './PrimaryButton';

type BloodCenterCardProps = {
  bloodCenter: BloodCenter;
  onSchedule?: () => void;
};

export function BloodCenterCard({ bloodCenter, onSchedule }: BloodCenterCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.icon}>
          <Ionicons color={colors.primary[400]} name="medical" size={24} />
        </View>
        <View style={styles.copy}>
          <Text style={styles.title}>{bloodCenter.name}</Text>
          <Text style={styles.address}>{bloodCenter.address}</Text>
        </View>
      </View>
      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Ionicons color={colors.secondary[400]} name="navigate" size={18} />
          <Text style={styles.metaText}>{bloodCenter.distance}</Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons color={colors.secondary[400]} name="calendar" size={18} />
          <Text style={styles.metaText}>{bloodCenter.nextSlot}</Text>
        </View>
      </View>
      <PrimaryButton label="AGENDAR DOACAO" onPress={onSchedule} variant="secondary" style={styles.button} />
    </View>
  );
}

const styles = StyleSheet.create({
  address: {
    color: colors.text.muted,
    fontSize: typography.size.sm,
  },
  button: {
    height: 42,
    marginTop: 16,
  },
  card: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 15,
    borderWidth: 1.5,
    padding: 18,
  },
  copy: {
    flex: 1,
    gap: 4,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 14,
  },
  icon: {
    alignItems: 'center',
    backgroundColor: colors.softPrimary,
    borderRadius: 22,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  metaItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 18,
    marginTop: 16,
  },
  metaText: {
    color: colors.text.strong,
    fontSize: typography.size.sm,
    fontWeight: '700',
  },
  title: {
    color: colors.text.strong,
    fontSize: typography.size.lg,
    fontWeight: '800',
  },
});
