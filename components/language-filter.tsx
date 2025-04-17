"use client"

import { Tag, Info } from "lucide-react"
import type { Repository } from "@/types/github"
import { getLanguageColor } from "@/lib/utils"

interface LanguageFilterProps {
  repositories: Repository[]
  selectedLanguages: Set<string>
  onToggleLanguage: (language: string) => void
  onClearFilters: () => void
}

export default function LanguageFilter({
  repositories,
  selectedLanguages,
  onToggleLanguage,
  onClearFilters,
}: LanguageFilterProps) {
  // Extract unique languages
  const languages = new Set<string>()
  repositories.forEach((repo) => {
    if (repo.language) {
      languages.add(repo.language)
    }
  })

  // Sort languages alphabetically
  const sortedLanguages = Array.from(languages).sort()

  // Count filtered repositories
  const filteredCount = repositories.filter(
    (repo) => selectedLanguages.size === 0 || (repo.language && selectedLanguages.has(repo.language)),
  ).length

  return (
    <div className="mb-6 p-6 bg-card rounded-xl shadow-md border border-border">
      <h3 className="text-base font-medium mb-4 text-muted-foreground flex items-center gap-2">
        <Tag className="w-4 h-4" />
        Filter by language
      </h3>

      <div className="flex flex-wrap gap-2 mb-4">
        {sortedLanguages.length === 0 ? (
          <span>No languages found</span>
        ) : (
          sortedLanguages.map((language) => (
            <button
              key={language}
              onClick={() => onToggleLanguage(language)}
              className={`inline-flex items-center py-1.5 px-3 rounded-full text-sm transition-all ${
                selectedLanguages.has(language)
                  ? "bg-primary/20 text-primary border border-primary/30 transform -translate-y-0.5 shadow-sm"
                  : "bg-muted text-muted-foreground border border-transparent hover:bg-muted/80 hover:-translate-y-0.5"
              }`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full mr-1.5"
                style={{ backgroundColor: getLanguageColor(language) }}
              />
              {language}
            </button>
          ))
        )}
      </div>

      <button
        onClick={onClearFilters}
        disabled={selectedLanguages.size === 0}
        className="text-sm text-primary bg-transparent border-none cursor-pointer py-1 px-2 rounded hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Clear filters
      </button>

      {selectedLanguages.size > 0 && (
        <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
          <Info className="w-4 h-4" />
          Showing {filteredCount} {filteredCount === 1 ? "repository" : "repositories"} with selected languages
        </div>
      )}
    </div>
  )
}
