import type { Repository } from "@/types/github"
import RepositoryCard from "./repository-card"
import { AlertCircle, Plus } from "lucide-react"

interface RepositoryGridProps {
  repositories: Repository[]
  loading: boolean
  error: Error | null
}

export default function RepositoryGrid({ repositories, loading, error }: RepositoryGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-[250px] bg-card rounded-xl border border-border animate-pulse" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12 bg-card rounded-xl border border-border">
        <h3 className="text-xl font-semibold mb-4">Error loading repositories</h3>
        <p className="text-muted-foreground mb-6">{error.message}</p>
        <AlertCircle className="w-16 h-16 mx-auto text-primary/50" />
      </div>
    )
  }

  if (repositories.length === 0) {
    return (
      <div className="text-center py-12 bg-card rounded-xl border border-border">
        <h3 className="text-xl font-semibold mb-4">No repositories found</h3>
        <p className="text-muted-foreground mb-6">Try adjusting your search criteria or language filters</p>
        <Plus className="w-16 h-16 mx-auto text-muted-foreground/50" />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      {repositories.map((repo) => (
        <RepositoryCard key={repo.id} repository={repo} />
      ))}
    </div>
  )
}
