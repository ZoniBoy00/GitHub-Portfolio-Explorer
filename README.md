<div align="center">
  <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt="GitHub Portfolio Explorer" width="80" height="80" />
  <h1 align="center">GitHub Portfolio Explorer</h1>
  <p align="center">
    A modern, responsive GitHub portfolio explorer built with Next.js 15, TypeScript, and Tailwind CSS.
    Browse repositories, view user profiles, and analyze coding statistics with a beautiful UI.
  </p>
  <p align="center">
    <a href="#features">Features</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#project-structure">Project Structure</a> •
    <a href="#contributing">Contributing</a>
  </p>
</div>

<br />

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js" alt="Next.js 15" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3-38bdf8?style=flat-square&logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/TanStack_Query-5-ff4154?style=flat-square&logo=react-query" alt="TanStack Query" />
  <img src="https://img.shields.io/badge/Framer_Motion-12-0055ff?style=flat-square&logo=framer" alt="Framer Motion" />
  <img src="https://img.shields.io/badge/shadcn/ui-latest-000?style=flat-square&logo=shadcnui" alt="shadcn/ui" />
</p>

---

## ✨ Features

- **User Profile View** — Display GitHub user details including avatar, bio, location, company, followers, and more
- **Repository Browser** — Browse all public repositories with sorting and filtering
- **Language Filter** — Filter repositories by programming language with color-coded indicators
- **Search** — Real-time search across repository names, descriptions, and topics
- **Statistics Dashboard** — View aggregate stats (total stars, forks, size) with language distribution charts
- **Dark / Light Mode** — Full theme support with system preference detection
- **Keyboard Shortcuts** — Press `/` to quickly focus the search input
- **Responsive Design** — Optimized for all screen sizes
- **Archive Toggle** — Show or hide archived repositories
- **Share Profiles** — Copy shareable profile links to clipboard
- **Rate Limit Monitor** — Track GitHub API rate limit usage

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ (recommended: 20 LTS)
- **pnpm**, **npm**, or **yarn**

### Installation

```bash
# Clone the repository
git clone https://github.com/ZoniBoy00/GitHub-Portfolio-Explorer.git
cd GitHub-Portfolio-Explorer

# Install dependencies
pnpm install
# or
npm install
# or
yarn
```

### Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

### Build

```bash
pnpm build
pnpm start
```

### Environment Variables (Optional)

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_GITHUB_TOKEN=your_github_token_here
```

> Adding a GitHub personal access token increases the API rate limit from 60 to 5,000 requests per hour. Generate one at [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens).

## 🛠 Tech Stack

| Technology | Purpose |
|---|---|
| **Next.js 15** | React framework with App Router |
| **TypeScript** | Type-safe development |
| **Tailwind CSS 3** | Utility-first styling |
| **shadcn/ui** | Accessible UI components |
| **Framer Motion 12** | Animations and transitions |
| **TanStack Query 5** | Server state management & caching |
| **Lucide React** | Icon library |
| **next-themes** | Dark/light mode theming |

## 📁 Project Structure

```
GitHub-Portfolio-Explorer/
├── app/                     # Next.js App Router pages
│   ├── page.tsx             # Main page (home)
│   ├── layout.tsx           # Root layout with providers
│   ├── loading.tsx          # Loading state
│   └── globals.css          # Global styles
├── components/              # React components
│   ├── ui/                  # shadcn/ui primitives
│   ├── header.tsx           # App header with theme toggle
│   ├── footer.tsx           # App footer
│   ├── user-profile.tsx     # GitHub user profile card
│   ├── search-bar.tsx       # Search and sort controls
│   ├── language-filter.tsx  # Language filter chips
│   ├── repository-grid.tsx  # Repository cards grid
│   ├── repository-card.tsx  # Individual repo card
│   ├── statistics-section.tsx # Stats dashboard
│   ├── username-form.tsx    # Username input form
│   ├── loading-screen.tsx   # Fullscreen loading overlay
│   ├── theme-provider.tsx   # Theme context provider
│   └── query-provider.tsx   # TanStack Query provider
├── hooks/                   # Custom React hooks
│   ├── use-github-user.ts       # User data fetching
│   ├── use-github-repositories.ts # Repositories fetching
│   └── use-keyboard-shortcuts.ts  # Keyboard shortcuts
├── lib/                     # Utility functions
│   ├── api.ts               # GitHub API client
│   └── utils.ts             # Helpers (date, colors, etc.)
└── types/                   # TypeScript type definitions
    └── github.ts            # GitHub API types
```

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">
  Built with ❤️ using the <a href="https://docs.github.com/en/rest">GitHub API</a>
</div>
