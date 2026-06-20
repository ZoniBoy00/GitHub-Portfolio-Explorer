"use client"

import { useQuery } from "@tanstack/react-query"
import type { GitHubUser } from "@/types/github"
import { githubFetchWithRateLimit } from "@/lib/api"
import type { RateLimitInfo } from "@/lib/api"

interface UseGitHubUserResult {
  user: GitHubUser | null
  loading: boolean
  error: Error | null
  rateLimit: RateLimitInfo | null
}

export function useGitHubUser(username: string): UseGitHubUserResult {
  const { data, isLoading, error } = useQuery({
    queryKey: ["github-user", username],
    queryFn: async () => {
      const result = await githubFetchWithRateLimit<GitHubUser>(
        `https://api.github.com/users/${username}`
      )
      return result
    },
    enabled: !!username,
    staleTime: 1000 * 60 * 10, // 10 min
  })

  return {
    user: data?.data ?? null,
    loading: isLoading,
    error: error instanceof Error ? error : null,
    rateLimit: data?.rateLimit ?? null,
  }
}
