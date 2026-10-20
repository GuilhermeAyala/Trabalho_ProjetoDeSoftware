import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppLogo } from '@/components/AppLogo';
import { PrimaryButton } from '@/components/PrimaryButton';
import { TextField } from '@/components/TextField';
import { useDonorSession } from '@/context/DonorSession';
import { getApiErrorMessage } from '@/services/api';
import { cadastrarDoador } from '@/services/donorApi';
import { colors, spacing, typography } from '@/theme';
import type { RootStackParamList } from '@/types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'SignUp'>;
const sangue = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const sexos = ['Feminino', 'Masculino', 'Não identificar'];

export function SignUpScreen({ navigation }: Props) {
  const { definirSessao } = useDonorSession();
  const [nome, setNome] = useState(''); const [email, setEmail] = useState(''); const [senha, setSenha] = useState('');
  const [cpf, setCpf] = useState(''); const [nascimento, setNascimento] = useState('');
  const [sexo, setSexo] = useState(''); const [tipoSanguineo, setTipoSanguineo] = useState('');
  const [erro, setErro] = useState(''); const [salvando, setSalvando] = useState(false);

  async function cadastrar() {
    setErro(''); setSalvando(true);
    try {
      const sessao = await cadastrarDoador({ nome, email, password: senha, cpf, sexo, tipoSanguineo, DataNascimento: nascimento });
      definirSessao(sessao);
      navigation.replace('AppTabs', { screen: 'Home' });
    } catch (error) { setErro(getApiErrorMessage(error, 'Não foi possível criar sua conta.')); }
    finally { setSalvando(false); }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.keyboardView}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <AppLogo />
          <View style={styles.hero}><Text style={styles.title}>Crie sua conta</Text><Text style={styles.subtitle}>Seus dados ficam vinculados à sua própria conta de doador.</Text></View>
          <View style={styles.form}>
            <TextField label="NOME COMPLETO" placeholder="Seu nome completo" value={nome} onChangeText={setNome} autoCapitalize="words" />
            <TextField label="E-MAIL" placeholder="voce@email.com" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
            <TextField label="SENHA (MÍNIMO 8 CARACTERES)" placeholder="********" value={senha} onChangeText={setSenha} secureTextEntry />
            <TextField label="CPF" placeholder="Somente números" value={cpf} onChangeText={setCpf} keyboardType="number-pad" />
            <TextField label="DATA DE NASCIMENTO" placeholder="AAAA-MM-DD" value={nascimento} onChangeText={setNascimento} />
            <Text style={styles.label}>SEXO</Text><View style={styles.options}>{sexos.map((item) => <Pressable key={item} onPress={() => setSexo(item)} style={[styles.option, sexo === item && styles.selected]}><Text style={[styles.optionText, sexo === item && styles.selectedText]}>{item}</Text></Pressable>)}</View>
            <Text style={styles.label}>TIPO SANGUÍNEO</Text><View style={styles.options}>{sangue.map((item) => <Pressable key={item} onPress={() => setTipoSanguineo(item)} style={[styles.option, tipoSanguineo === item && styles.selected]}><Text style={[styles.optionText, tipoSanguineo === item && styles.selectedText]}>{item}</Text></Pressable>)}</View>
          </View>
          {erro ? <Text style={styles.error}>{erro}</Text> : null}
          <PrimaryButton label={salvando ? 'CRIANDO CONTA...' : 'CRIAR CONTA'} disabled={salvando} onPress={() => void cadastrar()} />
          <Pressable onPress={() => navigation.navigate('DonorLogin')}><Text style={styles.loginLink}>Já tenho conta</Text></Pressable>
          <View style={styles.privacyCard}><Text style={styles.privacyText}>Sua senha é armazenada de forma protegida e nunca é exibida no perfil.</Text></View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: { flexGrow: 1, gap: spacing.xl, paddingHorizontal: spacing.xxl, paddingTop: spacing.xl, paddingBottom: 40 },
  form: { gap: spacing.lg }, hero: { gap: spacing.sm, marginTop: spacing.xl }, keyboardView: { flex: 1 },
  loginLink: { color: colors.secondary[400], fontSize: typography.size.md, fontWeight: '800', textAlign: 'center' },
  privacyCard: { backgroundColor: colors.softPrimary, borderRadius: 18, padding: 20 },
  privacyText: { color: colors.primary[600], fontSize: typography.size.sm, lineHeight: 18 }, safeArea: { backgroundColor: colors.background, flex: 1 },
  subtitle: { color: colors.text.muted, fontSize: typography.size.md + 1, lineHeight: 22 },
  title: { color: colors.text.strong, fontSize: typography.size.display, fontWeight: '900' },
  options: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }, option: { borderColor: colors.fieldBorder, borderRadius: 12, borderWidth: 1, padding: spacing.md },
  selected: { backgroundColor: colors.primary[400], borderColor: colors.primary[400] }, optionText: { color: colors.text.strong, fontWeight: '700' }, selectedText: { color: colors.white },
  label: { color: colors.primary[600], fontSize: typography.size.sm, fontWeight: '800' }, error: { color: colors.primary[600], fontWeight: '700' },
});
