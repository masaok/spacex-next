# Lighthouse CI Setup

This project includes a ready-to-run Lighthouse CI configuration to track performance, accessibility, best practices, and SEO in CI.

Files added
- `.lighthouserc.js` — LHCI config with target URLs on `http://localhost:3002`.
- `.github/workflows/lighthouse-ci.yml` — GitHub Action to build, start, and audit the app.

Run locally
1. Build and start the app on port 3002:
   - `bun run build`
   - `bun run start -p 3002`
2. In a new terminal, run Lighthouse CI:
   - `npx @lhci/cli@0.13.x autorun --config=.lighthouserc.js`

Notes
- The config currently targets non-prefixed routes (e.g. `/cores`). Once language-prefixed routes are implemented, update `.lighthouserc.js` URLs to include `/:lang` (e.g., `/en/cores`, `/fr/cores`).
- The workflow uploads HTML reports as a build artifact under `.lighthouseci` and also to LHCI temporary public storage.
- Thresholds are set to "warn" initially so audits don't fail the build; tighten them over time.

GitHub status checks
- Create a repo secret named `LHCI_GITHUB_TOKEN` containing a Personal Access Token (classic) with at least `repo:status` (or `public_repo` for public repos). Org-level secret also works.
- The workflow at `.github/workflows/lighthouse-ci.yml:40` passes this secret to `lhci` via the `LHCI_GITHUB_TOKEN` env var so Lighthouse CI can post commit status checks.
- If you prefer the Lighthouse CI GitHub App, create a secret `LHCI_GITHUB_APP_TOKEN` with the app token and set it in the workflow instead of `LHCI_GITHUB_TOKEN`.
- For forks, GitHub may restrict secrets on pull_request from forks. Use `pull_request_target` or PAT-based workflows cautiously.
