"use client"

import { useQuery } from "@tanstack/react-query"
import type { Repository } from "@/types/github"
import { githubFetchWithRateLimit } from "@/lib/api"
import { inferLanguage } from "@/lib/utils"

interface UseGitHubRepositoriesResult {
  repositories: Repository[] | null
  loading: boolean
  error: Error | null
}

export function useGitHubRepositories(username: string): UseGitHubRepositoriesResult {
  const perPage = 30

  // Fetch repos — fetches all pages for full local filtering
  const reposQuery = useQuery({
    queryKey: ["github-repos", username, perPage],
    queryFn: async () => {
      const repos: Repository[] = []
      // GitHub API paginates at 100, but we fetch all pages for full local filtering
      const perPageMax = 100
      let page = 1
      let fetched: Repository[] = []

      do {
        const { data } = await githubFetchWithRateLimit<Repository[]>(
          `https://api.github.com/users/${username}/repos?per_page=${perPageMax}&page=${page}&sort=updated`
        )
        fetched = data
        repos.push(
          ...fetched
            .filter((repo: Repository) => !repo.private)
            .map((repo: Repository) => ({
              ...repo,
              language: inferLanguage(repo),
            }))
        )
        page++
      } while (fetched.length === perPageMax)

      return repos
    },
    enabled: !!username,
    staleTime: 1000 * 60 * 5,
  })

  return {
    repositories: reposQuery.data ?? null,
    loading: reposQuery.isLoading,
    error: reposQuery.error instanceof Error ? reposQuery.error : null,
  }
}
