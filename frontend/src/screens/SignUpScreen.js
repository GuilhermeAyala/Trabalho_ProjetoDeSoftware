import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppLogo } from '@/components/AppLogo';
import { PrimaryButton } from '@/components/PrimaryButton';
import { TextField } from '@/components/TextField';
import { colors, spacing, typography } from '@/theme';
export function SignUpScreen({ navigation }) {
    return (_jsx(SafeAreaView, { style: styles.safeArea, children: _jsx(KeyboardAvoidingView, { behavior: Platform.OS === 'ios' ? 'padding' : undefined, style: styles.keyboardView, children: _jsxs(ScrollView, { contentContainerStyle: styles.content, keyboardShouldPersistTaps: "handled", children: [_jsx(AppLogo, {}), _jsxs(View, { style: styles.hero, children: [_jsx(Text, { style: styles.title, children: "Crie sua conta" }), _jsx(Text, { style: styles.subtitle, children: "Cadastre-se para agendar doacoes, acompanhar pontos e encontrar hemocentros proximos." })] }), _jsxs(View, { style: styles.form, children: [_jsx(TextField, { label: "NOME", placeholder: "Seu nome completo" }), _jsx(TextField, { autoCapitalize: "none", keyboardType: "email-address", label: "E-MAIL", placeholder: "voce@email.com" }), _jsx(TextField, { label: "SENHA", placeholder: "********", secureTextEntry: true })] }), _jsx(PrimaryButton, { label: "CRIAR CONTA", onPress: () => navigation.replace('AppTabs', { screen: 'Home' }) }), _jsx(Pressable, { onPress: () => navigation.replace('AppTabs', { screen: 'Home' }), children: _jsx(Text, { style: styles.loginLink, children: "Ja tenho conta" }) }), _jsx(View, { style: styles.privacyCard, children: _jsx(Text, { style: styles.privacyText, children: "Seus dados serao usados para conectar voce a campanhas e instituicoes de saude." }) })] }) }) }));
}
const styles = StyleSheet.create({
    content: {
        flexGrow: 1,
        gap: spacing.xl,
        paddingHorizontal: spacing.xxl,
        paddingTop: spacing.xl,
    },
    form: {
        gap: spacing.xl,
    },
    hero: {
        gap: spacing.sm,
        marginTop: spacing.xl,
    },
    keyboardView: {
        flex: 1,
    },
    loginLink: {
        color: colors.secondary[400],
        fontSize: typography.size.md,
        fontWeight: '800',
        letterSpacing: 0,
        textAlign: 'center',
    },
    privacyCard: {
        backgroundColor: colors.softPrimary,
        borderRadius: 18,
        marginTop: 'auto',
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    privacyText: {
        color: colors.primary[600],
        fontSize: typography.size.sm,
        lineHeight: 18,
    },
    safeArea: {
        backgroundColor: colors.background,
        flex: 1,
    },
    subtitle: {
        color: colors.text.muted,
        fontSize: typography.size.md + 1,
        lineHeight: 22,
    },
    title: {
        color: colors.text.strong,
        fontSize: typography.size.display,
        fontWeight: '900',
        letterSpacing: 0,
    },
});
//# sourceMappingURL=SignUpScreen.js.map