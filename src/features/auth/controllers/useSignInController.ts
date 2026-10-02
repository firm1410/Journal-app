import { supabase } from "@/lib/supabase"
import { useState } from "react"

const useSignInController = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const signIn = async () => {
    const normalizedEmail = email.trim()

    if (!normalizedEmail || !password) {
      setError("Email and password are required.")
      return
    }

    try {
      setIsSubmitting(true)
      setError(null)

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      })

      if (signInError) {
        throw signInError
      }
    } catch (caughtError) {
      const message =
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to sign in."

      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    email,
    password,
    error,
    isSubmitting,
    setEmail,
    setPassword,
    signIn,
  }
}

export default useSignInController
