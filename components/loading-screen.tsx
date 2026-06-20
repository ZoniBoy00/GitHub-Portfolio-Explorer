"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import { Github } from "lucide-react"

interface LoadingScreenProps {
  isLoading: boolean
  message?: string
}

export default function LoadingScreen({ isLoading, message = "Loading..." }: LoadingScreenProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (isLoading) {
      setVisible(true)
    } else {
      const timer = setTimeout(() => setVisible(false), 300)
      return () => clearTimeout(timer)
    }
  }, [isLoading])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/95 backdrop-blur-sm"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          >
            <Github className="w-12 h-12 text-primary" />
          </motion.div>
          <p className="mt-4 text-sm text-muted-foreground">{message}</p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
