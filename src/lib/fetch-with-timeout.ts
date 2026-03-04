/**
 * 带超时的 fetch，避免外部 API 偶发长时间阻塞导致请求超时
 */
const DEFAULT_TIMEOUT_MS = 15000

export async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs: number = DEFAULT_TIMEOUT_MS,
): Promise<Response> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const res = await fetch(url, {
      ...options,
      signal: options.signal ?? controller.signal,
    })
    return res
  } finally {
    clearTimeout(timeoutId)
  }
}
