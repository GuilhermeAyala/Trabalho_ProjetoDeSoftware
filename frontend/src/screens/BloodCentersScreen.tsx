import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BloodCenterCard } from '@/components/BloodCenterCard';
import { SectionTitle } from '@/components/SectionTitle';
import { PrimaryButton } from '@/components/PrimaryButton';
import { getApiErrorMessage } from '@/services/api';
import { buscarHemocentros, type HemocentroPublico } from '@/services/agendamentoApi';
import { colors, spacing, typography } from '@/theme';
import type { RootStackParamList } from '@/types/navigation';

export function BloodCentersScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [hemocentros, setHemocentros] = useState<HemocentroPublico[]>([]);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(true);

  async function carregar() {
    setCarregando(true); setErro('');
    try { setHemocentros(await buscarHemocentros()); }
    catch (error) { setErro(getApiErrorMessage(error, 'Não foi possível carregar os hemocentros.')); }
    finally { setCarregando(false); }
  }
  useEffect(() => { void carregar(); }, []);

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View>
          <Text style={styles.title}>Hemocentros</Text>
          <Text style={styles.subtitle}>Encontre locais cadastrados e escolha onde doar.</Text>
        </View>

        <SectionTitle>Hemocentros cadastrados</SectionTitle>
        {carregando ? <Text style={styles.subtitle}>Carregando hemocentros...</Text> : null}
        {erro ? <Text style={styles.subtitle}>{erro}</Text> : null}
        {erro ? <PrimaryButton label="TENTAR NOVAMENTE" onPress={() => void carregar()} /> : null}
        {!carregando && !erro && hemocentros.length === 0 ? <Text style={styles.subtitle}>Nenhum hemocentro cadastrado.</Text> : null}
        <View style={styles.list}>
          {hemocentros.map((hemocentro) => (
            <BloodCenterCard
              bloodCenter={{ id: String(hemocentro.id), name: hemocentro.nome, address: hemocentro.endereco, distance: hemocentro.distanciaKm === undefined ? 'Local cadastrado' : `${hemocentro.distanciaKm} km`, nextSlot: 'Escolha data e hora' }}
              key={hemocentro.id}
              onSchedule={() => navigation.navigate('AppTabs', { screen: 'Schedule', params: { hemocentroId: hemocentro.id } })}
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
