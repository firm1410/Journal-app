import { randomBytes } from "node:crypto"
import { createClient } from "@supabase/supabase-js"

const url = process.env.SUPABASE_ADMIN_URL || "http://127.0.0.1:8000"
const serviceKey = process.env.SERVICE_ROLE_KEY
const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY
const ownerEmail = process.env.JOURNAL_USER_EMAIL
const ownerPassword = process.env.JOURNAL_USER_PASSWORD
if (!serviceKey || !publishableKey) {
  throw new Error("Set SERVICE_ROLE_KEY and SUPABASE_PUBLISHABLE_KEY")
}

const fail = (message) => { throw new Error(message) }
const admin = createClient(url, serviceKey, { auth: { persistSession: false } })
const client = () => createClient(url, publishableKey, { auth: { persistSession: false } })
const first = client()
const second = client()
const other = client()
let temporaryUserId
let temporaryOwnerId
let entryId

try {
  let testOwnerEmail = ownerEmail
  let testOwnerPassword = ownerPassword
  if (!testOwnerEmail || !testOwnerPassword) {
    testOwnerEmail = "journal-owner-" + Date.now() + "@example.invalid"
    testOwnerPassword = randomBytes(24).toString("hex")
    const createdOwner = await admin.auth.admin.createUser({
      email: testOwnerEmail,
      password: testOwnerPassword,
      email_confirm: true,
    })
    if (createdOwner.error || !createdOwner.data.user) fail("Could not create temporary owner")
    temporaryOwnerId = createdOwner.data.user.id
  }
  const firstSignIn = await first.auth.signInWithPassword({ email: testOwnerEmail, password: testOwnerPassword })
  if (firstSignIn.error || !firstSignIn.data.user) fail("Owner sign-in failed")
  const secondSignIn = await second.auth.signInWithPassword({ email: testOwnerEmail, password: testOwnerPassword })
  if (secondSignIn.error) fail("Second device sign-in failed")

  const password = randomBytes(24).toString("hex")
  const created = await admin.auth.admin.createUser({
    email: "journal-rls-" + Date.now() + "@example.invalid",
    password,
    email_confirm: true,
  })
  if (created.error || !created.data.user) fail("Could not create temporary second user")
  temporaryUserId = created.data.user.id
  const otherSignIn = await other.auth.signInWithPassword({
    email: created.data.user.email,
    password,
  })
  if (otherSignIn.error) fail("Temporary user sign-in failed")

  const inserted = await first.from("journal_entries").insert({
    user_id: firstSignIn.data.user.id,
    title: "Verification",
    body: "From first device",
    source: "written",
  }).select("id").single()
  if (inserted.error || !inserted.data) fail("Owner insert failed: " + inserted.error?.message)
  entryId = inserted.data.id

  const synced = await second.from("journal_entries").select("body").eq("id", entryId).single()
  if (synced.error || synced.data?.body !== "From first device") fail("Second device did not see entry")
  const updated = await second.from("journal_entries").update({ body: "From second device" }).eq("id", entryId).select("id")
  if (updated.error || updated.data?.length !== 1) fail("Second device update failed")
  const back = await first.from("journal_entries").select("body").eq("id", entryId).single()
  if (back.error || back.data?.body !== "From second device") fail("First device did not see update")

  const forbiddenRead = await other.from("journal_entries").select("id").eq("id", entryId)
  if (forbiddenRead.error || forbiddenRead.data?.length !== 0) fail("Other user can read entry")
  const forbiddenUpdate = await other.from("journal_entries").update({ body: "stolen" }).eq("id", entryId).select("id")
  if (forbiddenUpdate.error || forbiddenUpdate.data?.length !== 0) fail("Other user can update entry")
  const forbiddenDelete = await other.from("journal_entries").delete().eq("id", entryId).select("id")
  if (forbiddenDelete.error || forbiddenDelete.data?.length !== 0) fail("Other user can delete entry")
  const forbiddenInsert = await other.from("journal_entries").insert({
    user_id: firstSignIn.data.user.id,
    body: "stolen",
    source: "written",
  })
  if (!forbiddenInsert.error) fail("Other user can insert entry for owner")

  const deleted = await first.from("journal_entries").delete().eq("id", entryId).select("id")
  if (deleted.error || deleted.data?.length !== 1) fail("Owner delete failed")
  entryId = undefined
  const gone = await second.from("journal_entries").select("id").eq("id", deleted.data[0].id)
  if (gone.error || gone.data?.length !== 0) fail("Deletion did not sync")
  console.log("Journal CRUD, two-session sync, and owner-only RLS passed")
} finally {
  if (entryId) await admin.from("journal_entries").delete().eq("id", entryId)
  if (temporaryUserId) await admin.auth.admin.deleteUser(temporaryUserId)
  if (temporaryOwnerId) await admin.auth.admin.deleteUser(temporaryOwnerId)
}
