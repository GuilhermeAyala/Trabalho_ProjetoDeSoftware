import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenHeader } from '@/components/ScreenHeader';
import { SectionTitle } from '@/components/SectionTitle';
import { faqsMock } from '@/data/faqsMock';
import { colors, spacing, typography } from '@/theme';
import type { RootStackParamList } from '@/types/navigation';

type InformationCenterScreenProps = NativeStackScreenProps<RootStackParamList, 'InformationCenter'>;

export function InformationCenterScreen({ navigation }: InformationCenterScreenProps) {
  const [openedId, setOpenedId] = useState<string | undefined>(faqsMock[0]?.id);

  return (
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
      <ScreenHeader title="Central de informacoes" onBack={navigation.goBack} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <LinearGradient colors={[colors.secondary[300], '#FF4400']} start={{ x: 0, y: 0 }} style={styles.hero}>
          <View style={styles.heroIcon}>
            <Ionicons color={colors.white} name="hand-left" size={38} />
          </View>
          <Text style={styles.heroTitle}>Tudo sobre doacao de sangue</Text>
          <Text style={styles.heroSubtitle}>Agende agora e comece a salvar vidas</Text>
        </LinearGradient>

        <SectionTitle>Perguntas Frequentes</SectionTitle>

        <View style={styles.faqList}>
          {faqsMock.map((faq) => {
            const isOpened = openedId === faq.id;

            return (
              <Pressable
                key={faq.id}
                accessibilityRole="button"
                onPress={() => setOpenedId(isOpened ? undefined : faq.id)}
                style={styles.faqCard}
              >
                <View style={styles.faqHeader}>
                  <View style={styles.faqIcon}>
                    <Ionicons color={colors.secondary[400]} name={faq.icon as keyof typeof Ionicons.glyphMap} size={22} />
                  </View>
                  <Text style={styles.faqTitle}>{faq.title}</Text>
                  <Ionicons color={colors.text.strong} name={isOpened ? 'chevron-up' : 'chevron-down'} size={20} />
                </View>
                {isOpened && <Text style={styles.faqDescription}>{faq.description}</Text>}
              </Pressable>
            );
          })}
        </View>

        <View style={styles.ctaCard}>
          <Text style={styles.ctaTitle}>Pronto para doar?</Text>
          <Text style={styles.ctaText}>Encontre um hemocentro proximo e agende sua doacao</Text>
          <PrimaryButton
            label="AGENDAR DOACAO"
            onPress={() => navigation.navigate('AppTabs', { screen: 'Schedule' })}
            style={styles.ctaButton}
            variant="light"
          />
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
  ctaButton: {
    alignSelf: 'center',
    height: 42,
    width: 240,
  },
  ctaCard: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 10,
    borderWidth: 1.5,
    gap: spacing.sm,
    padding: spacing.xl,
  },
  ctaText: {
    color: colors.text.muted,
    fontSize: typography.size.md,
    lineHeight: 22,
    textAlign: 'center',
  },
  ctaTitle: {
    color: colors.text.strong,
    fontSize: typography.size.md + 1,
    fontWeight: '800',
  },
  faqCard: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 10,
    borderWidth: 1.5,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  faqDescription: {
    color: colors.text.muted,
    fontSize: typography.size.sm,
    lineHeight: 19,
    marginLeft: 52,
    marginTop: spacing.sm,
  },
  faqHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  faqIcon: {
    alignItems: 'center',
    backgroundColor: colors.softPrimary,
    borderRadius: 19,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  faqList: {
    gap: spacing.sm,
  },
  faqTitle: {
    color: colors.text.strong,
    flex: 1,
    fontSize: typography.size.md,
    fontWeight: '700',
  },
  hero: {
    alignItems: 'center',
    borderRadius: 15,
    gap: spacing.md,
    minHeight: 158,
    padding: spacing.xl,
  },
  heroIcon: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.24)',
    borderRadius: 32,
    height: 64,
    justifyContent: 'center',
    width: 64,
  },
  heroSubtitle: {
    color: colors.white,
    fontSize: typography.size.md,
    fontWeight: '700',
  },
  heroTitle: {
    color: colors.white,
    fontSize: typography.size.lg,
    fontWeight: '900',
    textAlign: 'center',
  },
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },
});
