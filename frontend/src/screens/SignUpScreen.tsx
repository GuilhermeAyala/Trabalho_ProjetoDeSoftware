import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppLogo } from '@/components/AppLogo';
import { PrimaryButton } from '@/components/PrimaryButton';
import { TextField } from '@/components/TextField';
import { colors, spacing, typography } from '@/theme';
import type { RootStackParamList } from '@/types/navigation';

type SignUpScreenProps = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

export function SignUpScreen({ navigation }: SignUpScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.keyboardView}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <AppLogo />

          <View style={styles.hero}>
            <Text style={styles.title}>Crie sua conta</Text>
            <Text style={styles.subtitle}>
              Cadastre-se para agendar doacoes, acompanhar pontos e encontrar hemocentros proximos.
            </Text>
          </View>

          <View style={styles.form}>
            <TextField label="NOME" placeholder="Seu nome completo" />
            <TextField autoCapitalize="none" keyboardType="email-address" label="E-MAIL" placeholder="voce@email.com" />
            <TextField label="SENHA" placeholder="********" secureTextEntry />
          </View>

          <PrimaryButton label="CRIAR CONTA" onPress={() => navigation.replace('AppTabs', { screen: 'Home' })} />

          <Pressable onPress={() => navigation.replace('AppTabs', { screen: 'Home' })}>
            <Text style={styles.loginLink}>Ja tenho conta</Text>
          </Pressable>

          <View style={styles.privacyCard}>
            <Text style={styles.privacyText}>
              Seus dados serao usados para conectar voce a campanhas e instituicoes de saude.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    gap: spacing.xl,
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.xl,
  },
  form: {
    gap: spacing.xl,
  },
  hero: {
    gap: spacing.sm,
    marginTop: spacing.xl,
  },
  keyboardView: {
    flex: 1,
  },
  loginLink: {
    color: colors.secondary[400],
    fontSize: typography.size.md,
    fontWeight: '800',
    letterSpacing: 0,
    textAlign: 'center',
  },
  privacyCard: {
    backgroundColor: colors.softPrimary,
    borderRadius: 18,
    marginTop: 'auto',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  privacyText: {
    color: colors.primary[600],
    fontSize: typography.size.sm,
    lineHeight: 18,
  },
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },
  subtitle: {
    color: colors.text.muted,
    fontSize: typography.size.md + 1,
    lineHeight: 22,
  },
  title: {
    color: colors.text.strong,
    fontSize: typography.size.display,
    fontWeight: '900',
    letterSpacing: 0,
  },
});
