import { createClient } from "@supabase/supabase-js"

const url = process.env.SUPABASE_ADMIN_URL || "http://127.0.0.1:8000"
const key = process.env.SERVICE_ROLE_KEY
const email = process.env.JOURNAL_USER_EMAIL
const password = process.env.JOURNAL_USER_PASSWORD
if (!key || !email || !password) {
  throw new Error("Set SERVICE_ROLE_KEY, JOURNAL_USER_EMAIL, and JOURNAL_USER_PASSWORD")
}
const client = createClient(url, key, { auth: { persistSession: false } })
const { data, error } = await client.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
})
if (error) throw error
console.log("Created journal user " + data.user.id)
