import websocketClient from "@/lib/api/websocketClient"
import WebSocketClientOptions from "@/lib/api/websocketClient.types"

export const transcribeApi = async (options?: WebSocketClientOptions) => {
  return websocketClient("/realtime-transcribe", {
    signal: new AbortController().signal,
    ...options,
  })
}

export default transcribeApi
