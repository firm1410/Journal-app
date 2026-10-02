import connectToTranscription from "@/api/go/transcribe/transcribe"
import type { ServerMessage } from "@/lib/api/websocketClient.types"
import {
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioStream,
} from "expo-audio"
import { useCallback, useRef, useState } from "react"
import { Alert } from "react-native"

const SAMPLE_RATE = 16_000

const useRecordingController = () => {
  const socketRef = useRef<WebSocket | null>(null)
  const [isRecording, setIsRecording] = useState(false)

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
    if (message.type === "error") {
      Alert.alert("Connection failed", message.message ?? message.code)
    }
  }

  const handleReady = () => setIsRecording(true)

  const handleClose = () => {
    socketRef.current = null
    setIsRecording(false)
  }

  const disconnect = useCallback(() => {
    setIsRecording(false)
    socketRef.current?.close()
    socketRef.current = null
  }, [])

  const connect = useCallback(async () => {
    const permission = await requestRecordingPermissionsAsync()

    if (!permission.granted) {
      Alert.alert("Permission required", "Microphone access is required.")
      return
    }

    await setAudioModeAsync({
      allowsRecording: true,
      playsInSilentMode: true,
    })

    try {
      const socket = await connectToTranscription({
        onMessage: handleMessage,
        onReady: handleReady,
        onClose: handleClose,
      })

      socketRef.current = socket
      socket.send(
        JSON.stringify({
          type: "start",
          encoding: "pcm_s16le",
          sampleRate: SAMPLE_RATE,
          channels: 1,
        }),
      )

      await stream.start()
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to start recording."

      setIsRecording(false)
      Alert.alert("Connection failed", message)
    }
  }, [stream])

  const toggleRecording = useCallback(async () => {
    if (isRecording) {
      disconnect()
      return
    }

    await connect()
  }, [connect, disconnect, isRecording])

  return {
    isRecording,
    toggleRecording,
  }
}

export default useRecordingController
