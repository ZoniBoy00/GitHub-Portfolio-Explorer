#!/usr/bin/env bash
# ============================================
# GitHub Portfolio Explorer — Repo Setup Script
# ============================================
# Aja tämä skripti lisätäksesi repo-kuvauksen ja tagit.
# Vaatii: gh (GitHub CLI) kirjautuneena, tai GITHUB_TOKEN ympäristömuuttujassa.
#
# Käyttö:
#   chmod +x scripts/setup-repo.sh
#   ./scripts/setup-repo.sh
# ============================================

set -euo pipefail

REPO="ZoniBoy00/GitHub-Portfolio-Explorer"
DESCRIPTION="A modern, responsive GitHub portfolio explorer built with Next.js 15, TypeScript, and Tailwind CSS. Browse repositories, view user profiles, and analyze coding statistics."
TOPICS=(
  "github"
  "portfolio"
  "nextjs"
  "react"
  "typescript"
  "tailwindcss"
  "github-api"
  "framer-motion"
  "tanstack-query"
  "shadcn-ui"
)

echo "==> Updating repo description..."
gh repo edit "$REPO" --description "$DESCRIPTION"

echo "==> Adding topics (tags)..."
TOPICS_CSV=$(IFS=,; echo "${TOPICS[*]}")
gh repo edit "$REPO" --add-topic "$TOPICS_CSV"

echo "==> Done! Repo updated:"
echo "    Description: $DESCRIPTION"
echo "    Topics: ${TOPICS[*]}"
