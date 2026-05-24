# Peer Review Log

## 2026-05-25 02:00 KST - Review 1

### Scope

- Main portfolio copy and layout entry points
- Routing/navigation behavior
- Build and package-management health
- Shared UI components with obvious code-level risk

### Findings

1. `components/GalleryBox.tsx` imports `useRouter` from `next/router`, but this App Router project should avoid `next/router`.
   - Current impact: unused import only, so runtime impact is low.
   - Recommended action: remove the import. If routing is needed later, use `next/navigation`.

2. `components/works/WorkWrapper.tsx` renders every work card with `Link href="/"`.
   - Current impact: portfolio items cannot lead to detail pages or external project links.
   - Recommended action: add a `href` field to each work item and route to a real detail page or project URL.

3. `components/works/WorkWrapper.tsx` uses duplicate `text` values as React keys.
   - Current impact: repeated `"yummy yummy"` keys can cause unstable reconciliation once the list changes.
   - Recommended action: add a stable `id` field to work items and use it as the key.

4. `package-lock.json` and `yarn.lock` both exist, but `package-lock.json` is not in sync with `package.json`.
   - Current impact: `npm ci` fails, while Yarn install works.
   - Recommended action: choose one package manager. Given current state, keep Yarn and remove or regenerate `package-lock.json`.

5. Production build fails on this Windows environment with Node 20.12.2 due to a Next worker memory crash.
   - Verified: `corepack yarn lint` passes with warnings only, and `tsc --noEmit` passes.
   - Current impact: deploy/build pipeline may fail depending on environment memory and worker behavior.
   - Recommended action: reproduce on CI or WSL/Linux, then consider reducing worker pressure, upgrading Next, or isolating large image/static processing paths.

6. Several components contain unused imports or state setters.
   - Examples: `components/about/AboutWrapper.tsx` has state setters that are never used, and other components have historical imports.
   - Current impact: noise during maintenance and harder code review.
   - Recommended action: run cleanup after the current content pass, keeping behavior unchanged.

### Verification

- `corepack yarn lint`: passed with existing `<img>` warnings in `components/Footer.tsx`.
- `node ./node_modules/typescript/bin/tsc --noEmit`: passed.
- `corepack yarn build`: failed with `Fatal process out of memory: Zone` from Next/Jest worker.

### Next Review Angle

- Review responsive layout risks after Korean copy expansion.
- Check About/Work pages for content consistency with AI developer positioning.
- Identify low-risk cleanup commits that can be separated from visual/content changes.
