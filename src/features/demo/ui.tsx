import type { PropsWithChildren } from "react"
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { colors, shadows } from "@/constants/theme"

export const Button = ({
  label,
  onPress,
  primary = false,
  disabled = false,
}: {
  label: string
  onPress: () => void
  primary?: boolean
  disabled?: boolean
}) => (
  <Pressable
    accessibilityRole="button"
    accessibilityState={{ disabled }}
    disabled={disabled}
    onPress={onPress}
    style={({ pressed }) => [
      ui.button,
      primary && ui.primary,
      pressed && ui.pressed,
      disabled && { opacity: 0.4 },
    ]}
  >
    <Text style={[ui.buttonText, primary && { color: colors.white }]}>
      {label}
    </Text>
  </Pressable>
)
export const Chip = ({
  label,
  active = false,
  onPress,
}: {
  label: string
  active?: boolean
  onPress?: () => void
}) => (
  <Pressable
    accessibilityRole={onPress ? "button" : "text"}
    accessibilityState={{ selected: active }}
    onPress={onPress}
    disabled={!onPress}
    style={[ui.chip, active && ui.chipActive]}
  >
    <Text style={[ui.chipText, active && { color: colors.accent }]}>
      {label}
    </Text>
  </Pressable>
)
export const Card = ({
  children,
  onPress,
  inset = false,
}: PropsWithChildren<{ onPress?: () => void; inset?: boolean }>) =>
  onPress ? (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        ui.card,
        inset && ui.inset,
        pressed && ui.pressed,
      ]}
    >
      {children}
    </Pressable>
  ) : (
    <View style={[ui.card, inset && ui.inset]}>{children}</View>
  )
export const Field = ({
  label,
  value,
  onChangeText,
  multiline = false,
  numeric = false,
}: {
  label: string
  value: string
  onChangeText: (value: string) => void
  multiline?: boolean
  numeric?: boolean
}) => (
  <View style={{ gap: 8 }}>
    <Text style={ui.label}>{label}</Text>
    <TextInput
      accessibilityLabel={label}
      value={value}
      onChangeText={onChangeText}
      multiline={multiline}
      keyboardType={numeric ? "decimal-pad" : "default"}
      placeholderTextColor={colors.subtleText}
      style={[
        ui.input,
        multiline && { minHeight: 160, textAlignVertical: "top" },
      ]}
    />
  </View>
)
export const Section = ({ title, meta }: { title: string; meta?: string }) => (
  <View style={ui.section}>
    <Text style={ui.sectionTitle}>{title}</Text>
    {meta && <Text style={ui.muted}>{meta}</Text>}
  </View>
)
export const Empty = ({ text }: { text: string }) => (
  <Card inset>
    <Text style={ui.muted}>{text}</Text>
  </Card>
)
export const Page = ({
  title,
  eyebrow,
  children,
  action,
}: PropsWithChildren<{
  title: string
  eyebrow: string
  action?: React.ReactNode
}>) => {
  const { top } = useSafeAreaInsets()
  return (
    <ScrollView
      style={ui.page}
      contentContainerStyle={[ui.pageContent, { paddingTop: top + 28 }]}
      keyboardShouldPersistTaps="handled"
    >
      <View style={ui.row}>
        <Text style={ui.eyebrow}>{eyebrow}</Text>
        <Text style={ui.demo}>SAMPLE DATA</Text>
      </View>
      <View style={ui.titleRow}>
        <Text style={ui.title}>{title}</Text>
        {action}
      </View>
      {children}
      <Text style={ui.footnote}>
        Your space to remember, plan, and make room for life.
      </Text>
    </ScrollView>
  )
}
export const ui = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.background },
  pageContent: {
    paddingHorizontal: 24,
    paddingBottom: 140,
    gap: 16,
    width: "100%",
    maxWidth: 760,
    alignSelf: "center",
  },
  eyebrow: {
    color: colors.subtleText,
    fontSize: 11,
    letterSpacing: 2,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  demo: {
    color: colors.mutedText,
    fontSize: 9,
    letterSpacing: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 6,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 10,
  },
  title: {
    color: colors.text,
    fontSize: 38,
    lineHeight: 44,
    letterSpacing: -1.5,
    fontWeight: "700",
    flexShrink: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  wrap: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
    alignItems: "center",
  },
  card: {
    backgroundColor: colors.background,
    padding: 20,
    borderRadius: 23,
    boxShadow: shadows.button,
    gap: 9,
  },
  inset: { boxShadow: shadows.input },
  heading: {
    color: colors.text,
    fontWeight: "600",
    fontSize: 17,
    lineHeight: 24,
  },
  body: { color: colors.text, fontSize: 15, lineHeight: 25 },
  muted: { color: colors.mutedText, fontSize: 13, lineHeight: 21 },
  section: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 14,
    marginBottom: 2,
    gap: 8,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 19,
    fontWeight: "600",
    letterSpacing: -0.5,
  },
  button: {
    backgroundColor: colors.background,
    borderRadius: 16,
    minHeight: 48,
    paddingHorizontal: 18,
    paddingVertical: 13,
    justifyContent: "center",
    alignItems: "center",
    boxShadow: shadows.button,
  },
  primary: { backgroundColor: colors.accent },
  buttonText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  pressed: { boxShadow: shadows.input, opacity: 0.8 },
  chip: {
    minHeight: 44,
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: colors.background,
    boxShadow: shadows.button,
  },
  chipActive: { boxShadow: shadows.input },
  chipText: { color: colors.mutedText, fontSize: 13, fontWeight: "600" },
  label: { color: colors.mutedText, fontSize: 12, fontWeight: "600" },
  input: {
    backgroundColor: colors.background,
    borderRadius: 16,
    boxShadow: shadows.input,
    color: colors.text,
    fontSize: 16,
    padding: 16,
    minHeight: 52,
  },
  footnote: {
    color: colors.subtleText,
    opacity: 0.65,
    textAlign: "center",
    fontSize: 11,
    lineHeight: 18,
    marginTop: 30,
  },
  amount: {
    color: colors.text,
    fontSize: 40,
    fontWeight: "600",
    letterSpacing: -1.5,
  },
})
