import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigation } from '@react-navigation/native';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BloodCenterCard } from '@/components/BloodCenterCard';
import { SectionTitle } from '@/components/SectionTitle';
import { bloodCentersMock } from '@/data/bloodCentersMock';
import { colors, spacing, typography } from '@/theme';
export function BloodCentersScreen() {
    const navigation = useNavigation();
    return (_jsx(SafeAreaView, { edges: ['top'], style: styles.safeArea, children: _jsxs(ScrollView, { contentContainerStyle: styles.content, showsVerticalScrollIndicator: false, children: [_jsxs(View, { children: [_jsx(Text, { style: styles.title, children: "Hemocentros" }), _jsx(Text, { style: styles.subtitle, children: "Encontre locais proximos e veja horarios disponiveis." })] }), _jsx(SectionTitle, { children: "Proximos de voce" }), _jsx(View, { style: styles.list, children: bloodCentersMock.map((bloodCenter) => (_jsx(BloodCenterCard, { bloodCenter: bloodCenter, onSchedule: () => navigation.navigate('AppTabs', { screen: 'Schedule' }) }, bloodCenter.id))) })] }) }));
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
//# sourceMappingURL=BloodCentersScreen.js.map