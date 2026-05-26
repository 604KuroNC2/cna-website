# GitHub Copilot Instructions

## Purpose
This file guides GitHub Copilot and AI coding agents for the CNA Lighting website repository.

## Key facts
- The repository is a **Next.js 14 App Router** frontend built with **TypeScript**, **React**, and **Tailwind CSS**.
- The main application lives in `app/`; reusable UI code is in `components/`; utility code is in `lib/`.
- Static assets and images are under `public/brand_assets/`.
- There is a separate legacy WordPress theme in `wordpress-theme/cna-lighting/`.

## What to do first
- Read `CLAUDE.md` before changing any frontend UI or design-related code.
- Prefer minimal, incremental changes over broad rewrites.
- Preserve existing site structure and avoid adding new sections unless requested.

## Useful commands
- `npm install`
- `npm run dev`
- `npm run build`
- `npm run lint`

## Notes
- The site uses App Router conventions; avoid mixing pages router patterns into `app/`.
- Use `app/api/` for new backend logic or server-route behavior.
- Do not modify the WordPress theme unless the task explicitly targets it.

## References
- `AGENTS.md` for agent guidance
- `CLAUDE.md` for frontend styling and screenshot workflow
- `README.md` for project overview
