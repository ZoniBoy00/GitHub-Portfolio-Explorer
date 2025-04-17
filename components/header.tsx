"use client"

import { useTheme } from "next-themes"
import { useState, useEffect } from "react"
import { Sun, Moon } from "lucide-react"
import UsernameForm from "./username-form"

interface HeaderProps {
  username: string
  onUsernameChange: (username: string) => void
  isLoading: boolean
}

export default function Header({ username, onUsernameChange, isLoading }: HeaderProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <header className="sticky top-0 bg-background/90 backdrop-blur-md z-10 border-b border-border">
        <div className="flex items-center justify-between max-w-7xl mx-auto w-full p-4">
          <div className="flex items-center gap-3">
            <img
              src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
              alt="GitHub Logo"
              className="w-8 h-8 transition-transform duration-300 hover:rotate-12"
            />
            <h1 className="text-xl font-semibold bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
              GitHub Portfolio Explorer
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              className="w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:bg-muted"
              aria-label="Toggle theme"
            >
              <Sun className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 bg-background/90 backdrop-blur-md z-10 border-b border-border">
      <div className="flex flex-col md:flex-row md:items-center justify-between max-w-7xl mx-auto w-full p-4 gap-4">
        <div className="flex items-center gap-3">
          <img
            src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
            alt="GitHub Logo"
            className="w-8 h-8 transition-transform duration-300 hover:rotate-12"
          />
          <h1 className="text-xl font-semibold bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
            GitHub Portfolio Explorer
          </h1>
        </div>
        <div className="flex items-center gap-4 justify-between">
          <UsernameForm defaultUsername={username} onSubmit={onUsernameChange} isLoading={isLoading} />
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:bg-muted"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </header>
  )
}
