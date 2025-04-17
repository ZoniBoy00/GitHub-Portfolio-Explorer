"use client"

import { useState, useEffect } from "react"
import type { GitHubUser, RateLimitInfo } from "@/types/github"

interface UseGitHubUserResult {
  user: GitHubUser | null
  loading: boolean
  error: Error | null
  rateLimit: RateLimitInfo | null
}

export function useGitHubUser(username: string): UseGitHubUserResult {
  const [user, setUser] = useState<GitHubUser | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)
  const [rateLimit, setRateLimit] = useState<RateLimitInfo | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      if (!username) return

      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`https://api.github.com/users/${username}`)

        // Extract rate limit information
        const rateLimitRemaining = response.headers.get("x-ratelimit-remaining")
        const rateLimitLimit = response.headers.get("x-ratelimit-limit")
        const rateLimitReset = response.headers.get("x-ratelimit-reset")
        const rateLimitUsed = response.headers.get("x-ratelimit-used")

        if (rateLimitRemaining && rateLimitLimit && rateLimitReset && rateLimitUsed) {
          setRateLimit({
            remaining: Number.parseInt(rateLimitRemaining, 10),
            limit: Number.parseInt(rateLimitLimit, 10),
            reset: Number.parseInt(rateLimitReset, 10),
            used: Number.parseInt(rateLimitUsed, 10),
          })
        }

        if (!response.ok) {
          throw new Error(`GitHub API returned ${response.status}: ${response.statusText}`)
        }

        const userData = await response.json()
        setUser(userData)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("An unknown error occurred"))
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [username])

  return { user, loading, error, rateLimit }
}
