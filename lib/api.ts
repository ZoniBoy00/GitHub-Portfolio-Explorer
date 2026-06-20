/**
 * GitHub API helper with optional token support for higher rate limits.
 */

const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN || ""

const BASE_HEADERS: Record<string, string> = {
  Accept: "application/vnd.github.v3+json",
}

if (GITHUB_TOKEN) {
  BASE_HEADERS["Authorization"] = `Bearer ${GITHUB_TOKEN}`
}

export async function githubFetch<T>(url: string): Promise<T> {
  const response = await fetch(url, { headers: BASE_HEADERS })

  if (!response.ok) {
    throw new Error(`GitHub API ${response.status}: ${response.statusText}`)
  }

  return response.json()
}

export interface RateLimitInfo {
  limit: number
  remaining: number
  reset: number
  used: number
}

export function extractRateLimit(headers: Headers): RateLimitInfo | null {
  const remaining = headers.get("x-ratelimit-remaining")
  const limit = headers.get("x-ratelimit-limit")
  const reset = headers.get("x-ratelimit-reset")
  const used = headers.get("x-ratelimit-used")

  if (remaining && limit && reset && used) {
    return {
      limit: Number.parseInt(limit, 10),
      remaining: Number.parseInt(remaining, 10),
      reset: Number.parseInt(reset, 10),
      used: Number.parseInt(used, 10),
    }
  }
  return null
}

export async function githubFetchWithRateLimit<T>(
  url: string
): Promise<{ data: T; rateLimit: RateLimitInfo | null }> {
  const response = await fetch(url, { headers: BASE_HEADERS })
  const rateLimit = extractRateLimit(response.headers)

  if (!response.ok) {
    throw new Error(`GitHub API ${response.status}: ${response.statusText}`)
  }

  const data: T = await response.json()
  return { data, rateLimit }
}
