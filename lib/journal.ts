import { supabase } from "./supabase"

export interface JournalEntry {
  id: string
  user_id: string
  title: string | null
  body: string
  source: "written" | "transcribed"
  created_at: string
  updated_at: string
}

export interface JournalDraft {
  title: string | null
  body: string
  source: JournalEntry["source"]
}

export const listEntries = async (): Promise<JournalEntry[]> => {
  const { data, error } = await supabase
    .from("journal_entries")
    .select("id,user_id,title,body,source,created_at,updated_at")
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })
  if (error) throw error
  return (data || []) as JournalEntry[]
}

export const createEntry = async (userId: string, draft: JournalDraft): Promise<JournalEntry> => {
  const { data, error } = await supabase
    .from("journal_entries")
    .insert({ ...draft, user_id: userId })
    .select("id,user_id,title,body,source,created_at,updated_at")
    .single()
  if (error) throw error
  return data as JournalEntry
}

export const updateEntry = async (id: string, draft: JournalDraft): Promise<void> => {
  const { data, error } = await supabase
    .from("journal_entries")
    .update(draft)
    .eq("id", id)
    .select("id")
  if (error) throw error
  if (!data?.length) throw new Error("Entry not found or access denied")
}

export const deleteEntry = async (id: string): Promise<void> => {
  const { data, error } = await supabase
    .from("journal_entries")
    .delete()
    .eq("id", id)
    .select("id")
  if (error) throw error
  if (!data?.length) throw new Error("Entry not found or access denied")
}
