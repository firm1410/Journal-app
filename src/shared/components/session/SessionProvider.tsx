import type { PropsWithChildren } from "react"

import SessionContext from "./SessionContext"
import useSessionController from "./useSessionController"

const SessionProvider = ({ children }: PropsWithChildren) => {
  const sessionController = useSessionController()

  return (
    <SessionContext.Provider value={sessionController}>
      {children}
    </SessionContext.Provider>
  )
}

export default SessionProvider
