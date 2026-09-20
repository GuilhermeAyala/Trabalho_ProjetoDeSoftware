import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/PrimaryButton';
import { TextField } from '@/components/TextField';
import { userMock } from '@/data/userMock';
import { colors, spacing, typography } from '@/theme';

export function SettingsScreen() {
  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Configuracao do usuario</Text>

        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{userMock.initials}</Text>
        </View>

        <View style={styles.photoButton}>
          <Ionicons color={colors.primary[400]} name="camera" size={18} />
          <Text style={styles.photoText}>Trocar foto</Text>
        </View>

        <Text style={styles.sectionLabel}>Dados pessoais</Text>
        <View style={styles.form}>
          <TextField defaultValue={userMock.name} label="NOME" />
          <TextField autoCapitalize="none" defaultValue={userMock.email} keyboardType="email-address" label="E-MAIL" />
          <TextField defaultValue="********" label="SENHA" secureTextEntry />
        </View>

        <PrimaryButton label="SALVAR ALTERACOES" />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: colors.softPrimary,
    borderRadius: 46,
    height: 92,
    justifyContent: 'center',
    width: 92,
  },
  avatarText: {
    color: colors.primary[400],
    fontSize: typography.size.xxl,
    fontWeight: '900',
  },
  content: {
    gap: spacing.xl,
    padding: spacing.xxl,
    paddingBottom: 120,
  },
  form: {
    gap: spacing.xl,
  },
  photoButton: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: colors.softPrimary,
    borderRadius: 18,
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
  },
  photoText: {
    color: colors.primary[400],
    fontSize: typography.size.md,
    fontWeight: '800',
  },
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },
  sectionLabel: {
    color: colors.text.strong,
    fontSize: typography.size.xl,
    fontWeight: '900',
  },
  title: {
    color: colors.primary[400],
    fontSize: typography.size.xxl,
    fontWeight: '900',
  },
});
