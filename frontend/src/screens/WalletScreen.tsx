import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { VoucherCard } from '@/components/VoucherCard';
import { vouchersMock } from '@/data/vouchersMock';
import { userMock } from '@/data/userMock';
import { colors, spacing, typography } from '@/theme';
import type { RootStackParamList } from '@/types/navigation';

export function WalletScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Minha carteira</Text>

        <View style={styles.pointsCard}>
          <View>
            <Text style={styles.pointsLabel}>Saldo de Pontos</Text>
            <Text style={styles.points}>{userMock.points}</Text>
            <View style={styles.levelRow}>
              <Ionicons color={colors.white} name="trophy" size={20} />
              <Text style={styles.level}>Nivel: {userMock.level}</Text>
            </View>
          </View>
          <Ionicons color={colors.white} name="trophy" size={122} style={styles.trophy} />
        </View>

        <View style={styles.voucherCount}>
          <View style={styles.countLabel}>
            <Ionicons color={colors.primary[400]} name="wallet" size={18} />
            <Text style={styles.countText}>Meus Vouchers Ativos</Text>
          </View>
          <View style={styles.countPill}>
            <Text style={styles.countNumber}>{userMock.activeVouchers}</Text>
          </View>
        </View>

        <View style={styles.list}>
          {vouchersMock.map((voucher) => (
            <VoucherCard
              key={voucher.id}
              voucher={voucher}
              onPress={() => navigation.navigate('VoucherDetails', { voucher })}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.lg,
    padding: spacing.xl,
    paddingBottom: 120,
  },
  countLabel: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  countNumber: {
    color: colors.white,
    fontSize: typography.size.md,
    fontWeight: '900',
  },
  countPill: {
    alignItems: 'center',
    backgroundColor: colors.info,
    borderRadius: 10,
    height: 32,
    justifyContent: 'center',
    width: 40,
  },
  countText: {
    color: colors.text.muted,
    fontSize: typography.size.md,
    fontWeight: '800',
  },
  level: {
    color: colors.white,
    fontSize: typography.size.md,
    fontWeight: '800',
  },
  levelRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  list: {
    gap: spacing.md,
  },
  points: {
    color: colors.white,
    fontSize: 44,
    fontWeight: '900',
    marginVertical: spacing.sm,
  },
  pointsCard: {
    backgroundColor: colors.primary[400],
    borderRadius: 10,
    minHeight: 170,
    overflow: 'hidden',
    padding: spacing.xl,
  },
  pointsLabel: {
    color: colors.white,
    fontSize: typography.size.lg,
  },
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },
  title: {
    color: colors.primary[400],
    fontSize: typography.size.xl,
    fontWeight: '900',
  },
  trophy: {
    opacity: 0.2,
    position: 'absolute',
    right: 14,
    top: 44,
  },
  voucherCount: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
