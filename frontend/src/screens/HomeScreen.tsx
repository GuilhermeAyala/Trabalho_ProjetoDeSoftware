import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/PrimaryButton';
import { SectionTitle } from '@/components/SectionTitle';
import { iniciaisDoador, useDonorSession } from '@/context/DonorSession';
import { useDonorDonations } from '@/hooks/useDonorDonations';
import { useRefreshDonorProfile } from '@/hooks/useRefreshDonorProfile';
import { colors, spacing, typography } from '@/theme';
import type { RootStackParamList } from '@/types/navigation';

export function HomeScreen() {
  useRefreshDonorProfile();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { sessao } = useDonorSession();
  const lastDonation = useDonorDonations()[0];
  const primeiroNome = sessao?.doador.nome.trim().split(/\s+/)[0] ?? 'Doador';

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Olá, {primeiroNome}</Text>
            <Text style={styles.subtitle}>Pronto para salvar vidas hoje?</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{iniciaisDoador(sessao?.doador)}</Text>
          </View>
        </View>

        <View style={styles.pointsCard}>
          <View>
            <Text style={styles.pointsLabel}>Saldo de Pontos</Text>
            <Text style={styles.points}>{sessao?.doador.pontosDoacao ?? 0}</Text>
            <View style={styles.levelRow}>
              <Ionicons color={colors.white} name="trophy" size={20} />
              <Text style={styles.level}>Nível do doador</Text>
            </View>
          </View>
          <Ionicons color={colors.white} name="trophy" size={112} style={styles.trophy} />
        </View>

        <View style={styles.quickActions}>
          <PrimaryButton
            label="REALIZAR TRIAGEM"
            onPress={() => sessao && navigation.navigate('Triage', { doadorId: sessao.doador.id })}
          />
          <PrimaryButton label="AGENDAR DOACAO" onPress={() => navigation.navigate('AppTabs', { screen: 'Schedule' })} />
          <PrimaryButton
            label="CENTRAL DE INFORMACOES"
            onPress={() => navigation.navigate('InformationCenter')}
            variant="light"
          />
        </View>

        <SectionTitle>Seu impacto</SectionTitle>
        <View style={styles.impactGrid}>
          <View style={styles.impactCard}>
            <Ionicons color={colors.primary[400]} name="water" size={28} />
            <Text style={styles.impactValue}>{sessao?.doador.doacoesRealizadas ?? 0}</Text>
            <Text style={styles.impactLabel}>Doacoes realizadas</Text>
          </View>
          <View style={styles.impactCard}>
            <Ionicons color={colors.success} name="trending-up" size={28} />
            <Text style={styles.impactValue}>{sessao?.doador.pontosDoacao ?? 0}</Text>
            <Text style={styles.impactLabel}>Pontos ganhos</Text>
          </View>
        </View>

        {lastDonation ? (
          <View style={styles.lastDonation}>
            <View>
              <Text style={styles.lastTitle}>Ultima doacao</Text>
              <Text style={styles.lastText}>{lastDonation.place}</Text>
              <Text style={styles.lastMuted}>
                {lastDonation.date} as {lastDonation.time}
              </Text>
            </View>
            <PrimaryButton label="HISTORICO" onPress={() => navigation.navigate('DonationHistory')} style={styles.smallButton} />
          </View>
        ) : (
          <View style={styles.lastDonation}>
            <Text style={styles.lastTitle}>Nenhuma doação realizada</Text>
            <Text style={styles.lastMuted}>Quando o hemocentro confirmar uma doação, ela aparecerá aqui.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    backgroundColor: colors.primary[400],
    borderRadius: 24,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  avatarText: {
    color: colors.white,
    fontSize: typography.size.lg,
    fontWeight: '900',
  },
  content: {
    gap: spacing.xl,
    padding: spacing.xl,
    paddingBottom: 120,
  },
  greeting: {
    color: colors.text.strong,
    fontSize: typography.size.xxl,
    fontWeight: '900',
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  impactCard: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1.5,
    flex: 1,
    padding: spacing.lg,
  },
  impactGrid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  impactLabel: {
    color: colors.text.muted,
    fontSize: typography.size.sm,
  },
  impactValue: {
    color: colors.text.strong,
    fontSize: typography.size.xxl,
    fontWeight: '900',
    marginTop: spacing.sm,
  },
  lastDonation: {
    backgroundColor: colors.softPrimary,
    borderRadius: 18,
    gap: spacing.md,
    padding: spacing.lg,
  },
  lastMuted: {
    color: colors.text.muted,
    fontSize: typography.size.sm,
    marginTop: 4,
  },
  lastText: {
    color: colors.text.strong,
    fontSize: typography.size.lg,
    fontWeight: '800',
    marginTop: 6,
  },
  lastTitle: {
    color: colors.primary[600],
    fontSize: typography.size.sm,
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
  points: {
    color: colors.white,
    fontSize: 46,
    fontWeight: '900',
    marginVertical: spacing.sm,
  },
  pointsCard: {
    backgroundColor: colors.primary[400],
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 172,
    overflow: 'hidden',
    padding: spacing.xl,
  },
  pointsLabel: {
    color: colors.white,
    fontSize: typography.size.lg,
  },
  quickActions: {
    gap: spacing.md,
  },
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },
  smallButton: {
    height: 42,
  },
  subtitle: {
    color: colors.text.muted,
    fontSize: typography.size.md,
    marginTop: 4,
  },
  trophy: {
    opacity: 0.22,
    position: 'absolute',
    right: -12,
    top: 32,
  },
});
