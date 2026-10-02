import { useContext } from "react"

import SessionContext from "./SessionContext"

const useSession = () => {
  const context = useContext(SessionContext)

  if (!context) {
    throw new Error("useSession must be used inside SessionProvider")
  }

  return context
}

export default useSession
