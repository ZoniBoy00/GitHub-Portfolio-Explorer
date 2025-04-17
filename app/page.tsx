"use client"

import { useState, useCallback, useMemo, useEffect, useRef } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import SearchBar from "@/components/search-bar"
import LanguageFilter from "@/components/language-filter"
import RepositoryGrid from "@/components/repository-grid"
import StatisticsSection from "@/components/statistics-section"
import LoadingScreen from "@/components/loading-screen"
import Pagination from "@/components/pagination"
import UserProfile from "@/components/user-profile"
import { useGitHubRepositories } from "@/hooks/use-github-repositories"
import { useGitHubUser } from "@/hooks/use-github-user"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"

export default function Home() {
  const [username, setUsername] = useState<string>("ZoniBoy00")
  const {
    repositories,
    loading: reposLoading,
    error: reposError,
    totalPages,
    currentPage,
    setCurrentPage,
  } = useGitHubRepositories(username)
  const { user, loading: userLoading, error: userError, rateLimit } = useGitHubUser(username)

  const [searchTerm, setSearchTerm] = useState("")
  const [sortKey, setSortKey] = useState<"created" | "stars" | "forks" | "updated" | "name">("created")
  const [selectedLanguages, setSelectedLanguages] = useState<Set<string>>(new Set())
  const [showArchived, setShowArchived] = useState(true)

  const searchInputRef = useRef<HTMLInputElement>(null)

  // Determine if any loading is happening
  const isLoading = reposLoading || userLoading

  // Save last visited username to localStorage
  useEffect(() => {
    const savedUsername = localStorage.getItem("github-explorer-username")
    if (savedUsername && savedUsername !== username) {
      setUsername(savedUsername)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("github-explorer-username", username)
  }, [username])

  // Memoize filtered repositories to prevent unnecessary recalculations
  const filteredRepos = useMemo(() => {
    if (!repositories) return []

    let filtered = [...repositories]

    // Filter out archived repositories if needed
    if (!showArchived) {
      filtered = filtered.filter((repo) => !repo.archived)
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (repo) =>
          repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (repo.description && repo.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (repo.topics && repo.topics.some((topic) => topic.toLowerCase().includes(searchTerm.toLowerCase()))),
      )
    }

    // Apply language filter
    if (selectedLanguages.size > 0) {
      filtered = filtered.filter((repo) => repo.language && selectedLanguages.has(repo.language))
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      switch (sortKey) {
        case "stars":
          return b.stargazers_count - a.stargazers_count
        case "forks":
          return b.forks_count - a.forks_count
        case "updated":
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        case "name":
          return a.name.localeCompare(b.name)
        case "created":
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
    })
  }, [repositories, searchTerm, sortKey, selectedLanguages, showArchived])

  // Memoize handler functions to prevent unnecessary re-renders
  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term)
  }, [])

  const handleSort = useCallback((key: "created" | "stars" | "forks" | "updated" | "name") => {
    setSortKey(key)
  }, [])

  const handleLanguageToggle = useCallback((language: string) => {
    setSelectedLanguages((prev) => {
      const newSelectedLanguages = new Set(prev)
      if (newSelectedLanguages.has(language)) {
        newSelectedLanguages.delete(language)
      } else {
        newSelectedLanguages.add(language)
      }
      return newSelectedLanguages
    })
  }, [])

  const clearLanguageFilters = useCallback(() => {
    setSelectedLanguages(new Set())
  }, [])

  const handleUsernameChange = useCallback(
    (newUsername: string) => {
      if (newUsername !== username) {
        setUsername(newUsername)
        // Reset filters when changing user
        setSearchTerm("")
        setSelectedLanguages(new Set())
      }
    },
    [username],
  )

  const handlePageChange = useCallback(
    (page: number) => {
      if (page < 1 || page > totalPages || page === currentPage) return

      // Scroll to top when changing pages
      window.scrollTo({ top: 0, behavior: "smooth" })
      setCurrentPage(page)
    },
    [setCurrentPage, totalPages, currentPage],
  )

  const toggleArchivedVisibility = useCallback(() => {
    setShowArchived((prev) => !prev)
  }, [])

  const focusSearchInput = useCallback(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [])

  // Set up keyboard shortcuts
  useKeyboardShortcuts({
    onNextPage: () => handlePageChange(currentPage + 1),
    onPrevPage: () => handlePageChange(currentPage - 1),
    onSearch: focusSearchInput,
    disabled: isLoading,
  })

  return (
    <div className="app-container min-h-screen flex flex-col">
      <LoadingScreen isLoading={isLoading} message={`Loading ${username}'s profile and repositories...`} />

      <Header username={username} onUsernameChange={handleUsernameChange} isLoading={isLoading} />

      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
        <UserProfile
          user={user}
          loading={userLoading}
          error={userError}
          rateLimit={rateLimit}
          showArchived={showArchived}
          onToggleArchived={toggleArchivedVisibility}
        />

        <SearchBar onSearch={handleSearch} onSort={handleSort} sortKey={sortKey} inputRef={searchInputRef} />

        <LanguageFilter
          repositories={repositories || []}
          selectedLanguages={selectedLanguages}
          onToggleLanguage={handleLanguageToggle}
          onClearFilters={clearLanguageFilters}
        />

        <StatisticsSection repositories={filteredRepos} />

        <RepositoryGrid repositories={filteredRepos} loading={reposLoading} error={reposError} />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          isLoading={reposLoading}
          onPageChange={handlePageChange}
        />
      </main>

      <Footer />
    </div>
  )
}
