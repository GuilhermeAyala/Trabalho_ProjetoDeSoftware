import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BloodCenterCard } from '@/components/BloodCenterCard';
import { DonationMap } from '@/components/DonationMap';
import { SectionTitle } from '@/components/SectionTitle';
import { PrimaryButton } from '@/components/PrimaryButton';
import { getApiErrorMessage } from '@/services/api';
import { buscarHemocentros } from '@/services/agendamentoApi';
import { colors, spacing, typography } from '@/theme';
export function BloodCentersScreen() {
    const navigation = useNavigation();
    const [hemocentros, setHemocentros] = useState([]);
    const [erro, setErro] = useState('');
    const [carregando, setCarregando] = useState(true);
    async function carregar() {
        setCarregando(true);
        setErro('');
        try {
            setHemocentros(await buscarHemocentros());
        }
        catch (error) {
            setErro(getApiErrorMessage(error, 'Não foi possível carregar os hemocentros.'));
        }
        finally {
            setCarregando(false);
        }
    }
    useEffect(() => { void carregar(); }, []);
    return (_jsx(SafeAreaView, { edges: ['top'], style: styles.safeArea, children: _jsxs(ScrollView, { contentContainerStyle: styles.content, showsVerticalScrollIndicator: false, children: [_jsxs(View, { children: [_jsx(Text, { style: styles.title, children: "Hemocentros" }), _jsx(Text, { style: styles.subtitle, children: "Encontre locais cadastrados e escolha onde doar." })] }), carregando ? _jsx(Text, { style: styles.subtitle, children: "Carregando hemocentros..." }) : null, erro ? _jsx(Text, { style: styles.subtitle, children: erro }) : null, erro ? _jsx(PrimaryButton, { label: "TENTAR NOVAMENTE", onPress: () => void carregar() }) : null, !carregando && !erro && hemocentros.length === 0 ? _jsx(Text, { style: styles.subtitle, children: "Nenhum hemocentro cadastrado." }) : null, !carregando && !erro && hemocentros.length > 0 ? (_jsxs(_Fragment, { children: [_jsx(SectionTitle, { children: "Mapa das institui\u00E7\u00F5es" }), _jsx(Text, { style: styles.mapHint, children: "Toque em um marcador para ver o nome e o endere\u00E7o do local de doa\u00E7\u00E3o." }), _jsx(DonationMap, { hemocentros: hemocentros })] })) : null, hemocentros.length > 0 ? (_jsxs(_Fragment, { children: [_jsx(SectionTitle, { children: "Lista de hemocentros" }), _jsx(View, { style: styles.list, children: hemocentros.map((hemocentro) => (_jsx(BloodCenterCard, { bloodCenter: { id: String(hemocentro.id), name: hemocentro.nome, address: hemocentro.endereco, distance: hemocentro.distanciaKm === undefined ? 'Local cadastrado' : `${hemocentro.distanciaKm} km`, nextSlot: 'Escolha data e hora' }, onSchedule: () => navigation.navigate('AppTabs', { screen: 'Schedule', params: { hemocentroId: hemocentro.id } }) }, hemocentro.id))) })] })) : null] }) }));
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
    mapHint: {
        color: colors.text.muted,
        fontSize: typography.size.sm,
        lineHeight: 19,
        marginTop: -spacing.lg,
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
//# sourceMappingURL=BloodCentersScreen.js.map