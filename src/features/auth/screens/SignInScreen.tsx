import { usePreview } from "@/src/features/demo/PreviewContext"
import { Button } from "@/src/features/demo/ui"
import { router } from "expo-router"
import { StyleSheet, View } from "react-native"

import { colors } from "@/constants/theme"
import SignInForm from "../components/SignInForm"
import useSignInController from "../controllers/useSignInController"

const SignInScreen = () => {
  const controller = useSignInController()
  const preview = usePreview()

  return (
    <View style={styles.screen}>
      <SignInForm {...controller} />
      <View style={{ marginTop: 28 }}>
        <Button
          label="Explore with sample data"
          onPress={() => {
            preview.enter()
            router.replace("/")
          }}
        />
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
})

export default SignInScreen
