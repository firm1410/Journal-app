import SessionProvider from "@/src/shared/session/SessionProvider"
import SessionWrapper from "@/src/shared/session/SessionWrapper"

const RootLayout = () => (
  <SessionProvider>
    <SessionWrapper />
  </SessionProvider>
)

export default RootLayout
