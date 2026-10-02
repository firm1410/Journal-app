type QueryValue = string | number | boolean | null | undefined

export type ApiResponseType = "json" | "text" | "blob" | "raw"

type ApiClientOptions = Omit<
  RequestInit,
  "body" | "headers" | "signal"
> & {
  auth?: boolean
  body?: BodyInit | Record<string, unknown> | unknown[] | null
  headers?: HeadersInit
  query?: Record<string, QueryValue | QueryValue[]>
  responseType?: ApiResponseType
  signal?: AbortSignal
  timeoutMs?: number
}

export type { ApiClientOptions as default, QueryValue }
