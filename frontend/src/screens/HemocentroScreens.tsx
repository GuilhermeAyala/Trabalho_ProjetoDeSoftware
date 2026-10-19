import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppLogo } from '@/components/AppLogo';
import { PrimaryButton } from '@/components/PrimaryButton';
import { TextField } from '@/components/TextField';
import { useHemocentroSession } from '@/context/HemocentroSession';
import { getApiErrorMessage } from '@/services/api';
import { abrirVaga, alterarCapacidadeVaga, atualizarAgendamento, cadastrarHemocentro, entrarHemocentro, listarAgenda, listarEstoque, listarMovimentacoes, listarVagasHemocentro, movimentarEstoque } from '@/services/hemocentroApi';
import { colors, spacing, typography } from '@/theme';
import type { AgendamentoHemocentro, EstoqueHemocentro, MovimentacaoEstoque, VagaHemocentro } from '@/types/hemocentro';
import type { RootStackParamList } from '@/types/navigation';

type ChoiceProps = NativeStackScreenProps<RootStackParamList, 'AccessChoice'>;
type CadastroProps = NativeStackScreenProps<RootStackParamList, 'HemocentroSignUp'>;
type LoginProps = NativeStackScreenProps<RootStackParamList, 'HemocentroLogin'>;

export function AccessChoiceScreen({ navigation }: ChoiceProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <AppLogo />
        <View style={styles.hero}>
          <Text style={styles.title}>Bem-vindo ao VITTA</Text>
          <Text style={styles.muted}>Escolha como deseja acessar o aplicativo.</Text>
        </View>
        <View style={styles.card}>
          <Ionicons color={colors.primary[400]} name="heart" size={30} />
          <Text style={styles.cardTitle}>Sou doador</Text>
          <Text style={styles.muted}>Encontre hemocentros e acompanhe suas doações.</Text>
          <PrimaryButton label="CRIAR CONTA DE DOADOR" onPress={() => navigation.navigate('SignUp')} />
          <Pressable onPress={() => navigation.navigate('DonorLogin')}><Text style={styles.link}>Já tenho conta de doador</Text></Pressable>
        </View>
        <View style={styles.card}>
          <Ionicons color={colors.secondary[400]} name="medical" size={30} />
          <Text style={styles.cardTitle}>Sou hemocentro</Text>
          <Text style={styles.muted}>Gerencie seus agendamentos e seu estoque de sangue.</Text>
          <PrimaryButton label="CADASTRAR HEMOCENTRO" onPress={() => navigation.navigate('HemocentroSignUp')} variant="secondary" />
          <Pressable onPress={() => navigation.navigate('HemocentroLogin')}><Text style={styles.link}>Já tenho cadastro de hemocentro</Text></Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export function HemocentroSignUpScreen({ navigation }: CadastroProps) {
  const { definirSessao } = useHemocentroSession();
  const [nome, setNome] = useState('');
  const [endereco, setEndereco] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);

  async function cadastrar() {
    const lat = Number(latitude.replace(',', '.'));
    const lon = Number(longitude.replace(',', '.'));
    if (!nome.trim() || !endereco.trim() || !email.trim() || !senha || !latitude.trim() || !longitude.trim()
      || !Number.isFinite(lat) || !Number.isFinite(lon)) {
      setErro('Preencha todos os campos e informe coordenadas válidas.');
      return;
    }
    setErro(''); setSalvando(true);
    try {
      const sessao = await cadastrarHemocentro({ nome, endereco, latitude: lat, longitude: lon, email, senha });
      definirSessao(sessao);
      navigation.replace('HemocentroTabs');
    } catch (error) { setErro(getApiErrorMessage(error, 'Não foi possível cadastrar o hemocentro.')); }
    finally { setSalvando(false); }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <AppLogo />
          <View style={styles.hero}>
            <Text style={styles.title}>Cadastro do hemocentro</Text>
            <Text style={styles.muted}>Crie o acesso da instituição para cuidar da agenda e do estoque.</Text>
          </View>
          <View style={styles.form}>
            <TextField label="NOME DO HEMOCENTRO" value={nome} onChangeText={setNome} placeholder="Nome da instituição" />
            <TextField label="ENDEREÇO COMPLETO" value={endereco} onChangeText={setEndereco} placeholder="Rua, número, cidade e UF" />
            <Text style={styles.hint}>Informe as coordenadas do endereço. Você pode consultá-las em um mapa; o cadastro não faz busca automática.</Text>
            <View style={styles.coordinates}>
              <View style={styles.flex}><TextField label="LATITUDE" value={latitude} onChangeText={setLatitude} keyboardType="decimal-pad" placeholder="-15.77972" /></View>
              <View style={styles.flex}><TextField label="LONGITUDE" value={longitude} onChangeText={setLongitude} keyboardType="decimal-pad" placeholder="-47.92972" /></View>
            </View>
            <TextField label="E-MAIL DE ACESSO" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="contato@hemocentro.org" />
            <TextField label="SENHA" value={senha} onChangeText={setSenha} secureTextEntry placeholder="Mínimo de 8 caracteres" />
          </View>
          {erro ? <Text style={styles.error}>{erro}</Text> : null}
          <PrimaryButton label={salvando ? 'CADASTRANDO...' : 'CADASTRAR HEMOCENTRO'} disabled={salvando} onPress={() => void cadastrar()} />
          <Pressable onPress={() => navigation.navigate('HemocentroLogin')}><Text style={styles.link}>Já tenho cadastro</Text></Pressable>
          <Pressable onPress={() => navigation.navigate('AccessChoice')}><Text style={styles.link}>Voltar à escolha de acesso</Text></Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export function HemocentroLoginScreen({ navigation }: LoginProps) {
  const { definirSessao } = useHemocentroSession();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function entrar() {
    setErro(''); setCarregando(true);
    try {
      const sessao = await entrarHemocentro(email, senha);
      definirSessao(sessao);
      navigation.replace('HemocentroTabs');
    } catch (error) { setErro(getApiErrorMessage(error, 'Não foi possível entrar.')); }
    finally { setCarregando(false); }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <AppLogo />
        <View style={styles.hero}><Text style={styles.title}>Acesso do hemocentro</Text><Text style={styles.muted}>Entre na área exclusiva da sua instituição.</Text></View>
        <TextField label="E-MAIL" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
        <TextField label="SENHA" value={senha} onChangeText={setSenha} secureTextEntry />
        {erro ? <Text style={styles.error}>{erro}</Text> : null}
        <PrimaryButton label={carregando ? 'ENTRANDO...' : 'ENTRAR'} disabled={carregando} onPress={() => void entrar()} />
        <Pressable onPress={() => navigation.navigate('HemocentroSignUp')}><Text style={styles.link}>Cadastrar hemocentro</Text></Pressable>
        <Pressable onPress={() => navigation.navigate('AccessChoice')}><Text style={styles.link}>Voltar à escolha de acesso</Text></Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

export function HemocentroAgendaScreen() {
  const { sessao } = useHemocentroSession();
  const [agendamentos, setAgendamentos] = useState<AgendamentoHemocentro[]>([]);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [alterando, setAlterando] = useState<number | null>(null);

  async function carregar() {
    if (!sessao) return;
    setCarregando(true); setErro('');
    try { setAgendamentos(await listarAgenda(sessao.token)); }
    catch (error) { setErro(getApiErrorMessage(error, 'Não foi possível carregar a agenda.')); }
    finally { setCarregando(false); }
  }
  useEffect(() => { void carregar(); }, [sessao?.token]);

  async function mudar(id: number, status: AgendamentoHemocentro['status']) {
    if (!sessao) return;
    setAlterando(id); setErro('');
    try { await atualizarAgendamento(sessao.token, id, status); await carregar(); }
    catch (error) { setErro(getApiErrorMessage(error, 'Não foi possível alterar o agendamento.')); }
    finally { setAlterando(null); }
  }

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Agenda do hemocentro</Text>
        <Text style={styles.muted}>{sessao?.hemocentro.nome}</Text>
        <PrimaryButton label="ATUALIZAR AGENDA" variant="light" onPress={() => void carregar()} />
        {carregando ? <Text style={styles.muted}>Carregando agendamentos...</Text> : null}
        {erro ? <Text style={styles.error}>{erro}</Text> : null}
        {!carregando && !erro && agendamentos.length === 0 ? <Text style={styles.muted}>Nenhum agendamento para este hemocentro.</Text> : null}
        {agendamentos.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.between}><Text style={styles.cardTitle}>{item.doador.nome}</Text><Text style={styles.badge}>{item.status}</Text></View>
            <Text style={styles.muted}>{item.data.slice(0, 10)} às {item.horario} · {item.doador.tipoSanguineo}</Text>
            <Text style={styles.muted}>{item.doador.email}</Text>
            {item.status === 'AGENDADO' ? <View style={styles.actions}>
              <Action label="Confirmar" disabled={alterando === item.id} onPress={() => void mudar(item.id, 'CONFIRMADO')} />
              <Action label="Cancelar" disabled={alterando === item.id} onPress={() => void mudar(item.id, 'CANCELADO')} />
            </View> : null}
            {item.status === 'CONFIRMADO' ? <View style={styles.actions}>
              <Action label="Marcar realizado" disabled={alterando === item.id} onPress={() => void mudar(item.id, 'REALIZADO')} />
              <Action label="Cancelar" disabled={alterando === item.id} onPress={() => void mudar(item.id, 'CANCELADO')} />
            </View> : null}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function Action({ label, onPress, disabled = false }: { label: string; onPress: () => void; disabled?: boolean }) {
  return <Pressable disabled={disabled} onPress={onPress} style={styles.action}><Text style={styles.actionText}>{label}</Text></Pressable>;
}

export function HemocentroEstoqueScreen() {
  const { sessao } = useHemocentroSession();
  const [estoques, setEstoques] = useState<EstoqueHemocentro[]>([]);
  const [historico, setHistorico] = useState<MovimentacaoEstoque[]>([]);
  const [selecionado, setSelecionado] = useState('');
  const [tipo, setTipo] = useState<'ENTRADA' | 'BAIXA'>('BAIXA');
  const [quantidade, setQuantidade] = useState('');
  const [motivo, setMotivo] = useState('');
  const [erro, setErro] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  async function carregar() {
    if (!sessao) return;
    setCarregando(true); setErro('');
    try {
      const [lista, movimentos] = await Promise.all([listarEstoque(sessao.token), listarMovimentacoes(sessao.token)]);
      setEstoques(lista); setHistorico(movimentos);
    } catch (error) { setErro(getApiErrorMessage(error, 'Não foi possível carregar o estoque.')); }
    finally { setCarregando(false); }
  }
  useEffect(() => { void carregar(); }, [sessao?.token]);

  async function salvar() {
    if (!sessao) return;
    const valor = Number(quantidade);
    if (!selecionado || !Number.isInteger(valor) || valor <= 0 || motivo.trim().length < 3) {
      setErro('Selecione o tipo sanguíneo e informe quantidade inteira e motivo.'); return;
    }
    setSalvando(true); setErro(''); setMensagem('');
    try {
      await movimentarEstoque(sessao.token, { tipoSanguineo: selecionado, tipo, quantidade: valor, motivo });
      setQuantidade(''); setMotivo(''); setMensagem(`${tipo === 'BAIXA' ? 'Baixa' : 'Entrada'} registrada para ${selecionado}.`);
      await carregar();
    } catch (error) { setErro(getApiErrorMessage(error, 'Não foi possível atualizar o estoque.')); }
    finally { setSalvando(false); }
  }

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.sectionTitle}>Estoque de sangue</Text>
        <Text style={styles.muted}>Quantidades em bolsas · {sessao?.hemocentro.nome}</Text>
        <PrimaryButton label="ATUALIZAR ESTOQUE" variant="light" onPress={() => void carregar()} />
        {carregando ? <Text style={styles.muted}>Carregando estoque...</Text> : null}
        <View style={styles.stockGrid}>
          {estoques.map((item) => <Pressable key={item.id} onPress={() => setSelecionado(item.tipoSanguineo)} style={[styles.stockCard, selecionado === item.tipoSanguineo && styles.selected]}>
            <Text style={styles.bloodType}>{item.tipoSanguineo}</Text>
            <Text style={styles.stockCount}>{item.quantidade} bolsas</Text>
            <Text style={styles.muted}>{item.nivel}</Text>
          </Pressable>)}
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Movimentar estoque</Text>
          <Text style={styles.muted}>Tipo selecionado: {selecionado || 'toque em um cartão acima'}</Text>
          <View style={styles.actions}>
            <Action label="Registrar baixa" onPress={() => setTipo('BAIXA')} />
            <Action label="Registrar entrada" onPress={() => setTipo('ENTRADA')} />
          </View>
          <Text style={styles.hint}>Operação: {tipo === 'BAIXA' ? 'baixa' : 'entrada'}</Text>
          <TextField label="QUANTIDADE DE BOLSAS" value={quantidade} onChangeText={setQuantidade} keyboardType="number-pad" placeholder="Ex.: 2" />
          <TextField label="MOTIVO" value={motivo} onChangeText={setMotivo} placeholder="Ex.: uso em atendimento" />
          <PrimaryButton label={salvando ? 'SALVANDO...' : 'CONFIRMAR MOVIMENTAÇÃO'} disabled={salvando} onPress={() => void salvar()} />
        </View>
        {erro ? <Text style={styles.error}>{erro}</Text> : null}
        {mensagem ? <Text style={styles.success}>{mensagem}</Text> : null}
        <Text style={styles.cardTitle}>Últimas movimentações</Text>
        {historico.length === 0 ? <Text style={styles.muted}>Ainda não há movimentações.</Text> : null}
        {historico.map((item) => <View key={item.id} style={styles.historyRow}>
          <Text style={styles.historyTitle}>{item.estoque.tipoSanguineo} · {item.tipo === 'BAIXA' ? '−' : '+'}{item.quantidade} bolsas</Text>
          <Text style={styles.muted}>{item.motivo} · {new Date(item.criadaEm).toLocaleDateString('pt-BR')}</Text>
        </View>)}
      </ScrollView>
    </SafeAreaView>
  );
}

export function HemocentroVagasScreen() {
  const { sessao } = useHemocentroSession();
  const [vagas, setVagas] = useState<VagaHemocentro[]>([]);
  const [data, setData] = useState('');
  const [horario, setHorario] = useState('');
  const [capacidade, setCapacidade] = useState('');
  const [edicao, setEdicao] = useState<number | null>(null);
  const [erro, setErro] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [salvando, setSalvando] = useState(false);

  async function carregar() {
    if (!sessao) return;
    setErro('');
    try { setVagas(await listarVagasHemocentro(sessao.token)); }
    catch (error) { setErro(getApiErrorMessage(error, 'Não foi possível carregar as vagas.')); }
  }
  useEffect(() => { void carregar(); }, [sessao?.token]);

  async function salvar() {
    if (!sessao) return;
    const numero = Number(capacidade);
    if (!Number.isInteger(numero) || numero < 1 || numero > 100 || (!edicao && (!data || !horario))) {
      setErro('Informe data, horário e capacidade entre 1 e 100.'); return;
    }
    setSalvando(true); setErro(''); setMensagem('');
    try {
      if (edicao) await alterarCapacidadeVaga(sessao.token, edicao, numero);
      else await abrirVaga(sessao.token, data, horario, numero);
      setEdicao(null); setData(''); setHorario(''); setCapacidade('');
      setMensagem('Vaga salva com sucesso.'); await carregar();
    } catch (error) { setErro(getApiErrorMessage(error, 'Não foi possível salvar a vaga.')); }
    finally { setSalvando(false); }
  }

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.sectionTitle}>Vagas para doação</Text>
        <Text style={styles.muted}>Abra horários e defina quantos doadores poderão agendar.</Text>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{edicao ? 'Alterar capacidade' : 'Abrir novo horário'}</Text>
          {!edicao ? <>
            <TextField label="DATA (AAAA-MM-DD)" value={data} onChangeText={setData} placeholder="2026-11-10" />
            <TextField label="HORÁRIO (HH:MM)" value={horario} onChangeText={setHorario} placeholder="13:30" />
          </> : null}
          <TextField label="CAPACIDADE" value={capacidade} onChangeText={setCapacidade} keyboardType="number-pad" placeholder="Ex.: 4" />
          <PrimaryButton label={salvando ? 'SALVANDO...' : 'SALVAR VAGA'} disabled={salvando} onPress={() => void salvar()} />
          {edicao ? <Action label="Cancelar edição" onPress={() => { setEdicao(null); setCapacidade(''); }} /> : null}
        </View>
        {erro ? <Text style={styles.error}>{erro}</Text> : null}
        {mensagem ? <Text style={styles.success}>{mensagem}</Text> : null}
        <PrimaryButton label="ATUALIZAR VAGAS" variant="light" onPress={() => void carregar()} />
        <Text style={styles.cardTitle}>Horários abertos</Text>
        {vagas.length === 0 ? <Text style={styles.muted}>Nenhum horário aberto.</Text> : null}
        {vagas.map((vaga) => <View key={vaga.id} style={styles.card}>
          <View style={styles.between}><Text style={styles.cardTitle}>{vaga.data.slice(0, 10)} · {vaga.horario}</Text><Text style={styles.badge}>{vaga.capacidade - vaga.reservadas} livres</Text></View>
          <Text style={styles.muted}>{vaga.reservadas} de {vaga.capacidade} vagas reservadas</Text>
          <Action label="Alterar capacidade" onPress={() => { setEdicao(vaga.id); setCapacidade(String(vaga.capacidade)); }} />
        </View>)}
      </ScrollView>
    </SafeAreaView>
  );
}

export function HemocentroPerfilScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { sessao, definirSessao } = useHemocentroSession();
  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Dados do hemocentro</Text>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{sessao?.hemocentro.nome}</Text>
          <Text style={styles.muted}>{sessao?.hemocentro.endereco}</Text>
          <Text style={styles.muted}>Latitude: {sessao?.hemocentro.latitude}</Text>
          <Text style={styles.muted}>Longitude: {sessao?.hemocentro.longitude}</Text>
        </View>
        <PrimaryButton label="SAIR DA ÁREA DO HEMOCENTRO" onPress={() => {
          definirSessao(null);
          navigation.reset({ index: 0, routes: [{ name: 'AccessChoice' }] });
        }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: colors.background, flex: 1 },
  flex: { flex: 1 },
  content: { flexGrow: 1, gap: spacing.xl, padding: spacing.xl, paddingBottom: 120 },
  hero: { gap: spacing.sm, marginTop: spacing.md },
  title: { color: colors.text.strong, fontSize: typography.size.display, fontWeight: '900' },
  sectionTitle: { color: colors.primary[400], fontSize: typography.size.xxl, fontWeight: '900' },
  cardTitle: { color: colors.text.strong, fontSize: typography.size.lg, fontWeight: '800' },
  muted: { color: colors.text.muted, fontSize: typography.size.md, lineHeight: 21 },
  hint: { color: colors.primary[600], fontSize: typography.size.sm, lineHeight: 19 },
  card: { backgroundColor: colors.white, borderColor: colors.border, borderRadius: 16, borderWidth: 1.5, gap: spacing.md, padding: spacing.lg },
  form: { gap: spacing.lg },
  coordinates: { flexDirection: 'row', gap: spacing.md },
  link: { color: colors.secondary[400], fontSize: typography.size.md, fontWeight: '800', textAlign: 'center' },
  error: { color: colors.primary[600], fontSize: typography.size.md, fontWeight: '700' },
  success: { color: '#087F54', fontSize: typography.size.md, fontWeight: '700' },
  between: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', gap: spacing.sm },
  badge: { backgroundColor: colors.softPrimary, color: colors.primary[600], fontSize: typography.size.xs, fontWeight: '800', overflow: 'hidden', padding: spacing.sm, borderRadius: 8 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  action: { backgroundColor: colors.softPrimary, borderRadius: 10, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  actionText: { color: colors.primary[600], fontSize: typography.size.sm, fontWeight: '800' },
  stockGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  stockCard: { backgroundColor: colors.white, borderColor: colors.border, borderRadius: 14, borderWidth: 1.5, gap: 4, padding: spacing.md, width: '47%' },
  selected: { borderColor: colors.primary[400], backgroundColor: colors.softPrimary },
  bloodType: { color: colors.primary[400], fontSize: typography.size.xxl, fontWeight: '900' },
  stockCount: { color: colors.text.strong, fontSize: typography.size.md, fontWeight: '800' },
  historyRow: { borderBottomColor: colors.border, borderBottomWidth: 1, gap: 4, paddingBottom: spacing.md },
  historyTitle: { color: colors.text.strong, fontSize: typography.size.md, fontWeight: '800' },
});
