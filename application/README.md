# thertv.in — Application

The Next.js app powering [Thilak Vikram R's portfolio](https://thertv.in): a
database-driven public portfolio page, an AI assistant that answers visitor
questions, and an authenticated admin panel for editing site content. See
the [root README](../README.md) for the full project overview.

## Stack

- **Next.js (App Router)** + React + TypeScript
- **Tailwind CSS** for styling
- **Prisma** ORM over **MariaDB**
- **better-auth** for login/sessions/admin roles
- **LangChain + Google Gemini + ChromaDB** for the AI assistant

## Getting started

1. Start the database (from the repo root):
   ```bash
   docker compose -f database/docker-compose.yml up -d
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with your database connection string, auth secret,
   and Google AI API key.
4. Generate the Prisma client and run migrations:
   ```bash
   npm run db:generate
   npm run db:migrate
   ```
5. Run the dev server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to see it.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the local dev server |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | Lint the codebase |
| `npm run db:generate` | Regenerate the Prisma client |
| `npm run db:migrate` | Run/create Prisma migrations |
| `npm run setAdmin` | Grant a user admin access |

## Project layout

- `app/_portfolio` — public portfolio content model and page rendering
- `app/_ai` — AI assistant logic (LangChain + vector store)
- `app/_auth` — session/auth helpers
- `app/admin` — authenticated content editor
- `app/auth` — login/logout routes
- `components/` — shared client components (chat widget, user menu, animated logo, etc.)
- `database/` — Prisma-backed data access (e.g. loading/saving portfolio content)
- `scripts/` — one-off scripts (seeding content, granting admin access)
