"use client"

import { useQuery } from "@tanstack/react-query"
import type { Repository } from "@/types/github"

interface UseGitHubRepositoriesResult {
  repositories: Repository[] | null
  loading: boolean
  error: Error | null
  totalRepos: number
  totalPages: number
  currentPage: number
  setCurrentPage: (page: number) => void
}

export function useGitHubRepositories(username: string): UseGitHubRepositoriesResult {
  const perPage = 30

  // Fetch total repo count
  const userQuery = useQuery({
    queryKey: ["github-user", username],
    queryFn: async () => {
      const r = await fetch(`https://api.github.com/users/${username}`)
      if (!r.ok) throw new Error(`GitHub API ${r.status}`)
      return r.json() as Promise<{ public_repos: number }>
    },
    enabled: !!username,
    staleTime: 1000 * 60 * 10,
  })

  const totalRepos = userQuery.data?.public_repos ?? 0
  const totalPages = Math.max(1, Math.ceil(totalRepos / perPage))

  // Fetch repos — no staleTime so it refetches on page change
  const reposQuery = useQuery({
    queryKey: ["github-repos", username, perPage],
    queryFn: async () => {
      const repos: Repository[] = []
      // GitHub API paginates at 100, but we fetch all pages for full local filtering
      const perPageMax = 100
      let page = 1
      let fetched: Repository[] = []

      do {
        const r = await fetch(
          `https://api.github.com/users/${username}/repos?per_page=${perPageMax}&page=${page}&sort=updated`,
          {
            headers: process.env.NEXT_PUBLIC_GITHUB_TOKEN
              ? { Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}` }
              : undefined,
          }
        )
        if (!r.ok) throw new Error(`GitHub API ${r.status}: ${r.statusText}`)
        fetched = await r.json()
        repos.push(...fetched.filter((repo: Repository) => !repo.private))
        page++
      } while (fetched.length === perPageMax)

      return repos
    },
    enabled: !!username,
    staleTime: 1000 * 60 * 5,
  })

  return {
    repositories: reposQuery.data ?? null,
    loading: reposQuery.isLoading || userQuery.isLoading,
    error: reposQuery.error instanceof Error ? reposQuery.error : userQuery.error instanceof Error ? userQuery.error : null,
    totalRepos,
    totalPages,
    currentPage: 1,
    setCurrentPage: () => {}, // no-op: we load all repos, no pagination needed
  }
}
