import { StyleSheet, Text } from 'react-native';

import { colors, typography } from '@/theme';

type SectionTitleProps = {
  children: string;
};

export function SectionTitle({ children }: SectionTitleProps) {
  return <Text style={styles.title}>{children}</Text>;
}

const styles = StyleSheet.create({
  title: {
    color: colors.text.strong,
    fontSize: typography.size.xl,
    fontWeight: '800',
    letterSpacing: 0,
  },
});
