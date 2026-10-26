import { colors, shadows } from "@/constants/theme"
import useTranslation from "@/src/shared/i18n/useTranslation"
import { StyleSheet, Text, TextInput, View } from "react-native"

type Props = {
  value: string
  onChangeText?: (value: string) => void
}

const TranscriptionField = ({ value, onChangeText }: Props) => {
  const { t } = useTranslation()
  const label = t("liveTranscription")

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        editable={!!onChangeText}
        multiline
        onChangeText={onChangeText}
        scrollEnabled
        style={styles.input}
        textAlignVertical="top"
        value={value}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  field: {
    alignSelf: "center",
    maxWidth: 640,
    width: "100%",
  },
  label: {
    color: colors.mutedText,
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    boxShadow: shadows.input,
    color: colors.text,
    fontSize: 20,
    lineHeight: 30,
    height: 240,
    paddingHorizontal: 20,
    paddingVertical: 18,
    textAlign: "left",
  },
})

export default TranscriptionField
