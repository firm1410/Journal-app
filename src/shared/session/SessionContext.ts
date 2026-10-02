import type { Session } from "@supabase/supabase-js"
import { createContext } from "react"

type SessionContextValue = {
  session: Session | null
  loading: boolean
}

const SessionContext = createContext<SessionContextValue | undefined>(undefined)

export default SessionContext
