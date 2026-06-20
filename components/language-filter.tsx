"use client"

import { motion, AnimatePresence } from "framer-motion"
import type { Repository } from "@/types/github"
import { getLanguageColor } from "@/lib/utils"
import { Tag, X } from "lucide-react"

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
  const languages = new Set<string>()
  repositories.forEach((repo) => {
    if (repo.language) languages.add(repo.language)
  })
  const sortedLanguages = Array.from(languages).sort()

  if (sortedLanguages.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4"
    >
      <div className="flex items-center gap-2 mb-2">
        <Tag className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="text-xs text-muted-foreground font-medium">Languages</span>
        {selectedLanguages.size > 0 && (
          <button
            onClick={onClearFilters}
            className="text-xs text-primary hover:text-primary/80 transition-colors ml-auto"
          >
            Clear filters ({selectedLanguages.size})
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {sortedLanguages.map((lang) => {
          const isSelected = selectedLanguages.has(lang)
          const color = getLanguageColor(lang)
          return (
            <button
              key={lang}
              onClick={() => onToggleLanguage(lang)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                isSelected
                  ? "bg-primary/10 text-primary ring-1 ring-primary/30"
                  : "bg-secondary text-muted-foreground hover:bg-secondary/80"
              }`}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
              {lang}
              {isSelected && <X className="w-3 h-3" />}
            </button>
          )
        })}
      </div>
    </motion.div>
  )
}
