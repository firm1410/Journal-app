import type { WebSocketClientErrorCode } from "@/lib/api/websocketClient.types"

class WebSocketClientError extends Error {
  readonly code: WebSocketClientErrorCode | string

  constructor(code: WebSocketClientErrorCode | string, message: string) {
    super(message)
    this.name = "WebSocketClientError"
    this.code = code
  }
}

export default WebSocketClientError
