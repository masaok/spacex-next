# Repository Guidelines

## Project Structure & Module Organization
- `src/app/` — Next.js App Router pages (e.g., `launches/page.tsx`).
- `src/components/` — Reusable React components.
- `src/translations/` — i18n dictionaries (`en.ts`, `es.ts`, `zh.ts`, `ja.ts`, `fr.ts`, `de.ts`) and index `translations.ts`.
- `src/store/` — Client state (Zustand) including language selector.
- `src/lib/`, `src/config/` — Utilities and app config.
- `public/` — Static assets.
- `src/docs/` — Internal notes and i18n plans.

## Build, Test, and Development Commands
- Dev: `bun run dev` (or `npm run dev`) — Run local dev server with Turbopack.
- Build: `bun run build` (or `npm run build`) — Production build.
- Start: `bun run start` (or `npm run start`) — Serve production build.
- Lint: `bun run lint` — ESLint (Next + TypeScript rules).
- CI sample: `bun run ci` — Lint then build.

## Coding Style & Naming Conventions
- TypeScript + React (Next.js 15, App Router).
- Formatting via Prettier: 2 spaces, single quotes, no semicolons, width 100.
- Linting via ESLint: `next/core-web-vitals`, `next/typescript`.
- Components and files: PascalCase for components (`Header.tsx`), camelCase for functions/vars.
- i18n keys must mirror `src/translations/en.ts`. New language files export `const xx = { ... }` and are registered in `src/translations/translations.ts`.

## Testing Guidelines
- No formal tests yet. Prefer adding unit tests near modules you change.
- Suggested stack: Vitest for unit tests, Playwright for e2e.
- Name tests `<file>.test.ts` and colocate within the feature directory.

## Commit & Pull Request Guidelines
- Commits: clear, imperative subject (e.g., "add german translations for i18n"). Group related changes.
- PRs: include description, screenshots for UI changes, and link issues. Keep diffs focused. Note any i18n additions and locales affected.

## Security & Configuration Tips
- Do not commit secrets. Use `.env.local` for runtime config. Access via `process.env.*` in server components only.
- Prefer parameterized fetches and validate all external data. Avoid exposing API keys to the client.

## Agent-Specific Notes
- Follow i18n plans in `src/docs/`. When adding languages, ensure language code is added to `src/store/languageStore.ts` and dictionaries are wired in `translations.ts`.
