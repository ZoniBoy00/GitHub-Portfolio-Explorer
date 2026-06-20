"use client"

import { useState } from "react"
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
  Building,
  LinkIcon,
  Twitter,
  FileCode,
  Share2,
  Copy,
  Check,
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
  const [showRateLimit, setShowRateLimit] = useState(false)
  const [showShare, setShowShare] = useState(false)
  const [copied, setCopied] = useState(false)

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-card rounded-xl border border-border p-6 mt-6 animate-pulse"
      >
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="w-20 h-20 rounded-full bg-secondary shrink-0" />
          <div className="flex-1 space-y-3">
            <div className="h-6 w-48 bg-secondary rounded" />
            <div className="h-4 w-32 bg-secondary rounded" />
            <div className="h-4 w-64 bg-secondary rounded" />
          </div>
        </div>
      </motion.div>
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
            Rate limit resets at{" "}
            {new Date(rateLimit.reset * 1000).toLocaleTimeString()}
          </p>
        )}
      </div>
    )
  }

  if (!user) return null

  const copyProfileLink = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}?user=${user.login}`)
      setCopied(true)
      setTimeout(() => {
        setCopied(false)
        setShowShare(false)
      }, 2000)
    } catch {
      // fallback
      const ta = document.createElement("textarea")
      ta.value = `${window.location.origin}?user=${user.login}`
      document.body.appendChild(ta)
      ta.select()
      document.execCommand("copy")
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => {
        setCopied(false)
        setShowShare(false)
      }, 2000)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-card rounded-xl border border-border p-6 mt-6"
    >
      <div className="flex flex-col sm:flex-row gap-6">
        {/* Avatar */}
        <div className="flex flex-col items-center sm:items-start shrink-0">
          <a href={user.html_url} target="_blank" rel="noopener noreferrer" className="group">
            <img
              src={user.avatar_url}
              alt={user.login}
              className="w-20 h-20 rounded-full border-2 border-primary/20 group-hover:border-primary transition-colors"
            />
          </a>
          <a
            href={user.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors mt-2"
          >
            @{user.login}
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
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
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* Share button */}
              <div className="relative">
                <button
                  onClick={() => setShowShare(!showShare)}
                  className="p-2 rounded-lg hover:bg-secondary transition-colors"
                  title="Share profile"
                >
                  <Share2 className="w-4 h-4 text-muted-foreground" />
                </button>
                {showShare && (
                  <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-lg shadow-lg py-1 z-10 min-w-[130px]">
                    <button
                      onClick={copyProfileLink}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-secondary transition-colors"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                      {copied ? "Copied!" : "Copy link"}
                    </button>
                  </div>
                )}
              </div>

              {/* Archived toggle */}
              {onToggleArchived && (
                <button
                  onClick={onToggleArchived}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
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
          </div>

          {user.bio && (
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{user.bio}</p>
          )}

          {/* Details grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 mt-3 text-sm text-muted-foreground">
            {user.location && (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span>{user.location}</span>
              </div>
            )}
            {user.company && (
              <div className="flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 shrink-0" />
                <span>{user.company}</span>
              </div>
            )}
            {user.blog && (
              <div className="flex items-center gap-1.5">
                <LinkIcon className="w-3.5 h-3.5 shrink-0" />
                <a
                  href={user.blog.startsWith("http") ? user.blog : `https://${user.blog}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors truncate"
                >
                  {user.blog.replace(/^https?:\/\//, "")}
                </a>
              </div>
            )}
            {user.twitter_username && (
              <div className="flex items-center gap-1.5">
                <Twitter className="w-3.5 h-3.5 shrink-0" />
                <a
                  href={`https://twitter.com/${user.twitter_username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  @{user.twitter_username}
                </a>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 shrink-0" />
              <span>Joined {formatDate(user.created_at)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 shrink-0" />
              <span>{user.followers} followers · {user.following} following</span>
            </div>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
            <div className="bg-secondary/50 rounded-lg p-3 text-center">
              <div className="text-xl font-bold">{user.public_repos}</div>
              <div className="text-[11px] text-muted-foreground flex items-center justify-center gap-1 mt-0.5">
                <BookOpen className="w-3 h-3" /> Repos
              </div>
            </div>
            <div className="bg-secondary/50 rounded-lg p-3 text-center">
              <div className="text-xl font-bold">{user.public_gists}</div>
              <div className="text-[11px] text-muted-foreground flex items-center justify-center gap-1 mt-0.5">
                <FileCode className="w-3 h-3" /> Gists
              </div>
            </div>
            <div className="bg-secondary/50 rounded-lg p-3 text-center">
              <div className="text-xl font-bold">{user.followers}</div>
              <div className="text-[11px] text-muted-foreground flex items-center justify-center gap-1 mt-0.5">
                <Users className="w-3 h-3" /> Followers
              </div>
            </div>
            <div className="bg-secondary/50 rounded-lg p-3 text-center">
              <div className="text-xl font-bold">{user.following}</div>
              <div className="text-[11px] text-muted-foreground flex items-center justify-center gap-1 mt-0.5">
                <Users className="w-3 h-3" /> Following
              </div>
            </div>
          </div>

          {/* Rate limit info */}
          {rateLimit && (
            <div className="mt-3">
              <button
                onClick={() => setShowRateLimit(!showRateLimit)}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {showRateLimit ? "Hide" : "Show"} API rate limit
              </button>
              {showRateLimit && (
                <div className="mt-2 p-3 bg-secondary/50 rounded-lg text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Remaining</span>
                    <span className="font-medium">{rateLimit.remaining}/{rateLimit.limit}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-border overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        (rateLimit.remaining / rateLimit.limit) > 0.5
                          ? "bg-emerald-500"
                          : (rateLimit.remaining / rateLimit.limit) > 0.2
                            ? "bg-amber-500"
                            : "bg-rose-500"
                      }`}
                      style={{ width: `${(rateLimit.remaining / rateLimit.limit) * 100}%` }}
                    />
                  </div>
                  {rateLimit.remaining < 10 && (
                    <p className="text-rose-500 flex items-center gap-1 mt-1">
                      <AlertTriangle className="w-3 h-3" />
                      Resets at {new Date(rateLimit.reset * 1000).toLocaleTimeString()}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
