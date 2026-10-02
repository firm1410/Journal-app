import ApiError from "@/lib/api/ApiError"
import type ApiClientOptions from "@/lib/api/apiClient.types"
import type {
  ApiResponseType,
  QueryValue,
} from "@/lib/api/apiClient.types"
import getApiBaseUrl from "@/lib/api/apiUrl"
import { supabase } from "@/lib/supabase"

const DEFAULT_TIMEOUT_MS = 60_000

const buildUrl = (
  path: string,
  query?: Record<string, QueryValue | QueryValue[]>,
) => {
  const url = new URL(path.replace(/^\/+/, ""), getApiBaseUrl())

  Object.entries(query ?? {}).forEach(([key, rawValue]) => {
    const values = Array.isArray(rawValue) ? rawValue : [rawValue]

    values.forEach((value) => {
      if (value !== undefined) {
        url.searchParams.append(key, value === null ? "" : String(value))
      }
    })
  })

  return url.toString()
}

const isJsonBody = (
  body: ApiClientOptions["body"],
): body is Record<string, unknown> | unknown[] => {
  if (Array.isArray(body)) {
    return true
  }

  if (!body || typeof body !== "object") {
    return false
  }

  return Object.getPrototypeOf(body) === Object.prototype
}

const getAccessToken = async (refresh: boolean) => {
  const { data, error } = refresh
    ? await supabase.auth.refreshSession()
    : await supabase.auth.getSession()

  if (error) {
    throw new ApiError(401, error.message, error)
  }

  const accessToken = data.session?.access_token

  if (!accessToken) {
    throw new ApiError(401, "Authentication is required")
  }

  return accessToken
}

const parseBody = async (response: Response) => {
  const text = await response.text()

  if (!text) {
    return undefined
  }

  try {
    return JSON.parse(text) as unknown
  } catch {
    return text
  }
}

const parseSuccessResponse = async (
  response: Response,
  responseType: ApiResponseType,
) => {
  if (responseType === "raw") {
    return response
  }

  if (response.status === 204) {
    return undefined
  }

  if (responseType === "text") {
    return response.text()
  }

  if (responseType === "blob") {
    return response.blob()
  }

  const text = await response.text()

  if (!text) {
    return undefined
  }

  try {
    return JSON.parse(text) as unknown
  } catch {
    throw new ApiError(response.status, "The API returned invalid JSON", text)
  }
}

const apiClient = async <T = unknown>(
  path: string,
  options: ApiClientOptions = {},
) => {
  const {
    auth = true,
    body,
    headers: suppliedHeaders,
    query,
    responseType = "json",
    signal,
    timeoutMs = DEFAULT_TIMEOUT_MS,
    ...requestInit
  } = options
  const url = buildUrl(path, query)
  const controller = new AbortController()
  let timedOut = false

  const abortFromCaller = () => controller.abort(signal?.reason)

  if (signal?.aborted) {
    abortFromCaller()
  } else {
    signal?.addEventListener("abort", abortFromCaller, { once: true })
  }

  const timeout = setTimeout(() => {
    timedOut = true
    controller.abort()
  }, timeoutMs)

  const sendRequest = async (refreshToken: boolean): Promise<Response> => {
    const headers = new Headers(suppliedHeaders)
    let requestBody = body as BodyInit | null | undefined

    if (!headers.has("Accept")) {
      headers.set("Accept", "application/json")
    }

    if (isJsonBody(body)) {
      requestBody = JSON.stringify(body)

      if (!headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json")
      }
    }

    if (auth) {
      const accessToken = await getAccessToken(refreshToken)
      headers.set("Authorization", `Bearer ${accessToken}`)
    }

    return fetch(url, {
      ...requestInit,
      body: requestBody,
      headers,
      signal: controller.signal,
    })
  }

  try {
    let response = await sendRequest(false)

    if (auth && response.status === 401) {
      response = await sendRequest(true)
    }

    if (!response.ok) {
      const data = await parseBody(response)
      const message =
        typeof data === "object" &&
        data !== null &&
        "message" in data &&
        typeof data.message === "string"
          ? data.message
          : `API request failed with status ${response.status}`

      throw new ApiError(response.status, message, data)
    }

    return (await parseSuccessResponse(response, responseType)) as T
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }

    if (timedOut) {
      throw new ApiError(0, `API request timed out after ${timeoutMs}ms`, {
        code: "timeout",
      })
    }

    if (controller.signal.aborted) {
      throw new ApiError(0, "API request was cancelled", {
        code: "aborted",
      })
    }

    throw new ApiError(
      0,
      error instanceof Error ? error.message : "API request failed",
      error,
    )
  } finally {
    clearTimeout(timeout)
    signal?.removeEventListener("abort", abortFromCaller)
  }
}

export default apiClient
