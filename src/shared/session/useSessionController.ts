import { supabase } from "@/lib/supabase"
import type { Session } from "@supabase/supabase-js"
import { useEffect, useState } from "react"

const useSessionController = () => {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  return {
    loading,
    session,
  }
}

export default useSessionController
