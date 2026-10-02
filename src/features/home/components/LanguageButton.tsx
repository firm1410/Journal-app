import { Pressable, StyleSheet, Text } from "react-native"

import { colors } from "@/constants/theme"

type LanguageButtonProps = {
  accessibilityLabel: string
  label: string
  onPress: () => void
}

const LanguageButton = ({
  accessibilityLabel,
  label,
  onPress,
}: LanguageButtonProps) => (
  <Pressable
    accessibilityRole="button"
    accessibilityLabel={accessibilityLabel}
    onPress={onPress}
    style={({ pressed }) => [
      styles.button,
      pressed && styles.buttonPressed,
    ]}
  >
    <Text style={styles.label}>{label}</Text>
  </Pressable>
)

const styles = StyleSheet.create({
  button: {
    borderColor: colors.controlBorder,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  buttonPressed: {
    opacity: 0.65,
  },
  label: {
    color: colors.mutedText,
    fontSize: 12,
    fontWeight: "600",
  },
})

export default LanguageButton
