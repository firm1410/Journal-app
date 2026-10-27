import type { ServerMessage } from "@/lib/api/websocketClient.types"
import {
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioStream,
} from "expo-audio"
import { useCallback, useRef, useState } from "react"
import { Alert } from "react-native"
import { RecordingState } from "../models/RecordingInterface"

const SAMPLE_RATE = 24_000

const useRecordingController = () => {
  const socketRef = useRef<WebSocket | null>(null)
  const connectionRef = useRef<AbortController | null>(null)
  const [recordingState, setRecordingState] = useState<RecordingState>(
    RecordingState.IDLE,
  )
  const [transcribe, setTranscribe] = useState("")
  const [date, setDate] = useState(new Date())
  const { stream } = useAudioStream({
    sampleRate: SAMPLE_RATE,
    channels: 1,
    encoding: "int16",
    onBuffer: ({ data }) => {
      const socket = socketRef.current

      if (socket?.readyState === WebSocket.OPEN) {
        socket.send(data)
      }
    },
  })

  const handleMessage = (message: ServerMessage) => {
    if (!connectionRef.current || connectionRef.current.signal.aborted) {
      return
    }
    if (message.type === "transcript.delta" && message.delta) {
      setTranscribe((current) => current + message.delta)
      return
    }
    if (message.type === "transcript.completed" && message.transcript) {
      setTranscribe(message.transcript)
      setRecordingState(RecordingState.EDITING)
      return
    }

    if (message.type === "error") {
      Alert.alert("Connection failed", message.message ?? message.code)
    }
  }

  const handleReady = () => {
    if (!connectionRef.current || connectionRef.current.signal.aborted) {
      return
    }
    console.log("ready")
    setRecordingState(RecordingState.TRANSCRIBING)
  }
  const disconnect = useCallback(() => {
    setRecordingState(RecordingState.DONE_TRANSCRIBING)
    console.log("disconnect")
    stream.stop()
    const socket = socketRef.current
    socket?.send(
      JSON.stringify({
        type: "stop",
      }),
    )
    socketRef.current?.close()
    socketRef.current = null
  }, [stream])

  const cancelRecording = useCallback(() => {
    connectionRef.current?.abort()
    const socket = socketRef.current
    socketRef.current = null

    try {
      stream.stop()
    } finally {
      try {
        if (socket && socket.readyState < WebSocket.CLOSING) {
          socket.close()
        }
      } finally {
        setTranscribe("")
        setRecordingState(RecordingState.IDLE)
      }
    }
  }, [stream])

  const handleClose = () => {
    setTranscribe("")
  }
  const connect = useCallback(async () => {
    console.log("connect")
    if (recordingState !== RecordingState.IDLE) {
      disconnect()
      return
    }
    const connection = new AbortController()
    connectionRef.current = connection
    const permission = await requestRecordingPermissionsAsync()

    if (connection.signal.aborted) {
      return
    }

    if (!permission.granted) {
      Alert.alert("Permission required", "Microphone access is required.")
      return
    }

    await setAudioModeAsync({
      allowsRecording: true,
      playsInSilentMode: true,
    })

    if (connection.signal.aborted) {
      return
    }

    try {
      setRecordingState(RecordingState.TRANSCRIBING)
      setTranscribe("test transcribe")
      // const socket = await connectToTranscription({
      //   signal: connection.signal,
      //   onMessage: handleMessage,
      //   onReady: handleReady,
      //   onClose: handleClose,
      // })

      // socketRef.current = socket
      // socket.send(
      //   JSON.stringify({
      //     type: "start",
      //     encoding: "pcm_s16le",
      //     sampleRate: SAMPLE_RATE,
      //     channels: 1,
      //   }),
      // )

      // await stream.start()
    } catch (error) {
      if (connection.signal.aborted) {
        return
      }
      const message =
        error instanceof Error ? error.message : "Unable to start recording."
      console.log(message)

      setRecordingState(RecordingState.IDLE)

      Alert.alert("Connection failed", message)
    }
  }, [disconnect, recordingState])

  const toggleRecording = useCallback(async () => {
    if (recordingState === RecordingState.TRANSCRIBING) {
      disconnect()
      return
    }
    await connect()
  }, [connect, disconnect, recordingState])

  return {
    cancelRecording,
    recordingState,
    setRecordingState,
    toggleRecording,
    transcribe,
    setTranscribe,
    date,
    setDate,
  }
}

export default useRecordingController
