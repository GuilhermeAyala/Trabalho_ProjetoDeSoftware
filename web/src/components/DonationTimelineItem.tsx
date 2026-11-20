import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { colors, typography } from '@/theme';
import type { DonationHistoryItem } from '@/types/domain';

type DonationTimelineItemProps = {
  item: DonationHistoryItem;
  isLast?: boolean;
};

export function DonationTimelineItem({ item, isLast }: DonationTimelineItemProps) {
  return (
    <View style={styles.container}>
      <View style={styles.timelineColumn}>
        <View style={styles.timelineIcon}>
          <Ionicons color={colors.white} name="water" size={20} />
        </View>
        {!isLast && <View style={styles.timelineLine} />}
      </View>

      <View style={styles.card}>
        <Text style={styles.date}>{item.date}</Text>
        <View style={styles.row}>
          <Ionicons color={colors.primary[400]} name="time" size={15} />
          <Text style={styles.muted}>{item.time}</Text>
        </View>
        <View style={styles.row}>
          <Ionicons color={colors.primary[400]} name="location" size={15} />
          <Text style={styles.place}>{item.place}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.pointsRow}>
          <Text style={styles.muted}>Pontos ganhos</Text>
          <Text style={styles.points}>+{item.points} pts</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 10,
    borderWidth: 1.5,
    flex: 1,
    padding: 16,
  },
  container: {
    flexDirection: 'row',
    gap: 24,
  },
  date: {
    color: colors.text.strong,
    fontSize: typography.size.lg,
    fontWeight: '700',
    marginBottom: 14,
  },
  divider: {
    backgroundColor: colors.border,
    height: 1,
    marginVertical: 14,
  },
  muted: {
    color: colors.text.muted,
    fontSize: typography.size.xs,
  },
  place: {
    color: colors.text.strong,
    flex: 1,
    fontSize: typography.size.md,
    fontWeight: '700',
  },
  points: {
    color: colors.success,
    fontSize: typography.size.sm,
    fontWeight: '800',
  },
  pointsRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  timelineColumn: {
    alignItems: 'center',
    width: 48,
  },
  timelineIcon: {
    alignItems: 'center',
    backgroundColor: colors.primary[500],
    borderRadius: 22,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  timelineLine: {
    backgroundColor: colors.primary[500],
    flex: 1,
    width: 2,
  },
});
