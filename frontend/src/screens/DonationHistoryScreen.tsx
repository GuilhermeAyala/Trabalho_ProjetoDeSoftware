import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DonationTimelineItem } from '@/components/DonationTimelineItem';
import { ScreenHeader } from '@/components/ScreenHeader';
import { SectionTitle } from '@/components/SectionTitle';
import { StatCard } from '@/components/StatCard';
import { donationsMock } from '@/data/donationsMock';
import { userMock } from '@/data/userMock';
import { colors, spacing } from '@/theme';
import type { RootStackParamList } from '@/types/navigation';

type DonationHistoryScreenProps = NativeStackScreenProps<RootStackParamList, 'DonationHistory'>;

export function DonationHistoryScreen({ navigation }: DonationHistoryScreenProps) {
  return (
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
      <ScreenHeader title="Historico de doacoes" onBack={navigation.goBack} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.stats}>
          <StatCard icon="hand-left" label="Doacoes Realizadas" value={String(userMock.donationsCount)} />
          <StatCard icon="trending-up" label="Pontos Ganhos" value={String(userMock.totalPoints)} tone="success" />
        </View>

        <SectionTitle>Suas doacoes</SectionTitle>
        <View style={styles.timeline}>
          {donationsMock.map((item, index) => (
            <DonationTimelineItem key={item.id} isLast={index === donationsMock.length - 1} item={item} />
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
  timeline: {
    gap: spacing.md,
  },
});
