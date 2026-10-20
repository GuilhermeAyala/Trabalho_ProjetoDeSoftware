import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DonationTimelineItem } from '@/components/DonationTimelineItem';
import { ScreenHeader } from '@/components/ScreenHeader';
import { SectionTitle } from '@/components/SectionTitle';
import { StatCard } from '@/components/StatCard';
import { useDonorSession } from '@/context/DonorSession';
import { useDonorDonations } from '@/hooks/useDonorDonations';
import { useRefreshDonorProfile } from '@/hooks/useRefreshDonorProfile';
import { colors, spacing } from '@/theme';
import type { RootStackParamList } from '@/types/navigation';

type DonationHistoryScreenProps = NativeStackScreenProps<RootStackParamList, 'DonationHistory'>;

export function DonationHistoryScreen({ navigation }: DonationHistoryScreenProps) {
  useRefreshDonorProfile();
  const { sessao } = useDonorSession();
  const doacoes = useDonorDonations();
  return (
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
      <ScreenHeader title="Historico de doacoes" onBack={navigation.goBack} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.stats}>
          <StatCard icon="hand-left" label="Doações Realizadas" value={String(sessao?.doador.doacoesRealizadas ?? 0)} />
          <StatCard icon="trending-up" label="Pontos Ganhos" value={String(sessao?.doador.pontosDoacao ?? 0)} tone="success" />
        </View>

        <SectionTitle>Suas doacoes</SectionTitle>
        <View style={styles.timeline}>
          {doacoes.length === 0 ? <Text style={styles.empty}>Nenhuma doação realizada até o momento.</Text> : null}
          {doacoes.map((item, index) => (
            <DonationTimelineItem key={item.id} isLast={index === doacoes.length - 1} item={item} />
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
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },
  stats: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  empty: {
    color: colors.text.muted,
  },
  timeline: {
    gap: spacing.md,
  },
});
