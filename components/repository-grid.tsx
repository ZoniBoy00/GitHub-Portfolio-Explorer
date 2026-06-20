import type { Repository } from "@/types/github"
import RepositoryCard from "./repository-card"
import { motion } from "framer-motion"
import { Inbox } from "lucide-react"

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
          <div key={i} className="h-[220px] rounded-xl bg-card border border-border animate-pulse" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16 bg-card rounded-xl border border-border"
      >
        <h3 className="text-xl font-semibold mb-2">Error loading repositories</h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">{error.message}</p>
        <div className="text-4xl text-primary/30">:(</div>
      </motion.div>
    )
  }

  if (!repositories || repositories.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16 bg-card rounded-xl border border-border"
      >
        <Inbox className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
        <h3 className="text-xl font-semibold mb-2">No repositories found</h3>
        <p className="text-muted-foreground">Try adjusting your search or filters</p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8"
    >
      {repositories.map((repo, i) => (
        <RepositoryCard key={repo.id} repository={repo} index={i} />
      ))}
    </motion.div>
  )
}
