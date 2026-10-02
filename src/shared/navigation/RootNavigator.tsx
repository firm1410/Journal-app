import { Stack } from "expo-router"
import { ActivityIndicator, StyleSheet, View } from "react-native"

import useSession from "@/src/shared/session/useSession"

const RootNavigator = () => {
  const { session, loading } = useSession()

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator />
      </View>
    )
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!session}>
        <Stack.Screen name="SignIn" />
      </Stack.Protected>

      <Stack.Protected guard={Boolean(session)}>
        <Stack.Screen name="(tabs)" />
      </Stack.Protected>
    </Stack>
  )
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
  },
})

export default RootNavigator
