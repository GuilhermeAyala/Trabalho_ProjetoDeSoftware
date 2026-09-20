import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenHeader } from '@/components/ScreenHeader';
import { SectionTitle } from '@/components/SectionTitle';
import { faqsMock } from '@/data/faqsMock';
import { colors, spacing, typography } from '@/theme';
export function InformationCenterScreen({ navigation }) {
    const [openedId, setOpenedId] = useState(faqsMock[0]?.id);
    return (_jsxs(SafeAreaView, { edges: ['bottom'], style: styles.safeArea, children: [_jsx(ScreenHeader, { title: "Central de informacoes", onBack: navigation.goBack }), _jsxs(ScrollView, { contentContainerStyle: styles.content, showsVerticalScrollIndicator: false, children: [_jsxs(LinearGradient, { colors: [colors.secondary[300], '#FF4400'], start: { x: 0, y: 0 }, style: styles.hero, children: [_jsx(View, { style: styles.heroIcon, children: _jsx(Ionicons, { color: colors.white, name: "hand-left", size: 38 }) }), _jsx(Text, { style: styles.heroTitle, children: "Tudo sobre doacao de sangue" }), _jsx(Text, { style: styles.heroSubtitle, children: "Agende agora e comece a salvar vidas" })] }), _jsx(SectionTitle, { children: "Perguntas Frequentes" }), _jsx(View, { style: styles.faqList, children: faqsMock.map((faq) => {
                            const isOpened = openedId === faq.id;
                            return (_jsxs(Pressable, { accessibilityRole: "button", onPress: () => setOpenedId(isOpened ? undefined : faq.id), style: styles.faqCard, children: [_jsxs(View, { style: styles.faqHeader, children: [_jsx(View, { style: styles.faqIcon, children: _jsx(Ionicons, { color: colors.secondary[400], name: faq.icon, size: 22 }) }), _jsx(Text, { style: styles.faqTitle, children: faq.title }), _jsx(Ionicons, { color: colors.text.strong, name: isOpened ? 'chevron-up' : 'chevron-down', size: 20 })] }), isOpened && _jsx(Text, { style: styles.faqDescription, children: faq.description })] }, faq.id));
                        }) }), _jsxs(View, { style: styles.ctaCard, children: [_jsx(Text, { style: styles.ctaTitle, children: "Pronto para doar?" }), _jsx(Text, { style: styles.ctaText, children: "Encontre um hemocentro proximo e agende sua doacao" }), _jsx(PrimaryButton, { label: "AGENDAR DOACAO", onPress: () => navigation.navigate('AppTabs', { screen: 'Schedule' }), style: styles.ctaButton, variant: "light" })] })] })] }));
}
const styles = StyleSheet.create({
    content: {
        gap: spacing.lg,
        padding: spacing.xl,
        paddingBottom: 120,
    },
    ctaButton: {
        alignSelf: 'center',
        height: 42,
        width: 240,
    },
    ctaCard: {
        alignItems: 'center',
        backgroundColor: colors.white,
        borderColor: colors.border,
        borderRadius: 10,
        borderWidth: 1.5,
        gap: spacing.sm,
        padding: spacing.xl,
    },
    ctaText: {
        color: colors.text.muted,
        fontSize: typography.size.md,
        lineHeight: 22,
        textAlign: 'center',
    },
    ctaTitle: {
        color: colors.text.strong,
        fontSize: typography.size.md + 1,
        fontWeight: '800',
    },
    faqCard: {
        backgroundColor: colors.white,
        borderColor: colors.border,
        borderRadius: 10,
        borderWidth: 1.5,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
    },
    faqDescription: {
        color: colors.text.muted,
        fontSize: typography.size.sm,
        lineHeight: 19,
        marginLeft: 52,
        marginTop: spacing.sm,
    },
    faqHeader: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: spacing.md,
    },
    faqIcon: {
        alignItems: 'center',
        backgroundColor: colors.softPrimary,
        borderRadius: 19,
        height: 38,
        justifyContent: 'center',
        width: 38,
    },
    faqList: {
        gap: spacing.sm,
    },
    faqTitle: {
        color: colors.text.strong,
        flex: 1,
        fontSize: typography.size.md,
        fontWeight: '700',
    },
    hero: {
        alignItems: 'center',
        borderRadius: 15,
        gap: spacing.md,
        minHeight: 158,
        padding: spacing.xl,
    },
    heroIcon: {
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.24)',
        borderRadius: 32,
        height: 64,
        justifyContent: 'center',
        width: 64,
    },
    heroSubtitle: {
        color: colors.white,
        fontSize: typography.size.md,
        fontWeight: '700',
    },
    heroTitle: {
        color: colors.white,
        fontSize: typography.size.lg,
        fontWeight: '900',
        textAlign: 'center',
    },
    safeArea: {
        backgroundColor: colors.background,
        flex: 1,
    },
});
//# sourceMappingURL=InformationCenterScreen.js.map