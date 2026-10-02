import { Pressable, StyleSheet, Text, TextInput, View } from "react-native"

import { colors, shadows } from "@/constants/theme"

type SignInFormProps = {
  email: string
  password: string
  error: string | null
  isSubmitting: boolean
  setEmail: (value: string) => void
  setPassword: (value: string) => void
  signIn: () => Promise<void>
}

const SignInForm = ({
  email,
  password,
  error,
  isSubmitting,
  setEmail,
  setPassword,
  signIn,
}: SignInFormProps) => (
  <View style={styles.form}>
    <Text style={styles.title}>Welcome back</Text>
    <Text style={styles.subtitle}>Sign in to continue your journal.</Text>

    <TextInput
      accessibilityLabel="Email"
      autoCapitalize="none"
      editable={!isSubmitting}
      keyboardType="email-address"
      placeholder="Email"
      placeholderTextColor={colors.subtleText}
      value={email}
      onChangeText={setEmail}
      style={styles.input}
    />
    <TextInput
      accessibilityLabel="Password"
      editable={!isSubmitting}
      placeholder="Password"
      placeholderTextColor={colors.subtleText}
      secureTextEntry
      value={password}
      onChangeText={setPassword}
      style={styles.input}
    />

    {error ? (
      <Text accessibilityRole="alert" style={styles.error}>
        {error}
      </Text>
    ) : null}

    <Pressable
      accessibilityRole="button"
      disabled={isSubmitting}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.buttonPressed,
        isSubmitting && styles.buttonDisabled,
      ]}
      onPress={signIn}
    >
      <Text style={styles.buttonText}>
        {isSubmitting ? "Signing in..." : "Sign in"}
      </Text>
    </Pressable>
  </View>
)

const styles = StyleSheet.create({
  form: {
    backgroundColor: colors.background,
    borderRadius: 28,
    boxShadow: shadows.form,
    maxWidth: 400,
    padding: 28,
    width: "100%",
  },
  title: {
    color: colors.text,
    fontSize: 32,
    fontWeight: "700",
    textAlign: "center",
  },
  subtitle: {
    color: colors.mutedText,
    fontSize: 16,
    marginBottom: 36,
    marginTop: 8,
    textAlign: "center",
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: 16,
    boxShadow: shadows.input,
    color: colors.text,
    fontSize: 16,
    marginBottom: 20,
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  error: {
    color: colors.error,
    fontSize: 14,
    marginBottom: 8,
  },
  button: {
    alignItems: "center",
    backgroundColor: colors.accent,
    borderRadius: 16,
    boxShadow: shadows.button,
    marginTop: 12,
    paddingVertical: 16,
  },
  buttonPressed: {
    boxShadow: shadows.buttonPressed,
    opacity: 0.9,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "700",
  },
})

export default SignInForm
