import { PreviewProvider } from "@/src/features/demo/PreviewContext"
import SessionProvider from "@/src/shared/components/session/SessionProvider"
import SessionWrapper from "@/src/shared/components/session/SessionWrapper"

const RootLayout = () => (
  <PreviewProvider>
    <SessionProvider>
      <SessionWrapper />
    </SessionProvider>
  </PreviewProvider>
)

export default RootLayout
