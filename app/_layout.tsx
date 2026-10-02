import RootNavigator from "@/src/shared/navigation/RootNavigator"
import SessionProvider from "@/src/shared/session/SessionProvider"

const RootLayout = () => (
  <SessionProvider>
    <RootNavigator />
  </SessionProvider>
)

export default RootLayout
