"use client"

import { useEffect, useRef } from "react"
import type { Repository } from "@/types/github"
import { getLanguageColor } from "@/lib/utils"
import { BarChart3, Database, Code, HardDrive } from "lucide-react"

interface StatisticsSectionProps {
  repositories: Repository[]
}

export default function StatisticsSection({ repositories }: StatisticsSectionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Calculate statistics
  const totalRepos = repositories.length

  // Language statistics
  const languageStats = repositories.reduce((stats: Record<string, any>, repo) => {
    const language = repo.language || "Unknown"

    if (!stats[language]) {
      stats[language] = {
        count: 0,
        color: getLanguageColor(language),
        repos: [],
        size: 0,
      }
    }

    stats[language].count++
    stats[language].repos.push(repo.name)
    stats[language].size += repo.size || 0

    return stats
  }, {})

  // Convert to array and sort by count
  const sortedStats = Object.entries(languageStats)
    .map(([language, stats]: [string, any]) => ({
      language,
      ...stats,
      percentage: (stats.count / totalRepos) * 100,
    }))
    .sort((a, b) => b.count - a.count)

  // Total size
  const totalSize = repositories.reduce((sum, repo) => sum + (repo.size || 0), 0)

  // Format size
  const formatSize = (sizeInKB: number) => {
    if (!sizeInKB) return "Unknown"

    if (sizeInKB < 1000) {
      return `${sizeInKB} KB`
    } else if (sizeInKB < 1000000) {
      return `${(sizeInKB / 1000).toFixed(1)} MB`
    } else {
      return `${(sizeInKB / 1000000).toFixed(1)} GB`
    }
  }

  // Draw chart
  useEffect(() => {
    if (!canvasRef.current || repositories.length === 0) return

    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)

    // Prepare for donut chart
    const centerX = canvasRef.current.width / 2
    const centerY = canvasRef.current.height / 2
    const radius = Math.min(centerX, centerY) * 0.8
    const innerRadius = radius * 0.6 // For donut hole

    // Limit to top languages
    const maxLanguages = 7
    let chartData = sortedStats

    if (sortedStats.length > maxLanguages) {
      const topLanguages = sortedStats.slice(0, maxLanguages - 1)
      const otherLanguages = sortedStats.slice(maxLanguages - 1)

      const otherCount = otherLanguages.reduce((sum, item) => sum + item.count, 0)
      const otherPercentage = otherLanguages.reduce((sum, item) => sum + item.percentage, 0)
      const otherSize = otherLanguages.reduce((sum, item) => sum + (item.size || 0), 0)

      chartData = [
        ...topLanguages,
        {
          language: "Other",
          count: otherCount,
          color: "#8c8c8c",
          percentage: otherPercentage,
          size: otherSize,
        },
      ]
    }

    // Draw donut chart segments
    let startAngle = -0.5 * Math.PI // Start at top

    chartData.forEach((item) => {
      const sliceAngle = (item.count / totalRepos) * 2 * Math.PI

      // Draw segment
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle)
      ctx.closePath()

      // Fill with language color
      ctx.fillStyle = item.color
      ctx.fill()

      // Draw inner circle for donut hole
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, innerRadius, startAngle, startAngle + sliceAngle)
      ctx.closePath()
      ctx.fillStyle = getComputedStyle(document.body).getPropertyValue("--background")
      ctx.fill()

      startAngle += sliceAngle
    })
  }, [repositories, sortedStats])

  // Add note about current page statistics
  const statisticsNote =
    repositories.length > 0 ? (
      <div className="text-center text-sm text-muted-foreground mt-4">
        Statistics shown are for the current page of repositories
      </div>
    ) : null

  if (repositories.length === 0) {
    return (
      <div className="mb-8 bg-card rounded-xl p-6 shadow-md border border-border">
        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Repository Statistics
        </h3>
        <div className="text-center py-8 text-muted-foreground">No repository data available</div>
      </div>
    )
  }

  return (
    <div className="mb-8 bg-card rounded-xl p-6 shadow-md border border-border">
      <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
        <BarChart3 className="w-5 h-5" />
        Repository Statistics
      </h3>

      <div className="flex flex-wrap gap-8">
        <div className="flex flex-col items-center">
          <div className="relative w-[300px] h-[300px] bg-card rounded-full p-2.5 shadow-sm">
            <canvas ref={canvasRef} width={300} height={300} />
          </div>

          <div className="flex flex-wrap gap-3 mt-6 justify-center max-w-[300px]">
            {sortedStats.slice(0, 7).map((item) => (
              <div
                key={item.language}
                className="flex items-center gap-2 text-sm text-muted-foreground p-1 px-2 bg-muted rounded transition-transform hover:-translate-y-0.5"
              >
                <span className="w-3 h-3 rounded" style={{ backgroundColor: item.color }} />
                <span>
                  {item.language} ({item.count})
                </span>
              </div>
            ))}
            {sortedStats.length > 7 && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground p-1 px-2 bg-muted rounded">
                <span className="w-3 h-3 rounded" style={{ backgroundColor: "#8c8c8c" }} />
                <span>Other ({sortedStats.length - 7})</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 min-w-[250px]">
          <div className="flex flex-col gap-4">
            <div className="bg-muted rounded-lg p-5 border border-border transition-all hover:-translate-y-0.5 hover:shadow-sm">
              <div className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                <Database className="w-4 h-4" />
                Repositories (Current Page)
              </div>
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
                {totalRepos}
              </div>
            </div>

            <div className="bg-muted rounded-lg p-5 border border-border transition-all hover:-translate-y-0.5 hover:shadow-sm">
              <div className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                <Code className="w-4 h-4" />
                Languages Used
              </div>
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
                {Object.keys(languageStats).length}
              </div>
              <div className="text-sm text-muted-foreground mt-2">
                Most used: {sortedStats[0]?.language || "None"} ({Math.round(sortedStats[0]?.percentage || 0)}%)
              </div>
            </div>

            <div className="bg-muted rounded-lg p-5 border border-border transition-all hover:-translate-y-0.5 hover:shadow-sm">
              <div className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                <HardDrive className="w-4 h-4" />
                Repository Size
              </div>
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
                {formatSize(totalSize)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {statisticsNote}
    </div>
  )
}
