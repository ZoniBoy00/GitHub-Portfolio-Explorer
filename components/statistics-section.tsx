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
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"

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

  const sortedLangs = Object.entries(languageStats)
    .sort(([, a], [, b]) => b.count - a.count)
    .slice(0, 10)

  const chartData = sortedLangs.map(([name, stats]) => ({
    name,
    count: stats.count,
    fill: stats.color,
  }))

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
        {statCards.map((card) => (
          <div key={card.label} className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-secondary ${card.color}`}>
                <card.icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{card.label}</p>
                <p className="text-xl font-bold">{card.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Language chart */}
      {chartData.length > 0 && (
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Languages</h3>
          </div>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ left: 80 }}>
                <XAxis type="number" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  width={75}
                />
                <Tooltip
                  cursor={{ fill: "hsl(var(--muted))" }}
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                    fontSize: 13,
                  }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={20}>
                  {chartData.map((entry, i) => (
                    <Cell key={`cell-${i}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </motion.div>
  )
}
