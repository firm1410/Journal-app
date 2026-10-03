import { Stack } from "expo-router"
import { ActivityIndicator, StyleSheet, View } from "react-native"
import SessionProvider from "./SessionProvider"
import useSession from "./useSession"

type Props = {}

const SessionWrapper = (props: Props) => {
  const { session, loading } = useSession()

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
        <Stack.Protected guard={!session}>
          <Stack.Screen name="SignIn" />
        </Stack.Protected>

        <Stack.Protected guard={Boolean(session)}>
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
