import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TextField } from '@/components/TextField';
import { iniciaisDoador, useDonorSession } from '@/context/DonorSession';
import { useRefreshDonorProfile } from '@/hooks/useRefreshDonorProfile';
import { colors, spacing, typography } from '@/theme';

export function SettingsScreen() {
  useRefreshDonorProfile();
  const { sessao } = useDonorSession();
  const profile = sessao?.doador;
  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Configuração do usuário</Text>
        <View style={styles.avatar}><Text style={styles.avatarText}>{iniciaisDoador(profile)}</Text></View>
        <View style={styles.photoButton}><Ionicons color={colors.primary[400]} name="person" size={18} /><Text style={styles.photoText}>Perfil do doador</Text></View>
        <Text style={styles.sectionLabel}>Dados pessoais</Text>
        {profile ? <View style={styles.form}>
          <TextField editable={false} label="NOME" value={profile.nome} />
          <TextField editable={false} label="E-MAIL" value={profile.email} />
          <TextField editable={false} label="SEXO" value={profile.sexo} />
          <TextField editable={false} label="TIPO SANGUÍNEO" value={profile.tipoSanguineo} />
          <TextField editable={false} label="PONTOS" value={String(profile.pontosDoacao)} />
        </View> : <Text style={styles.statusText}>Entre na sua conta para ver o perfil.</Text>}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  avatar: { alignItems: 'center', alignSelf: 'center', backgroundColor: colors.softPrimary, borderRadius: 46, height: 92, justifyContent: 'center', width: 92 },
  avatarText: { color: colors.primary[400], fontSize: typography.size.xxl, fontWeight: '900' },
  content: { gap: spacing.xl, padding: spacing.xxl, paddingBottom: 120 },
  form: { gap: spacing.xl },
  photoButton: { alignItems: 'center', alignSelf: 'center', backgroundColor: colors.softPrimary, borderRadius: 18, flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.xl, paddingVertical: spacing.sm },
  photoText: { color: colors.primary[400], fontSize: typography.size.md, fontWeight: '800' },
  safeArea: { backgroundColor: colors.background, flex: 1 },
  sectionLabel: { color: colors.text.strong, fontSize: typography.size.xl, fontWeight: '900' },
  statusText: { color: colors.text.muted, fontSize: typography.size.md },
  title: { color: colors.primary[400], fontSize: typography.size.xxl, fontWeight: '900' },
});
