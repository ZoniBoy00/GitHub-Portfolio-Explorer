"use client"

import type React from "react"
import { useState } from "react"
import { Search } from "lucide-react"

interface UsernameFormProps {
  username: string
  onUsernameChange: (username: string) => void
  isLoading: boolean
}

export default function UsernameForm({ username, onUsernameChange, isLoading }: UsernameFormProps) {
  const [inputValue, setInputValue] = useState(username)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = inputValue.trim()
    if (trimmed && trimmed !== username) {
      onUsernameChange(trimmed)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="GitHub username..."
        disabled={isLoading}
        className="h-9 w-36 md:w-44 pl-3 pr-8 rounded-lg bg-secondary border border-border text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={isLoading}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
      >
        <Search className="w-3.5 h-3.5" />
      </button>
    </form>
  )
}
