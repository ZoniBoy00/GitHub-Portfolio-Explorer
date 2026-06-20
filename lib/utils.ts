import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a date to "Jan 15, 2023" format consistently across all browsers and locales
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "Unknown date"
    }

    // Define month names to ensure consistency
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    const month = months[date.getMonth()]
    const day = date.getDate()
    const year = date.getFullYear()

    // Format as "Jan 15, 2023"
    return `${month} ${day}, ${year}`
  } catch (error) {
    console.error("Date formatting error:", error)
    return "Invalid date"
  }
}

/**
 * Language color mapping based on GitHub's language colors
 */
const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Python: "#3572A5",
  Java: "#b07219",
  "C#": "#178600",
  PHP: "#4F5D95",
  Ruby: "#701516",
  Go: "#00ADD8",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Rust: "#DEA584",
  Dart: "#00B4AB",
  Shell: "#89e051",
  "C++": "#f34b7d",
  C: "#555555",
  "Jupyter Notebook": "#DA5B0B",
  Vue: "#41B883",
  Dockerfile: "#384d54",
  Markdown: "#083fa1",
  Lua: "#5270C0",
  Unknown: "#858585",
}

/**
 * Get color for a language
 * @param language - The programming language
 * @returns Hex color code
 */
export function getLanguageColor(language: string | null): string {
  if (!language) return LANGUAGE_COLORS.Unknown
  return LANGUAGE_COLORS[language] || LANGUAGE_COLORS.Unknown
}

/**
 * Infer language from repo metadata when GitHub API returns null
 * Checks topics and description for known patterns
 */
const LANGUAGE_PATTERNS: [RegExp, string][] = [
  [/fivem|qbcore|esx|qb-input|rpserver/i, "Lua"],
  [/lua/i, "Lua"],
  [/dockerfile/i, "Dockerfile"],
  [/rust/i, "Rust"],
  [/python/i, "Python"],
  [/typescript/i, "TypeScript"],
  [/javascript|js/i, "JavaScript"],
  [/html/i, "HTML"],
  [/css/i, "CSS"],
  [/go\b|golang/i, "Go"],
  [/c#|csharp/i, "C#"],
  [/c\+\+|cpp/i, "C++"],
]

export function inferLanguage(repo: { language?: string | null; topics?: string[]; description?: string | null; name: string }): string | null {
  // If GitHub already detected a language, use it
  if (repo.language) return repo.language

  // Check topics first
  if (repo.topics) {
    const topicStr = repo.topics.join(" ")
    for (const [pattern, lang] of LANGUAGE_PATTERNS) {
      if (pattern.test(topicStr)) return lang
    }
  }

  // Check description
  if (repo.description) {
    for (const [pattern, lang] of LANGUAGE_PATTERNS) {
      if (pattern.test(repo.description)) return lang
    }
  }

  // Check repo name
  for (const [pattern, lang] of LANGUAGE_PATTERNS) {
    if (pattern.test(repo.name)) return lang
  }

  return null
}
