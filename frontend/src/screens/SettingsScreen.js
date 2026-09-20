import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PrimaryButton } from '@/components/PrimaryButton';
import { TextField } from '@/components/TextField';
import { userMock } from '@/data/userMock';
import { colors, spacing, typography } from '@/theme';
export function SettingsScreen() {
    return (_jsx(SafeAreaView, { edges: ['top'], style: styles.safeArea, children: _jsxs(ScrollView, { contentContainerStyle: styles.content, keyboardShouldPersistTaps: "handled", children: [_jsx(Text, { style: styles.title, children: "Configuracao do usuario" }), _jsx(View, { style: styles.avatar, children: _jsx(Text, { style: styles.avatarText, children: userMock.initials }) }), _jsxs(View, { style: styles.photoButton, children: [_jsx(Ionicons, { color: colors.primary[400], name: "camera", size: 18 }), _jsx(Text, { style: styles.photoText, children: "Trocar foto" })] }), _jsx(Text, { style: styles.sectionLabel, children: "Dados pessoais" }), _jsxs(View, { style: styles.form, children: [_jsx(TextField, { defaultValue: userMock.name, label: "NOME" }), _jsx(TextField, { autoCapitalize: "none", defaultValue: userMock.email, keyboardType: "email-address", label: "E-MAIL" }), _jsx(TextField, { defaultValue: "********", label: "SENHA", secureTextEntry: true })] }), _jsx(PrimaryButton, { label: "SALVAR ALTERACOES" })] }) }));
}
const styles = StyleSheet.create({
    avatar: {
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: colors.softPrimary,
        borderRadius: 46,
        height: 92,
        justifyContent: 'center',
        width: 92,
    },
    avatarText: {
        color: colors.primary[400],
        fontSize: typography.size.xxl,
        fontWeight: '900',
    },
    content: {
        gap: spacing.xl,
        padding: spacing.xxl,
        paddingBottom: 120,
    },
    form: {
        gap: spacing.xl,
    },
    photoButton: {
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: colors.softPrimary,
        borderRadius: 18,
        flexDirection: 'row',
        gap: spacing.sm,
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.sm,
    },
    photoText: {
        color: colors.primary[400],
        fontSize: typography.size.md,
        fontWeight: '800',
    },
    safeArea: {
        backgroundColor: colors.background,
        flex: 1,
    },
    sectionLabel: {
        color: colors.text.strong,
        fontSize: typography.size.xl,
        fontWeight: '900',
    },
    title: {
        color: colors.primary[400],
        fontSize: typography.size.xxl,
        fontWeight: '900',
    },
});
//# sourceMappingURL=SettingsScreen.js.map