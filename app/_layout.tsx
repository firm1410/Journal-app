import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { View } from "react-native"

import { colors } from "../constants/theme"
import Nav from "./components/Nav/Nav"

const RootLayout = () => {
  return (
    <View style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      />
      <StatusBar style="dark" />
      <Nav />
    </View>
  )
}

export default RootLayout
