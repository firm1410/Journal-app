import { supabase } from "@/lib/supabase"

export const login = async (email: string, password: string) => {
  const signIn = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  if (signIn.error) {
    throw signIn.error
  }
  return signIn.data.session
}
