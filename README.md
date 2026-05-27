# AI Workplace Productivity Assistant

A modern, responsive web application that helps professionals automate workplace tasks using AI. Built with **TanStack Start**, **React 19**, **Tailwind CSS v4**, and **shadcn/ui**.

---

## Features

| Tool | Description |
|------|-------------|
| **Smart Email Generator** | Draft professional emails with customizable tones (formal, friendly, persuasive). |
| **Meeting Notes Summarizer** | Paste long notes and get structured summaries with key decisions, action items, and deadlines. |
| **AI Task Planner** | Generate prioritized daily or weekly schedules based on your task list and available hours. |
| **AI Research Assistant** | Summarize topics or articles with insights, recommendations, and source highlights. |
| **AI Chatbot** | Interactive workplace assistant for open-ended prompts and real-time help. |

### Core UX
- **Modern dashboard UI** with hero section and tool grid
- **Collapsible sidebar navigation** with active route highlighting
- **Editable AI outputs** — switch between preview (markdown) and edit modes, copy to clipboard
- **Structured AI prompts** — each tool sends tailored system instructions for consistent, high-quality outputs
- **Responsible AI disclaimer** — visible on the dashboard and sidebar footer
- **Fully responsive** — works on desktop, tablet, and mobile

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | [TanStack Start](https://tanstack.com/start) (full-stack React, file-based routing) |
| UI Library | React 19 |
| Styling | Tailwind CSS v4 + CSS custom properties (OKLCH tokens) |
| Components | [shadcn/ui](https://ui.shadcn.com) (Radix UI primitives) |
| State & Data | TanStack Query (React Query) |
| Server Functions | `createServerFn` from `@tanstack/react-start` |
| AI Integration | [Lovable AI Gateway](https://ai.gateway.lovable.dev) |
| Icons | Lucide React |
| Fonts | Space Grotesk (display), Inter (body) |

---

## Project Structure

```
.
├── src/
│   ├── components/
│   │   ├── AppSidebar.tsx          # Collapsible workspace sidebar
│   │   ├── AIOutput.tsx             # Reusable AI output panel (preview/edit/copy)
│   │   ├── ToolShell.tsx            # Consistent layout wrapper for tool pages
│   │   └── ui/                      # shadcn/ui components (Button, Input, Select, etc.)
│   ├── lib/
│   │   ├── ai.functions.ts          # Server function: generateAI (Lovable AI Gateway)
│   │   └── utils.ts                 # cn() utility for Tailwind class merging
│   ├── routes/
│   │   ├── __root.tsx               # Root layout (sidebar + header + footer + providers)
│   │   ├── index.tsx                # Dashboard / landing page
│   │   ├── email.tsx                # Smart Email Generator
│   │   ├── notes.tsx                # Meeting Notes Summarizer
│   │   ├── planner.tsx              # AI Task Planner
│   │   ├── research.tsx             # AI Research Assistant
│   │   └── chat.tsx                 # AI Chatbot Interface
│   ├── styles.css                   # Tailwind theme tokens, custom properties, gradients
│   ├── router.tsx                   # TanStack Router configuration
│   └── start.ts                     # TanStack Start instance config
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

---

## Getting Started

### Prerequisites
- **Node.js** 18+ or **Bun** 1.0+
- A Lovable account with AI Gateway access (for `LOVABLE_API_KEY`)

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd <repo-folder>

# Install dependencies
bun install
# or
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
LOVABLE_API_KEY=your_lovable_api_key_here
```

> The `LOVABLE_API_KEY` is used server-side inside `src/lib/ai.functions.ts` to call the Lovable AI Gateway. It is never exposed to the browser.

### Run the Development Server

```bash
bun run dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
bun run build
# or
npm run build
```

### Preview Production Build

```bash
bun run preview
# or
npm run preview
```

---

## Available Scripts

| Script | Description |
|--------|-------------|
| `dev` | Start the Vite development server with HMR |
| `build` | Build for production (SSR + static assets) |
| `build:dev` | Build in development mode |
| `preview` | Preview the production build locally |
| `lint` | Run ESLint across the codebase |
| `format` | Run Prettier to format all files |

---

## How the AI Features Work

All AI features share a single server function, `generateAI`, defined in `src/lib/ai.functions.ts`. Each tool page:

1. Collects user input (forms, textareas, selects)
2. Builds a tailored system prompt + user message
3. Calls `generateAI` via `useServerFn`
4. Renders the response in the `AIOutput` component

The `AIOutput` component supports:
- **Markdown preview** (via `react-markdown` + Tailwind Typography)
- **Inline editing** (switch to textarea, edit, and save)
- **Copy to clipboard** (with toast confirmation)
- **Loading skeleton** while waiting for the AI response

---

## Customization

### Theme / Colors
Design tokens are defined in `src/styles.css` using OKLCH color values. Edit the `:root` variables to change the palette:

```css
:root {
  --primary: oklch(0.45 0.18 265);
  --accent: oklch(0.72 0.15 175);
  --background: oklch(0.99 0.005 250);
  /* ... */
}
```

### Adding a New Tool
1. Create a new route file: `src/routes/<tool>.tsx`
2. Use the `ToolShell` + `AIOutput` pattern (see existing tools for reference)
3. Add the navigation item to `src/components/AppSidebar.tsx`
4. Add a card to the dashboard grid in `src/routes/index.tsx`

---

## License

© 2026 vuyokazigxowa. All rights reserved.

---

## Responsible AI

This application uses AI-generated content. Outputs may be incomplete or inaccurate. Always review and edit AI-generated text before sending, sharing, or acting on it. Do not paste confidential or sensitive information.
