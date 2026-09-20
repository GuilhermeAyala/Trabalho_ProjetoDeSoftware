import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, typography } from '@/theme';

type ScreenHeaderProps = {
  title: string;
  onBack?: () => void;
};

export function ScreenHeader({ title, onBack }: ScreenHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 32) }]}>
      <Pressable accessibilityRole="button" onPress={onBack} style={styles.backButton}>
        <Ionicons color={colors.text.muted} name="arrow-undo-outline" size={25} />
      </Pressable>
      <Text numberOfLines={1} style={styles.title}>
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignItems: 'center',
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  container: {
    alignItems: 'center',
    backgroundColor: colors.white,
    elevation: 2,
    flexDirection: 'row',
    gap: 8,
    minHeight: 94,
    paddingBottom: 14,
    paddingHorizontal: 24,
    shadowColor: colors.shadow,
    shadowOffset: { height: 0, width: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
  },
  title: {
    color: colors.primary[400],
    flex: 1,
    fontSize: typography.size.xl,
    fontWeight: '800',
    letterSpacing: 0,
  },
});
