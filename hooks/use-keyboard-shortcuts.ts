"use client"

import { useEffect } from "react"

interface KeyboardShortcutsProps {
  onSearch?: () => void
  disabled?: boolean
}

export function useKeyboardShortcuts({ onSearch, disabled = false }: KeyboardShortcutsProps) {
  useEffect(() => {
    if (disabled) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement instanceof HTMLInputElement ||
        document.activeElement instanceof HTMLTextAreaElement ||
        document.activeElement instanceof HTMLSelectElement
      ) {
        return
      }

      switch (e.key) {
        case "/":
          if (onSearch) {
            e.preventDefault()
            onSearch()
          }
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onSearch, disabled])
}
