import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenHeader } from '@/components/ScreenHeader';
import { colors, spacing, typography } from '@/theme';
import type { RootStackParamList } from '@/types/navigation';

type VoucherDetailsScreenProps = NativeStackScreenProps<RootStackParamList, 'VoucherDetails'>;

export function VoucherDetailsScreen({ navigation, route }: VoucherDetailsScreenProps) {
  const { voucher } = route.params;

  return (
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
      <ScreenHeader title="Detalhes do voucher" onBack={navigation.goBack} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <View style={[styles.icon, { backgroundColor: voucher.accentColor }]}>
            <Ionicons color={colors.white} name={voucher.iconName as keyof typeof Ionicons.glyphMap} size={42} />
          </View>
          <Text style={styles.brand}>{voucher.brand}</Text>
          <Text style={[styles.title, { color: voucher.accentColor }]}>{voucher.title}</Text>

          <View style={styles.imageMock}>
            <Ionicons color={colors.secondary[400]} name="gift" size={84} />
          </View>

          <Text style={styles.label}>Codigo do voucher</Text>
          <View style={styles.codeBox}>
            <Text style={styles.code}>{voucher.code}</Text>
          </View>

          <View style={styles.detailsBox}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Desconto:</Text>
              <Text style={styles.detailValue}>{voucher.tag}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Data de aquisicao:</Text>
              <Text style={styles.detailValue}>{voucher.acquiredAt}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Valido ate:</Text>
              <Text style={styles.detailValue}>{voucher.expiresAt}</Text>
            </View>
          </View>
          <PrimaryButton label="USAR VOUCHER" variant="secondary" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  brand: {
    color: colors.text.strong,
    fontSize: typography.size.xxl,
    fontWeight: '900',
    marginTop: spacing.lg,
    textAlign: 'center',
  },
  card: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1.5,
    padding: spacing.xl,
  },
  code: {
    color: colors.primary[600],
    fontSize: typography.size.xl,
    fontWeight: '900',
    letterSpacing: 0,
    textAlign: 'center',
  },
  codeBox: {
    backgroundColor: colors.softPrimary,
    borderRadius: 10,
    marginTop: spacing.sm,
    paddingVertical: spacing.sm,
  },
  content: {
    padding: spacing.xl,
  },
  detailLabel: {
    color: colors.text.strong,
    flex: 1,
    fontSize: typography.size.sm,
    fontWeight: '700',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailValue: {
    color: colors.text.strong,
    fontSize: typography.size.sm,
    fontWeight: '800',
  },
  detailsBox: {
    backgroundColor: colors.softPrimary,
    borderRadius: 10,
    gap: spacing.sm,
    marginVertical: spacing.lg,
    padding: spacing.lg,
  },
  icon: {
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 40,
    height: 80,
    justifyContent: 'center',
    width: 80,
  },
  imageMock: {
    alignItems: 'center',
    backgroundColor: colors.softPrimary,
    borderRadius: 12,
    height: 230,
    justifyContent: 'center',
    marginVertical: spacing.xl,
  },
  label: {
    color: colors.text.strong,
    fontSize: typography.size.md,
    fontWeight: '800',
  },
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },
  title: {
    fontSize: typography.size.xl,
    fontWeight: '900',
    marginTop: spacing.sm,
    textAlign: 'center',
  },
});
