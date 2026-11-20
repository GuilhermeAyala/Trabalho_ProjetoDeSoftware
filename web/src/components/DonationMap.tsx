import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

import { colors } from '@/theme';
import { createDonationMapHtml, type DonationMapPoint } from './DonationMapHtml';

type Props = {
  hemocentros: DonationMapPoint[];
};

export function DonationMap({ hemocentros }: Props) {
  return (
    <View style={styles.container}>
      <WebView
        domStorageEnabled
        javaScriptEnabled
        nestedScrollEnabled
        originWhitelist={['*']}
        source={{ html: createDonationMapHtml(hemocentros) }}
        style={styles.webview}
      />
    </View>
  );
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
