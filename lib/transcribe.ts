import { fetch as expoFetch } from "expo/fetch"
import { File } from "expo-file-system"
import { Platform } from "react-native"

import { supabase } from "./supabase"

export const transcribeRecording = async (uri: string): Promise<string> => {
  if (Platform.OS === "web") throw new Error("Recording is available in the mobile app")
  const file = new File(uri)
  try {
    const apiUrl = process.env.EXPO_PUBLIC_TRANSCRIBE_API_URL
    if (!apiUrl) throw new Error("Transcription API URL is not configured")
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError || !session) throw new Error("Sign in again before transcribing")
    const form = new FormData()
    form.append("file", file)
    const response = await expoFetch(`${apiUrl.replace(/\/$/, "")}/transcribe`, {
      method: "POST",
      headers: { Authorization: `Bearer ${session.access_token}` },
      body: form,
    })
    const payload = await response.json() as { text?: string; error?: string }
    if (!response.ok) throw new Error(payload.error || "Transcription failed")
    if (!payload.text?.trim()) throw new Error("No speech was detected")
    return payload.text.trim()
  } finally {
    if (file.exists) file.delete()
  }
}
