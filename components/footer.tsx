import { Github } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t border-border mt-12">
      <div className="max-w-7xl mx-auto w-full px-4 md:px-8 py-6">
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Github className="w-4 h-4" />
          <span>Powered by the</span>
          <a
            href="https://docs.github.com/en/rest"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            GitHub API
          </a>
        </div>
      </div>
    </footer>
  )
}
