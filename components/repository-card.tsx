import type { Repository } from "@/types/github"
import { getLanguageColor, formatDate } from "@/lib/utils"
import { GitFork, Star, ExternalLink, GitBranch, Tag, Eye, AlertTriangle, Calendar } from "lucide-react"

interface RepositoryCardProps {
  repository: Repository
}

export default function RepositoryCard({ repository }: RepositoryCardProps) {
  // Format dates
  const createdDate = formatDate(repository.created_at)

  return (
    <div
      className={`bg-card rounded-xl p-6 shadow-md border border-border transition-all hover:-translate-y-1 hover:shadow-lg flex flex-col h-full ${
        repository.fork ? "border-l-4 border-l-blue-400" : repository.archived ? "border-l-4 border-l-amber-400" : ""
      }`}
    >
      <div className="mb-3 flex justify-between items-start">
        <h3 className="text-lg font-semibold text-primary flex items-center gap-2 mb-2">
          {repository.fork ? <GitFork className="w-4 h-4" /> : <GitBranch className="w-4 h-4" />}
          {repository.name}
        </h3>
        <div className="flex gap-1">
          {repository.archived && (
            <span
              className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 text-xs px-2 py-0.5 rounded-full flex items-center gap-1"
              title="This repository is archived and read-only"
            >
              <AlertTriangle className="w-3 h-3" />
              Archived
            </span>
          )}
          {repository.private && (
            <span
              className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 text-xs px-2 py-0.5 rounded-full"
              title="This repository is private"
            >
              Private
            </span>
          )}
        </div>
      </div>

      <p className="text-muted-foreground mb-4 flex-grow">{repository.description || "No description available."}</p>

      {repository.language && (
        <div className="flex items-center gap-1 mb-3">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: getLanguageColor(repository.language) }} />
          <span className="text-sm">{repository.language}</span>
        </div>
      )}

      {repository.topics && repository.topics.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {repository.topics.slice(0, 3).map((topic) => (
            <span
              key={topic}
              className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
            >
              <Tag className="w-3 h-3" />
              {topic}
            </span>
          ))}
          {repository.topics.length > 3 && (
            <span className="text-xs text-muted-foreground">+{repository.topics.length - 3} more</span>
          )}
        </div>
      )}

      <div className="flex gap-4 mb-4 flex-wrap">
        <span className="flex items-center gap-1 text-sm text-muted-foreground" title="Stars">
          <Star className="w-4 h-4" />
          {repository.stargazers_count}
        </span>
        <span className="flex items-center gap-1 text-sm text-muted-foreground" title="Forks">
          <GitFork className="w-4 h-4" />
          {repository.forks_count}
        </span>
        <span className="flex items-center gap-1 text-sm text-muted-foreground" title="Watchers">
          <Eye className="w-4 h-4" />
          {repository.watchers_count}
        </span>
        <span className="flex items-center gap-1 text-sm text-muted-foreground" title="Publication date">
          <Calendar className="w-4 h-4" />
          Published {createdDate}
        </span>
      </div>

      <div className="flex gap-2 mt-auto pt-4">
        <a
          href={repository.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-primary font-medium transition-colors hover:text-primary/80 hover:translate-x-1"
        >
          View Repository
          <ExternalLink className="w-4 h-4" />
        </a>

        {repository.homepage && (
          <a
            href={repository.homepage}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors ml-auto"
            title="Visit project homepage"
          >
            <span className="hidden sm:inline">Homepage</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </div>
  )
}
