import WebSocketClientError from "./WebSocketClientError"

export type WebSocketClientErrorCode =
  | "aborted"
  | "auth_failed"
  | "auth_required"
  | "connection_closed"
  | "connection_error"
  | "invalid_message"
  | "timeout"

type WebSocketClientOptions = {
  readyTimeoutMs?: number
  signal?: AbortSignal
  onReady?: () => void
  onMessage?: (message: ServerMessage) => void
  onClose?: () => void
  onError?: (error: WebSocketClientError) => void
  onAbort?: () => void
}

export type ServerMessage = {
  code?: string
  message?: string
  type?: string
  delta?: string
  transcript?: string
}

export type { WebSocketClientOptions as default }
