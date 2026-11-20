import { jsx as _jsx } from "react/jsx-runtime";
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { colors } from '@/theme';
import { createDonationMapHtml } from './DonationMapHtml';
export function DonationMap({ hemocentros }) {
    return (_jsx(View, { style: styles.container, children: _jsx(WebView, { domStorageEnabled: true, javaScriptEnabled: true, nestedScrollEnabled: true, originWhitelist: ['*'], source: { html: createDonationMapHtml(hemocentros) }, style: styles.webview }) }));
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
    webview: {
        backgroundColor: colors.softPrimary,
        flex: 1,
    },
});
//# sourceMappingURL=DonationMap.js.map