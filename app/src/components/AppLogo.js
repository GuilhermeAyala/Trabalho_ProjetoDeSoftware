import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@/theme';
export function AppLogo() {
    return (_jsxs(View, { style: styles.container, children: [_jsxs(View, { style: styles.mark, children: [_jsx(View, { style: [styles.dot, styles.dotTopLeft] }), _jsx(View, { style: [styles.dot, styles.dotTopRight] }), _jsx(View, { style: [styles.dot, styles.dotBottom] })] }), _jsx(Text, { style: styles.text, children: "VITTA" })] }));
}
const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 14,
    },
    dot: {
        borderRadius: 9,
        height: 18,
        position: 'absolute',
        width: 18,
    },
    dotBottom: {
        backgroundColor: colors.primary[600],
        left: 7,
        top: 14,
    },
    dotTopLeft: {
        backgroundColor: colors.primary[400],
        left: 0,
        top: 0,
    },
    dotTopRight: {
        backgroundColor: colors.primary[400],
        left: 14,
        top: 0,
    },
    mark: {
        height: 32,
        width: 32,
    },
    text: {
        color: colors.primary[400],
        fontSize: 22,
        fontWeight: '800',
        letterSpacing: 0,
    },
});
//# sourceMappingURL=AppLogo.js.map