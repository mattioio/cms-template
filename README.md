# CMS Template

A git template for blog and property websites built with Payload CMS v3, Next.js, and shadcn/ui. Clone this to start any new project.

## Stack

- **[Payload CMS v3](https://payloadcms.com/)** — headless CMS + admin panel, co-located with Next.js
- **[Next.js 15](https://nextjs.org/)** — App Router, Server Components, ISR
- **[PostgreSQL](https://neon.tech/)** — via Neon (free tier works great)
- **[Tailwind CSS v4](https://tailwindcss.com/)** + **[shadcn/ui](https://ui.shadcn.com/)** — styling

## What's included

- **Admin** at `/admin` — full Payload CMS admin panel
- **Blog** — Posts, Categories, rich text editor (Lexical), featured images
- **Properties** — price, bedrooms/bathrooms, image gallery, for sale/rent filter
- **Globals** — SiteSettings (name, description, logo) and Navigation (header links)
- **Starter pages** — homepage, blog listing + post, property listing + detail

## Getting started

### 1. Clone and install

```bash
git clone <your-repo-url> my-new-site
cd my-new-site
pnpm install
```

### 2. Set up your database

Create a free PostgreSQL database at [neon.tech](https://neon.tech).

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

```env
DATABASE_URL=postgres://user:password@host.neon.tech/dbname?sslmode=require
PAYLOAD_SECRET=<random string — run: openssl rand -base64 32>
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
```

### 3. Generate types and run

```bash
pnpm generate:types   # generates src/payload-types.ts from your schema
pnpm dev              # starts at http://localhost:3000
```

Visit `/admin` to create your first user and start adding content.

## Deploying to Vercel

1. Push to GitHub
2. Import to [Vercel](https://vercel.com)
3. Add environment variables in the Vercel dashboard:
   - `DATABASE_URL` — your Neon connection string
   - `PAYLOAD_SECRET` — same random secret
   - `NEXT_PUBLIC_SERVER_URL` — your Vercel URL (e.g. `https://my-site.vercel.app`)
4. Deploy

Payload runs migrations automatically on first boot.

## Project structure

```
src/
├── app/
│   ├── (payload)/          # Payload admin + API (auto-managed)
│   └── (frontend)/         # Public site
│       ├── page.tsx         # Homepage
│       ├── blog/            # Blog listing + post pages
│       └── properties/      # Property listing + detail pages
├── collections/             # CMS schema definitions
│   ├── Posts.ts
│   ├── Properties.ts
│   ├── Categories.ts
│   ├── Media.ts
│   └── Users.ts
├── globals/
│   ├── SiteSettings.ts
│   └── Navigation.ts
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── PostCard.tsx
│   └── PropertyCard.tsx
└── payload.config.ts        # Main Payload config
```

## Customising

- **Add fields** — edit files in `src/collections/` and re-run `pnpm generate:types`
- **Add shadcn components** — `pnpm dlx shadcn@canary add <component>`
- **Change styling** — edit CSS variables in `src/app/globals.css`
- **Add pages** — create routes under `src/app/(frontend)/`
