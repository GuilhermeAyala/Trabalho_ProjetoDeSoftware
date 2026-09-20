import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BloodCenterCard } from '@/components/BloodCenterCard';
import { SectionTitle } from '@/components/SectionTitle';
import { bloodCentersMock } from '@/data/bloodCentersMock';
import { colors, spacing, typography } from '@/theme';
import type { RootStackParamList } from '@/types/navigation';

export function BloodCentersScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View>
          <Text style={styles.title}>Hemocentros</Text>
          <Text style={styles.subtitle}>Encontre locais proximos e veja horarios disponiveis.</Text>
        </View>

        <SectionTitle>Proximos de voce</SectionTitle>
        <View style={styles.list}>
          {bloodCentersMock.map((bloodCenter) => (
            <BloodCenterCard
              bloodCenter={bloodCenter}
              key={bloodCenter.id}
              onSchedule={() => navigation.navigate('AppTabs', { screen: 'Schedule' })}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.xl,
    padding: spacing.xl,
    paddingBottom: 120,
  },
  list: {
    gap: spacing.md,
  },
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },
  subtitle: {
    color: colors.text.muted,
    fontSize: typography.size.md,
    lineHeight: 20,
    marginTop: spacing.sm,
  },
  title: {
    color: colors.primary[400],
    fontSize: typography.size.xxl,
    fontWeight: '900',
  },
});
