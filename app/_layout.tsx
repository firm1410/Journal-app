import SessionProvider from "@/src/shared/components/session/SessionProvider"
import SessionWrapper from "@/src/shared/components/session/SessionWrapper"

const RootLayout = () => (
  <SessionProvider>
    <SessionWrapper />
  </SessionProvider>
)

export default RootLayout
