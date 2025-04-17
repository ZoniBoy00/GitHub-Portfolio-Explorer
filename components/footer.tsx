"use client"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="py-6 px-4 text-center text-muted-foreground text-sm border-t border-border mt-8">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-4">
        <p>© {currentYear} GitHub Portfolio Explorer | Data provided by GitHub API</p>
        <div className="flex gap-6">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary/80 hover:underline transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://docs.github.com/en/rest"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary/80 hover:underline transition-colors"
          >
            API Docs
          </a>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault()
              window.scrollTo({ top: 0, behavior: "smooth" })
            }}
            className="text-primary hover:text-primary/80 hover:underline transition-colors"
          >
            Back to top
          </a>
        </div>
        <div className="text-xs text-muted-foreground mt-2">
          <p>
            Keyboard shortcuts: Use <kbd className="px-1.5 py-0.5 bg-muted border border-border rounded text-xs">←</kbd>{" "}
            <kbd className="px-1.5 py-0.5 bg-muted border border-border rounded text-xs">→</kbd> for pagination
          </p>
        </div>
      </div>
    </footer>
  )
}
