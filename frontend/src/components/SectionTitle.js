import { jsx as _jsx } from "react/jsx-runtime";
import { StyleSheet, Text } from 'react-native';
import { colors, typography } from '@/theme';
export function SectionTitle({ children }) {
    return _jsx(Text, { style: styles.title, children: children });
}
const styles = StyleSheet.create({
    title: {
        color: colors.text.strong,
        fontSize: typography.size.xl,
        fontWeight: '800',
        letterSpacing: 0,
    },
});
//# sourceMappingURL=SectionTitle.js.map