"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Search, ArrowUpDown, X } from "lucide-react"

interface SearchBarProps {
  onSearch: (term: string) => void
  onSort: (key: "created" | "stars" | "forks" | "updated" | "name") => void
  sortKey: string
  inputRef?: React.RefObject<HTMLInputElement | null>
}

const SORT_OPTIONS = [
  { key: "created", label: "Created" },
  { key: "stars", label: "Stars" },
  { key: "forks", label: "Forks" },
  { key: "updated", label: "Updated" },
  { key: "name", label: "Name" },
] as const

export default function SearchBar({ onSearch, onSort, sortKey, inputRef }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedTerm, setDebouncedTerm] = useState("")

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedTerm(searchTerm), 300)
    return () => clearTimeout(timer)
  }, [searchTerm])

  useEffect(() => {
    onSearch(debouncedTerm)
  }, [debouncedTerm, onSearch])

  return (
    <div className="flex flex-col sm:flex-row gap-3 mt-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search repositories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full h-10 pl-9 pr-9 rounded-xl bg-card border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="relative">
        <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <select
          value={sortKey}
          onChange={(e) => onSort(e.target.value as any)}
          className="h-10 pl-9 pr-8 rounded-xl bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all appearance-none cursor-pointer"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.key} value={opt.key}>
              Sort by {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
