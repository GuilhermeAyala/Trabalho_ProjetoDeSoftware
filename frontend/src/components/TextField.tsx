import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

import { colors, typography } from '@/theme';

type TextFieldProps = TextInputProps & {
  label: string;
};

export function TextField({ label, secureTextEntry, ...inputProps }: TextFieldProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholderTextColor={colors.text.muted}
        secureTextEntry={secureTextEntry}
        style={styles.input}
        {...inputProps}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  input: {
    borderColor: colors.fieldBorder,
    borderRadius: 16,
    borderWidth: 1,
    color: colors.text.strong,
    fontSize: typography.size.md + 1,
    height: 56,
    paddingHorizontal: 18,
  },
  label: {
    color: colors.primary[600],
    fontSize: typography.size.sm,
    fontWeight: '800',
    letterSpacing: 0,
  },
});
