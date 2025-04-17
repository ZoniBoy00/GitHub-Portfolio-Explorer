"use client"

import type React from "react"

import { useState } from "react"
import { Search } from "lucide-react"

interface UsernameFormProps {
  defaultUsername: string
  onSubmit: (username: string) => void
  isLoading: boolean
}

export default function UsernameForm({ defaultUsername, onSubmit, isLoading }: UsernameFormProps) {
  const [username, setUsername] = useState(defaultUsername)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (username.trim() && !isLoading) {
      onSubmit(username.trim())
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="GitHub username"
          className="py-2 pl-10 pr-4 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all w-[180px]"
        />
      </div>
      <button
        type="submit"
        disabled={isLoading || !username.trim()}
        className="py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
      >
        {isLoading ? "Loading..." : "Explore"}
      </button>
    </form>
  )
}
