import { jsx as _jsx } from "react/jsx-runtime";
import { StyleSheet, View } from 'react-native';
import { colors } from '@/theme';
import { createDonationMapHtml } from './DonationMapHtml';
export function DonationMap({ hemocentros }) {
    return (_jsx(View, { style: styles.container, children: _jsx("iframe", { referrerPolicy: "strict-origin-when-cross-origin", sandbox: "allow-scripts", srcDoc: createDonationMapHtml(hemocentros), style: styles.iframe, title: "Mapa dos hemocentros" }) }));
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.softPrimary,
        borderColor: colors.border,
        borderRadius: 16,
        borderWidth: 1.5,
        height: 360,
        overflow: 'hidden',
    },
    iframe: {
        borderWidth: 0,
        height: '100%',
        width: '100%',
    },
});
//# sourceMappingURL=DonationMap.web.js.map