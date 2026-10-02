import { StyleSheet, View } from "react-native"

import { colors } from "@/constants/theme"
import SignInForm from "../components/SignInForm"
import useSignInController from "../controllers/useSignInController"

const SignInScreen = () => {
  const controller = useSignInController()

  return (
    <View style={styles.screen}>
      <SignInForm {...controller} />
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
