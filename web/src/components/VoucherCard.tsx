import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, typography } from '@/theme';
import type { Voucher } from '@/types/domain';

type VoucherCardProps = {
  voucher: Voucher;
  onPress?: () => void;
};

export function VoucherCard({ voucher, onPress }: VoucherCardProps) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.brandIcon, { backgroundColor: voucher.accentColor }]}>
          <Ionicons color={colors.white} name={voucher.iconName as keyof typeof Ionicons.glyphMap} size={24} />
        </View>
        <View style={styles.copy}>
          <Text style={styles.brand}>{voucher.brand}</Text>
          <Text style={[styles.title, { color: voucher.accentColor }]}>{voucher.title}</Text>
        </View>
      </View>

      <View style={styles.tagRow}>
        <View style={styles.tag}>
          <Text style={styles.tagText}>{voucher.tag}</Text>
        </View>
        <Ionicons color={colors.secondary[400]} name="pricetag-outline" size={20} />
      </View>

      <Text style={styles.expiration}>Valido ate: {voucher.expiresAt}</Text>
      <View style={styles.button}>
        <Text style={styles.buttonText}>Usar Voucher</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  brand: {
    color: colors.text.muted,
    fontSize: typography.size.sm,
    letterSpacing: 0,
  },
  brandIcon: {
    alignItems: 'center',
    borderRadius: 22,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  button: {
    alignItems: 'center',
    backgroundColor: colors.secondary[300],
    borderRadius: 16,
    height: 32,
    justifyContent: 'center',
    marginTop: 18,
  },
  buttonText: {
    color: colors.white,
    fontSize: typography.size.md,
    fontWeight: '800',
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
    gap: 2,
  },
  expiration: {
    color: colors.text.muted,
    fontSize: typography.size.sm,
    marginLeft: 62,
    marginTop: 8,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16,
  },
  tag: {
    backgroundColor: colors.secondary[300],
    borderRadius: 16,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  tagRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
    marginLeft: 62,
    marginTop: 8,
  },
  tagText: {
    color: colors.white,
    fontSize: typography.size.tiny,
    fontWeight: '700',
  },
  title: {
    fontSize: typography.size.xl,
    fontWeight: '900',
    letterSpacing: 0,
  },
});
