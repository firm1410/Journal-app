import getApiBaseUrl from "@/lib/api/apiUrl"
import type WebSocketClientOptions from "@/lib/api/websocketClient.types"
import type { ServerMessage } from "@/lib/api/websocketClient.types"
import WebSocketClientError from "@/lib/api/WebSocketClientError"
import { supabase } from "@/lib/supabase"

const DEFAULT_READY_TIMEOUT_MS = 10_000

const buildWebSocketUrl = (path: string) => {
  const url = new URL(path.replace(/^\/+/, ""), getApiBaseUrl())

  if (url.protocol === "https:") {
    url.protocol = "wss:"
  } else if (url.protocol === "http:") {
    url.protocol = "ws:"
  } else {
    throw new WebSocketClientError(
      "connection_error",
      `Unsupported API URL protocol: ${url.protocol}`,
    )
  }

  return url.toString()
}

const websocketClient = async (
  path: string,
  options: WebSocketClientOptions = {},
) => {
  const { readyTimeoutMs = DEFAULT_READY_TIMEOUT_MS, signal } = options
  const { data, error } = await supabase.auth.getSession()
  const accessToken = data.session?.access_token

  if (error) {
    throw new WebSocketClientError("auth_failed", error.message)
  }

  if (!accessToken) {
    throw new WebSocketClientError(
      "auth_required",
      "Authentication is required",
    )
  }

  if (signal?.aborted) {
    throw new WebSocketClientError(
      "aborted",
      "WebSocket connection was cancelled",
    )
  }

  return new Promise<WebSocket>((resolve, reject) => {
    const socket = new WebSocket(buildWebSocketUrl(path))
    let settled = false

    const cleanup = () => {
      clearTimeout(timeout)
      signal?.removeEventListener("abort", handleAbort)
      socket.removeEventListener("open", handleOpen)
      socket.removeEventListener("message", handleMessage)
      socket.removeEventListener("error", handleError)
      socket.removeEventListener("close", handleClose)
    }

    const resolveConnection = () => {
      if (settled) {
        return
      }

      settled = true
      clearTimeout(timeout)
      signal?.removeEventListener("abort", handleAbort)
      socket.removeEventListener("open", handleOpen)
      resolve(socket)
    }

    const rejectConnection = (
      clientError: WebSocketClientError,
      closeSocket = true,
    ) => {
      if (settled) {
        return
      }

      settled = true
      cleanup()

      if (closeSocket && socket.readyState < WebSocket.CLOSING) {
        options.onClose?.()
        socket.close()
      }

      reject(clientError)
    }

    const handleAbort = () => {
      options.onAbort?.()
      rejectConnection(
        new WebSocketClientError(
          "aborted",
          "WebSocket connection was cancelled",
        ),
      )
    }

    const handleOpen = () => {
      socket.send(
        JSON.stringify({
          type: "auth",
          accessToken,
        }),
      )
    }

    const handleMessage = (event: MessageEvent) => {
      if (typeof event.data !== "string") {
        rejectConnection(
          new WebSocketClientError(
            "invalid_message",
            "The WebSocket server returned a non-text authentication response",
          ),
        )
        return
      }

      let message: ServerMessage

      try {
        message = JSON.parse(event.data) as ServerMessage
      } catch {
        rejectConnection(
          new WebSocketClientError(
            "invalid_message",
            "The WebSocket server returned invalid JSON",
          ),
        )
        return
      }

      if (message.type === "ready") {
        options.onReady?.()
        resolveConnection()
        return
      }
      options.onMessage?.(message)

      if (message.type === "error") {
        rejectConnection(
          new WebSocketClientError(
            message.code ?? "connection_error",
            message.message ?? "WebSocket authentication failed",
          ),
        )
      }
    }

    const handleError = () => {
      options.onError?.(
        new WebSocketClientError(
          "connection_error",
          "The WebSocket connection failed",
        ),
      )
      rejectConnection(
        new WebSocketClientError(
          "connection_error",
          "The WebSocket connection failed",
        ),
        false,
      )
    }

    const handleClose = () => {
      rejectConnection(
        new WebSocketClientError(
          "connection_closed",
          "The WebSocket closed before it was ready",
        ),
        false,
      )
    }

    const timeout = setTimeout(() => {
      rejectConnection(
        new WebSocketClientError(
          "timeout",
          `WebSocket was not ready after ${readyTimeoutMs}ms`,
        ),
      )
    }, readyTimeoutMs)

    signal?.addEventListener("abort", handleAbort, { once: true })
    socket.addEventListener("open", handleOpen)
    socket.addEventListener("message", handleMessage)
    socket.addEventListener("error", handleError)
    socket.addEventListener("close", handleClose)
  })
}

export default websocketClient
