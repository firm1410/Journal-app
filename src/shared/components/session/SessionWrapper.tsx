import { usePreview } from "@/src/features/demo/PreviewContext"
import { Stack } from "expo-router"
import { ActivityIndicator, StyleSheet, View } from "react-native"
import SessionProvider from "./SessionProvider"
import useSession from "./useSession"

const SessionWrapper = () => {
  const { session, loading } = useSession()
  const preview = usePreview()

  if (loading) {
    return (
      <SessionProvider>
        <View style={styles.loading}>
          <ActivityIndicator />
        </View>
      </SessionProvider>
    )
  }

  return (
    <SessionProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={!session && !preview.enabled}>
          <Stack.Screen name="SignIn" />
        </Stack.Protected>

        <Stack.Protected guard={Boolean(session) || preview.enabled}>
          <Stack.Screen name="(tabs)" />
        </Stack.Protected>
      </Stack>
    </SessionProvider>
  )
}

export default SessionWrapper

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
  },
})
