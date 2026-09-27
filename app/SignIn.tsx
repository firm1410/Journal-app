import { Pressable, StyleSheet, Text, TextInput, View } from "react-native"

import { login } from "@/api/supabase/auth/auth"
import { useCallback, useState } from "react"
import { colors, shadows } from "../constants/theme"

const SignIn = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const onSignin = useCallback(async () => {
    await login(email, password)
  }, [email, password])

  return (
    <View style={styles.screen}>
      <View style={styles.form}>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Sign in to continue your journal.</Text>

        <TextInput
          accessibilityLabel="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="Email"
          placeholderTextColor={colors.subtleText}
          onChangeText={(text) => setEmail(text)}
          style={styles.input}
        />
        <TextInput
          accessibilityLabel="Password"
          placeholder="Password"
          placeholderTextColor={colors.subtleText}
          secureTextEntry
          onChangeText={(text) => setPassword(text)}
          style={styles.input}
        />

        <Pressable
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => onSignin()}
        >
          <Text style={styles.buttonText}>Sign in</Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    alignItems: "center",
    backgroundColor: colors.background,
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
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
  buttonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "700",
  },
})

export default SignIn
