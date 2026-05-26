# AGENTS.md — AI Coding Agent Guidance

## Purpose
This file helps AI coding agents understand the structure and conventions of the CNA Lighting website repository so they can be productive immediately.

## Key project facts
- Primary application is a **Next.js 14 App Router** frontend with **TypeScript**, **React**, and **Tailwind CSS**.
- The frontend is built from `app/` routes and reusable UI components in `components/`.
- Data and site-specific logic live under `lib/`, while images and static assets are under `public/brand_assets/`.
- The project also contains a legacy WordPress theme in `wordpress-theme/cna-lighting/`, which is separate from the Next.js frontend.

## Important files
- `package.json`: project scripts and dependencies.
- `app/page.tsx`: main homepage entry point.
- `app/layout.tsx`: global layout and metadata wrapper.
- `app/api/`: server API routes used by the site.
- `CLAUDE.md`: authoritative frontend design rules and screenshot/dev workflow. Follow it for any UI work.
- `wordPress-theme/cna-lighting/README.md`: WordPress-specific notes if editing the legacy theme.

## Recommended commands
- Install dependencies: `npm install`
- Run development server: `npm run dev`
- Build production app: `npm run build`
- Start production server: `npm run start`
- Lint code: `npm run lint`

## Development guidance
- Prefer minimal, incremental changes; preserve the existing site structure.
- When working on frontend UI, follow the rules in `CLAUDE.md` first.
- Use API route files in `app/api/` when adding backend behavior.
- Do not touch the WordPress theme files unless the task explicitly targets `wordpress-theme/cna-lighting/`.
- Keep public assets in `public/brand_assets/` and respect existing brand assets when available.

## Notes for agents
- This repository is a **frontend-first Next.js site** with some admin/upload features, not a full multi-service backend project.
- Avoid adding unrelated sections, features, or generic design improvements unless the task explicitly asks for them.
- Use `CLAUDE.md` for frontend styling and screenshot workflow details.
