import { AudioModule, RecordingPresets, setAudioModeAsync, useAudioRecorder, useAudioRecorderState } from "expo-audio"
import { useCallback, useEffect, useMemo, useState } from "react"
import { ActivityIndicator, Alert, FlatList, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native"
import { Session } from "@supabase/supabase-js"
import { useLocalSearchParams } from "expo-router"

import { colors } from "../constants/theme"
import { createEntry, deleteEntry, JournalEntry, listEntries, updateEntry } from "../lib/journal"
import { isBackendConfigured, supabase } from "../lib/supabase"
import { transcribeRecording } from "../lib/transcribe"

const JournalScreen = () => {
  const { compose } = useLocalSearchParams<{ compose?: string }>()
  const [session, setSession] = useState<Session | null>(null)
  const [authLoaded, setAuthLoaded] = useState(!isBackendConfigured)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [selected, setSelected] = useState<JournalEntry | null>(null)
  const [editing, setEditing] = useState(compose === "write" || compose === "record")
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [source, setSource] = useState<JournalEntry["source"]>("written")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY)
  const recorderState = useAudioRecorderState(recorder)

  useEffect(() => {
    if (!isBackendConfigured) return
    supabase.auth.getSession().then(({ data, error: authError }) => {
      setSession(data.session)
      if (authError) setError(authError.message)
      setAuthLoaded(true)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      if (!nextSession) setEntries([])
    })
    return () => subscription.unsubscribe()
  }, [])

  const refresh = useCallback(async () => {
    if (!session) return
    try {
      setEntries(await listEntries())
      setError("")
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not load entries")
    }
  }, [session])
  useEffect(() => {
    if (!session) return
    listEntries().then(setEntries).catch((cause: unknown) => {
      setError(cause instanceof Error ? cause.message : "Could not load entries")
    })
  }, [session])

  const openNew = useCallback(() => {
    setSelected(null)
    setTitle("")
    setBody("")
    setSource("written")
    setError("")
    setEditing(true)
  }, [])
  const openEntry = useCallback((entry: JournalEntry) => {
    setSelected(entry)
    setTitle(entry.title || "")
    setBody(entry.body)
    setSource(entry.source)
    setError("")
    setEditing(true)
  }, [])
  const signIn = useCallback(async () => {
    setBusy(true)
    setError("")
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
      if (authError) throw authError
      setPassword("")
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not sign in")
    } finally {
      setBusy(false)
    }
  }, [email, password])
  const save = useCallback(async () => {
    if (!session || !body.trim()) {
      setError("Write an entry before saving")
      return
    }
    setBusy(true)
    setError("")
    try {
      const draft = { title: title.trim() || null, body: body.trim(), source }
      if (selected) await updateEntry(selected.id, draft)
      else await createEntry(session.user.id, draft)
      setEditing(false)
      await refresh()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not save entry")
    } finally {
      setBusy(false)
    }
  }, [body, refresh, selected, session, source, title])
  const remove = useCallback(async () => {
    if (!selected) return
    setBusy(true)
    setError("")
    try {
      await deleteEntry(selected.id)
      setEditing(false)
      await refresh()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not delete entry")
    } finally {
      setBusy(false)
    }
  }, [refresh, selected])
  const confirmDelete = useCallback(() => {
    Alert.alert("Delete entry?", "This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => void remove() },
    ])
  }, [remove])
  const toggleRecording = useCallback(async () => {
    if (busy) return
    setError("")
    try {
      if (recorderState.isRecording) {
        setBusy(true)
        await recorder.stop()
        if (!recorder.uri) throw new Error("Recording was not saved")
        const text = await transcribeRecording(recorder.uri)
        setBody((current) => current ? current + "\n\n" + text : text)
        setSource("transcribed")
      } else {
        const permission = await AudioModule.requestRecordingPermissionsAsync()
        if (!permission.granted) throw new Error("Microphone permission is required")
        await setAudioModeAsync({ playsInSilentMode: true, allowsRecording: true })
        await recorder.prepareToRecordAsync()
        recorder.record()
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Recording failed")
    } finally {
      setBusy(false)
    }
  }, [busy, recorder, recorderState.isRecording])
  const entryCount = useMemo(() => entries.length + (entries.length === 1 ? " entry" : " entries"), [entries.length])

  if (!authLoaded) return <View style={styles.center}><ActivityIndicator /></View>
  if (!isBackendConfigured) return <View style={styles.center}><Text>Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY to connect your journal.</Text></View>
  if (!session) return (
    <View style={styles.screen}>
      <Text style={styles.heading}>Your journal</Text>
      <Text style={styles.subtitle}>Sign in to sync your entries.</Text>
      <TextInput accessibilityLabel="Email" autoCapitalize="none" keyboardType="email-address" placeholder="Email" style={styles.input} value={email} onChangeText={setEmail} />
      <TextInput accessibilityLabel="Password" secureTextEntry placeholder="Password" style={styles.input} value={password} onChangeText={setPassword} />
      <Pressable accessibilityRole="button" disabled={busy} onPress={() => void signIn()} style={styles.primary}><Text style={styles.primaryText}>{busy ? "Signing in…" : "Sign in"}</Text></Pressable>
      {!!error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
    </View>
  )
  if (editing) return (
    <View style={styles.screen}>
      <Text style={styles.heading}>{selected ? "Edit entry" : "New entry"}</Text>
      <TextInput accessibilityLabel="Entry title" placeholder="Title (optional)" style={styles.input} value={title} onChangeText={setTitle} />
      <TextInput accessibilityLabel="Entry body" multiline placeholder="What is on your mind?" style={[styles.input, styles.bodyInput]} value={body} onChangeText={setBody} textAlignVertical="top" />
      {Platform.OS !== "web" && <Pressable accessibilityRole="button" disabled={busy} onPress={() => void toggleRecording()} style={styles.secondary}><Text>{recorderState.isRecording ? "Stop and transcribe" : "Record speech"}</Text></Pressable>}
      <Pressable accessibilityRole="button" disabled={busy} onPress={() => void save()} style={styles.primary}><Text style={styles.primaryText}>{busy ? "Working…" : "Save entry"}</Text></Pressable>
      <Pressable accessibilityRole="button" disabled={busy} onPress={() => setEditing(false)} style={styles.secondary}><Text>Cancel</Text></Pressable>
      {selected && <Pressable accessibilityRole="button" disabled={busy} onPress={confirmDelete} style={styles.secondary}><Text style={styles.error}>Delete entry</Text></Pressable>}
      {!!error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
    </View>
  )
  return (
    <View style={styles.screen}>
      <View style={styles.header}><View><Text style={styles.heading}>Your journal</Text><Text style={styles.subtitle}>{entryCount}</Text></View><Pressable accessibilityRole="button" onPress={() => void supabase.auth.signOut()}><Text>Sign out</Text></Pressable></View>
      <Pressable accessibilityRole="button" onPress={openNew} style={styles.primary}><Text style={styles.primaryText}>New entry</Text></Pressable>
      {!!error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
      <FlatList data={entries} keyExtractor={(item) => item.id} contentContainerStyle={styles.list} ListEmptyComponent={<Text style={styles.subtitle}>No entries yet. Write your first one.</Text>} renderItem={({ item }) => (
        <Pressable accessibilityRole="button" accessibilityLabel={"Open " + (item.title || "untitled entry")} onPress={() => openEntry(item)} style={styles.entry}>
          <Text style={styles.entryTitle}>{item.title || item.body.split("\n")[0]}</Text>
          <Text style={styles.subtitle}>{new Date(item.created_at).toLocaleString()}</Text>
          <Text numberOfLines={2} style={styles.preview}>{item.body}</Text>
        </Pressable>
      )} refreshing={busy} onRefresh={() => void refresh()} />
    </View>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background, padding: 24, paddingTop: 64, paddingBottom: 120 },
  center: { flex: 1, justifyContent: "center", padding: 24 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  heading: { color: colors.text, fontSize: 30, fontWeight: "700" },
  subtitle: { color: colors.mutedText, marginTop: 6 },
  input: { borderWidth: 1, borderColor: colors.controlBorder, borderRadius: 14, padding: 14, marginTop: 16, backgroundColor: "white", color: colors.text },
  bodyInput: { minHeight: 220 },
  primary: { backgroundColor: colors.accent, borderRadius: 14, padding: 16, alignItems: "center", marginTop: 16 },
  primaryText: { color: colors.text, fontWeight: "700" },
  secondary: { borderRadius: 14, padding: 14, alignItems: "center", marginTop: 12 },
  error: { color: "#b42318", marginTop: 12 },
  list: { paddingTop: 20, paddingBottom: 24 },
  entry: { backgroundColor: colors.surface, borderRadius: 16, padding: 16, marginBottom: 12 },
  entryTitle: { color: colors.text, fontSize: 18, fontWeight: "600" },
  preview: { color: colors.mutedText, marginTop: 10 },
})

export default JournalScreen
