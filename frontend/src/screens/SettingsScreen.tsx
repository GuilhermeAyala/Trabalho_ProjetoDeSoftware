import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/PrimaryButton';
import { TextField } from '@/components/TextField';
import { CURRENT_DONOR_ID } from '@/config/api';
import { userMock } from '@/data/userMock';
import { getApiErrorMessage } from '@/services/api';
import { buscarPerfilDoador } from '@/services/donorApi';
import { colors, spacing, typography } from '@/theme';
import type { DonorProfile } from '@/types/donor';

export function SettingsScreen() {
  const [profile, setProfile] = useState<DonorProfile | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  async function loadProfile() {
    setIsLoading(true);
    setError('');

    try {
      // Enquanto não há autenticação, o protótipo usa o mesmo doador da Home.
      // Quando o login existir, este id virá da sessão do usuário.
      setProfile(await buscarPerfilDoador(CURRENT_DONOR_ID));
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Não foi possível carregar o perfil.'));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadProfile();
  }, []);

  const initials = profile?.nome
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((name) => name[0])
    .join('')
    .toUpperCase() ?? userMock.initials;

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Configuracao do usuario</Text>

        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>

        <View style={styles.photoButton}>
          <Ionicons color={colors.primary[400]} name="camera" size={18} />
          <Text style={styles.photoText}>Trocar foto</Text>
        </View>

        <Text style={styles.sectionLabel}>Dados pessoais</Text>
        {isLoading ? <Text style={styles.statusText}>Carregando perfil...</Text> : null}

        {error ? (
          <View style={styles.errorCard}>
            <Ionicons color={colors.primary[500]} name="alert-circle" size={20} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {profile ? (
          <View style={styles.form}>
            {/* Somente os campos públicos retornados pelo backend são exibidos. */}
            <TextField editable={false} label="NOME" value={profile.nome} />
            <TextField editable={false} label="E-MAIL" value={profile.email} />
            <TextField editable={false} label="SEXO" value={profile.sexo} />
            <TextField editable={false} label="TIPO SANGUÍNEO" value={profile.tipoSanguineo} />
            <TextField editable={false} label="PONTOS" value={String(profile.pontosDoacao)} />
          </View>
        ) : null}

        {error ? <PrimaryButton label="TENTAR NOVAMENTE" onPress={() => void loadProfile()} /> : null}
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
  errorCard: {
    alignItems: 'center',
    backgroundColor: colors.primary[100],
    borderRadius: 12,
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.md,
  },
  errorText: {
    color: colors.primary[600],
    flex: 1,
    fontSize: typography.size.sm,
    fontWeight: '700',
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
  statusText: {
    color: colors.text.muted,
    fontSize: typography.size.md,
  },
  title: {
    color: colors.primary[400],
    fontSize: typography.size.xxl,
    fontWeight: '900',
  },
});
