"use client"

import { motion } from "framer-motion"
import type { GitHubUser, RateLimitInfo } from "@/types/github"
import { formatDate } from "@/lib/utils"
import {
  MapPin,
  Users,
  BookOpen,
  Calendar,
  ExternalLink,
  Archive,
  AlertTriangle,
} from "lucide-react"

interface UserProfileProps {
  user: GitHubUser | null
  loading: boolean
  error: Error | null
  rateLimit: RateLimitInfo | null
  showArchived?: boolean
  onToggleArchived?: () => void
}

export default function UserProfile({
  user,
  loading,
  error,
  rateLimit,
  showArchived = true,
  onToggleArchived,
}: UserProfileProps) {
  if (loading) {
    return (
      <div className="flex flex-col sm:flex-row gap-6 bg-card rounded-xl border border-border p-6 mt-6 animate-pulse">
        <div className="w-20 h-20 rounded-xl bg-secondary shrink-0" />
        <div className="flex-1 space-y-3">
          <div className="h-6 w-48 bg-secondary rounded" />
          <div className="h-4 w-32 bg-secondary rounded" />
          <div className="h-4 w-64 bg-secondary rounded" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-card rounded-xl border border-border p-6 mt-6">
        <div className="flex items-center gap-3 text-destructive">
          <AlertTriangle className="w-5 h-5" />
          <div>
            <p className="font-semibold">Failed to load user</p>
            <p className="text-sm text-muted-foreground">{error.message}</p>
          </div>
        </div>
        {rateLimit && rateLimit.remaining === 0 && (
          <p className="text-sm text-muted-foreground mt-2">
            Rate limit reset{" "}
            {new Date(rateLimit.reset * 1000).toLocaleTimeString()}
          </p>
        )}
      </div>
    )
  }

  if (!user) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-card rounded-xl border border-border p-6 mt-6"
    >
      <div className="flex flex-col sm:flex-row gap-6">
        {/* Avatar */}
        <a href={user.html_url} target="_blank" rel="noopener noreferrer" className="shrink-0 group">
          <img
            src={user.avatar_url}
            alt={user.login}
            className="w-20 h-20 rounded-xl border-2 border-border group-hover:border-primary transition-colors"
          />
        </a>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                {user.name || user.login}
                <a
                  href={user.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </h2>
              <p className="text-sm text-muted-foreground">@{user.login}</p>
            </div>

            {onToggleArchived && (
              <button
                onClick={onToggleArchived}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 ${
                  showArchived
                    ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                <Archive className="w-3.5 h-3.5" />
                {showArchived ? "Archived visible" : "Archived hidden"}
              </button>
            )}
          </div>

          {user.bio && (
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{user.bio}</p>
          )}

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-sm text-muted-foreground">
            {user.location && (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>{user.location}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              <span>{user.followers} followers · {user.following} following</span>
            </div>
            <div className="flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{user.public_repos} repos</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>Joined {formatDate(user.created_at)}</span>
            </div>
          </div>

          {rateLimit && rateLimit.remaining < 10 && (
            <div className="mt-3 text-xs text-amber-500 flex items-center gap-1.5">
              <AlertTriangle className="w-3 h-3" />
              API rate limit: {rateLimit.remaining}/{rateLimit.limit} remaining
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
