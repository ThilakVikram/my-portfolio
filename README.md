# thertv.in — Personal Portfolio Platform

Official personal portfolio site for **Thilak Vikram R**, published at
`thertv.in`. It's not just a static profile page — it's a small
content-managed platform: the owner can log in and edit every section of
the site live, and visitors can chat with an AI assistant that answers
questions about the owner using real, grounded data.

## Scope

- **Public portfolio** — hero, about, skills, projects, services,
  experience and contact sections, rendered from data stored in a
  database (not hardcoded), so the page updates without a redeploy.
- **AI assistant** — a chat widget on the public site that answers
  visitor questions about the owner, backed by a vector database seeded
  with the owner's real background/experience for grounded, relevant
  answers instead of generic chatbot replies.
- **Admin panel** — authenticated area where the owner can edit portfolio
  content (profile, sections, projects, etc.) with a live preview, and
  manage who has admin access.
- **Auth** — email/session-based login so only the owner (and any admins
  they grant) can edit content; everyone else gets the read-only public
  view.

## How it's built

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router) + React + TypeScript |
| Styling | Tailwind CSS |
| Database | MariaDB, accessed through Prisma ORM |
| Auth | better-auth (sessions, login, admin roles) |
| AI assistant | LangChain + Google Gemini, grounded on a ChromaDB vector store of the owner's personal data |
| Local infra | Docker Compose (spins up the database for local development) |

**Architecture in short:** the public page is a Server Component that
loads portfolio content from the database at request time (falling back
to sensible defaults if the database is unreachable), so it's always
fresh. A small set of Client Components handle interactive pieces — the
AI chat widget, the signed-in user menu, the admin content editor, and
the animated logo — layered on top of the server-rendered page. Content
edited in the admin panel is persisted to the database through Prisma and
reflected immediately on the public site.

## Running locally

1. Start the database: `docker compose -f database/docker-compose.yml up -d`
2. Install dependencies and generate the Prisma client inside `application/`.
3. Run the dev server: `npm run dev` (from `application/`).

See the `application/` folder for the actual Next.js project.
