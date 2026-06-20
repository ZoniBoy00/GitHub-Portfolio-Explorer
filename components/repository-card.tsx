import { motion } from "framer-motion"
import type { Repository } from "@/types/github"
import { getLanguageColor, formatDate } from "@/lib/utils"
import { Star, GitFork, GitBranch, Calendar, ExternalLink, Archive } from "lucide-react"

interface RepositoryCardProps {
  repository: Repository
  index: number
}

export default function RepositoryCard({ repository, index }: RepositoryCardProps) {
  const isFork = repository.fork === true
  const isArchived = repository.archived === true

  // Border color: fork -> blue, archived -> amber, otherwise default
  const borderClass = isFork
    ? "border-l-4 border-l-blue-400"
    : isArchived
      ? "border-l-4 border-l-amber-400"
      : ""

  return (
    <motion.a
      href={repository.html_url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      className={`group block bg-card rounded-xl border border-border hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 overflow-hidden ${borderClass}`}
    >
      <div className="p-5 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="min-w-0">
            <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
              {repository.name}
            </h3>
            {repository.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                {repository.description}
              </p>
            )}
          </div>
          <ExternalLink className="w-4 h-4 text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-opacity mt-1" />
        </div>

        {/* Fork indicator & badges */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {isFork ? (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-500 dark:text-blue-400">
              <GitFork className="w-3.5 h-3.5" />
              Forked
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
              <GitBranch className="w-3.5 h-3.5" />
              Source
            </span>
          )}

          {isArchived && (
            <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Archive className="w-3 h-3" />
              Archived
            </span>
          )}

          {repository.private && (
            <span className="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full bg-red-500/10 text-red-500">
              Private
            </span>
          )}
        </div>

        {/* Parent repo link */}
        {isFork && repository.parent && (
          <div className="mb-3 text-xs text-muted-foreground">
            Forked from{" "}
            <button
              onClick={(e) => {
                e.stopPropagation()
                window.open(repository.parent!.html_url, "_blank", "noopener noreferrer")
              }}
              className="text-primary hover:underline font-medium inline cursor-pointer"
            >
              {repository.parent.full_name}
            </button>
          </div>
        )}

        {/* Topics */}
        {repository.topics && repository.topics.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {repository.topics.slice(0, 4).map((topic) => (
              <span
                key={topic}
                className="text-[11px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium"
              >
                {topic}
              </span>
            ))}
            {repository.topics.length > 4 && (
              <span className="text-[11px] px-2 py-0.5 text-muted-foreground">
                +{repository.topics.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Language bar */}
        {repository.language && (
          <div className="mb-3">
            <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: "100%",
                  backgroundColor: getLanguageColor(repository.language),
                }}
              />
            </div>
          </div>
        )}

        {/* Footer stats */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          {repository.language && (
            <div className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: getLanguageColor(repository.language) }}
              />
              <span>{repository.language}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5" />
            <span>{repository.stargazers_count}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <GitFork className="w-3.5 h-3.5" />
            <span>{repository.forks_count}</span>
          </div>
          <div className="flex items-center gap-1.5 ml-auto">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formatDate(repository.created_at)}</span>
          </div>
        </div>
      </div>
    </motion.a>
  )
}
