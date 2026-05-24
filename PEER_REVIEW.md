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

## 2026-05-25 03:00 KST - Review 2

### Scope

- Korean portfolio copy quality after AI developer positioning change
- Encoding safety for Korean source text
- Verification-oriented portfolio narrative
- Fast syntax-level validation after copy changes

### Findings

1. The first AI developer copy was too generic and sounded like "AI로 빠르게 만든다" rather than "AI 결과를 책임 있게 검증한다."
   - Current impact: the portfolio positioning did not clearly differentiate the developer's strength.
   - Action taken: revised the main copy toward evaluation, evidence, failure detection, repeatable validation, and reliability automation.

2. Korean text in source files is vulnerable to mojibake during shell-based edits.
   - Current impact: previous Korean copy became unreadable in `app/layout.tsx`, `components/main/MainWrapper.tsx`, and `components/Footer.tsx`.
   - Action taken: rewrote the affected copy blocks and re-saved touched files as UTF-8.
   - Action taken: added an `.editorconfig` with `charset = utf-8` and LF line endings.
   - Recommended action: avoid ad hoc shell text replacement for Korean copy.

3. The homepage now has a stronger technical narrative, but the About and Work pages still use older generic AI/developer wording.
   - Current impact: users may see a strong verification-focused homepage, then inconsistent supporting pages.
   - Recommended action: update `components/about/AboutWrapper.tsx` and `components/works/WorkWrapper.tsx` around the same "검증하는 AI 개발자" positioning.

4. The build toolchain still has intermittent Node/V8 `Zone` memory failures on Windows.
   - Current impact: `next lint` and `next build` are not reliable gates in this local environment.
   - Recommended action: verify in a clean Linux/CI environment or WSL, then decide whether this is environment-specific or a Next/SWC dependency issue.

### Verification

- `node ./node_modules/typescript/bin/tsc --noEmit`: passed.
- Mojibake marker search for known broken Korean byte patterns: no matches in `app`, `components`, or `PEER_REVIEW.md`.
- `corepack yarn lint`: failed this run with Node/V8 `Fatal process out of memory: Zone`.
- `corepack yarn build`: failed this run with Node/V8 `Fatal process out of memory: Zone`.

### Next Review Angle

- Make About/Work pages support the new verification-focused positioning.
- Add encoding/tooling guardrails so Korean content edits do not regress.
- Separate visual copy changes from code cleanup in future commits.

## 2026-05-25 04:00 KST - Review 3

### Scope

- Work page data modeling and navigation
- App Router compatibility in shared gallery/navigation components
- Ref safety around scroll-driven layout code
- Documentation integrity after Korean encoding issues

### Findings

1. `components/works/WorkWrapper.tsx:107` still routes every work card to `/`.
   - Current impact: the Work page looks clickable but cannot expose project detail, case-study, or external result pages.
   - Recommended action: model each work item as `{ id, title, href, images }` and render `Link href={work.href}`. If a project has no target yet, make that explicit in the data instead of silently linking home.

2. `components/works/WorkWrapper.tsx:64` keeps work data inside the component and uses duplicate titles as identity.
   - Current impact: the UI, routing, and data are coupled; duplicate `"yummy yummy"` labels make React keys unstable and prevent reliable project expansion.
   - Recommended action: extract a typed `works` array near the module top or under `config/works.ts`, with stable `id` values and project metadata.

3. `components/GalleryBox.tsx:1` imports `useRouter` from `next/router`, and `components/GalleryBox.tsx:2` imports unused hooks.
   - Current impact: it works only because those imports are unused, but it leaves Pages Router API in an App Router codebase and adds review noise.
   - Recommended action: remove `useRouter`, `useEffect`, and `useState`; keep this component presentational.

4. `components/GalleryBox.tsx:33` through `components/GalleryBox.tsx:133` manually repeats the same `<span>{text}</span>` blocks.
   - Current impact: the component is long, harder to change, and easy to make inconsistent when the marquee behavior changes.
   - Recommended action: create a small helper like `renderLoopText(text, count = 10)` or map over `Array.from({ length: 10 })` for each edge.

5. `components/about/AboutWrapper.tsx:72` and `components/works/WorkWrapper.tsx:47` dereference refs through `mainContainer.current` and `infoText.current` without guarding `.current`.
   - Current impact: React effects normally run after refs attach, but this can still crash under conditional rendering, test environments, or future layout changes.
   - Recommended action: use early guards such as `if (!mainContainer.current || !infoText.current) return;`.

6. `components/NaviBox.tsx:3`, `components/NaviBox.tsx:5`, `components/NaviBox.tsx:6`, `components/NaviBox.tsx:7`, and `components/NaviBox.tsx:23` show unused imports/state plumbing.
   - Current impact: `Link`, `useRef`, `useWindowSize`, `keyframes`, and `setRoute` increase maintenance noise and hide the actual navigation behavior.
   - Recommended action: remove unused imports and either wire `useCommonStore` to real behavior or delete it from this component.

7. `app/layout.tsx` had a mojibake-damaged metadata description during this review.
   - Current impact: the project could fail type checking or ship broken SEO text.
   - Action taken: restored `description` to readable Korean and kept `Noto Sans KR` metadata setup intact.
   - Recommended action: keep Korean copy changes in editor/patch workflows that preserve UTF-8.

### Verification

- `node ./node_modules/typescript/bin/tsc --noEmit`: passed after restoring `app/layout.tsx`.
- Searched for known mojibake marker characters in `app`, `components`, and `PEER_REVIEW.md`: no matches after cleanup.
- `git status --short --branch`: showed a clean branch before this review and only review/layout documentation changes afterward.

### Next Review Angle

- Turn the Work page findings into a small data-model cleanup commit.
- Re-run lint in a stable Node environment and compare against the manual unused-import findings.
- Review image handling and asset sizes, especially large `public/images/img_user_*.jpg` files.
