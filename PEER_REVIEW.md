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

## 2026-05-25 05:00 KST - Review 4

### Scope

- Static image sizes and dimensions
- Image rendering strategy in homepage, About, Work, gallery, and footer
- Accessibility impact of CSS background images and icon images
- Next.js image optimization opportunities

### Findings

1. Several public images are much larger than their likely display size.
   - Evidence: `public/images/img_user_1.jpg` is 3543x3543 and 6.98 MB; `img_product_third.png` is 1228x1628 and 3.54 MB; `img_product_second.png` is 1150x1558 and 2.89 MB; `img_user_4.jpg` is 2456x1608 and 2.44 MB.
   - Current impact: About and homepage/gallery views can transfer multi-megabyte assets before the user sees meaningful content.
   - Recommended action: generate web-sized variants, preferably AVIF/WebP plus fallback, and keep originals outside `public` if they are not served directly.

2. Most important visual assets are rendered as CSS `background-image` rather than `next/image`.
   - Evidence: `components/main/MainWrapper.tsx:342`, `components/main/MainWrapper.tsx:538`, `components/main/MainWrapper.tsx:545`, `components/main/MainWrapper.tsx:553`, `components/about/AboutWrapper.tsx:263`, and `components/GalleryBox.tsx:229` use background images.
   - Current impact: the app misses built-in image optimization, responsive `srcset`, priority/lazy loading controls, and semantic `alt` text.
   - Recommended action: use `next/image` for content images. Keep CSS backgrounds only for purely decorative masks or texture-like art.

3. About page carousel user images are content but have no accessible name.
   - Evidence: `components/about/AboutWrapper.tsx:263` sets `backgroundImage` on `UserImgBox`.
   - Current impact: assistive technologies cannot understand what each slide represents, and browser image loading cannot be optimized per slide.
   - Recommended action: render an `Image` with `alt` derived from the project/member title and use CSS only for framing/cropping.

4. Footer icons use raw `<img>` tags and trigger the existing Next lint warning.
   - Evidence: `components/Footer.tsx:60`, `components/Footer.tsx:64`, and `components/Footer.tsx:68`.
   - Current impact: the project keeps known lint warnings and bypasses Next's image handling even for small icons.
   - Recommended action: switch to `next/image` for raster icons or inline SVG/import SVG icons where appropriate.

5. `next.config.mjs` does not define image-related policy.
   - Evidence: only the `styledComponents` compiler setting is configured.
   - Current impact: there is no explicit format/device-size strategy or documented image optimization policy.
   - Recommended action: once `next/image` is adopted, define `images.formats` such as `["image/avif", "image/webp"]` and ensure the device sizes match the portfolio layout breakpoints.

6. Large Work thumbnails are repeated across multiple cards.
   - Evidence: `components/works/WorkWrapper.tsx` maps four cards to the same three `yummygame` images, each roughly 0.83 MB to 1.09 MB.
   - Current impact: caching helps after first load, but the page still has no real project diversity and can create duplicated decode/layout work.
   - Recommended action: pair the Review 3 work data-model cleanup with optimized per-project thumbnails.

7. Image dimensions are implicit in several components.
   - Evidence: gallery and product images rely on container aspect ratio/background cover rather than explicit image dimensions.
   - Current impact: layout stability depends on CSS containers and cannot benefit from image-level intrinsic sizing.
   - Recommended action: give image components stable dimensions or `fill` with a constrained parent `aspect-ratio`.

### Verification

- Enumerated image file sizes with `Get-ChildItem public/images -Recurse -File`.
- Read image dimensions via `System.Drawing.Image`.
- Searched usage with `rg -n "background-image|<img|next/image|img_user|img_product|main\\.jpeg|images/work|ico_" app components styles lib config`.
- `git status --short --branch`: clean before this review.

### Next Review Angle

- Review accessibility and keyboard interaction: navigation buttons, carousel arrows, external links, hover-only gallery behavior, and reduced-motion handling.
- Consider implementing the small unused-import cleanup from Reviews 1 and 3 before larger image refactors.

## 2026-05-25 06:00 KST - Review 5

### Scope

- Keyboard accessibility for navigation, gallery, carousel, and footer controls
- External link security and semantics
- Motion/reduced-motion handling
- Screen reader affordances for icon-only controls and decorative overlays

### Findings

1. The footer "top" control is a clickable `div`, not a button.
   - Evidence: `components/Footer.tsx:71` uses `<div className="top" onClick={...}>`.
   - Current impact: keyboard users cannot focus or activate the control reliably, and assistive tech does not receive button semantics.
   - Recommended action: change it to `<button type="button" className="top" aria-label="맨 위로 이동">` and keep the existing SVG visuals inside.

2. The mobile hamburger button has no accessible name.
   - Evidence: `components/NaviBox.tsx:34` renders a button with only two empty `<div>` bars.
   - Current impact: screen readers announce an unnamed button.
   - Recommended action: add `aria-label="메뉴 열기"` to the hamburger button and `aria-expanded={naviState}`.

3. The mobile menu dim/close button has no accessible name and the menu lacks dialog/navigation state.
   - Evidence: `components/NaviBox.tsx:48` renders a full-screen `.dim` button with no label.
   - Current impact: users may tab to an unnamed control; focus is not constrained while the menu is open.
   - Recommended action: add `aria-label="메뉴 닫기"`, wrap links in a semantic `nav`, and consider focus management for the open mobile menu.

4. Navigation uses buttons for route changes instead of links.
   - Evidence: `components/NaviBox.tsx:55`, `components/NaviBox.tsx:61`, and `components/NaviBox.tsx:69` call `router.push`.
   - Current impact: users cannot open routes in a new tab, copy link URLs, or get standard link semantics.
   - Recommended action: use `Link` for internal navigation and reserve `button` for actions that do not navigate.

5. External links opened with `target="_blank"` lack `rel="noopener noreferrer"`.
   - Evidence: `components/Footer.tsx:58`, `components/Footer.tsx:63`, `components/Footer.tsx:67`, `components/about/AboutWrapper.tsx:359`, and `components/about/AboutWrapper.tsx:395`.
   - Current impact: opened pages can access `window.opener`, and audits will flag the links.
   - Recommended action: add `rel="noopener noreferrer"` to every external blank-target link.

6. The About page has an anchor without `href`.
   - Evidence: `components/about/AboutWrapper.tsx:325` renders `<a>` around the Twitter row.
   - Current impact: it is not a real link, may not be keyboard-focusable as expected, and creates inconsistent social-link behavior.
   - Recommended action: either provide a real `href` or render it as a disabled/non-link element with clear semantics.

7. Carousel arrow buttons are icon-only without labels or disabled state.
   - Evidence: `components/about/AboutWrapper.tsx:154` and `components/about/AboutWrapper.tsx:196` render arrow buttons with SVG only.
   - Current impact: screen readers do not know what the controls do, and boundary conditions return `false` instead of communicating disabled state.
   - Recommended action: add `aria-label="이전 작업 보기"` / `aria-label="다음 작업 보기"` and use `disabled={currentMemberIdx === 1}` or `disabled={currentMemberIdx === memberArrayData.length}`.

8. The homepage gallery reveal is mouse-only.
   - Evidence: `components/main/MainWrapper.tsx:219` and `components/main/MainWrapper.tsx:220` rely on `onMouseEnter` / `onMouseLeave`.
   - Current impact: keyboard and touch users cannot trigger the same reveal interaction.
   - Recommended action: add `onFocus`, `onBlur`, and a semantic focusable control or link around the gallery.

9. The site has many continuous animations but no `prefers-reduced-motion` handling.
   - Evidence: `components/EffectBox.tsx:191`, `components/EffectBox.tsx:203`, `components/EffectBox.tsx:205`, `components/GalleryBox.tsx:277`, and `components/main/MainWrapper.tsx:580` animate overlays/marquees continuously.
   - Current impact: motion-sensitive users cannot opt out, and the UI may feel noisy during repeated visits.
   - Recommended action: add a global `@media (prefers-reduced-motion: reduce)` rule that disables marquee/transition animations and uses static states.

10. Decorative transition overlays may be announced as content.
    - Evidence: `components/EffectBox.tsx` renders repeated rolling text and a fixed overlay without `aria-hidden`.
    - Current impact: screen readers may encounter repeated non-essential words while navigating pages.
    - Recommended action: mark the visual transition wrapper `aria-hidden="true"` unless it carries essential status information.

### Verification

- Searched interaction patterns with `rg -n "<button|<a|target=|onClick|onMouseEnter|onMouseLeave|hover|animation:|keyframes|scrollTo|aria-|role=|tabIndex|prefers-reduced-motion" app components styles lib`.
- Inspected `components/NaviBox.tsx`, `components/Footer.tsx`, and `components/EffectBox.tsx` directly.
- `node ./node_modules/typescript/bin/tsc --noEmit`: passed after verifying the restored source files.
- Checked critical Korean strings via Python `unicode_escape` output because PowerShell display encoding renders Hangul as mojibake in this environment.

### Next Review Angle

- Review state management and client-component boundaries: unnecessary `"use client"` usage, Zustand store value, and direct DOM mutation patterns.
- Consider making the accessibility fixes in small commits because several are low-risk and user-facing.

## 2026-05-25 07:00 KST - Review 6

### Scope

- Client component boundaries and hydration cost
- Zustand store usage
- Direct DOM mutation patterns
- Scroll/window hooks and derived state
- Server/client split opportunities in the App Router structure

### Findings

1. `app/page.tsx` is marked `"use client"` even though it only returns `<MainWrapper />`.
   - Evidence: `app/page.tsx:1`.
   - Current impact: the route entrypoint is forced into the client boundary without local state or effects.
   - Recommended action: remove `"use client"` from `app/page.tsx`; keep client behavior inside `MainWrapper` where the hover state exists.

2. Layout wraps the whole app in a client smooth-scroll provider.
   - Evidence: `app/layout.tsx` renders `<SmoothScrolling>` around `StyledComponentsRegistry`, navigation, and all route children; `lib/smoothScrolling.tsx` is a client component using `ReactLenis`.
   - Current impact: every page goes through a client scroll provider even if a route does not need custom scroll behavior, increasing hydration surface and making native scroll semantics harder to reason about.
   - Recommended action: evaluate whether Lenis should be route-level or optional. If kept globally, document why and ensure accessibility/reduced-motion behavior is handled.

3. `lib/smoothScrolling.tsx` imports `useLenis` but never uses it.
   - Evidence: `lib/smoothScrolling.tsx:4`.
   - Current impact: small bundle/review noise and another example of stale code.
   - Recommended action: remove `useLenis` from the import.

4. `components/LeftWrapper.tsx` and `components/RightWrapper.tsx` are client components without client-only behavior.
   - Evidence: both files start with `"use client"` and only render styled wrappers.
   - Current impact: static layout wrappers become client components unnecessarily.
   - Recommended action: test whether the directive can be removed. If styled-components SSR requires a specific pattern, keep it documented; otherwise move them back to server-compatible components.

5. `components/NaviBox.tsx` reads from `useCommonStore` but does not use the value or call `setRoute`.
   - Evidence: `components/NaviBox.tsx:11` and `components/NaviBox.tsx:23`.
   - Current impact: Zustand is pulled into navigation for no behavior, and `stores/useCommon.ts` appears to be unused state infrastructure.
   - Recommended action: remove `useCommonStore` from `NaviBox` and delete the store if no other component uses it.

6. `stores/useCommon.ts` has an unused `get` argument and only stores route state that is already available through `usePathname`.
   - Evidence: `stores/useCommon.ts:8`.
   - Current impact: duplicated route state can drift from Next router state if it is revived later.
   - Recommended action: prefer `usePathname` for route reads. If global route state is needed, synchronize it explicitly in one place.

7. `components/EffectBox.tsx` stores props in state but never updates that state.
   - Evidence: `components/EffectBox.tsx:15` and `components/EffectBox.tsx:16`.
   - Current impact: `pageState` and `rollingTextState` are redundant and can become stale if props change.
   - Recommended action: use `text` and `rollingText` directly unless there is a planned transition state machine.

8. `components/EffectBox.tsx` imports `usePathname`, reads `windowHeight`, and defines `toggleAni`, but none of them affect rendering.
   - Evidence: `components/EffectBox.tsx:18`, `components/EffectBox.tsx:19`, and `components/EffectBox.tsx:96`.
   - Current impact: unnecessary subscriptions and dead code around a component that already animates heavily.
   - Recommended action: remove unused hook values and dead keyframes.

9. Several components mutate DOM styles through refs instead of representing transforms in React state/style.
   - Evidence: `components/about/AboutWrapper.tsx:75`, `components/about/AboutWrapper.tsx:80`, `components/about/AboutWrapper.tsx:87`, `components/about/AboutWrapper.tsx:90`, `components/about/AboutWrapper.tsx:93`, `components/works/WorkWrapper.tsx:50`, `components/works/WorkWrapper.tsx:55`, and `components/EffectBox.tsx:22`.
   - Current impact: behavior is harder to test, null-safety is weaker, and future concurrent rendering/layout changes are riskier.
   - Recommended action: compute transform strings and pass them via `style` props, or encapsulate imperative animation in a well-scoped hook with null guards.

10. `useWindowScroll` destructures `x: scrollX` in About and Work but `scrollX` is unused.
    - Evidence: `components/about/AboutWrapper.tsx:67` and `components/works/WorkWrapper.tsx:42`.
    - Current impact: minor noise; more importantly, it shows broad hook usage without a clear dependency budget.
    - Recommended action: destructure only `y: scrollY`.

### Verification

- Searched client/state patterns with `rg -n '"use client"|useState|useEffect|useRef|useWindow|usePathname|useRouter|useCommonStore|\\.current\\.style|document\\.|window\\.|setTimeout|ReactLenis|create\\(' app components lib stores styles config`.
- Inspected `app/layout.tsx`, `lib/smoothScrolling.tsx`, `lib/registry.tsx`, and `stores/useCommon.ts` directly.
- `node ./node_modules/typescript/bin/tsc --noEmit`: passed.
- Checked UTF-8 integrity using a Python scan for CJK compatibility/han mojibake candidates in critical source and review files.

### Next Review Angle

- Review deployment/runtime configuration: `ecosystem.config.js`, scripts, Node version assumptions, package-manager consistency, and PM2 behavior.
- Consider implementing low-risk cleanup from this review: remove unused imports/state from `smoothScrolling`, `EffectBox`, `NaviBox`, and the route page.

## 2026-05-25 08:00 KST - Review 7

### Scope

- Package manager and lockfile consistency
- Node/runtime version pinning
- Build/start scripts and PM2 production behavior
- Repository hygiene for generated artifacts
- CI/deployment reproducibility

### Findings

1. The project tracks both `package-lock.json` and `yarn.lock`, but only the Yarn path currently works.
   - Evidence: `git ls-files package-lock.json yarn.lock` shows both files tracked; `corepack yarn --version` returns `1.22.22`.
   - Current impact: contributors and deployment environments can pick different dependency graphs depending on package manager.
   - Recommended action: choose one package manager. Given current behavior, add `"packageManager": "yarn@1.22.22"` to `package.json` and remove or regenerate `package-lock.json`.

2. `npm ci --dry-run` fails on the current dependency tree.
   - Evidence: npm reports `react-textfit@1.1.1` requires React `^15.0.0 || ^16.0.0`, while the project uses React 18.
   - Current impact: any npm-based CI/deploy target will fail before build.
   - Recommended action: either standardize on Yarn or replace `react-textfit` with a React 18-compatible alternative.

3. Node version is documented but not enforced.
   - Evidence: `README.md` says `v20.12.2`; there is no `.nvmrc`, `.node-version`, `volta`, or `engines` field.
   - Current impact: developers can use Node 22 or other versions and hit different Next/SWC/worker behavior.
   - Recommended action: add `.nvmrc` with `20.12.2` and a matching `engines.node` range in `package.json`.

4. `package.json` has no CI-oriented install/build contract.
   - Evidence: scripts include `dev`, `build`, `start`, `lint`, and `only-start`, but no `typecheck`, `ci`, or `verify`.
   - Current impact: the working manual gate `node ./node_modules/typescript/bin/tsc --noEmit` is not encoded as a script.
   - Recommended action: add `typecheck` and `verify` scripts, for example `yarn typecheck && yarn lint`, once lint is stable in the target environment.

5. The `start` script rebuilds on every process start.
   - Evidence: `"start": "next build && next start"`.
   - Current impact: production restarts do unnecessary build work and can fail at runtime even if a build artifact was already validated.
   - Recommended action: split scripts into `build: next build` and `start: next start`; let CI/deploy run build before process start.

6. `only-start` starts PM2 with `--env production`, but `env_production` is commented out.
   - Evidence: `package.json` uses `pm2 start ecosystem.config.js --env production`; `ecosystem.config.js` has `env_production` commented.
   - Current impact: `--env production` currently communicates intent but does not set `NODE_ENV`, `PORT`, or other runtime variables.
   - Recommended action: either restore `env_production` or remove `--env production` until it has effect.

7. PM2 `instances: 4` is set without an explicit `exec_mode: "cluster"`.
   - Evidence: `ecosystem.config.js` sets `instances: 4`, while the `exec_mode: 'cluster'` line is commented.
   - Current impact: multiple forked `next start` processes may compete for the same port depending on PM2 behavior and environment.
   - Recommended action: explicitly configure cluster mode or run a single Next process behind an external process manager/reverse proxy.

8. PM2 starts `script: "next"` directly.
   - Evidence: `ecosystem.config.js` uses `script: "next"` and `args: "start"`.
   - Current impact: PATH resolution can differ between shells, PM2, CI, and servers.
   - Recommended action: prefer `script: "node_modules/next/dist/bin/next"` or run `yarn start`/a package script through PM2 consistently.

9. Operational comments in `ecosystem.config.js` and README contain mojibake when viewed through the current shell.
   - Evidence: PM2 comments and README reference text display as corrupted Korean in PowerShell output.
   - Current impact: deployment instructions are harder to trust and maintain.
   - Recommended action: rewrite operational comments in plain Korean or English and verify UTF-8 rendering in the editor, not just shell output.

10. There is no CI workflow checked in.
    - Evidence: `.github` does not exist.
    - Current impact: typecheck/lint/build regressions are detected manually and inconsistently.
    - Recommended action: add a GitHub Actions workflow pinned to Node 20.12.2 and Yarn 1.22.22, initially running install and typecheck. Add lint/build after the local Next worker issue is resolved.

### Verification

- `npm ci --dry-run`: failed with `ERESOLVE` due to `react-textfit` peer dependency against React 18.
- `corepack yarn --version`: `1.22.22`.
- `node --version`: `v20.12.2`.
- `npm --version`: `10.5.0`.
- Checked absence of `.nvmrc`, `.node-version`, `.npmrc`, `.yarnrc`, and `.github`.
- Inspected `package.json`, `ecosystem.config.js`, `README.md`, `next.config.mjs`, `.gitignore`, and tracked lockfiles.

### Next Review Angle

- Review content consistency across About and Work now that the homepage is positioned around verification-oriented AI development.
- Consider implementing the deployment hygiene fixes as separate commits: package manager declaration, `.nvmrc`, `typecheck` script, and PM2 env cleanup.

## 2026-05-25 09:00 KST - Review 8

### Scope

- Content consistency between Home, About, and Work
- Portfolio positioning around verification-oriented AI development
- Information architecture for proof, evidence, and case studies
- Remaining placeholder/parody copy that weakens credibility

### Findings

1. The homepage now positions the portfolio around verified AI systems, but About still introduces a generic frontend/developer story.
   - Evidence: `components/about/AboutWrapper.tsx:137` describes a visual-design-to-development transition, frontend focus, and future backend learning.
   - Current impact: the first page promises AI validation expertise, while About explains a different career narrative.
   - Recommended action: rewrite About around validation workflow: problem framing, dataset/testset design, LLM/RAG evaluation, automation, failure analysis, and user-facing implementation.

2. About effect copy still says `SOOHO about`.
   - Evidence: `components/about/AboutWrapper.tsx:36`.
   - Current impact: page transition text does not reinforce the current positioning.
   - Recommended action: change it to a phrase such as `VERIFIED AI ABOUT`, `AI EVALUATION`, or another concise verification-focused label.

3. Work effect copy still says `SOOHO work`.
   - Evidence: `components/works/WorkWrapper.tsx:38`.
   - Current impact: Work page branding does not match homepage's `VERIFIED AI SYSTEMS`.
   - Recommended action: use `VERIFIED AI WORK` or a project-specific label.

4. About uses fictional or joke-like contact/place copy.
   - Evidence: `components/about/AboutWrapper.tsx:105` shows `Inquiries:`, and `components/about/AboutWrapper.tsx:108` through `components/about/AboutWrapper.tsx:112` show `CONTACT:`, `Blumenkopf kein Studio`, `Burgring 123`, and `1010 Wien, Korea`.
   - Current impact: credibility drops for a portfolio trying to sell rigorous validation work.
   - Recommended action: replace with real contact channels, location/timezone if useful, and a short project inquiry statement.

5. Work page repeats the same contact placeholder from About.
   - Evidence: `components/works/WorkWrapper.tsx:89` through `components/works/WorkWrapper.tsx:96`.
   - Current impact: the Work page starts with unrelated/fake contact context instead of helping users inspect proof of work.
   - Recommended action: change the left rail to a Work-specific summary such as "검증 기준, 자동화, 결과" or remove the left rail content.

6. About still contains fake-client parody copy.
   - Evidence: `components/about/AboutWrapper.tsx:288` renders `Clients i wish i had WORKED FOR:` and the data includes `Netflix`, `Apple`, `Nike`, and other brands.
   - Current impact: the joke competes with the intended serious AI validation positioning.
   - Recommended action: replace with "검증 경험 영역", "다뤄본 문제 유형", or "관심 도메인" backed by real or honest labels.

7. About skillset is generic web stack only.
   - Evidence: `components/about/AboutWrapper.tsx:300` through `components/about/AboutWrapper.tsx:315` list `REACT`, `NEXT JS`, `NODE JS`, `EXPRESS`, `HTML`, `JAVASCRIPT`, `CSS / SCSS`, and `SQL`.
   - Current impact: the page does not communicate AI evaluation ability after the homepage foregrounds it.
   - Recommended action: add categories like `Evaluation`, `Prompt/RAG Testing`, `LLM Integration`, `Automation`, `Observability`, and keep web stack as implementation tools.

8. About project carousel labels do not explain evidence or outcomes.
   - Evidence: `memberArrayData` entries in `components/about/AboutWrapper.tsx:38` through `components/about/AboutWrapper.tsx:58` have project names and short service descriptions, but no role, metric, validation method, or result.
   - Current impact: viewers cannot evaluate what was built or how quality was verified.
   - Recommended action: remodel items with `role`, `problem`, `validation`, `result`, and `stack` fields.

9. Work page is still a visual gallery with repeated dummy cards.
   - Evidence: `components/works/WorkWrapper.tsx:64` through `components/works/WorkWrapper.tsx:80` repeats `yummygame` images and `"yummy yummy"` titles.
   - Current impact: there is no credible case-study structure for an AI validation portfolio.
   - Recommended action: define real case-study cards, even if initially brief: `title`, `problem`, `verification approach`, `artifact`, and `link/status`.

10. Social section says `YOU won't FIND ME HERE`.
    - Evidence: `components/about/AboutWrapper.tsx:322` through `components/about/AboutWrapper.tsx:323`.
    - Current impact: the copy discourages contact/verification instead of directing users to credible channels.
    - Recommended action: replace with straightforward labels like `Contact`, `GitHub`, `Instagram`, or `Project Links`, and ensure each link is real.

### Verification

- Inspected `components/about/AboutWrapper.tsx`, `components/works/WorkWrapper.tsx`, and the current homepage copy.
- Searched for leftover placeholder/brand terms with `Select-String` over About and Work.
- Checked actual UTF-8 contents with Python because PowerShell displays Hangul as mojibake in this environment.
- `node ./node_modules/typescript/bin/tsc --noEmit`: passed.

### Next Review Angle

- Review CSS/layout maintainability: repeated section/wrapper styles, typo-prone names, hard-coded viewport units, and mobile layout risks.
- Consider a content refactor before visual polish: About and Work should prove the same verification-focused story that Home now promises.

## 2026-05-25 10:00 KST - Review 9

### Scope

- Styled-components layout maintainability
- Repeated section/wrapper patterns
- Responsive behavior based on viewport units
- Hard-coded spacing, borders, and z-index layering
- Naming consistency and typo-prone style identifiers

### Findings

1. `Section` and `MainWrapper` styled components are duplicated across major page wrappers.
   - Evidence: `components/main/MainWrapper.tsx:823`, `components/about/AboutWrapper.tsx:938`, `components/works/WorkWrapper.tsx:191`, plus repeated `MainWrapper` definitions in About and Work.
   - Current impact: page-level layout changes must be repeated manually and can drift between pages.
   - Recommended action: extract shared layout primitives such as `PageWrapper`, `SplitSection`, and `ContentSection` under `components/layout` or `styles/layout.ts`.

2. The left/right split layout is encoded in multiple places with hard-coded `25vw`, `75vw`, and `40px` offsets.
   - Evidence: `components/LeftWrapper.tsx:16`, `components/RightWrapper.tsx:15`, `components/RightWrapper.tsx:18`, `components/main/MainWrapper.tsx:294`, `components/main/MainWrapper.tsx:317`, and `components/main/MainWrapper.tsx:846`.
   - Current impact: changing the rail width or mobile offset requires broad search/replace across unrelated components.
   - Recommended action: define layout constants/tokens for rail width and mobile gutter, then consume them consistently.

3. Border styles are repeated as literal `4px solid #000`.
   - Evidence: repeated in Footer, About, Main, Work, Gallery, Title, Skill, Client, and Section styles.
   - Current impact: visual system changes are noisy and error-prone.
   - Recommended action: create tokens such as `const BORDER = "4px solid #000"` or use CSS variables like `--line-width` and `--line-color`.

4. Several components depend heavily on viewport-height/viewport-width typography and dimensions.
   - Evidence: `components/main/MainWrapper.tsx:327`, `components/main/MainWrapper.tsx:458`, `components/main/MainWrapper.tsx:780`, `components/main/MainWrapper.tsx:816`, `components/about/AboutWrapper.tsx:545`, `components/about/AboutWrapper.tsx:665`, and `components/EffectBox.tsx:186`.
   - Current impact: long Korean text and narrow devices can overflow or become unreadable because type and layout scale directly with viewport width.
   - Recommended action: replace critical text sizes with `clamp(min, preferred, max)` and use max-width/line-height constraints for content blocks.

5. Z-index values are scattered and undocumented.
   - Evidence: navigation uses `150`, mobile navigation uses `190` and `200`, effect overlay uses `8000`, gallery uses `100`, masks/arrows use `10`, `20`, `30`, and `40`.
   - Current impact: future overlays, modals, and mobile menus can accidentally layer under or above transition effects.
   - Recommended action: create a z-index scale (`base`, `gallery`, `nav`, `mobileNav`, `overlay`) and use names instead of ad hoc numbers.

6. `GlobalStyles` globally sets `flex-shrink: 0` on every element.
   - Evidence: `styles/GlobalStyles.ts:10` through `styles/GlobalStyles.ts:14`.
   - Current impact: text and controls are less able to shrink in constrained layouts, increasing overflow risk on mobile.
   - Recommended action: remove global `flex-shrink: 0` and apply it only to fixed-format components that need it.

7. Global responsive helpers `.tablet` and `.pc` rely on `!important`.
   - Evidence: `styles/GlobalStyles.ts:70` through `styles/GlobalStyles.ts:80`.
   - Current impact: component-level styles become harder to override and reason about.
   - Recommended action: prefer explicit responsive rendering in components or non-important utility classes with clear naming.

8. Typo-prone names are already present in style/component identifiers.
   - Evidence: `components/about/AboutWrapper.tsx:735` defines `SwipeWrppaer`, and `components/Footer.tsx:13` uses `border-gorup`.
   - Current impact: future searches and refactors are harder, and typos can spread through CSS selectors.
   - Recommended action: rename to `SwipeWrapper` and `border-group` in a focused cleanup commit.

9. Fixed-position left rails are duplicated in About and Work.
   - Evidence: `components/about/AboutWrapper.tsx:906` and `components/works/WorkWrapper.tsx:159`.
   - Current impact: fixed sidebar behavior, padding, and email typography can diverge across pages.
   - Recommended action: extract a `FixedLeftRail` component that receives title/email/body content.

10. Mobile navigation and page content both reserve a hard-coded 40px left offset.
    - Evidence: `components/NaviBox.tsx:86`, `components/RightWrapper.tsx:18`, and multiple mobile content wrappers in `components/main/MainWrapper.tsx`.
    - Current impact: any change to the mobile rail/menu affordance requires synchronized edits across nav and content.
    - Recommended action: define a single mobile shell/gutter layout, preferably via CSS variable on `:root` or a shared layout wrapper.

### Verification

- Searched styled/layout patterns with `rg -n "styled\\.|const Section|const MainWrapper|const AboutLeft|width: calc\\(|height: [0-9.]+vw|font-size: [0-9.]+vw|margin-left: 40px|padding-left: 40px|position: fixed|z-index|border-bottom: 4px solid|border-right: 4px solid|breakpoints\\.md|breakpoints\\.sm" components app styles lib config`.
- Inspected `components/LeftWrapper.tsx`, `components/RightWrapper.tsx`, and `styles/GlobalStyles.ts` directly.
- `node ./node_modules/typescript/bin/tsc --noEmit`: passed.

### Next Review Angle

- Review data/type safety: `any` refs, image prop types, untyped work arrays, duplicated domain data, and opportunities for shared TypeScript models.
- Consider a layout-token cleanup before larger redesign work to reduce future edit risk.

## 2026-05-25 11:00 KST - Review 10

### Scope

- TypeScript type safety
- `any` usage and DOM ref typing
- Image prop and work-item data modeling
- Duplicated domain arrays across pages
- Strictness gaps that are hidden by current patterns

### Findings

1. `GalleryBox` uses `any` for image props in both public props and styled props.
   - Evidence: `components/GalleryBox.tsx:7`, `components/GalleryBox.tsx:8`, `components/GalleryBox.tsx:9`, `components/GalleryBox.tsx:160`, `components/GalleryBox.tsx:161`, and `components/GalleryBox.tsx:162`.
   - Current impact: callers can pass non-string image values and still satisfy TypeScript, even though the values are interpolated into CSS `url(...)`.
   - Recommended action: type these props as `string`, or define `type GalleryImageSet = { imgFirst: string; imgSecond: string; imgThird: string }`.

2. Ref types use `any` across interactive pages.
   - Evidence: `components/about/AboutWrapper.tsx:62` through `components/about/AboutWrapper.tsx:66`, `components/works/WorkWrapper.tsx:40` through `components/works/WorkWrapper.tsx:41`, and `components/EffectBox.tsx:17`.
   - Current impact: TypeScript cannot catch invalid `.style`, `.offsetHeight`, or `.current` usage.
   - Recommended action: use concrete refs such as `useRef<HTMLDivElement | null>(null)` and add null guards before style/layout reads.

3. Work page declares a `memberType` and `clientArrayData` that are not used for Work rendering.
   - Evidence: `components/works/WorkWrapper.tsx:15` through `components/works/WorkWrapper.tsx:31`.
   - Current impact: stale copied types/data make it harder to see the actual Work model.
   - Recommended action: remove unused copied declarations and introduce a real `WorkItem` type.

4. `workArray` is inferred from a local anonymous array and lacks stable identity fields.
   - Evidence: `components/works/WorkWrapper.tsx:64` through `components/works/WorkWrapper.tsx:80`.
   - Current impact: there is no enforced `id`, `href`, or image tuple length; key usage falls back to duplicated `text`.
   - Recommended action: define `type WorkItem = { id: string; title: string; href: string; images: readonly [string, string, string] }`.

5. About page uses `memberType`, but the shape is too generic for portfolio work.
   - Evidence: `components/about/AboutWrapper.tsx:13` through `components/about/AboutWrapper.tsx:17`.
   - Current impact: `user_idx`, `name`, and `job` do not encode project-specific proof such as role, stack, validation method, or result.
   - Recommended action: replace `memberType` with a domain type such as `ProjectSummary` or `CaseStudySummary`.

6. Naming does not follow TypeScript conventions.
   - Evidence: `type memberType` and `type CommonStoreType`.
   - Current impact: lowercase type names blend into value identifiers and reduce readability.
   - Recommended action: rename to `Member`, `ProjectSummary`, or `CommonStoreState` depending on intent.

7. `clientArrayData` is duplicated between About and Work even though Work does not use it.
   - Evidence: `components/about/AboutWrapper.tsx:19` and `components/works/WorkWrapper.tsx:21`.
   - Current impact: copied page scaffolding increases stale data and review noise.
   - Recommended action: keep page-specific data close to the page only when used; shared data should live in a typed config module.

8. State is used for immutable data.
   - Evidence: `components/about/AboutWrapper.tsx:61` stores `clientArrayData` with `useState` but never updates it.
   - Current impact: it suggests mutability where there is none and adds unnecessary React state.
   - Recommended action: use `clientArrayData` directly or memoize only if a computed transformation is expensive.

9. `tsconfig.json` allows JavaScript files while the codebase is effectively TypeScript.
   - Evidence: `tsconfig.json` has `"allowJs": true`.
   - Current impact: stray JavaScript files can enter the project without TypeScript checking expectations matching TS files.
   - Recommended action: set `allowJs` to `false` unless there is a concrete migration reason.

10. `skipLibCheck` hides dependency type issues, including older library compatibility.
    - Evidence: `tsconfig.json` has `"skipLibCheck": true`; dependency review already found `react-textfit` peer compatibility issues.
    - Current impact: type checking is faster but can mask stale dependency type problems.
    - Recommended action: keep it if build speed matters, but track it as a conscious tradeoff and prioritize replacing outdated packages.

### Verification

- Searched type patterns with `rg -n "\\bany\\b|type .*Type|type Props|useRef<|useState<|const .*Data|workArray|memberArrayData|clientArrayData|imgFirst|imgSecond|imgThird|ReactNode|Record<|interface" app components lib stores config styles`.
- Inspected `tsconfig.json`, `components/GalleryBox.tsx`, `components/about/AboutWrapper.tsx`, and `components/works/WorkWrapper.tsx` directly.
- `node ./node_modules/typescript/bin/tsc --noEmit`: passed.

### Next Review Angle

- Review dependency health and library choices: `react-textfit`, `react-use`, `styled`, Lenis package duplication, and unused packages.
- Consider creating shared `types/portfolio.ts` or `config/works.ts` before more page content changes.
