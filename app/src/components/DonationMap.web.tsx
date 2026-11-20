import { StyleSheet, View } from 'react-native';

import { colors } from '@/theme';
import { createDonationMapHtml, type DonationMapPoint } from './DonationMapHtml';

type Props = {
  hemocentros: DonationMapPoint[];
};

export function DonationMap({ hemocentros }: Props) {
  return (
    <View style={styles.container}>
      <iframe
        referrerPolicy="strict-origin-when-cross-origin"
        sandbox="allow-scripts"
        srcDoc={createDonationMapHtml(hemocentros)}
        style={styles.iframe}
        title="Mapa dos hemocentros"
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
  iframe: {
    borderWidth: 0,
    height: '100%',
    width: '100%',
  },
});
