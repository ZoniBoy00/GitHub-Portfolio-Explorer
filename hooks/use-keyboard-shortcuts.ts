"use client"

import { useEffect } from "react"

interface KeyboardShortcutsProps {
  onNextPage?: () => void
  onPrevPage?: () => void
  onSearch?: () => void
  disabled?: boolean
}

export function useKeyboardShortcuts({ onNextPage, onPrevPage, onSearch, disabled = false }: KeyboardShortcutsProps) {
  useEffect(() => {
    if (disabled) return

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in input fields
      if (
        document.activeElement instanceof HTMLInputElement ||
        document.activeElement instanceof HTMLTextAreaElement ||
        document.activeElement instanceof HTMLSelectElement
      ) {
        return
      }

      switch (e.key) {
        case "ArrowRight":
          if (onNextPage) {
            e.preventDefault()
            onNextPage()
          }
          break
        case "ArrowLeft":
          if (onPrevPage) {
            e.preventDefault()
            onPrevPage()
          }
          break
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
  }, [onNextPage, onPrevPage, onSearch, disabled])
}
