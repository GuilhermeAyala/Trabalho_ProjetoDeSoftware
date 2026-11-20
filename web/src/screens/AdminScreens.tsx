import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppLogo } from '@/components/AppLogo';
import { PrimaryButton } from '@/components/PrimaryButton';
import { TextField } from '@/components/TextField';
import { getApiErrorMessage } from '@/services/api';
import { agendaAdmin, alterarAgendaAdmin, alterarVagaAdmin, abrirVagaAdmin, ativarCentroAdmin, decidirSolicitacao,
  editarCentroAdmin, entrarAdmin, estoqueAdmin, excluirCentroAdmin, listarCentrosAdmin, listarSolicitacoes, movimentarEstoqueAdmin, vagasAdmin,
  type CentroAdmin } from '@/services/adminApi';
import { colors, spacing, typography } from '@/theme';
import type { AgendamentoHemocentro, EstoqueHemocentro, VagaHemocentro } from '@/types/hemocentro';
import type { RootStackParamList } from '@/types/navigation';

type LoginProps = NativeStackScreenProps<RootStackParamList, 'AdminLogin'>;
type PanelProps = NativeStackScreenProps<RootStackParamList, 'AdminPanel'>;
type Area = 'solicitacoes' | 'hemocentros' | 'horarios';

function SmallAction({ label, onPress, danger = false, disabled = false }: { label: string; onPress: () => void; danger?: boolean; disabled?: boolean }) {
  return <Pressable accessibilityRole="button" disabled={disabled} onPress={onPress} style={[styles.smallAction, danger && styles.dangerAction, disabled && styles.disabled]}>
    <Text style={[styles.smallActionText, danger && styles.dangerText]}>{label}</Text>
  </Pressable>;
}

export function AdminLoginScreen({ navigation }: LoginProps) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  async function entrar() {
    setCarregando(true); setErro('');
    try { const sessao = await entrarAdmin(email, senha); navigation.replace('AdminPanel', { token: sessao.token }); }
    catch (error) { setErro(getApiErrorMessage(error, 'Não foi possível entrar.')); }
    finally { setCarregando(false); }
  }
  return <SafeAreaView style={styles.safe}><ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
    <AppLogo />
    <Text style={styles.title}>Acesso do administrador</Text>
    <Text style={styles.muted}>Analise solicitações e acompanhe os hemocentros do VITTA.</Text>
    <TextField label="E-MAIL" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
    <TextField label="SENHA" value={senha} onChangeText={setSenha} secureTextEntry />
    {erro ? <Text style={styles.error}>{erro}</Text> : null}
    <PrimaryButton label={carregando ? 'ENTRANDO...' : 'ENTRAR'} disabled={carregando} onPress={() => void entrar()} />
    <SmallAction label="Voltar à escolha de acesso" onPress={() => navigation.navigate('AccessChoice')} />
  </ScrollView></SafeAreaView>;
}

export function AdminPanelScreen({ navigation, route }: PanelProps) {
  const token = route.params.token;
  const [area, setArea] = useState<Area>('solicitacoes');
  const [solicitacoes, setSolicitacoes] = useState<CentroAdmin[]>([]);
  const [centros, setCentros] = useState<CentroAdmin[]>([]);
  const [selecionado, setSelecionado] = useState<number | null>(null);
  const [estoque, setEstoque] = useState<EstoqueHemocentro[]>([]);
  const [vagas, setVagas] = useState<VagaHemocentro[]>([]);
  const [agenda, setAgenda] = useState<AgendamentoHemocentro[]>([]);
  const [erro, setErro] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [ocupado, setOcupado] = useState(false);
  const [nome, setNome] = useState('');
  const [endereco, setEndereco] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [tipoSanguineo, setTipoSanguineo] = useState('');
  const [tipoMovimento, setTipoMovimento] = useState<'ENTRADA' | 'BAIXA'>('ENTRADA');
  const [quantidade, setQuantidade] = useState('');
  const [motivo, setMotivo] = useState('');
  const [data, setData] = useState('');
  const [horario, setHorario] = useState('');
  const [capacidade, setCapacidade] = useState('');
  const [vagaEditando, setVagaEditando] = useState<number | null>(null);
  const centro = centros.find((item) => item.id === selecionado);

  async function carregarListas() {
    const [pedidos, lista] = await Promise.all([listarSolicitacoes(token), listarCentrosAdmin(token)]);
    setSolicitacoes(pedidos); setCentros(lista);
  }
  async function carregarDetalhes(id: number) {
    const [novoEstoque, novasVagas, novaAgenda] = await Promise.all([estoqueAdmin(token, id), vagasAdmin(token, id), agendaAdmin(token, id)]);
    setEstoque(novoEstoque); setVagas(novasVagas); setAgenda(novaAgenda);
  }
  useEffect(() => { void carregarListas().catch((error) => setErro(getApiErrorMessage(error, 'Não foi possível carregar os dados.'))); }, [token]);
  useEffect(() => {
    const item = centros.find((c) => c.id === selecionado);
    if (!item) return;
    setNome(item.nome); setEndereco(item.endereco); setLatitude(String(item.latitude)); setLongitude(String(item.longitude));
    if (item.status === 'APROVADO') void carregarDetalhes(item.id).catch((error) => setErro(getApiErrorMessage(error, 'Não foi possível carregar os detalhes.')));
    else { setEstoque([]); setVagas([]); setAgenda([]); }
  }, [selecionado, centros]);

  async function executar(acao: () => Promise<unknown>, sucesso: string, atualizarDetalhes = false) {
    setOcupado(true); setErro(''); setMensagem('');
    try {
      await acao();
      await carregarListas();
      if (atualizarDetalhes && selecionado) await carregarDetalhes(selecionado);
      setMensagem(sucesso);
      return true;
    } catch (error) { setErro(getApiErrorMessage(error, 'Não foi possível concluir a operação.')); }
    finally { setOcupado(false); }
    return false;
  }

  function salvarCentro() {
    if (!selecionado) return;
    void executar(() => editarCentroAdmin(token, selecionado, { nome, endereco, latitude: Number(latitude.replace(',', '.')), longitude: Number(longitude.replace(',', '.')) }), 'Hemocentro atualizado.');
  }
  function salvarMovimento() {
    if (!selecionado) return;
    void executar(() => movimentarEstoqueAdmin(token, selecionado, { tipoSanguineo, tipo: tipoMovimento, quantidade: Number(quantidade), motivo }), 'Estoque atualizado.', true);
  }
  async function salvarVaga() {
    if (!selecionado) return;
    const acao = vagaEditando ? () => alterarVagaAdmin(token, selecionado, vagaEditando, Number(capacidade))
      : () => abrirVagaAdmin(token, selecionado, data, horario, Number(capacidade));
    if (await executar(acao, 'Horário salvo.', true)) {
      setVagaEditando(null); setData(''); setHorario(''); setCapacidade('');
    }
  }

  return <SafeAreaView style={styles.safe}><ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
    <View style={styles.header}><View><Text style={styles.eyebrow}>VITTA · ADMIN</Text><Text style={styles.title}>Painel administrativo</Text></View>
      <SmallAction label="Sair" onPress={() => navigation.reset({ index: 0, routes: [{ name: 'AccessChoice' }] })} /></View>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.menu}>
      {([['solicitacoes', '1 · Requisições de hemocentro'], ['hemocentros', '2 · Hemocentros'], ['horarios', '3 · Horários e comparecimento']] as const).map(([chave, rotulo]) =>
        <Pressable key={chave} accessibilityRole="tab" accessibilityState={{ selected: area === chave }} onPress={() => { setArea(chave); setErro(''); setMensagem(''); }} style={[styles.menuItem, area === chave && styles.menuActive]}>
          <Text style={[styles.menuText, area === chave && styles.menuTextActive]}>{rotulo}</Text>
        </Pressable>)}
    </ScrollView>
    {erro ? <Text style={styles.error}>{erro}</Text> : null}
    {mensagem ? <Text style={styles.success}>{mensagem}</Text> : null}

    {area === 'solicitacoes' ? <>
      <Text style={styles.section}>Requisições de hemocentro</Text>
      <Text style={styles.muted}>Confira os dados enviados no formulário de cadastro antes de decidir.</Text>
      {solicitacoes.length === 0 ? <Text style={styles.empty}>Nenhuma solicitação pendente.</Text> : null}
      {solicitacoes.map((item) => <View key={item.id} style={styles.card}>
        <Text style={styles.cardTitle}>{item.nome}</Text><Text style={styles.muted}>{item.endereco}</Text>
        <Text style={styles.muted}>E-mail: {item.conta?.email}</Text>
        <Text style={styles.muted}>Latitude: {item.latitude} · Longitude: {item.longitude}</Text>
        <View style={styles.actions}>
          <SmallAction label="Aceitar" disabled={ocupado} onPress={() => void executar(() => decidirSolicitacao(token, item.id, 'APROVADO'), 'Solicitação aprovada. O hemocentro verá a decisão ao entrar.')} />
          <SmallAction label="Recusar" danger disabled={ocupado} onPress={() => void executar(() => decidirSolicitacao(token, item.id, 'RECUSADO'), 'Solicitação recusada. O hemocentro verá a decisão ao entrar.')} />
        </View>
      </View>)}
    </> : null}

    {area !== 'solicitacoes' ? <>
      <Text style={styles.section}>{area === 'hemocentros' ? 'Hemocentros' : 'Horários e comparecimento'}</Text>
      <Text style={styles.muted}>Selecione um hemocentro para {area === 'hemocentros' ? 'ver seus dados e estoque.' : 'gerenciar as vagas e a presença dos doadores.'}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.choices}>
        {centros.map((item) => <Pressable key={item.id} onPress={() => setSelecionado(item.id)} style={[styles.choice, selecionado === item.id && styles.choiceActive]}>
          <Text style={[styles.choiceText, selecionado === item.id && styles.choiceTextActive]}>{item.nome}</Text>
        </Pressable>)}
      </ScrollView>
      {!centro ? <Text style={styles.empty}>Selecione um hemocentro acima.</Text> : null}
      {centro?.status === 'DESATIVADO' ? <View style={styles.card}><Text style={styles.cardTitle}>{centro.nome}</Text><Text style={styles.muted}>Este hemocentro está desativado.</Text>
        <SmallAction label="Reativar hemocentro" disabled={ocupado} onPress={() => void executar(() => ativarCentroAdmin(token, centro.id, 'APROVADO'), 'Hemocentro reativado.')} /></View> : null}
    </> : null}

    {area === 'hemocentros' && centro?.status === 'APROVADO' ? <>
      <View style={styles.card}><Text style={styles.cardTitle}>Informações de {centro.nome}</Text>
        <Text style={styles.muted}>E-mail de acesso: {centro.conta?.email}</Text>
        <TextField label="NOME" value={nome} onChangeText={setNome} />
        <TextField label="ENDEREÇO" value={endereco} onChangeText={setEndereco} />
        <View style={styles.row}><View style={styles.flex}><TextField label="LATITUDE" value={latitude} onChangeText={setLatitude} keyboardType="decimal-pad" /></View>
          <View style={styles.flex}><TextField label="LONGITUDE" value={longitude} onChangeText={setLongitude} keyboardType="decimal-pad" /></View></View>
        <PrimaryButton label="SALVAR INFORMAÇÕES" disabled={ocupado} onPress={salvarCentro} />
        <SmallAction label="Excluir hemocentro" danger disabled={ocupado} onPress={() => void executar(() => excluirCentroAdmin(token, centro.id), 'Hemocentro excluído da busca pública. Histórico preservado.')} />
      </View>
      <Text style={styles.section}>Estoque de sangue</Text>
      <View style={styles.grid}>{estoque.map((item) => <View key={item.id} style={styles.stock}>
        <Text style={styles.blood}>{item.tipoSanguineo}</Text><Text style={styles.cardTitle}>{item.quantidade} bolsas</Text><Text style={styles.muted}>{item.nivel}</Text>
      </View>)}</View>
      <View style={styles.card}><Text style={styles.cardTitle}>Movimentar estoque</Text>
        <Text style={styles.fieldLabel}>TIPO SANGUÍNEO</Text>
        <Text style={styles.muted}>Selecione o tipo sanguíneo para esta movimentação.</Text>
        <View style={styles.bloodChoices}>{estoque.map((item) => <Pressable key={item.id} accessibilityRole="radio" accessibilityState={{ selected: tipoSanguineo === item.tipoSanguineo }} onPress={() => setTipoSanguineo(item.tipoSanguineo)} style={[styles.bloodChoice, tipoSanguineo === item.tipoSanguineo && styles.bloodChoiceActive]}>
          <Text style={[styles.bloodChoiceText, tipoSanguineo === item.tipoSanguineo && styles.bloodChoiceTextActive]}>{item.tipoSanguineo}</Text>
        </Pressable>)}</View>
        <Text style={styles.muted}>Tipo selecionado: {tipoSanguineo || 'nenhum'}</Text>
        <View style={styles.actions}><SmallAction label="Entrada" onPress={() => setTipoMovimento('ENTRADA')} /><SmallAction label="Baixa" onPress={() => setTipoMovimento('BAIXA')} /></View>
        <Text style={styles.muted}>Operação: {tipoMovimento === 'ENTRADA' ? 'entrada' : 'baixa'}</Text>
        <TextField label="QUANTIDADE" value={quantidade} onChangeText={setQuantidade} keyboardType="number-pad" />
        <TextField label="MOTIVO" value={motivo} onChangeText={setMotivo} />
        <PrimaryButton label="CONFIRMAR MOVIMENTAÇÃO" disabled={ocupado || !tipoSanguineo} onPress={salvarMovimento} />
      </View>
    </> : null}

    {area === 'horarios' && centro?.status === 'APROVADO' ? <>
      <View style={styles.card}><Text style={styles.cardTitle}>{vagaEditando ? 'Alterar capacidade' : 'Abrir horário de doação'}</Text>
        {!vagaEditando ? <><TextField label="DATA (AAAA-MM-DD)" value={data} onChangeText={setData} placeholder="2026-11-10" />
          <TextField label="HORÁRIO (HH:MM)" value={horario} onChangeText={setHorario} placeholder="13:30" /></> : null}
        <TextField label="CAPACIDADE" value={capacidade} onChangeText={setCapacidade} keyboardType="number-pad" />
        <PrimaryButton label="SALVAR HORÁRIO" disabled={ocupado} onPress={() => void salvarVaga()} />
        {vagaEditando ? <SmallAction label="Cancelar edição" onPress={() => { setVagaEditando(null); setCapacidade(''); }} /> : null}
      </View>
      <Text style={styles.section}>Horários abertos</Text>
      {vagas.length === 0 ? <Text style={styles.empty}>Nenhum horário aberto.</Text> : null}
      {vagas.map((vaga) => <View key={vaga.id} style={styles.card}>
        <Text style={styles.cardTitle}>{vaga.data.slice(0, 10)} · {vaga.horario}</Text>
        <Text style={styles.muted}>{vaga.reservadas} de {vaga.capacidade} vagas reservadas</Text>
        <SmallAction label="Alterar capacidade" onPress={() => { setVagaEditando(vaga.id); setCapacidade(String(vaga.capacidade)); }} />
      </View>)}
      <Text style={styles.section}>Comparecimento dos doadores</Text>
      {agenda.length === 0 ? <Text style={styles.empty}>Nenhum agendamento neste hemocentro.</Text> : null}
      {agenda.map((item) => <View key={item.id} style={styles.card}>
        <Text style={styles.cardTitle}>{item.doador.nome}</Text>
        <Text style={styles.muted}>{item.data.slice(0, 10)} às {item.horario} · {item.doador.tipoSanguineo}</Text>
        <Text style={styles.muted}>{item.doador.email} · {item.status.replaceAll('_', ' ')}</Text>
        {item.status === 'AGENDADO' ? <View style={styles.actions}>
          <SmallAction label="Confirmar" disabled={ocupado} onPress={() => void executar(() => alterarAgendaAdmin(token, centro.id, item.id, 'CONFIRMADO'), 'Agendamento confirmado.', true)} />
          <SmallAction label="Cancelar" danger disabled={ocupado} onPress={() => void executar(() => alterarAgendaAdmin(token, centro.id, item.id, 'CANCELADO'), 'Agendamento cancelado.', true)} />
        </View> : null}
        {item.status === 'CONFIRMADO' ? <View style={styles.actions}>
          <SmallAction label="Compareceu" disabled={ocupado} onPress={() => void executar(() => alterarAgendaAdmin(token, centro.id, item.id, 'REALIZADO'), 'Comparecimento registrado.', true)} />
          <SmallAction label="Não compareceu" danger disabled={ocupado} onPress={() => void executar(() => alterarAgendaAdmin(token, centro.id, item.id, 'NAO_COMPARECEU'), 'Ausência registrada.', true)} />
        </View> : null}
      </View>)}
    </> : null}
  </ScrollView></SafeAreaView>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background }, content: { flexGrow: 1, gap: spacing.lg, padding: spacing.xl, paddingBottom: 90 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
  eyebrow: { color: colors.secondary[400], fontSize: typography.size.xs, fontWeight: '900' },
  title: { color: colors.text.strong, fontSize: typography.size.display, fontWeight: '900' },
  section: { color: colors.primary[400], fontSize: typography.size.xxl, fontWeight: '900' },
  muted: { color: colors.text.muted, fontSize: typography.size.md, lineHeight: 21 },
  error: { color: colors.primary[600], fontWeight: '700' }, success: { color: '#087F54', fontWeight: '700' },
  empty: { color: colors.text.muted, backgroundColor: colors.softPrimary, borderRadius: 14, padding: spacing.lg },
  menu: { flexDirection: 'row', gap: spacing.sm, paddingVertical: spacing.sm },
  menuItem: { borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: spacing.md, paddingVertical: spacing.md },
  menuActive: { backgroundColor: colors.primary[400], borderColor: colors.primary[400] },
  menuText: { color: colors.primary[600], fontWeight: '800' }, menuTextActive: { color: colors.white },
  card: { backgroundColor: colors.white, borderWidth: 1.5, borderColor: colors.border, borderRadius: 16, padding: spacing.lg, gap: spacing.md },
  cardTitle: { color: colors.text.strong, fontSize: typography.size.lg, fontWeight: '800' },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  smallAction: { backgroundColor: colors.softPrimary, borderRadius: 10, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, alignSelf: 'flex-start' },
  smallActionText: { color: colors.primary[600], fontWeight: '800' }, dangerAction: { backgroundColor: '#FFF0EE' }, dangerText: { color: colors.primary[600] }, disabled: { opacity: 0.5 },
  fieldLabel: { color: colors.primary[600], fontSize: typography.size.sm, fontWeight: '800' },
  bloodChoices: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  bloodChoice: { alignItems: 'center', borderColor: colors.border, borderRadius: 10, borderWidth: 1.5, minWidth: 54, paddingHorizontal: spacing.sm, paddingVertical: spacing.sm },
  bloodChoiceActive: { backgroundColor: colors.primary[400], borderColor: colors.primary[400] },
  bloodChoiceText: { color: colors.primary[600], fontWeight: '900' }, bloodChoiceTextActive: { color: colors.white },
  choices: { flexDirection: 'row', gap: spacing.sm }, choice: { borderWidth: 1, borderColor: colors.border, borderRadius: 20, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  choiceActive: { backgroundColor: colors.primary[400], borderColor: colors.primary[400] }, choiceText: { color: colors.primary[600], fontWeight: '700' }, choiceTextActive: { color: colors.white },
  row: { flexDirection: 'row', gap: spacing.md }, flex: { flex: 1 }, grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  stock: { width: '47%', borderWidth: 1.5, borderColor: colors.border, borderRadius: 14, padding: spacing.md, gap: 4 }, stockActive: { borderColor: colors.primary[400], backgroundColor: colors.softPrimary },
  blood: { color: colors.primary[400], fontSize: typography.size.xxl, fontWeight: '900' },
});
