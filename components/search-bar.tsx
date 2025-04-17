"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search, SlidersHorizontal, X } from "lucide-react"

interface SearchBarProps {
  onSearch: (term: string) => void
  onSort: (key: "created" | "stars" | "forks" | "updated" | "name") => void
  sortKey: string
  inputRef?: React.RefObject<HTMLInputElement>
}

export default function SearchBar({ onSearch, onSort, sortKey, inputRef }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedTerm, setDebouncedTerm] = useState("")
  const [showSortOptions, setShowSortOptions] = useState(false)

  // Debounce search term to avoid excessive filtering
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm])

  // Only trigger search when debounced term changes
  useEffect(() => {
    onSearch(debouncedTerm)
  }, [debouncedTerm, onSearch])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleClearSearch = () => {
    setSearchTerm("")
  }

  const handleSortChange = (key: "created" | "stars" | "forks" | "updated" | "name") => {
    onSort(key)
    setShowSortOptions(false)
  }

  const sortOptions = [
    { key: "created", label: "Latest" },
    { key: "updated", label: "Recently Updated" },
    { key: "stars", label: "Most Stars" },
    { key: "forks", label: "Most Forks" },
    { key: "name", label: "Name (A-Z)" },
  ]

  const currentSortOption = sortOptions.find((option) => option.key === sortKey) || sortOptions[0]

  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <div className="flex-1 min-w-[200px] relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search repositories by name, description or topic... (Press / to focus)"
          className="w-full py-2 pl-10 pr-10 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          aria-label="Search repositories"
        />
        {searchTerm && (
          <button
            onClick={handleClearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="relative">
        <button
          onClick={() => setShowSortOptions(!showSortOptions)}
          className="py-2 px-4 border border-border rounded-md bg-background text-foreground cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all flex items-center gap-2"
          aria-expanded={showSortOptions}
          aria-haspopup="listbox"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Sort: {currentSortOption.label}</span>
        </button>

        {showSortOptions && (
          <div className="absolute top-full mt-1 right-0 z-10 bg-card border border-border rounded-md shadow-md py-1 min-w-[180px]">
            {sortOptions.map((option) => (
              <button
                key={option.key}
                onClick={() => handleSortChange(option.key as any)}
                className={`w-full text-left px-4 py-2 hover:bg-muted transition-colors ${
                  sortKey === option.key ? "bg-primary/10 text-primary font-medium" : ""
                }`}
                role="option"
                aria-selected={sortKey === option.key}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
