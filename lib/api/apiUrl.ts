import ApiError from "@/lib/api/ApiError"

const getApiBaseUrl = () => {
  const baseUrl =
    process.env.EXPO_PUBLIC_API_URL ??
    process.env.EXPO_PUBLIC_TRANSCRIBE_API_URL

  if (!baseUrl) {
    throw new ApiError(
      0,
      "API URL is not configured. Set EXPO_PUBLIC_API_URL.",
    )
  }

  return baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`
}

export default getApiBaseUrl
