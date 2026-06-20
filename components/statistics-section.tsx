"use client"

import { motion } from "framer-motion"
import type { Repository } from "@/types/github"
import { getLanguageColor } from "@/lib/utils"
import {
  BarChart3,
  Code,
  HardDrive,
  GitFork,
  Star,
} from "lucide-react"

interface StatisticsSectionProps {
  repositories: Repository[]
}

export default function StatisticsSection({ repositories }: StatisticsSectionProps) {
  // Language statistics
  const languageStats = repositories.reduce<Record<string, { count: number; color: string }>>((acc, repo) => {
    const lang = repo.language || "Unknown"
    if (!acc[lang]) {
      acc[lang] = { count: 0, color: getLanguageColor(lang) }
    }
    acc[lang].count++
    return acc
  }, {})

  const totalRepos = repositories.length
  const sortedLangs = Object.entries(languageStats)
    .sort(([, a], [, b]) => b.count - a.count)
    .slice(0, 10)

  const maxCount = sortedLangs[0]?.[1].count || 1

  // Top stats
  const totalStars = repositories.reduce((sum, repo) => sum + repo.stargazers_count, 0)
  const totalForks = repositories.reduce((sum, repo) => sum + repo.forks_count, 0)
  const totalSize = repositories.reduce((sum, repo) => sum + repo.size, 0)

  const statCards = [
    { label: "Repositories", value: repositories.length, icon: Code, color: "text-blue-500" },
    { label: "Total Stars", value: totalStars, icon: Star, color: "text-amber-500" },
    { label: "Total Forks", value: totalForks, icon: GitFork, color: "text-emerald-500" },
    { label: "Total Size", value: `${(totalSize / 1024).toFixed(1)} MB`, icon: HardDrive, color: "text-purple-500" },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.4 }}
      className="mt-8 space-y-6"
    >
      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05, duration: 0.3 }}
            className="bg-card rounded-xl border border-border p-4"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-secondary ${card.color}`}>
                <card.icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{card.label}</p>
                <p className="text-xl font-bold">{card.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Language distribution */}
      {sortedLangs.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="bg-card rounded-xl border border-border p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Languages</h3>
            <span className="text-xs text-muted-foreground ml-auto">
              {totalRepos} repo{totalRepos !== 1 ? "s" : ""} · {sortedLangs.length} language{sortedLangs.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Language bars */}
          <div className="space-y-3">
            {sortedLangs.map(([name, stats], i) => {
              const percentage = ((stats.count / totalRepos) * 100).toFixed(1)
              return (
                <motion.div
                  key={name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + i * 0.03, duration: 0.3 }}
                  className="group"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="w-3 h-3 rounded-sm shrink-0 ring-1 ring-black/10 dark:ring-white/10"
                        style={{ backgroundColor: stats.color }}
                      />
                      <span className="text-sm font-medium truncate">{name}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground shrink-0 ml-4">
                      <span className="font-semibold tabular-nums">{stats.count}</span>
                      <span className="w-12 text-right tabular-nums">{percentage}%</span>
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-secondary overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(stats.count / maxCount) * 100}%` }}
                      transition={{ delay: 0.3 + i * 0.03, duration: 0.5, ease: "easeOut" }}
                      className="h-full rounded-full transition-all duration-500 group-hover:opacity-80"
                      style={{ backgroundColor: stats.color }}
                    />
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Multi-color bar — GitHub-style summary */}
          {sortedLangs.length > 1 && (
            <div className="mt-6 h-2 rounded-full overflow-hidden flex">
              {sortedLangs.map(([name, stats]) => (
                <div
                  key={name}
                  className="h-full first:rounded-l-full last:rounded-r-full transition-all duration-300 hover:opacity-80"
                  style={{
                    backgroundColor: stats.color,
                    width: `${(stats.count / totalRepos) * 100}%`,
                  }}
                  title={`${name}: ${stats.count} (${((stats.count / totalRepos) * 100).toFixed(1)}%)`}
                />
              ))}
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  )
}
