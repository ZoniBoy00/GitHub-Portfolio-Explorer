"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

interface LoadingScreenProps {
  isLoading: boolean
  message?: string
}

export default function LoadingScreen({ isLoading, message = "Loading repositories..." }: LoadingScreenProps) {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Handle visibility with a slight delay for smoother transitions
  useEffect(() => {
    if (isLoading) {
      setVisible(true)
    } else {
      const timer = setTimeout(() => setVisible(false), 300)
      return () => clearTimeout(timer)
    }
  }, [isLoading])

  if (!mounted || !visible) return null

  return (
    <div
      className={`fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center transition-opacity duration-300 ${isLoading ? "opacity-100" : "opacity-0"}`}
    >
      <div className="relative w-24 h-24 mb-8">
        {/* GitHub Octocat silhouette animation */}
        <svg
          className="w-full h-full"
          viewBox="0 0 16 16"
          fill={theme === "dark" ? "#ffffff" : "#333333"}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
          ></path>
        </svg>
        {/* Animated ring */}
        <div className="absolute inset-0 border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
      </div>
      <p className="text-lg font-medium text-foreground">{message}</p>
      <div className="mt-4 flex gap-2">
        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: "0ms" }}></span>
        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: "300ms" }}></span>
        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: "600ms" }}></span>
      </div>
    </div>
  )
}
