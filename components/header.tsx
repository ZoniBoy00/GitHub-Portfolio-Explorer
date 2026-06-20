"use client"

import { useTheme } from "next-themes"
import { useState, useEffect } from "react"
import { Sun, Moon, Github } from "lucide-react"
import UsernameForm from "./username-form"
import { motion } from "framer-motion"

interface HeaderProps {
  username: string
  onUsernameChange: (username: string) => void
  isLoading: boolean
}

export default function Header({ username, onUsernameChange, isLoading }: HeaderProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark")

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="flex items-center justify-between max-w-7xl mx-auto w-full px-4 md:px-8 h-16">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Github className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-sm font-semibold leading-tight">GitHub Explorer</h1>
            <p className="text-[11px] text-muted-foreground">Portfolio & Repositories</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <UsernameForm username={username} onUsernameChange={onUsernameChange} isLoading={isLoading} />

          {mounted && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </motion.button>
          )}
        </div>
      </div>
    </header>
  )
}
