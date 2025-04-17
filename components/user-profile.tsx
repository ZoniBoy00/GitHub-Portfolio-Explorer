"use client"

import { useState } from "react"
import type { GitHubUser, RateLimitInfo } from "@/types/github"
import {
  User,
  MapPin,
  Building,
  LinkIcon,
  Twitter,
  Calendar,
  Users,
  BookOpen,
  FileCode,
  AlertCircle,
  ExternalLink,
  Archive,
  Share2,
  Copy,
  Check,
} from "lucide-react"
import { formatDate } from "@/lib/utils"

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
  const [showShareOptions, setShowShareOptions] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)

  if (loading) {
    return (
      <div className="mb-8 bg-card rounded-xl p-6 shadow-md border border-border animate-pulse">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-24 h-24 rounded-full bg-muted"></div>
          <div className="flex-1">
            <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-muted rounded w-2/3 mb-3"></div>
            <div className="h-4 bg-muted rounded w-1/2 mb-3"></div>
            <div className="h-4 bg-muted rounded w-1/4"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mb-8 bg-card rounded-xl p-6 shadow-md border border-border">
        <div className="flex items-center gap-3 text-destructive">
          <AlertCircle className="w-5 h-5" />
          <h3 className="text-lg font-medium">Error loading user profile</h3>
        </div>
        <p className="mt-2 text-muted-foreground">{error.message}</p>
      </div>
    )
  }

  if (!user) {
    return null
  }

  // Format dates
  const joinedDate = formatDate(user.created_at)

  const renderRateLimitInfo = () => {
    if (!rateLimit) return null

    const resetDate = new Date(rateLimit.reset * 1000)
    const resetTime = resetDate.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    })
    const resetDay = formatDate(resetDate.toISOString())
    const percentage = Math.round((rateLimit.remaining / rateLimit.limit) * 100)

    return (
      <div className="mt-4 p-4 bg-muted rounded-lg text-sm">
        <h4 className="font-medium mb-2">GitHub API Rate Limit</h4>
        <div className="space-y-2">
          <div>
            <div className="flex justify-between mb-1">
              <span>
                Remaining: {rateLimit.remaining} of {rateLimit.limit}
              </span>
              <span>{percentage}%</span>
            </div>
            <div className="w-full bg-border rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  percentage > 50 ? "bg-green-500" : percentage > 20 ? "bg-yellow-500" : "bg-red-500"
                }`}
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
          <p>
            Resets at: {resetTime} on {resetDay}
          </p>
        </div>
      </div>
    )
  }

  const handleShare = () => {
    setShowShareOptions(!showShareOptions)
  }

  const copyProfileLink = () => {
    try {
      navigator.clipboard.writeText(window.location.href)
      setLinkCopied(true)

      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setLinkCopied(false)
        setShowShareOptions(false)
      }, 2000)
    } catch (err) {
      console.error("Error copying to clipboard:", err)
      // Fallback for browsers without clipboard API
      const textArea = document.createElement("textarea")
      textArea.value = window.location.href
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()

      try {
        document.execCommand("copy")
        setLinkCopied(true)
        setTimeout(() => {
          setLinkCopied(false)
          setShowShareOptions(false)
        }, 2000)
      } catch (err) {
        console.error("Fallback copy failed:", err)
        // Last resort fallback
        prompt("Copy this link:", window.location.href)
      }

      document.body.removeChild(textArea)
    }
  }

  return (
    <div className="mb-8 bg-card rounded-xl p-6 shadow-md border border-border">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Avatar and basic info */}
        <div className="flex flex-col items-center md:items-start">
          <img
            src={user.avatar_url || "/placeholder.svg"}
            alt={`${user.login}'s avatar`}
            className="w-24 h-24 rounded-full border-4 border-primary/20 shadow-md"
          />
          <div className="mt-4 flex flex-col items-center md:items-start">
            <a
              href={user.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-primary hover:underline"
            >
              <User className="w-4 h-4" />@{user.login}
              <ExternalLink className="w-3 h-3" />
            </a>
            <div className="flex flex-wrap gap-2 mt-2">
              <button
                onClick={() => setShowRateLimit(!showRateLimit)}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {showRateLimit ? "Hide API limits" : "Show API limits"}
              </button>

              {onToggleArchived && (
                <button
                  onClick={onToggleArchived}
                  className="text-xs flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                  title={showArchived ? "Hide archived repositories" : "Show archived repositories"}
                >
                  <Archive className="w-3 h-3" />
                  {showArchived ? "Hide archived" : "Show archived"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* User details */}
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-semibold mb-2">{user.name || user.login}</h2>
            <div className="relative">
              <button
                onClick={handleShare}
                className="p-2 rounded-full hover:bg-muted transition-colors"
                aria-label="Share profile"
                title="Share profile"
              >
                <Share2 className="w-4 h-4" />
              </button>

              {showShareOptions && (
                <div className="absolute right-0 mt-2 bg-card border border-border rounded-md shadow-md py-1 z-10 min-w-[120px]">
                  <button
                    onClick={copyProfileLink}
                    className="w-full text-left px-4 py-2 hover:bg-muted transition-colors text-sm flex items-center gap-2"
                  >
                    {linkCopied ? (
                      <>
                        <Check className="w-4 h-4 text-green-500" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy link</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {user.bio && <p className="text-muted-foreground mb-4">{user.bio}</p>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
            {user.location && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{user.location}</span>
              </div>
            )}

            {user.company && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Building className="w-4 h-4" />
                <span>{user.company}</span>
              </div>
            )}

            {user.blog && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <LinkIcon className="w-4 h-4" />
                <a
                  href={user.blog.startsWith("http") ? user.blog : `https://${user.blog}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  {user.blog}
                </a>
              </div>
            )}

            {user.twitter_username && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Twitter className="w-4 h-4" />
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

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>Joined: {joinedDate}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            <div className="bg-muted p-3 rounded-lg text-center">
              <div className="text-2xl font-bold">{user.public_repos}</div>
              <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                <BookOpen className="w-3 h-3" /> Repositories
              </div>
            </div>
            <div className="bg-muted p-3 rounded-lg text-center">
              <div className="text-2xl font-bold">{user.public_gists}</div>
              <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                <FileCode className="w-3 h-3" /> Gists
              </div>
            </div>
            <div className="bg-muted p-3 rounded-lg text-center">
              <div className="text-2xl font-bold">{user.followers}</div>
              <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                <Users className="w-3 h-3" /> Followers
              </div>
            </div>
            <div className="bg-muted p-3 rounded-lg text-center">
              <div className="text-2xl font-bold">{user.following}</div>
              <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                <Users className="w-3 h-3" /> Following
              </div>
            </div>
          </div>

          {showRateLimit && renderRateLimitInfo()}
        </div>
      </div>
    </div>
  )
}
