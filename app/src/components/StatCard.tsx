import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { colors, typography } from '@/theme';

type StatCardProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  tone?: 'primary' | 'success';
};

export function StatCard({ icon, label, value, tone = 'primary' }: StatCardProps) {
  return (
    <View style={[styles.card, tone === 'success' && styles.success]}>
      <Ionicons color={colors.white} name={icon} size={34} />
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.primary[300],
    borderRadius: 10,
    flex: 1,
    minHeight: 150,
    padding: 18,
  },
  label: {
    color: colors.white,
    fontSize: typography.size.xs,
    letterSpacing: 0,
    marginTop: 8,
  },
  success: {
    backgroundColor: colors.success,
  },
  value: {
    color: colors.white,
    fontSize: typography.size.hero,
    fontWeight: '900',
    letterSpacing: 0,
    marginTop: 10,
  },
});
