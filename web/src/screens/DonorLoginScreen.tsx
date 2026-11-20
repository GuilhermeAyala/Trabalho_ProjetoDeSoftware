import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppLogo } from '@/components/AppLogo';
import { PrimaryButton } from '@/components/PrimaryButton';
import { TextField } from '@/components/TextField';
import { useDonorSession } from '@/context/DonorSession';
import { getApiErrorMessage } from '@/services/api';
import { entrarDoador } from '@/services/donorApi';
import { colors, spacing, typography } from '@/theme';
import type { RootStackParamList } from '@/types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'DonorLogin'>;

export function DonorLoginScreen({ navigation }: Props) {
  const { definirSessao } = useDonorSession();
  const [email, setEmail] = useState(''); const [senha, setSenha] = useState('');
  const [erro, setErro] = useState(''); const [carregando, setCarregando] = useState(false);
  async function entrar() {
    setErro(''); setCarregando(true);
    try { definirSessao(await entrarDoador(email, senha)); navigation.replace('AppTabs', { screen: 'Home' }); }
    catch (error) { setErro(getApiErrorMessage(error, 'Não foi possível entrar.')); }
    finally { setCarregando(false); }
  }
  return <SafeAreaView style={styles.safe}><ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
    <AppLogo /><View style={styles.hero}><Text style={styles.title}>Acesso do doador</Text><Text style={styles.subtitle}>Entre com o e-mail e a senha da sua conta.</Text></View>
    <View style={styles.form}><TextField label="E-MAIL" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" /><TextField label="SENHA" value={senha} onChangeText={setSenha} secureTextEntry /></View>
    {erro ? <Text style={styles.error}>{erro}</Text> : null}
    <PrimaryButton label={carregando ? 'ENTRANDO...' : 'ENTRAR'} disabled={carregando} onPress={() => void entrar()} />
    <Pressable onPress={() => navigation.navigate('SignUp')}><Text style={styles.link}>Criar conta de doador</Text></Pressable>
    <Pressable onPress={() => navigation.navigate('AccessChoice')}><Text style={styles.link}>Voltar à escolha de acesso</Text></Pressable>
  </ScrollView></SafeAreaView>;
}

const styles = StyleSheet.create({ safe: { backgroundColor: colors.background, flex: 1 }, content: { flexGrow: 1, gap: spacing.xl, padding: spacing.xxl }, hero: { gap: spacing.sm }, title: { color: colors.text.strong, fontSize: typography.size.display, fontWeight: '900' }, subtitle: { color: colors.text.muted, fontSize: typography.size.md }, form: { gap: spacing.xl }, link: { color: colors.secondary[400], fontSize: typography.size.md, fontWeight: '800', textAlign: 'center' }, error: { color: colors.primary[600], fontWeight: '700' } });
