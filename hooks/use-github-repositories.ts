"use client"

import { useState, useEffect } from "react"
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
  const [repositories, setRepositories] = useState<Repository[] | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)
  const [totalRepos, setTotalRepos] = useState<number>(0)
  const [currentPage, setCurrentPage] = useState<number>(1)

  // GitHub API returns max 100 repos per page, but we'll use 30 for better UX
  const perPage = 30

  // Calculate total pages based on total repos
  const totalPages = Math.max(1, Math.ceil(totalRepos / perPage))

  // Reset to page 1 when username changes
  useEffect(() => {
    setCurrentPage(1)
  }, [username])

  // Fetch user info to get total repo count
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!username) return

      try {
        const response = await fetch(`https://api.github.com/users/${username}`)

        if (!response.ok) {
          // Don't throw here, we'll handle errors in the main fetch
          console.warn(`Error fetching user info: ${response.status}`)
          return
        }

        const userData = await response.json()
        setTotalRepos(userData.public_repos)
      } catch (err) {
        console.error("Error fetching user info:", err)
        // Don't set error state here as we'll handle it in the main fetch
      }
    }

    fetchUserInfo()
  }, [username])

  // Fetch repositories for the current page
  useEffect(() => {
    const fetchRepositories = async () => {
      if (!username) return

      setLoading(true)
      setError(null)

      try {
        const response = await fetch(
          `https://api.github.com/users/${username}/repos?per_page=${perPage}&page=${currentPage}&sort=updated`,
        )

        if (!response.ok) {
          throw new Error(`GitHub API returned ${response.status}: ${response.statusText}`)
        }

        const data = await response.json()
        setRepositories(data.filter((repo: Repository) => !repo.private))

        // Check for pagination info in the Link header
        const linkHeader = response.headers.get("Link")
        if (linkHeader) {
          // Parse Link header to get total pages if available
          const lastPageMatch = linkHeader.match(/page=(\d+)>; rel="last"/)
          if (lastPageMatch && lastPageMatch[1]) {
            const lastPage = Number.parseInt(lastPageMatch[1], 10)
            // Only update if we don't already have the total from user info
            if (totalRepos === 0) {
              setTotalRepos(lastPage * perPage)
            }
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error("An unknown error occurred"))
        setRepositories([])
      } finally {
        setLoading(false)
      }
    }

    fetchRepositories()
  }, [username, currentPage, perPage, totalRepos])

  return {
    repositories,
    loading,
    error,
    totalRepos,
    totalPages,
    currentPage,
    setCurrentPage,
  }
}
