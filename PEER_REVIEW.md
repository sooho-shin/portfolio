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


## 2026-05-25 12:00 KST - Review 11

### Scope

- Dependency health and package surface area
- React 18 compatibility risk
- Declared packages that are unused or duplicated
- Libraries that can be replaced by simpler local code
- Package-manager reproducibility impact

### Findings

1. `react-textfit@1.1.1` is the highest-risk dependency in the current UI stack.
   - Evidence: `package.json:19`, `components/main/MainWrapper.tsx:6`, `components/about/AboutWrapper.tsx:6`, and `components/works/WorkWrapper.tsx:6`.
   - Current impact: the package is old and its peer dependency does not match React 18, which already causes `npm ci --dry-run` to fail in this repository.
   - Recommended action: replace `Textfit` usage with CSS `clamp()`, container-aware layout, or a maintained fit-text package. Remove `@types/react-textfit` at the same time.

2. Text sizing depends on JavaScript where CSS would be more predictable.
   - Evidence: the main, about, and work pages import `Textfit` just to size display headings.
   - Current impact: large hero copy depends on client-side measurement, increasing hydration/layout timing risk.
   - Recommended action: define responsive typography tokens in CSS and reserve JavaScript measurement only for cases that cannot be expressed in layout rules.

3. Lenis has a stale package declaration.
   - Evidence: `package.json:13` declares `@studio-freight/react-lenis`, but the source import is `lib/smoothScrolling.tsx:4` from `lenis/react`.
   - Current impact: two Lenis-era package names are represented in the dependency graph, making it unclear which wrapper is canonical.
   - Recommended action: standardize on the current `lenis` package and remove `@studio-freight/react-lenis` if it is not required by runtime resolution.

4. `useLenis` is imported but unused.
   - Evidence: `lib/smoothScrolling.tsx:4`.
   - Current impact: this is small, but it signals that smooth-scroll integration was copied from a broader example than the project needs.
   - Recommended action: remove the unused import, then keep the wrapper limited to the single behavior currently required.

5. `styled` appears to be an unused dependency.
   - Evidence: `package.json:22` declares `styled`, while source imports consistently use `styled-components`; no `from "styled"` import was found.
   - Current impact: it adds install surface and confusion next to `styled-components`, whose name is similar.
   - Recommended action: remove `styled` unless there is a hidden runtime requirement.

6. Zustand is present for a store that currently does not drive visible behavior.
   - Evidence: `stores/useCommon.ts:1`, `stores/useCommon.ts:8`, and `components/NaviBox.tsx:23`.
   - Current impact: `NaviBox` reads `setRoute`, but no route state consumer was found and the setter is not used for navigation state.
   - Recommended action: either wire the store into real shared navigation behavior or remove Zustand until cross-component state is needed.

7. `react-use` is broad for the current hook needs.
   - Evidence: `components/EffectBox.tsx:4`, `components/NaviBox.tsx:6`, `components/about/AboutWrapper.tsx:7`, and `components/works/WorkWrapper.tsx:7`.
   - Current impact: the project mainly uses window size and scroll hooks, which can be implemented as small local hooks or replaced with CSS/intersection observers in some areas.
   - Recommended action: audit whether scroll/size values are still needed after typography and layout cleanup; then consider a local `useWindowSize`/`useScrollY` pair.

8. Some `react-use` hook values are destructured more broadly than the UI needs.
   - Evidence: About and Work read both `scrollX` and `scrollY`, and several components read full window dimensions.
   - Current impact: broader subscriptions make components re-render for values they do not clearly use.
   - Recommended action: keep only consumed values and prefer derived booleans such as `isMobile` when full dimensions are not needed.

9. `classnames` is used for a single component.
   - Evidence: `package.json:14` and `components/NaviBox.tsx:10`.
   - Current impact: the package is stable and low risk, but the dependency exists for one class composition site.
   - Recommended action: keep it only if class composition is expected to grow; otherwise replace the single call with a small local expression during navigation cleanup.

10. React versions are declared with broad ranges while dependency compatibility is already fragile.
    - Evidence: `package.json:17` and `package.json:18` use `^18`, while `next` is pinned to `14.2.3`.
    - Current impact: installs can drift within React 18 even though older peer dependencies are already sensitive to the exact React major/version range.
    - Recommended action: pin `react` and `react-dom` to exact versions after the package manager is settled, then update deliberately with a lockfile diff.

11. Dependency cleanup should happen before larger UI refactors.
    - Evidence: the current homepage relies on `Textfit`, Lenis, `react-use`, styled-components, and page-level client components together.
    - Current impact: redesign work can accidentally preserve stale library choices because the page still compiles.
    - Recommended action: first remove unused packages and replace `react-textfit`; then simplify component boundaries with fewer client-only dependencies.

### Verification

- Searched actual dependency usage with `rg -n -F` for `@studio-freight/react-lenis`, `lenis/react`, `react-textfit`, `from "styled"`, `classnames`, `zustand`, `useCommon`, `react-use`, `useWindowSize`, and `useWindowScroll`.
- Confirmed `@studio-freight/react-lenis` and `styled` are declared without matching source imports.
- Confirmed `react-textfit` is used in Main, About, and Work display sections.
- Confirmed Zustand is only imported by `stores/useCommon.ts` and `components/NaviBox.tsx`.
- Confirmed `react-use` usage is limited to window size and scroll hooks.

### Next Review Angle

- Review runtime motion and scroll behavior: Lenis provider placement, direct DOM mutation, resize listeners, scroll-triggered rendering cost, and reduced-motion handling.
- Consider a dependency-removal branch that starts with `react-textfit`, `styled`, and `@studio-freight/react-lenis`.


## 2026-05-25 13:00 KST - Review 12

### Scope

- Runtime motion and scroll behavior
- Lenis provider placement and options
- Direct DOM mutation during scroll/resize
- Animation accessibility and reduced-motion support
- Re-render and layout-read costs caused by viewport hooks

### Findings

1. Lenis is mounted globally with very heavy smoothing settings.
   - Evidence: `lib/smoothScrolling.tsx:7` uses `<ReactLenis root options={{ lerp: 0.1, duration: 10 }}>`.
   - Current impact: a `duration` of `10` can make scroll feel detached from input, especially on trackpads and mobile browsers.
   - Recommended action: start with Lenis defaults or a much smaller duration, then validate actual feel on desktop wheel, trackpad, and mobile touch.

2. Smooth scrolling has two competing implementations.
   - Evidence: Lenis is mounted at root in `lib/smoothScrolling.tsx:7`, while `components/Footer.tsx:74` calls `window.scrollTo({ top: 0, behavior: "smooth" })`.
   - Current impact: browser smooth scroll and Lenis-managed scroll can disagree about timing, easing, and cancellation.
   - Recommended action: route top-scroll through the Lenis instance if Lenis remains, or remove Lenis and rely on native scrolling consistently.

3. `useLenis` is imported but not used, which also prevents coordinated imperative scroll commands.
   - Evidence: `lib/smoothScrolling.tsx:4` imports `useLenis` with `ReactLenis`.
   - Current impact: the app pays for a global Lenis provider but does not expose the instance where imperative scroll behavior is needed.
   - Recommended action: either remove the unused import and keep scrolling passive, or create a small scroll helper that owns Lenis-based commands.

4. About and Work read layout and write inline transforms on every scroll update.
   - Evidence: `components/about/AboutWrapper.tsx:72` through `components/about/AboutWrapper.tsx:80`, and `components/works/WorkWrapper.tsx:47` through `components/works/WorkWrapper.tsx:55`.
   - Current impact: `offsetHeight` reads mixed with `style.transform` writes can create layout thrash as scroll frequency increases.
   - Recommended action: cache measured section height with `ResizeObserver`, then update transform from derived state or CSS variables in a throttled `requestAnimationFrame` loop.

5. Null guards check the ref object rather than the DOM node.
   - Evidence: `if (infoText)` appears before `mainContainer.current.offsetHeight` and `infoText.current.style.transform` in About and Work.
   - Current impact: the guard is always true after `useRef`, so a missing `.current` would still throw at runtime.
   - Recommended action: guard `mainContainer.current && infoText.current` before reading or writing DOM values.

6. Scroll hooks subscribe to more values than the code uses.
   - Evidence: `components/about/AboutWrapper.tsx:67` and `components/works/WorkWrapper.tsx:42` destructure `scrollX`, but only `scrollY` drives behavior.
   - Current impact: horizontal scroll changes can still cause component updates even though they are irrelevant.
   - Recommended action: only subscribe to or retain `scrollY`, ideally through a local hook dedicated to the sticky-left transform.

7. Window-size hooks are used as broad invalidation signals.
   - Evidence: About and Work depend on `[scrollY, windowHeight, windowWidth]`, and `EffectBox` reads both width and height while only width is used.
   - Current impact: resize changes can re-run DOM mutation effects more often than needed.
   - Recommended action: remove unused `windowHeight` in `EffectBox`, and separate measurement invalidation from scroll updates in About/Work.

8. The app has many infinite or delayed animations without a reduced-motion fallback.
   - Evidence: `components/EffectBox.tsx:191`, `components/EffectBox.tsx:203`, `components/EffectBox.tsx:205`, `components/EffectBox.tsx:207`, `components/GalleryBox.tsx:277`, `components/GalleryBox.tsx:287`, `components/GalleryBox.tsx:301`, `components/GalleryBox.tsx:313`, `components/main/MainWrapper.tsx:580`, `components/main/MainWrapper.tsx:590`, `components/main/MainWrapper.tsx:604`, and `components/main/MainWrapper.tsx:615`.
   - Current impact: users who prefer reduced motion still get marquee loops and page-cover animations.
   - Recommended action: add a global `@media (prefers-reduced-motion: reduce)` rule that disables marquee animation and shortens transitions, then selectively re-enable essential state changes.

9. `EffectBox` uses a timeout without cleanup.
   - Evidence: `components/EffectBox.tsx:28` through `components/EffectBox.tsx:32`.
   - Current impact: if the component unmounts before the timeout fires, the callback still runs and touches a stale ref check.
   - Recommended action: store the timeout id and clear it in the effect cleanup.

10. `EffectBox` stores props in state without later updates.
    - Evidence: `components/EffectBox.tsx:14` and `components/EffectBox.tsx:15` initialize state from `text` and `rollingText`, but no setter is used after initialization.
    - Current impact: a route/title prop change would not necessarily refresh the displayed transition text as expected, and the state adds render noise.
    - Recommended action: render from props directly, or add an explicit effect if route-transition copy must be latched.

11. Motion code is spread across component internals instead of having one policy layer.
    - Evidence: Lenis config is in `lib/smoothScrolling.tsx`, top-scroll behavior is in `Footer`, page scroll transforms are in About/Work, and marquee animations are inside several styled components.
    - Current impact: changing motion behavior requires checking multiple unrelated files and makes accessibility fixes easy to miss.
    - Recommended action: create a small motion policy: global reduced-motion CSS, one scroll helper, and page-specific animation tokens shared by marquee components.

### Verification

- Searched runtime motion patterns with `rg -n "Lenis|ReactLenis|useLenis|useWindowScroll|useWindowSize|addEventListener|removeEventListener|requestAnimationFrame|scroll|resize|style\\.|offsetHeight|getBoundingClientRect|matchMedia|prefers-reduced-motion" app components lib stores styles config`.
- Inspected `lib/smoothScrolling.tsx`, `components/EffectBox.tsx`, `components/about/AboutWrapper.tsx`, `components/works/WorkWrapper.tsx`, `components/NaviBox.tsx`, and `components/Footer.tsx`.
- Confirmed no `prefers-reduced-motion` rule exists with `rg -n -F "prefers-reduced-motion" app components lib stores styles config`.
- Confirmed animation-heavy files with `rg -n -F "animation:" components styles app`.

### Next Review Angle

- Review content/data integrity after the copy rewrite: mojibake text, stale fictional client lists, broken social links, duplicated About/Work scaffolding, and portfolio proof structure.
- Consider fixing motion policy before adding more visual effects, because current animation behavior is hard to govern centrally.

## 2026-05-25 14:00 KST - Review 13

### Scope

- Content and data integrity after the AI-developer copy rewrite
- Portfolio proof structure
- Placeholder project/client data
- External links and contact affordances
- Duplication between About and Work page scaffolding

### Findings

1. The main and footer now present an AI validation position, but About still tells an older frontend-growth story.
   - Evidence: `components/main/MainWrapper.tsx:27`, `components/main/MainWrapper.tsx:64`, and `components/Footer.tsx:33` focus on AI validation; `components/about/AboutWrapper.tsx:133` through `components/about/AboutWrapper.tsx:140` still describe a frontend-focused developer path.
   - Current impact: the portfolio's first impression and deeper profile do not reinforce the same professional positioning.
   - Recommended action: rewrite About around AI reliability work: evaluation design, RAG quality checks, agent failure analysis, automation, and product-level validation.

2. Work data does not prove the AI-developer claim.
   - Evidence: `components/works/WorkWrapper.tsx:64` through `components/works/WorkWrapper.tsx:80` lists repeated `yummygame` / `yummy yummy` items with the same images.
   - Current impact: the Work page looks like sample data instead of evidence of AI engineering capability.
   - Recommended action: replace `workArray` with case-study data fields such as `problem`, `aiRole`, `validationMethod`, `stack`, `result`, and `artifactUrl`.

3. Work item keys are not stable because duplicated titles are used as keys.
   - Evidence: `components/works/WorkWrapper.tsx:107` uses `key={c.text}`, while three entries use `text: "yummy yummy"`.
   - Current impact: React can misidentify repeated Work items during updates.
   - Recommended action: add a unique `id` to each work item and use `key={c.id}`.

4. Work detail links currently route every card to the homepage.
   - Evidence: `components/works/WorkWrapper.tsx:107` uses `<Link href={"/"} key={c.text}>`.
   - Current impact: clicking a portfolio item does not lead to any proof, demo, source, or case-study detail.
   - Recommended action: add real detail routes or outbound artifact links for each work item.

5. About contains a fictional or aspirational client list that can be misread as real experience.
   - Evidence: `components/about/AboutWrapper.tsx:19` through `components/about/AboutWrapper.tsx:32` includes Netflix, Apple, Samsung, Nike, Google, Gucci, Tesla, and others.
   - Current impact: even though the heading says "Clients i wish i had", the list still weakens trust in a validation-oriented portfolio.
   - Recommended action: replace it with actual technologies, evaluation artifacts, project domains, or remove the section.

6. The same client-list scaffold is duplicated in Work even though Work does not render it.
   - Evidence: `components/works/WorkWrapper.tsx:21` through `components/works/WorkWrapper.tsx:34`.
   - Current impact: dead copied content makes it harder to know which data is real and which is leftover template material.
   - Recommended action: delete unused Work page scaffold data during the next cleanup.

7. Contact data mixes real email with fake address content.
   - Evidence: `components/about/AboutWrapper.tsx:105` through `components/about/AboutWrapper.tsx:113`, and `components/works/WorkWrapper.tsx:89` through `components/works/WorkWrapper.tsx:97`.
   - Current impact: a portfolio that emphasizes verification should not show placeholder address data such as `Blumenkopf kein Studio` and `Burgring 123`.
   - Recommended action: keep the email and replace the address block with concrete availability, GitHub, LinkedIn, or project inquiry context.

8. The main email link is not actionable.
   - Evidence: `components/main/MainWrapper.tsx:38` uses `<a href="#">soojoon92@gmail.com</a>`.
   - Current impact: users cannot click to contact from the main entry point.
   - Recommended action: change it to `mailto:soojoon92@gmail.com` or a real contact route.

9. External links open new tabs without `rel="noopener noreferrer"`.
   - Evidence: `components/Footer.tsx:57`, `components/Footer.tsx:63`, `components/Footer.tsx:67`, `components/about/AboutWrapper.tsx:359`, and `components/about/AboutWrapper.tsx:394`.
   - Current impact: new-tab links keep an unnecessary `window.opener` relationship.
   - Recommended action: add `rel="noopener noreferrer"` to every `target="_blank"` anchor.

10. Some social links appear mismatched with their icon or label.
    - Evidence: `components/Footer.tsx:63` links the Facebook icon to `https://www.naver.com/`; `components/about/AboutWrapper.tsx:325` renders a Twitter row without an `href`.
    - Current impact: users may click a social/contact affordance and land somewhere unrelated or nowhere at all.
    - Recommended action: replace placeholder social links with real profiles, or remove unavailable channels.

11. About project data is close to real case-study material but lacks validation outcomes.
    - Evidence: `components/about/AboutWrapper.tsx:38` through `components/about/AboutWrapper.tsx:58` lists `sooho`, `amazoncar`, `catcatch`, and `yummygame` with short job descriptions.
    - Current impact: these entries name projects, but they do not explain what was built, how correctness was checked, or what result was achieved.
    - Recommended action: evolve this array into proof cards with measurable validation details rather than generic titles.

12. Content is split across component files instead of a typed content source.
    - Evidence: main copy, About biography, footer copy, Work data, contact blocks, and social links all live directly inside component files.
    - Current impact: copy edits are hard to review for consistency and can drift between pages.
    - Recommended action: move portfolio content into typed config files such as `config/profile.ts`, `config/projects.ts`, and `config/socialLinks.ts`.

### Verification

- Searched placeholder and portfolio-content strings with `rg -n` for client names, contact labels, social labels, project names, and email addresses across `app`, `components`, `lib`, `stores`, `styles`, and `config`.
- Checked link affordances with `Select-String` for `target="_blank"`, `rel="noopener`, `href="https`, and `href="#"`.
- Verified Korean content is UTF-8 text by reading `components/main/MainWrapper.tsx`, `components/about/AboutWrapper.tsx`, and `components/Footer.tsx` with Python and printing Unicode escapes.
- Confirmed Work image assets exist under `public/images/work/yummygame`, while the rendered Work data repeats the same asset set for multiple cards.

### Next Review Angle

- Review SEO and metadata: page titles, descriptions, Open Graph data, sitemap/robots, semantic headings, and whether the AI-developer positioning appears in crawlable metadata.
- Consider a content-source refactor before more copy changes so profile, work, footer, and social data stay consistent.

## 2026-05-25 15:00 KST - Review 14

### Scope

- SEO metadata and crawlable positioning
- Open Graph / Twitter card readiness
- Robots and sitemap coverage
- Semantic document structure
- Image discoverability and accessible alternatives

### Findings

1. Only the root layout exports metadata.
   - Evidence: `app/layout.tsx:7` exports `metadata`; `app/page.tsx`, `app/about/page.tsx`, and `app/work/page.tsx` do not export page-specific metadata.
   - Current impact: Home, About, and Work share the same generic title/description even though they serve different search intents.
   - Recommended action: add route-level metadata for `/`, `/about`, and `/work`, with titles/descriptions that reinforce the AI validation portfolio angle.

2. The global metadata is a good start but too thin for sharing.
   - Evidence: `app/layout.tsx:8` defines `title`, and `app/layout.tsx:9` defines `description`; no `openGraph`, `twitter`, `alternates`, `metadataBase`, `creator`, or `authors` entries were found.
   - Current impact: shared links may show generic or missing previews, and canonical URL generation is not explicit.
   - Recommended action: add `metadataBase`, canonical alternates, author/creator fields, Open Graph, and Twitter card metadata.

3. The AI-developer positioning is not represented in Open Graph or Twitter card text.
   - Evidence: searching `openGraph` and `twitter` across `app`, `public`, and `next.config.mjs` returned no matches.
   - Current impact: the strongest positioning exists in rendered copy, but social previews do not carry it.
   - Recommended action: define preview copy such as "검증하는 AI 개발자" and "Eval / RAG / Agent 품질을 기준과 자동화로 증명합니다" in metadata.

4. There is no sitemap route.
   - Evidence: no `app/sitemap.ts` file was found.
   - Current impact: search engines must discover `/about` and `/work` only through links and crawl heuristics.
   - Recommended action: add `app/sitemap.ts` with `/`, `/about`, and `/work`, including `lastModified` and priorities.

5. There is no robots route.
   - Evidence: no `app/robots.ts` or `public/robots.txt` file was found.
   - Current impact: crawl policy is implicit and cannot advertise the sitemap URL.
   - Recommended action: add `app/robots.ts` with allowed crawling and a sitemap reference once the canonical site URL is known.

6. The app lacks a dedicated social preview image.
   - Evidence: no `opengraph-image.*`, `twitter-image.*`, or obvious `og`/`social` preview asset was found; only regular images and icons exist under `public`.
   - Current impact: previews may use an arbitrary image or no strong visual at all.
   - Recommended action: create an Open Graph image that directly states the AI validation positioning and includes the portfolio name/email.

7. Primary page headings are not semantic headings.
   - Evidence: `Select-String` found no `<h1>`, `<h2>`, or `<h3>` usage in `MainWrapper`, `AboutWrapper`, `WorkWrapper`, or `GalleryBox`; titles are rendered as `<p className="title">`, `<div className="title">`, and `Textfit` content.
   - Current impact: crawlers and assistive technology cannot infer the main outline from the visual hierarchy.
   - Recommended action: render the first major page title as `h1`, section labels as `h2`, and card titles as `h3` while preserving the existing styled-components visuals.

8. The layout does not expose a real `<main>` landmark.
   - Evidence: page wrappers return styled `div` components such as `MainWrapper` and `Section`; no `<main>` usage was found.
   - Current impact: keyboard and screen-reader users have weaker page landmarks, and search engines receive less semantic structure.
   - Recommended action: change top-level page wrappers to `main` or wrap page content in a semantic `<main>`.

9. Core visual content is mostly CSS background images.
   - Evidence: `components/main/MainWrapper.tsx:342`, `components/main/MainWrapper.tsx:538`, `components/main/MainWrapper.tsx:545`, `components/main/MainWrapper.tsx:553`, `components/about/AboutWrapper.tsx:263`, and `components/GalleryBox.tsx:229` through `components/GalleryBox.tsx:249`.
   - Current impact: important portfolio images do not have alt text, intrinsic sizing, or easy indexing as content images.
   - Recommended action: use `next/image` for meaningful images and keep CSS backgrounds only for decorative treatment.

10. Social icon alt text is generic and not destination-specific.
    - Evidence: `components/Footer.tsx:60`, `components/Footer.tsx:64`, and `components/Footer.tsx:68` use `alt="icoSoundcloud"`, `alt="icoFacebook"`, and `alt="icoInsta"`.
    - Current impact: screen readers hear implementation-style labels instead of the link purpose.
    - Recommended action: either use empty alt text when the anchor has an accessible label, or set descriptive labels such as "SoundCloud profile" and "Instagram profile".

11. Metadata and visible copy can drift because they live in separate places.
    - Evidence: metadata lives in `app/layout.tsx`, while main/footer/About/Work copy lives directly inside component files.
    - Current impact: future copy changes can update the visible UI but leave search snippets stale.
    - Recommended action: centralize profile positioning strings in a typed content config and import them into both metadata and rendered components.

12. The current `next.config.mjs` is minimal and does not document deployment URL assumptions.
    - Evidence: `next.config.mjs` only enables the styled-components compiler.
    - Current impact: sitemap, canonical URLs, and metadataBase will require a site URL decision that is not captured anywhere.
    - Recommended action: introduce a `NEXT_PUBLIC_SITE_URL` convention or a small `config/site.ts` module used by metadata, sitemap, and robots.

### Verification

- Searched metadata and SEO-related symbols with `rg -n "metadata|Metadata|title|description|openGraph|twitter|robots|sitemap|viewport|manifest|canonical|alternates|keywords|icons|themeColor" app components config public next.config.* package.json`.
- Inspected `app/layout.tsx`, `app/page.tsx`, `app/about/page.tsx`, `app/work/page.tsx`, and `next.config.mjs` directly.
- Confirmed route-level metadata only exists in `app/layout.tsx` with `rg -n -F "export const metadata" app`.
- Checked semantic headings and landmarks with `Select-String` for `<h1`, `<h2`, `<h3`, `<main`, `<section`, `<article`, and title-class patterns.
- Checked SEO preview assets by searching `app` and `public` for robots, sitemap, manifest, Open Graph, and Twitter image files.

### Next Review Angle

- Review accessibility more deeply: focus order, button labels, keyboard navigation, link semantics, color contrast, reduced motion, and screen-reader names.
- Consider implementing metadata/sitemap/robots as a low-risk improvement after the content source is consolidated.

## 2026-05-25 16:00 KST - Review 15

### Scope

- Keyboard navigation and focus visibility
- Button and link semantics
- Screen-reader accessible names
- Image alternatives
- Motion and hover-only interaction accessibility

### Findings

1. There is no visible focus style policy.
   - Evidence: no `focus-visible` styles were found, and `styles/GlobalStyles.ts:65` removes `outline` from inputs and textareas.
   - Current impact: keyboard users may not be able to track their current position through navigation, cards, links, and form-like controls.
   - Recommended action: add a global `:focus-visible` rule with a high-contrast outline and avoid suppressing native outlines without a replacement.

2. Mobile menu buttons do not expose accessible names.
   - Evidence: `components/NaviBox.tsx:34` renders the hamburger button with only two empty `div` bars; `components/NaviBox.tsx:48` renders the dim close button with no text or `aria-label`.
   - Current impact: screen readers announce generic buttons without purpose.
   - Recommended action: add `aria-label="Open navigation"` and `aria-label="Close navigation"` or equivalent localized labels.

3. Navigation uses buttons for route changes instead of links.
   - Evidence: `components/NaviBox.tsx:55`, `components/NaviBox.tsx:61`, and `components/NaviBox.tsx:69` call `router.push` from `<button>` elements.
   - Current impact: users cannot open routes in a new tab, copy link targets, or get native link semantics.
   - Recommended action: use Next `Link` for Home, Work, and About; keep buttons for actions that mutate UI state.

4. The footer "top" control is a clickable `div`.
   - Evidence: `components/Footer.tsx:73` attaches `onClick` to a `<div className="top">`.
   - Current impact: it is not keyboard-focusable by default and has no button semantics or accessible name.
   - Recommended action: render it as `<button type="button" aria-label="Scroll to top">`.

5. Carousel arrow buttons in About are icon-only without labels.
   - Evidence: `components/about/AboutWrapper.tsx:154` and `components/about/AboutWrapper.tsx:196` render buttons whose visible content is decorative SVG/circle markup.
   - Current impact: assistive technology cannot distinguish previous/next project controls.
   - Recommended action: add `aria-label="Previous project"` and `aria-label="Next project"`, and hide decorative SVGs from screen readers.

6. The Twitter row is an anchor without a destination.
   - Evidence: `components/about/AboutWrapper.tsx:325` renders `<a>` with no `href`.
   - Current impact: the element looks interactive but is not a real link, and keyboard/link semantics become inconsistent.
   - Recommended action: add a real `href` or replace the row with non-interactive text until the destination exists.

7. The main email affordance is a placeholder link.
   - Evidence: `components/main/MainWrapper.tsx:38` renders `<a href="#">soojoon92@gmail.com</a>`.
   - Current impact: keyboard and screen-reader users reach a link that does not perform the expected contact action.
   - Recommended action: change it to `mailto:soojoon92@gmail.com` with descriptive link text.

8. External links still lack new-tab safety attributes.
   - Evidence: `components/Footer.tsx:58`, `components/Footer.tsx:63`, `components/Footer.tsx:67`, `components/about/AboutWrapper.tsx:359`, and `components/about/AboutWrapper.tsx:395`.
   - Current impact: these links open new tabs without `rel="noopener noreferrer"`, and screen readers do not get any indication that a new tab opens.
   - Recommended action: add `rel="noopener noreferrer"` and consider visible or `aria-label` text that includes "opens in a new tab".

9. Social icon image alt text is implementation-oriented.
   - Evidence: `components/Footer.tsx:60`, `components/Footer.tsx:64`, and `components/Footer.tsx:68` use `alt="icoSoundcloud"`, `alt="icoFacebook"`, and `alt="icoInsta"`.
   - Current impact: the accessible name describes the icon file style rather than the link destination.
   - Recommended action: use a descriptive anchor label and empty decorative image alt, or set image alt text such as "SoundCloud" and "Instagram".

10. Hover-only gallery behavior has no keyboard equivalent.
    - Evidence: `components/main/MainWrapper.tsx:219` toggles gallery hover state only with `onMouseEnter`; `components/GalleryBox.tsx` reveals loop labels and image states under `&:hover`.
    - Current impact: keyboard and touch users cannot access the same interaction states as mouse users.
    - Recommended action: add `onFocus`/`onBlur` behavior or CSS `:focus-within` alongside `:hover`.

11. Motion accessibility is still missing.
    - Evidence: no `prefers-reduced-motion` rule was found, while earlier review confirmed multiple infinite marquee animations in `EffectBox`, `GalleryBox`, and `MainWrapper`.
    - Current impact: users who request reduced motion still receive continuous scrolling text and page-cover animations.
    - Recommended action: add a global reduced-motion policy that disables infinite loops and shortens transitions.

12. The page still lacks semantic landmarks and heading structure.
    - Evidence: no `<main>` usage was found, and only a commented `<h1>` exists in `components/ListDetail.tsx:11`.
    - Current impact: screen-reader users do not get a reliable page outline or main-content landmark.
    - Recommended action: introduce a real `<main>` wrapper per page and convert visual titles to `h1`/`h2`/`h3` where appropriate.

13. Decorative SVGs are exposed by default.
    - Evidence: navigation arrows, footer arrows, blackhole SVGs, and slider masks are rendered inline without `aria-hidden`.
    - Current impact: screen readers may encounter path-heavy graphics that do not add meaning.
    - Recommended action: mark decorative SVGs with `aria-hidden="true"` and `focusable="false"` unless they need an accessible title.

### Verification

- Checked current worktree status before review with `git status --short --branch`.
- Searched accessibility patterns with `rg` and `Select-String` for buttons, anchors, `aria-*`, roles, `tabIndex`, keyboard handlers, image alt text, new-tab links, focus styles, reduced-motion rules, and pointer-only interactions.
- Inspected `styles/GlobalStyles.ts`, `components/NaviBox.tsx`, `components/Footer.tsx`, `components/GalleryBox.tsx`, and the first interaction-heavy section of `components/main/MainWrapper.tsx`.
- Confirmed no `focus-visible`, no `aria-*`, and no `prefers-reduced-motion` pattern currently exists in app/component/style source.

### Next Review Angle

- Review build and CI reliability again with fresh eyes: package-manager consistency, lint/build memory failures, TypeScript-only checks, and which automated gates should block deployment.
- Consider fixing low-risk accessibility issues first: button labels, mailto link, `rel` attributes, and the clickable footer div.

## 2026-05-25 17:00 KST - Review 16

### Scope

- Build and CI reliability
- Package-manager consistency
- Install reproducibility
- Lint/type/build gate coverage
- Deployment script assumptions and local environment risk

### Findings

1. The repository still has two package-manager lockfiles.
   - Evidence: both `package-lock.json` and `yarn.lock` exist at the project root.
   - Current impact: contributors and CI can install different dependency trees depending on whether they use npm or Yarn.
   - Recommended action: choose one package manager, delete the other lockfile, and document the expected install command in `README.md`.

2. npm installation is not reproducible with the current dependency graph.
   - Evidence: `npm ci --dry-run` fails because `react-textfit@1.1.1` requires React `^15.0.0 || ^16.0.0`, while the project resolves React 18.
   - Current impact: any npm-based CI, hosting provider, or new contributor install will fail before tests or builds run.
   - Recommended action: replace `react-textfit` first, then regenerate the chosen lockfile from a clean install.

3. Yarn lint currently passes but only reports warnings.
   - Evidence: `corepack yarn lint` exits successfully and reports three `@next/next/no-img-element` warnings in `components/Footer.tsx:60`, `components/Footer.tsx:64`, and `components/Footer.tsx:68`.
   - Current impact: performance/accessibility warnings are visible but do not block changes.
   - Recommended action: decide which warnings should fail CI, or convert footer icons to `next/image`.

4. Production build is not stable in the current local environment.
   - Evidence: `corepack yarn build` compiles successfully, then fails during static page generation with `ENOSPC: no space left on device` and V8 `Fatal process out of memory: Zone`.
   - Current impact: the build cannot be trusted as a local release gate until disk and memory conditions are controlled.
   - Recommended action: free disk space, clear `.next/cache` when needed, and run the build again in a clean environment before release.

5. The current machine has effectively no free space on the C drive.
   - Evidence: `Get-PSDrive -Name C` first reported `Free : 0`; after removing ignored `.next` output, only about 9 MB was free.
   - Current impact: Next cache writes, build traces, package installs, and generated artifacts can fail unpredictably.
   - Recommended action: treat disk capacity as a blocker for reliable build verification, not as an application-level failure.

6. There is no project CI workflow.
   - Evidence: no root `.github/workflows` workflow was found; CI/deploy searches only produced package-internal files under `node_modules`.
   - Current impact: pushes can land without an automated install, typecheck, lint, and build gate.
   - Recommended action: add a GitHub Actions workflow that runs the chosen install command, `tsc --noEmit`, lint, and production build.

7. The scripts do not expose an explicit typecheck command.
   - Evidence: `package.json` has `dev`, `build`, `start`, `lint`, and `only-start`, but no `typecheck`.
   - Current impact: the most reliable passing gate is currently a manually invoked TypeScript binary command.
   - Recommended action: add `"typecheck": "tsc --noEmit"` and use it in CI.

8. `start` performs a build before starting the server.
   - Evidence: `package.json` defines `"start": "next build && next start"`.
   - Current impact: production process startup can fail or become slow because it recompiles on launch.
   - Recommended action: split release lifecycle into `build` and `start`, with `start` running only `next start`.

9. PM2 deployment configuration is not fully wired to dependencies.
   - Evidence: `package.json` defines `"only-start": "pm2 start ecosystem.config.js --env production"`, but `pm2` is not listed in dependencies or devDependencies.
   - Current impact: `only-start` only works on machines with a global PM2 installation.
   - Recommended action: either document the global runtime requirement or add PM2 to the deployment environment explicitly.

10. PM2 production environment values are commented out.
    - Evidence: `ecosystem.config.js` has `env_production` and port settings commented out.
    - Current impact: `--env production` does not visibly configure `NODE_ENV` or `PORT`, despite the script implying it.
    - Recommended action: either restore concrete production env settings or remove the misleading `--env production` flag.

11. Generated build artifacts can be left behind after failed builds.
    - Evidence: `.next` contained build manifests, cache, server output, static output, and trace files after the failed `yarn build`.
    - Current impact: local verification can be affected by stale cache or partial outputs if builds are retried without cleanup.
    - Recommended action: add a clean-build instruction for release verification, or ensure CI always builds from a fresh checkout.

12. TypeScript configuration still allows JavaScript files.
    - Evidence: `tsconfig.json` has `"allowJs": true`.
    - Current impact: JavaScript files can enter the project without the same type-safety expectations as existing TS/TSX source.
    - Recommended action: set `allowJs` to `false` unless a JavaScript migration path is intentional.

13. Prettier line-ending behavior is environment-sensitive.
    - Evidence: `.prettierrc` uses `"endOfLine": "auto"`, and `git diff --check` repeatedly warns that `PEER_REVIEW.md` line endings will be converted by Git.
    - Current impact: formatting diffs can vary by OS and Git settings.
    - Recommended action: use a committed `.gitattributes` and a fixed Prettier `endOfLine` policy if cross-machine consistency matters.

14. The README does not describe the actual verification workflow.
    - Evidence: root `README.md` exists but is very small, while the project relies on manually remembered commands such as `node .\node_modules\typescript\bin\tsc --noEmit`.
    - Current impact: future maintainers cannot quickly know which commands are expected to pass before pushing.
    - Recommended action: document install, dev, typecheck, lint, build, and deployment commands after the package manager is settled.

### Verification

- Checked current worktree with `git status --short --branch`.
- Inspected `package.json`, `.eslintrc.json`, `.prettierrc`, `tsconfig.json`, `next.config.mjs`, and `ecosystem.config.js`.
- Confirmed both `package-lock.json` and `yarn.lock` exist at the repository root.
- Ran `corepack yarn lint`: passed with three `@next/next/no-img-element` warnings.
- Ran `npm ci --dry-run`: failed on the `react-textfit` React peer dependency conflict.
- Ran `corepack yarn build`: failed after successful compilation due to `ENOSPC` and V8 out-of-memory during static generation.
- Checked drive capacity with `Get-PSDrive -Name C`: reported no free space before removing ignored `.next` output.

### Next Review Angle

- Review repository hygiene and generated files: `.next`, `tsconfig.tsbuildinfo`, lockfile policy, ignore rules, README accuracy, and which artifacts should never be committed.
- Consider fixing the package-manager decision before adding CI, because CI should enforce one install path rather than preserve the current split.

## 2026-05-25 18:00 KST - Review 17

### Scope

- Repository hygiene and tracked artifacts
- Ignore rules versus actually tracked files
- Editor/IDE configuration policy
- README accuracy
- Line-ending and package-manager consistency

### Findings

1. IDE project files are committed.
   - Evidence: `git ls-files .idea -s` shows `.idea/.gitignore`, `.idea/inspectionProfiles/Project_Default.xml`, `.idea/modules.xml`, `.idea/portfolio.iml`, `.idea/prettier.xml`, and `.idea/vcs.xml`.
   - Current impact: personal JetBrains workspace state can leak into repository history and create noisy diffs across machines.
   - Recommended action: decide whether IDE settings are intentionally shared; if not, remove `.idea` from git and add `.idea/` to `.gitignore`.

2. VS Code local settings are committed.
   - Evidence: `git ls-files -s .vscode` shows `.vscode/settings.json`, whose content only adds a cSpell word.
   - Current impact: editor-local preferences are mixed into application source even though they do not affect runtime.
   - Recommended action: either keep a deliberate team `.vscode/settings.json` with meaningful shared defaults, or ignore `.vscode/`.

3. `.gitignore` does not ignore editor directories.
   - Evidence: `.gitignore` covers `/node_modules`, `/.next/`, `/out/`, `/build`, env files, and TypeScript generated files, but not `.idea/` or `.vscode/`.
   - Current impact: future editor-generated files can be accidentally staged.
   - Recommended action: add `.idea/` and a scoped `.vscode/*` policy, while allowing only intentional shared files if needed.

4. The repository has both npm and Yarn lockfiles under version control.
   - Evidence: `git ls-files` includes `package-lock.json` and `yarn.lock`.
   - Current impact: dependency review, CI, and onboarding cannot know which lockfile is authoritative.
   - Recommended action: choose npm or Yarn, remove the other lockfile, and add a `packageManager` field to `package.json`.

5. README install instructions contradict the lockfile state.
   - Evidence: `README.md` suggests `npm run dev`, `yarn dev`, `pnpm dev`, and `bun dev`.
   - Current impact: it encourages four install/runtime paths even though the repository contains only npm and Yarn lockfiles and npm install currently fails.
   - Recommended action: document exactly one supported workflow, plus the known Node version.

6. README still contains mojibake in a section heading.
   - Evidence: `README.md` displays a garbled Korean heading for the reference-site section in PowerShell output.
   - Current impact: project documentation looks corrupted and undermines the care expected from a portfolio repo.
   - Recommended action: rewrite the heading in valid Korean or English and clarify whether the linked site is a design reference.

7. README does not mention the actual verification gates.
   - Evidence: it only explains how to run the dev server and lists Node `v20.12.2`.
   - Current impact: contributors do not know to run `tsc --noEmit`, lint, or build before pushing.
   - Recommended action: add a "Verification" section with `typecheck`, `lint`, and `build` commands after scripts are normalized.

8. `.editorconfig` and Prettier disagree on line-ending policy.
   - Evidence: `.editorconfig` sets `end_of_line = lf`, while `.prettierrc` sets `"endOfLine": "auto"`.
   - Current impact: formatting behavior can vary by operating system and editor.
   - Recommended action: align Prettier with `.editorconfig`, likely by setting `"endOfLine": "lf"`.

9. There is no `.gitattributes` file.
   - Evidence: no `.gitattributes` exists at the root.
   - Current impact: Git's line-ending normalization is left to developer/global settings, which is why Markdown diffs repeatedly warn about CRLF conversion.
   - Recommended action: add `.gitattributes` with explicit text normalization such as `* text=auto eol=lf`.

10. Generated Next/TypeScript files are ignored, but the cleanup process is not documented.
    - Evidence: `.gitignore` ignores `/.next/`, `*.tsbuildinfo`, and `next-env.d.ts`; `git status --ignored --short` showed `next-env.d.ts` and `node_modules/` as ignored.
    - Current impact: failed builds can leave large ignored artifacts that consume disk until manually removed.
    - Recommended action: document a cleanup command for `.next`, `out`, and TypeScript build info, especially because local disk pressure already broke builds.

11. `next-env.d.ts` is ignored.
    - Evidence: `.gitignore:36` lists `next-env.d.ts`.
    - Current impact: Next can regenerate it, but many Next projects commit this file to keep type references explicit across fresh clones.
    - Recommended action: choose a policy intentionally; either commit it like the Next default or document that it is generated.

12. `node_modules` dominates operational risk but is correctly untracked.
    - Evidence: `git status --ignored --short` shows `!! node_modules/`; `git ls-files` does not include `node_modules`.
    - Current impact: source control is clean, but local disk pressure can still be severe on this machine.
    - Recommended action: keep it ignored, but ensure CI uses a fresh cache/install strategy instead of relying on local node_modules state.

13. The repo currently has only 62 tracked files, so hygiene fixes are low blast radius.
    - Evidence: `git ls-files | Measure-Object` reports `62`.
    - Current impact: removing editor files and normalizing docs/lockfiles should be a contained cleanup rather than a risky refactor.
    - Recommended action: make repository hygiene a small dedicated PR before changing application behavior.

### Verification

- Checked worktree and disk state with `git status --short --branch` and `Get-PSDrive -Name C`.
- Cleared npm/Yarn caches to recover local disk space after previous build failures; no tracked project source was removed.
- Inspected tracked files with `git ls-files`, including `.idea`, `.vscode`, lockfiles, README, and ignore-related files.
- Inspected `.gitignore`, `.editorconfig`, `.prettierrc`, `README.md`, and `.vscode/settings.json`.
- Confirmed no `.gitattributes` file exists.
- Confirmed ignored generated/local paths with `git status --ignored --short`.

### Next Review Angle

- Review deployment/runtime architecture: App Router static generation, PM2 startup, Next standalone/export assumptions, environment variables, and production process ownership.
- Consider a dedicated hygiene cleanup after package-manager selection: editor files, line endings, README, and lockfile policy.

## 2026-05-25 19:00 KST - Review 18

### Scope

- Deployment and runtime architecture
- App Router rendering assumptions
- PM2 process ownership
- Environment/port configuration
- Asset delivery and production portability

### Findings

1. Runtime target is not explicitly defined.
   - Evidence: `next.config.mjs` only enables the styled-components compiler and does not set `output`, `distDir`, `assetPrefix`, `basePath`, or image options.
   - Current impact: it is unclear whether the project is intended for Vercel, a Node server with `next start`, a static export, or a standalone Docker/PM2 deployment.
   - Recommended action: document the intended deployment target first, then encode required Next config for that target.

2. The PM2 path assumes a normal `.next` server build, not standalone output.
   - Evidence: `ecosystem.config.js` runs `script: "next"` with `args: "start"`; `next.config.mjs` does not set `output: "standalone"`.
   - Current impact: deployment requires full project files and `node_modules` on the server rather than a minimal standalone artifact.
   - Recommended action: either keep `next start` and document server requirements, or switch to `output: "standalone"` and run the generated server entry.

3. `package.json` mixes build and runtime in the `start` script.
   - Evidence: `"start": "next build && next start"`.
   - Current impact: process startup depends on a successful build and sufficient disk/memory at runtime.
   - Recommended action: run `next build` during CI/deploy and make `start` only run `next start`.

4. PM2 production environment is implied but not configured.
   - Evidence: `package.json` uses `pm2 start ecosystem.config.js --env production`, but `ecosystem.config.js` has `env_production` commented out.
   - Current impact: `--env production` looks meaningful but does not set `NODE_ENV`, `PORT`, or other production values.
   - Recommended action: restore `env_production` or remove the flag until there is a real production environment block.

5. Production port ownership is unclear.
   - Evidence: `ecosystem.config.js` comments mention `PORT: "9981"` and `PORT: "3000"`, but no active port is set.
   - Current impact: `next start` will use its default behavior unless the shell environment supplies `PORT`, which makes deployment dependent on the machine.
   - Recommended action: define the production port in PM2, hosting settings, or a documented `.env` convention.

6. PM2 uses four instances without cluster mode.
   - Evidence: `ecosystem.config.js` sets `instances: 4`, while `exec_mode: "cluster"` is commented out.
   - Current impact: PM2 may run multiple forked processes without the intended load-balancing model, or the setting may not behave as expected for this script.
   - Recommended action: decide whether a single Next server is enough; if multiple instances are required, configure `exec_mode: "cluster"` deliberately and test routing.

7. There is no runtime health check or readiness policy.
   - Evidence: `ecosystem.config.js` has `wait_ready`, `listen_timeout`, and `kill_timeout` commented out.
   - Current impact: process managers and deploy scripts cannot reliably know when the app is ready to receive traffic.
   - Recommended action: add a simple health endpoint or rely on hosting-provider health checks, then wire PM2/deployment around it.

8. The App Router pages are mostly static, but the app pays a large client-runtime cost.
   - Evidence: `app/page.tsx` is a client component, and `AboutWrapper`, `WorkWrapper`, `NaviBox`, `Footer`, `SmoothScrolling`, `LeftWrapper`, and `RightWrapper` are client components.
   - Current impact: a mostly static portfolio ships more JavaScript than necessary, which can affect production performance and hydration.
   - Recommended action: keep page shells/server-rendered content as server components and isolate client behavior to navigation, animation, and interactive sections.

9. Global smooth scrolling is part of the root runtime.
   - Evidence: `app/layout.tsx` wraps the whole app with `SmoothScrolling`, and `lib/smoothScrolling.tsx` mounts `<ReactLenis root>`.
   - Current impact: every route depends on client-side Lenis behavior even if a page does not need scroll effects.
   - Recommended action: evaluate whether Lenis should be route-scoped or removed in favor of native scrolling.

10. Styled-components SSR is configured manually, so runtime changes should be tested against hydration.
    - Evidence: `lib/registry.tsx` uses `ServerStyleSheet`, `StyleSheetManager`, and `useServerInsertedHTML`; `next.config.mjs` enables `compiler.styledComponents`.
    - Current impact: the styling setup is correct in principle, but root/client boundary changes can easily affect style injection and hydration.
    - Recommended action: keep a build/runtime smoke test that checks pages after any registry/layout change.

11. There is no environment-variable convention.
    - Evidence: no `.env.example`, no `process.env` usage, and no site URL config were found.
    - Current impact: future metadata, sitemap, analytics, or API settings have no documented place to live.
    - Recommended action: add `.env.example` once deployment variables are introduced, starting with `NEXT_PUBLIC_SITE_URL` if canonical URLs are added.

12. Work page links are deployment-safe but semantically wrong.
    - Evidence: `components/works/WorkWrapper.tsx:107` links every work card to `/`.
    - Current impact: there is no 404 risk, but production users cannot navigate to real case studies.
    - Recommended action: add actual work detail routes or external artifact URLs before presenting the Work page as production content.

13. Large public assets are served as-is.
    - Evidence: `public/images/img_user_1.jpg` is about 7 MB, and product images include files around 2-3 MB.
    - Current impact: static hosting and Node deployments both pay unnecessary transfer and LCP cost.
    - Recommended action: resize/compress portfolio assets and migrate meaningful images to `next/image` so runtime delivery is optimized.

14. README still only documents local dev startup.
    - Evidence: `README.md` mentions `localhost:3000` but does not describe build, start, PM2, hosting, or environment requirements.
    - Current impact: deployment knowledge lives in scripts and comments rather than in a reproducible runbook.
    - Recommended action: add a deployment section after deciding whether the canonical runtime is Vercel, `next start`, or PM2 standalone.

### Verification

- Checked current worktree with `git status --short --branch`.
- Inspected `package.json`, `next.config.mjs`, `ecosystem.config.js`, `app/layout.tsx`, `lib/registry.tsx`, and `lib/smoothScrolling.tsx`.
- Searched runtime/deploy symbols with `rg` for env usage, Next output modes, `PORT`, App Router dynamic settings, `fetch`, `headers`, `cookies`, standalone/export settings, and route links.
- Confirmed no `.env*`, Vercel, Docker, or deployment-specific files exist at the repository root.
- Listed `public` assets and sizes to identify large production payloads.
- Checked client-boundary markers with `rg` for `"use client"`, router hooks, `window`, Lenis, and styled-components SSR usage.

### Next Review Angle

- Review performance payload and rendering cost: image sizes, client bundle surface, font loading, CSS animation cost, static versus client-rendered content, and LCP risks.
- Consider deciding the deployment target before changing PM2 or Next output settings; otherwise fixes may optimize for the wrong runtime.

## 2026-05-25 20:00 KST - Review 19

### Scope

- Performance payload and rendering cost
- Image delivery and LCP risk
- Client component surface area
- Font loading and typography runtime work
- CSS animation and scroll/runtime overhead

### Findings

1. Several public images are too large for direct page use.
   - Evidence: `public/images/img_user_1.jpg` is about 7 MB, `img_product_third.png` is about 3.5 MB, `img_product_second.png` is about 2.9 MB, and `img_user_4.jpg` is about 2.4 MB.
   - Current impact: production users can pay multi-megabyte transfers before seeing portfolio content.
   - Recommended action: resize and compress these assets, then keep source-quality originals outside the served `public` tree if needed.

2. Important images are delivered as CSS background images.
   - Evidence: `components/main/MainWrapper.tsx:342`, `components/main/MainWrapper.tsx:538`, `components/main/MainWrapper.tsx:545`, `components/main/MainWrapper.tsx:553`, `components/about/AboutWrapper.tsx:263`, and `components/GalleryBox.tsx:229` through `components/GalleryBox.tsx:249`.
   - Current impact: Next cannot apply `next/image` optimization, responsive sizing, lazy loading, or priority hints.
   - Recommended action: migrate meaningful content images to `next/image`; reserve CSS backgrounds for decorative shapes only.

3. No `next/image` usage exists.
   - Evidence: searching performance-related patterns found `<img>` in `Footer`, but no `next/image` import or usage.
   - Current impact: even small social icons bypass Next image handling, and larger content images cannot be optimized by the framework.
   - Recommended action: start with large hero/project images, then convert footer icons if they remain raster assets.

4. The homepage is forced into the client bundle.
   - Evidence: `app/page.tsx:1` has `"use client"`, and `components/main/MainWrapper.tsx` uses `useState`, styled-components, `Textfit`, and hover state.
   - Current impact: the main marketing content cannot stay as a mostly static server-rendered page shell.
   - Recommended action: split the homepage into a server-rendered content shell and small client islands for hover/animation behavior.

5. About and Work are also fully client-rendered wrappers.
   - Evidence: `components/about/AboutWrapper.tsx:1` and `components/works/WorkWrapper.tsx:1` use `"use client"`.
   - Current impact: static copy, project data, and layout content are shipped with client runtime even where only scroll/slider interactions need it.
   - Recommended action: move static content and data mapping into server components, then isolate sliders and scroll effects.

6. Global client providers are mounted for every route.
   - Evidence: `app/layout.tsx` wraps all children in `SmoothScrolling`, `StyledComponentsRegistry`, and `NaviComponent`; `lib/smoothScrolling.tsx` mounts root Lenis.
   - Current impact: every route inherits Lenis and navigation runtime cost, even if a route is mostly static.
   - Recommended action: keep the navigation client component, but re-evaluate root-level Lenis and route-scope it if only some pages need it.

7. `react-textfit` adds client measurement for display text that could be CSS.
   - Evidence: `Textfit` is used in `components/main/MainWrapper.tsx:200`, `components/about/AboutWrapper.tsx:121`, and imported in Work.
   - Current impact: large headings depend on runtime measurement and an outdated dependency.
   - Recommended action: replace with CSS `clamp()`, stable container sizing, and responsive typography tokens.

8. `react-use` window hooks make scroll/resize values part of render behavior.
   - Evidence: `AboutWrapper` and `WorkWrapper` use `useWindowScroll` and `useWindowSize`; `EffectBox` uses `useWindowSize`.
   - Current impact: scroll and resize can trigger React work for effects that are mostly layout transforms.
   - Recommended action: replace broad hooks with narrow local hooks, CSS sticky behavior, or requestAnimationFrame-throttled DOM updates.

9. Infinite marquee animations are widespread.
   - Evidence: `EffectBox`, `GalleryBox`, and `MainWrapper` define multiple `keyframes` and continuous `animation:` declarations.
   - Current impact: the page can consume CPU/GPU continuously after initial load.
   - Recommended action: pause offscreen animations, disable or simplify them under reduced motion, and avoid running decorative loops by default.

10. Product image reveal animations stack multiple large background layers.
    - Evidence: `MainWrapper` uses `img_product_first.png`, `img_product_second.png`, and `img_product_third.png` as layered backgrounds with hover-triggered animations.
    - Current impact: hover effects can require decoding and compositing multiple large assets at once.
    - Recommended action: preload only the first meaningful image and lazy-load secondary reveal assets, or replace the effect with a lighter static card.

11. Google font usage may be heavier than needed.
    - Evidence: `app/layout.tsx` loads `Noto_Sans_KR` with six weights, while `NaviBox` and `MainWrapper` each instantiate `Playfair_Display` with three weights.
    - Current impact: multiple font families and weights increase font CSS and font file work.
    - Recommended action: reduce Noto Sans KR to used weights, centralize Playfair loading, and avoid re-instantiating the same font in multiple components.

12. Footer icons are raster images for simple marks.
    - Evidence: `components/Footer.tsx:60`, `components/Footer.tsx:64`, and `components/Footer.tsx:68` render PNG icons.
    - Current impact: small but avoidable image requests remain in the footer.
    - Recommended action: use SVG icons or a shared icon component if these are purely decorative/social affordances.

13. Build performance is also affected by asset and client-surface choices.
    - Evidence: the previous build reached compilation but failed during static generation under disk/memory pressure; this review found multi-megabyte assets and broad client wrappers.
    - Current impact: even if the immediate failure is environmental, the app has avoidable work that makes constrained builds and runtime delivery more fragile.
    - Recommended action: reduce asset sizes and client boundaries before treating build instability as only an infrastructure problem.

14. There is no automated performance budget.
    - Evidence: no Lighthouse, bundle analyzer, image-size check, or CI workflow exists in the repo.
    - Current impact: regressions in asset size or JavaScript payload can land silently.
    - Recommended action: add a lightweight budget gate after CI exists, starting with max image file sizes and a bundle analyzer script.

### Verification

- Checked current worktree with `git status --short --branch`.
- Listed `public/images` by file size to identify largest served assets.
- Searched performance-related usage with `rg` for `use client`, `next/image`, `<img>`, background images, font loaders, `Textfit`, `keyframes`, animations, window hooks, Lenis, and router hooks.
- Inspected `components/main/MainWrapper.tsx`, `components/about/AboutWrapper.tsx`, `components/works/WorkWrapper.tsx`, and `app/layout.tsx`.
- Checked disk state with `Get-PSDrive -Name C` before verification work.

### Next Review Angle

- Review maintainability of component structure: oversized wrappers, repeated left/right layout code, styled-components locality, dead List/CatchCatch components, and naming consistency.
- Consider optimizing large images before further visual work, because asset size is one of the clearest production risks.

## 2026-05-25 21:00 KST - Review 20

### Scope

- Component structure and maintainability
- Oversized page wrappers
- Repeated layout and styled-components patterns
- Dead scaffold components
- Naming consistency and typo debt

### Findings

1. `AboutWrapper` is too large and mixes too many responsibilities.
   - Evidence: `components/about/AboutWrapper.tsx` is about 26 KB and contains page data, state, scroll effects, slider effects, JSX, and all styled-components in one file.
   - Current impact: small copy or behavior changes require navigating an entire page implementation.
   - Recommended action: split About into `AboutIntro`, `ProjectSlider`, `ClientList`, `SkillList`, `SocialLinks`, and page-level layout/data modules.

2. `MainWrapper` has the same oversized-wrapper problem.
   - Evidence: `components/main/MainWrapper.tsx` is about 24 KB and contains hero copy, page layout, hover gallery behavior, animations, buttons, and all style definitions.
   - Current impact: homepage copy, image behavior, and layout changes are tightly coupled.
   - Recommended action: split the homepage into server-rendered content sections and a small client gallery/animation component.

3. Page-specific wrappers duplicate layout primitives.
   - Evidence: `components/about/AboutWrapper.tsx`, `components/works/WorkWrapper.tsx`, and `components/main/MainWrapper.tsx` each define their own `Section`, `MainWrapper`, and `AboutLeft`-style layout blocks.
   - Current impact: changing the two-column layout requires updating multiple files manually.
   - Recommended action: create shared layout primitives such as `PortfolioShell`, `SplitSection`, `LeftRail`, and `ContentRail`.

4. `LeftWrapperComponent` and `RightWrapperComponent` are thin wrappers but force client components.
   - Evidence: `components/LeftWrapper.tsx` and `components/RightWrapper.tsx` both start with `"use client"` even though they only render styled layout containers.
   - Current impact: purely structural layout becomes part of the client component graph.
   - Recommended action: make shared layout primitives server-compatible where possible and keep client-only behavior outside them.

5. Unused scaffold components remain in source.
   - Evidence: `components/ListDetail.tsx` only appears in its own file, `components/works/CatchCatch.tsx` only appears in its own file, and `components/List.tsx` / `components/ListItem.tsx` are example-like and commented.
   - Current impact: reviewers cannot tell whether these are planned features, abandoned examples, or safe-to-delete files.
   - Recommended action: delete unused scaffold components or move planned examples into a clearly named sandbox directory outside production source.

6. Zustand store code is effectively dead.
   - Evidence: `stores/useCommon.ts` exports `useCommonStore`; `components/NaviBox.tsx` imports it and destructures `setRoute`, but no call or route-state consumer was found.
   - Current impact: global state infrastructure exists without driving behavior.
   - Recommended action: remove the store until a real cross-component state need exists, or wire it into a documented navigation transition feature.

7. Work page includes copied About data that is not used.
   - Evidence: `components/works/WorkWrapper.tsx:15` through `components/works/WorkWrapper.tsx:34` define `memberType` and `clientArrayData`, but Work rendering uses `workArray`.
   - Current impact: page files contain stale data that increases review noise.
   - Recommended action: remove copied declarations and keep Work data in a typed project config.

8. About uses state for immutable content.
   - Evidence: `components/about/AboutWrapper.tsx:61` stores `clientArrayData` with `useState`, but the array is never updated.
   - Current impact: static content looks mutable and adds unnecessary React state.
   - Recommended action: render static arrays directly or import them from a content config module.

9. Several names carry typo debt.
   - Evidence: `config/breakboint.ts`, `SwipeWrppaer`, `.border-gorup`, and related class names.
   - Current impact: typos become part of import paths and CSS selectors, making future refactors more error-prone.
   - Recommended action: rename with compatibility in one focused pass: `breakpoint`, `SwipeWrapper`, `border-group`.

10. Styled-components are deeply local to page files.
    - Evidence: About defines `SnsWrapper`, `SkillWrapper`, `ClientWrapper`, `UserImgGroup`, `UserNameGroup`, `SwipeWrppaer`, `CenterInfo`, `Title`, `AboutLeft`, `Section`, and `MainWrapper` in one file.
    - Current impact: there is no clear boundary between reusable design primitives and one-off styles.
    - Recommended action: keep truly page-specific styles local, but extract repeated layout primitives and card patterns.

11. `GalleryBox` has unused imports and weak type boundaries.
    - Evidence: `components/GalleryBox.tsx:1` imports `useRouter` from `next/router`, and image props are typed as `any`.
    - Current impact: a shared visual component has both stale dependencies and loose input contracts.
    - Recommended action: remove unused imports and type image props as strings or a tuple-backed image model.

12. Component names do not consistently describe domain intent.
    - Evidence: `memberType`, `memberArrayData`, and `clientArrayData` describe generic members/clients, while the UI is actually presenting portfolio projects and proof points.
    - Current impact: domain meaning is hidden behind template-era names.
    - Recommended action: rename data models to `ProjectSummary`, `ProofPoint`, `Capability`, or similar portfolio-specific types.

13. The current file structure separates by page, but not by feature responsibility.
    - Evidence: `components/about/AboutWrapper.tsx` owns About copy, contact rail, project slider, social links, skills, clients, and animation trigger.
    - Current impact: future improvements such as AI case-study cards or accessibility fixes will touch a large page file instead of a focused component.
    - Recommended action: move toward feature folders such as `components/about/ProjectSlider.tsx`, `components/shared/SplitLayout.tsx`, and `config/projects.ts`.

14. Comments and copied snippets are left in production files.
    - Evidence: Work contains commented example props for `GalleryBox`; `NaviBox` contains commented old `Link` markup; `MainWrapper` contains commented `LeftWrapper` styles.
    - Current impact: stale comments distract from active behavior and make code review slower.
    - Recommended action: remove comments that only describe abandoned code paths; keep comments only where they explain non-obvious decisions.

### Verification

- Checked current worktree with `git status --short --branch`.
- Listed source files by size to identify maintenance hotspots.
- Searched component/data/layout patterns with `rg` for wrapper names, page data arrays, dead components, typo names, store usage, and styled-component declarations.
- Inspected `LeftWrapper`, `RightWrapper`, `config/breakboint.ts`, and `stores/useCommon.ts` directly.
- Confirmed `ListDetail`, `CatchCatch`, and the List/ListItem scaffold have no production usage beyond their own/example files.

### Next Review Angle

- Review data modeling and content-source design: project configs, profile/capability schemas, social/contact config, image metadata, and how to make copy edits safer.
- Consider deleting dead scaffold components before larger refactors, because it immediately reduces search noise.

## 2026-05-25 22:00 KST - Review 21

### Scope

- Data modeling and content-source design
- Portfolio proof schema
- Contact/social configuration
- Image metadata
- Safer copy edits across pages

### Findings

1. Portfolio content is embedded directly in components.
   - Evidence: main copy is in `components/main/MainWrapper.tsx`, About biography/project/client content is in `components/about/AboutWrapper.tsx`, Work cards are in `components/works/WorkWrapper.tsx`, and footer copy/social links are in `components/Footer.tsx`.
   - Current impact: changing positioning requires editing multiple component files instead of one content source.
   - Recommended action: introduce typed content modules such as `config/profile.ts`, `config/projects.ts`, `config/capabilities.ts`, and `config/socialLinks.ts`.

2. Contact information is duplicated with inconsistent casing and behavior.
   - Evidence: `components/main/MainWrapper.tsx` includes `soojoon92@gmail.com` and `SOOJOON92@GMAIL.COM`; About and Work repeat `soojoon92@gmail.com`; Footer repeats `SOOJOON92@GMAIL.COM`.
   - Current impact: copy drift is likely, and the main email link still uses placeholder behavior.
   - Recommended action: define one `profile.email` value and derive display text, `mailto`, and footer labels from it.

3. Capability keywords are duplicated as raw strings.
   - Evidence: `Eval`, `RAG`, `Agent`, `AUTOMATION`, `LLM`, and `QA` appear in Main and Footer markup.
   - Current impact: adding or renaming a capability requires manual edits in separate sections.
   - Recommended action: define a `capabilities` array with `id`, `label`, `description`, and optional `proofProjectIds`.

4. Work data is too shallow for an AI validation portfolio.
   - Evidence: `components/works/WorkWrapper.tsx` models work items as `{ text, images }`.
   - Current impact: there is no place to express problem, AI role, validation method, evaluation metric, stack, failure mode, or result.
   - Recommended action: define `ProjectCaseStudy` with fields like `id`, `slug`, `title`, `summary`, `problem`, `role`, `stack`, `validation`, `metrics`, `result`, `links`, and `images`.

5. Work items have no stable ids or slugs.
   - Evidence: Work cards use `key={c.text}` and several entries share `text: "yummy yummy"`.
   - Current impact: React keys are unstable and future detail routes cannot be derived safely.
   - Recommended action: add explicit `id` and `slug` to every project item.

6. Image data lacks metadata.
   - Evidence: Work images are arrays of string paths, About user images are inferred from `user_idx`, and GalleryBox accepts `imgFirst`, `imgSecond`, `imgThird`.
   - Current impact: there is no alt text, dimensions, priority/lazy hint, role, or caption in the data model.
   - Recommended action: define `PortfolioImage = { src: string; alt: string; width?: number; height?: number; priority?: boolean }`.

7. The About project model uses template-era naming.
   - Evidence: `memberType`, `memberArrayData`, `user_idx`, `name`, and `job` are used for portfolio project cards.
   - Current impact: the model obscures the fact that these are projects/proof points, not team members.
   - Recommended action: rename to `ProjectSummary` or `ProofPoint` and model it around portfolio evidence.

8. Fictional client data is not tagged as fictional or aspirational in the model.
   - Evidence: `clientArrayData` includes brands such as Netflix, Apple, Samsung, Nike, Google, Gucci, and Tesla.
   - Current impact: trust-sensitive content is represented as plain strings with no source, status, or display rule.
   - Recommended action: remove the list, or model it explicitly as `aspirationalBrands` with copy that cannot be mistaken for actual clients.

9. Social links have no central source of truth.
   - Evidence: Footer links SoundCloud, Naver, and Instagram; About has Twitter text without an `href`, Facebook, and a different Instagram URL.
   - Current impact: link destinations and labels diverge between pages.
   - Recommended action: define `socialLinks` with `id`, `label`, `href`, `icon`, `enabled`, and `opensInNewTab`.

10. External link safety cannot be enforced by data.
    - Evidence: multiple `target="_blank"` anchors are written inline without a shared link component or metadata flag.
    - Current impact: `rel="noopener noreferrer"` and accessible labels must be remembered manually.
    - Recommended action: create a `SocialLink` or `ExternalLink` component that consumes link config and applies safe defaults.

11. Contact rail data is duplicated in About and Work.
    - Evidence: both About and Work render `Inquiries`, email, `CONTACT`, `Blumenkopf kein Studio`, `Burgring 123`, and `1010 Wien, Korea`.
    - Current impact: placeholder address content persists in multiple files.
    - Recommended action: define a `contact` object and one `ContactRail` component; remove fake address fields from production content.

12. Content copy and metadata are separate, so SEO can drift.
    - Evidence: root metadata lives in `app/layout.tsx`, while main positioning copy lives in `MainWrapper` and footer text lives in `Footer`.
    - Current impact: visible AI-developer copy can change without updating search/social snippets.
    - Recommended action: source `metadata` title/description from the same profile/positioning config used by visible components.

13. There is no schema-level validation for content completeness.
    - Evidence: content is plain local arrays and JSX strings with inferred types or weak custom types.
    - Current impact: missing links, duplicate ids, empty alt text, or placeholder routes are not caught.
    - Recommended action: use TypeScript `satisfies` with readonly arrays, tuple image requirements, and explicit project/social/contact types.

14. Content should be extractable before major visual refactors.
    - Evidence: current visual components mix layout, animation, and content values in the same files.
    - Current impact: refactors risk changing copy accidentally or preserving stale placeholder data.
    - Recommended action: first move content to typed configs, then refactor UI components to consume those configs.

### Verification

- Checked current worktree with `git status --short --branch`.
- Searched content/data patterns with `rg` for local arrays, custom types, project names, email strings, social links, image paths, capabilities, and metadata-like fields.
- Inspected `WorkWrapper`, `AboutWrapper`, `Footer`, and `MainWrapper` directly.
- Counted repeated contact/capability strings across Main, About, Work, and Footer using Python.
- Confirmed `config` currently only contains `breakboint.ts`, with no profile/project/social content source.

### Next Review Angle

- Review routing and navigation architecture: App Router route structure, placeholder links, router button usage, prefetch behavior, missing work detail routes, and URL design for case studies.
- Consider creating typed content config before fixing copy again, because it would reduce repeated manual edits across pages.

## 2026-05-25 23:00 KST - Review 22

### Scope

- Routing and navigation architecture
- App Router route shape
- Placeholder links and missing detail pages
- Navigation semantics
- URL design for case studies

### Findings

1. The App Router only exposes three real pages.
   - Evidence: `app` contains `page.tsx`, `about/page.tsx`, and `work/page.tsx`.
   - Current impact: the portfolio has no route surface for case studies, project proof, contact, or individual work details.
   - Recommended action: add explicit routes based on the intended content model, starting with `/work/[slug]` if Work cards should be evidence pages.

2. Work cards all navigate back to the homepage.
   - Evidence: `components/works/WorkWrapper.tsx:107` renders `<Link href={"/"} key={c.text}>`.
   - Current impact: users clicking a Work card lose context instead of seeing project details.
   - Recommended action: model each work item with `slug` and route to `/work/${slug}`.

3. There is no dynamic route for work details.
   - Evidence: `Get-ChildItem app -Recurse -Directory` shows only `app/about` and `app/work`.
   - Current impact: even if work data gets better, there is no place to render long-form case studies.
   - Recommended action: add `app/work/[slug]/page.tsx` with `generateStaticParams` sourced from typed project config.

4. Work item data cannot currently drive routing.
   - Evidence: `workArray` only has `text` and `images`, and repeated `text: "yummy yummy"` values.
   - Current impact: URLs cannot be stable, unique, or human-readable.
   - Recommended action: add `id`, `slug`, `title`, and `summary` before creating detail pages.

5. Navigation imports `Link` but uses buttons with `router.push`.
   - Evidence: `components/NaviBox.tsx:3` imports `Link`, while `components/NaviBox.tsx:57`, `components/NaviBox.tsx:64`, and `components/NaviBox.tsx:69` call `router.push` from buttons.
   - Current impact: top-level navigation loses native link behavior such as opening in a new tab, copying URLs, and link semantics.
   - Recommended action: render Home, Work, and About as `Link` elements and keep buttons only for opening/closing the mobile menu.

6. `useCommonStore` route state is not connected to routing.
   - Evidence: `NaviBox` destructures `setRoute`, but no route setter call or route-state consumer was found.
   - Current impact: route state appears planned but does not participate in navigation.
   - Recommended action: remove the store from navigation or define an explicit transition state responsibility.

7. The main CTA links use legacy `passHref` unnecessarily.
   - Evidence: `components/main/MainWrapper.tsx:192` and `components/main/MainWrapper.tsx:209` use `passHref`.
   - Current impact: this is harmless but suggests Pages Router-era patterns are still present in App Router code.
   - Recommended action: remove `passHref` unless wrapping a custom component that forwards anchor props.

8. Explicit `prefetch` props are redundant on basic internal links.
   - Evidence: the homepage CTA links use `<Link prefetch href={"/about"}>` and `<Link prefetch href={"/work"}>`.
   - Current impact: the code implies special prefetch behavior where Next already provides sensible defaults.
   - Recommended action: omit `prefetch` unless there is a measured reason to override defaults.

9. Main email is modeled as an internal-style placeholder link.
   - Evidence: `components/main/MainWrapper.tsx:38` uses `<a href="#">soojoon92@gmail.com</a>`.
   - Current impact: clicking it changes scroll/hash behavior rather than opening a contact flow.
   - Recommended action: use a `mailto:` link or add a real `/contact` route.

10. About has an anchor without `href`.
    - Evidence: `components/about/AboutWrapper.tsx:325` renders `<a>` for Twitter without a destination.
    - Current impact: it looks like a navigation item but is not a valid route/link.
    - Recommended action: remove disabled social rows or source them from config with `enabled: false`.

11. External profile links are spread across components instead of a route/link model.
    - Evidence: Footer and About define separate social links inline, with different Instagram URLs and a Naver URL under the Facebook icon.
    - Current impact: users can land in inconsistent destinations depending on page.
    - Recommended action: centralize links in a `socialLinks` config and render them through one link component.

12. `GalleryBox` imports `useRouter` from the Pages Router package.
    - Evidence: `components/GalleryBox.tsx:1` imports `useRouter` from `next/router`.
    - Current impact: the shared gallery component carries a stale Pages Router dependency, even though the app uses App Router and the import is unused.
    - Recommended action: remove the import; if imperative navigation is needed, use `next/navigation` in a client component.

13. Commented routing examples remain in production source.
    - Evidence: `components/ListItem.tsx:12` references `/users/[id]`, and `components/NaviBox.tsx:46` keeps a commented old `Link`.
    - Current impact: dead route examples create noise when auditing navigation.
    - Recommended action: delete unused examples or move them to documentation.

14. There is no canonical URL strategy for case-study pages.
    - Evidence: no project slugs, no route metadata, and no `metadataBase`/canonical config exist.
    - Current impact: future work detail pages could launch without stable SEO/social URL definitions.
    - Recommended action: pair `/work/[slug]` with typed project metadata and route-level `generateMetadata`.

### Verification

- Checked current worktree with `git status --short --branch`.
- Listed App Router files and route directories under `app`.
- Searched route/link patterns with `rg -F` for `Link`, `href=`, `router.push`, `useRouter`, `usePathname`, `passHref`, `prefetch`, placeholder anchors, and dynamic-route hints.
- Inspected `NaviBox`, `WorkWrapper`, `MainWrapper`, and `GalleryBox` directly.
- Confirmed only `/`, `/about`, and `/work` are represented by route files.

### Next Review Angle

- Review form/contact and conversion flow: email affordances, inquiry paths, social destinations, CTA consistency, and what a recruiter/client can actually do after landing.
- Consider implementing `/work/[slug]` only after typed project config exists, because route params should come from stable project ids.

## 2026-05-26 00:00 KST - Review 23

### Scope

- Contact and conversion flow
- Email affordances
- CTA consistency
- Social destination trust
- Recruiter/client next actions after landing

### Findings

1. The primary homepage email link is not actionable.
   - Evidence: `components/main/MainWrapper.tsx:38` renders the email as `<a href="#">...`.
   - Current impact: a visitor who tries to contact from the first viewport does not get an email client or contact flow.
   - Recommended action: change the link to `mailto:soojoon92@gmail.com` or route to a real contact page.

2. About and Work show the email as text, not a link.
   - Evidence: `components/about/AboutWrapper.tsx:106` and `components/works/WorkWrapper.tsx:90` render the email inside `<p className="mail">`.
   - Current impact: users must manually copy the address, which creates avoidable friction.
   - Recommended action: use a shared `ContactRail` component with a real mail link.

3. There is no dedicated contact route.
   - Evidence: the App Router only has `/`, `/about`, and `/work`.
   - Current impact: there is no place for inquiry context, expected response, project-fit guidance, or alternative contact methods.
   - Recommended action: either add `/contact` or make the homepage/About contact blocks fully actionable.

4. Contact copy is duplicated across pages.
   - Evidence: About and Work both render `Inquiries`, `CONTACT`, email, and the same placeholder address block.
   - Current impact: contact edits can drift and placeholder content can survive in one page after being fixed in another.
   - Recommended action: centralize contact data and render it through one component.

5. The contact block includes fake address content.
   - Evidence: About and Work both show `Blumenkopf kein Studio`, `Burgring 123`, and `1010 Wien, Korea`.
   - Current impact: trust is damaged because a verification-oriented portfolio presents unverifiable or template-like contact information.
   - Recommended action: remove fake address fields and replace them with real availability, location preference, or remote-work context.

6. The homepage CTA hierarchy does not clearly prioritize contact.
   - Evidence: homepage CTA buttons route to About and Work, while the only contact action is the placeholder email link.
   - Current impact: the user can explore but cannot easily convert.
   - Recommended action: make the primary conversion action explicit, for example contact/email, and keep About/Work as secondary exploration.

7. Footer social destinations are inconsistent with labels/icons.
   - Evidence: `components/Footer.tsx:63` links a Facebook icon to `https://www.naver.com/`.
   - Current impact: users may interpret the portfolio as unfinished or unreliable after clicking a social icon.
   - Recommended action: replace placeholder social URLs with real destinations or remove unavailable channels.

8. About and Footer use different social profiles.
   - Evidence: Footer links Instagram `_soooho`, while About links Instagram `iamnotsooho`; Footer has SoundCloud, while About has Facebook and a Twitter row.
   - Current impact: visitors get different identity signals depending on page.
   - Recommended action: define one canonical social profile list and render it consistently.

9. About has a social row that is visually interactive but not a link.
   - Evidence: `components/about/AboutWrapper.tsx:325` renders `<a>` without `href`.
   - Current impact: users encounter a dead interactive affordance.
   - Recommended action: remove disabled links or render them as inactive text with no anchor semantics.

10. New-tab social links lack safety and expectation cues.
    - Evidence: external anchors use `target="_blank"` but do not include `rel="noopener noreferrer"`.
    - Current impact: link behavior and security hygiene are weaker than expected for a professional portfolio.
    - Recommended action: use a shared external-link component that applies `rel` and accessible labels by default.

11. The Work page does not offer a project-specific conversion path.
    - Evidence: Work cards link to `/`, and the page repeats a generic contact rail.
    - Current impact: a visitor interested in a specific project cannot ask about that project or inspect proof.
    - Recommended action: add per-project detail routes and include a CTA tied to the project context.

12. The portfolio does not explain what kind of inquiries are wanted.
    - Evidence: visible contact surfaces only show generic inquiry/contact labels and email.
    - Current impact: recruiters, clients, and collaborators do not get guidance on fit, scope, or expected materials.
    - Recommended action: define contact microcopy such as AI evaluation consulting, RAG quality checks, agent QA automation, or frontend AI product work.

13. Conversion state cannot be measured.
    - Evidence: there is no analytics, event naming, form submit path, or structured CTA component.
    - Current impact: after deployment, it will be hard to know which CTA or page produces contact attempts.
    - Recommended action: after privacy requirements are decided, centralize CTA components and optionally add analytics hooks.

14. Contact and social data should be part of the typed content source.
    - Evidence: contact strings and social links are hard-coded in Main, About, Work, and Footer.
    - Current impact: conversion fixes are currently repetitive code edits rather than content changes.
    - Recommended action: add `config/contact.ts` or merge contact/social fields into `config/profile.ts`.

### Verification

- Checked current worktree with `git status --short --branch`.
- Searched contact and link surfaces with `rg -F` for inquiry labels, contact labels, email strings, `href=`, `mailto:`, social URLs, About/Work CTA text, and contact route hints.
- Inspected `MainWrapper`, `AboutWrapper`, `WorkWrapper`, and `Footer` directly.
- Confirmed there is no `mailto:` usage and no dedicated contact route.
- Confirmed social destinations differ between About and Footer.

### Next Review Angle

- Review visual QA and responsive layout risk: mobile nav overlay, text overflow, large fixed rails, blackhole SVG masking, gallery grid behavior, and whether key text remains readable across breakpoints.
- Consider fixing contact links early, because actionable email and trusted social destinations are low-risk, high-impact improvements.

## 2026-05-26 01:00 KST - Review 24

### Scope

- Visual QA and responsive layout risk
- Mobile navigation overlay
- Text overflow and readability
- Fixed rails and blackhole SVG masking
- Gallery grid behavior across breakpoints

### Findings

1. Breakpoint coverage is too coarse.
   - Evidence: `config/breakboint.ts` defines common breakpoints, but most layout changes pivot only at `md` or `sm`.
   - Current impact: tablet and narrow desktop states can inherit desktop assumptions such as fixed rails and large viewport typography.
   - Recommended action: define tested viewport targets and add styles for high-risk ranges such as 768-1024px and small mobile widths.

2. Mobile navigation uses a full-screen fixed panel with horizontal offset hiding.
   - Evidence: `components/NaviBox.tsx` sets `.navi-group` to fixed, `width: 100%`, `height: 100%`, and toggles `left: 0` / `left: -100%`.
   - Current impact: off-canvas state can still create focus/scroll issues and is sensitive to viewport width calculations.
   - Recommended action: use transform-based off-canvas motion, focus trapping, and `aria-hidden`/inert behavior when closed.

3. Mobile nav text is very large.
   - Evidence: `components/NaviBox.tsx:191` sets `.navi` font size to `16vw` and line-height to `0.85em`.
   - Current impact: long labels or future Korean labels can collide or clip on narrow screens.
   - Recommended action: constrain nav font with `clamp()` and test 320px/360px widths.

4. Mobile nav header dimensions are tied to viewport width.
   - Evidence: `.mobile-navi` uses `height: 12vw`, `border-radius: 8vw`, and padding in vw units.
   - Current impact: touch target sizes can become too small or too large depending on device width.
   - Recommended action: use `clamp()` for height, padding, and icon sizes so the hamburger remains a stable target.

5. The main blackhole SVG mixes fixed positioning, viewport units, and min dimensions.
   - Evidence: `BlackholePositioner` is fixed on desktop, becomes absolute on mobile, and `.blackhole` uses `min-height: 100.1vh` and `min-width: 100.1vh`.
   - Current impact: the mask can crop, overrun, or frame differently across viewport aspect ratios.
   - Recommended action: replace min-vh sizing with explicit aspect-ratio containers and verify across portrait/landscape.

6. Main project gallery uses negative margin on desktop.
   - Evidence: `ProjectWrapper` has `height: 49.5vw` and `margin-top: -10vw`, then resets the margin on mobile.
   - Current impact: the gallery can overlap preceding content at intermediate widths.
   - Recommended action: avoid negative layout offsets or isolate the overlap in a predictable positioned container.

7. Main gallery dimensions are not tied to a stable aspect-ratio.
   - Evidence: `.gallery` uses `width: 37vw` and `height: 49.5vw`, then `width: 50vw` and `height: 70vw` on mobile.
   - Current impact: image framing and marquee bands can change unpredictably with viewport width.
   - Recommended action: use `aspect-ratio` and max/min constraints for the gallery card.

8. Vertical marquee bands use fixed viewport-width band sizes.
   - Evidence: Main gallery uses `height: 3vw` and vertical band `width: 3vw`, while text uses `font-size: 1.5vw`.
   - Current impact: marquee text can become unreadable on small screens and oversized on wide screens.
   - Recommended action: use `clamp()` and pause/hide decorative marquee bands below a threshold.

9. About/Work local fixed rails do not share the same mobile hiding logic as `LeftWrapper`.
   - Evidence: page-local `AboutLeft` in About and Work sets `width: 25vw`, `height: 100vh`, and `position: fixed`, while shared `LeftWrapper` hides at `md`.
   - Current impact: the fixed rail content can behave differently than the layout wrapper that contains it.
   - Recommended action: move rail behavior into one shared component with a single responsive policy.

10. Long email/contact text relies on viewport-sized type.
    - Evidence: About/Work `.mail` uses `font-size: 3vw` and `word-break: break-all`.
    - Current impact: email readability changes sharply by viewport and can break awkwardly.
    - Recommended action: use `clamp()` and allow better wrapping with a real `mailto` link.

11. About center content uses fixed text widths.
    - Evidence: `CenterInfo > div` uses `width: 47vw` on desktop and only switches to `100%` under `md`.
    - Current impact: medium-width layouts can produce narrow columns or awkward line breaks.
    - Recommended action: use `max-width` and container-relative spacing rather than hard `vw` widths.

12. About slider mobile square depends on `calc(100vw - 40px)`.
    - Evidence: `.swipe-gallery-box` sets both width and height to `calc(100vw - 40px)` under `md`.
    - Current impact: this is tied to the left mobile gutter and can break if the shared layout offset changes.
    - Recommended action: derive gallery size from its container with `aspect-ratio: 1 / 1`.

13. Work grid border logic assumes an even number of cards.
    - Evidence: `GalleryContainer` removes border-bottom from `:nth-last-child(2)` and `:last-child`.
    - Current impact: odd card counts can leave inconsistent borders.
    - Recommended action: use CSS grid gap/borders or data-independent border rules.

14. Visual QA is not automated.
    - Evidence: there is no Playwright, Storybook, screenshot test, or viewport test script.
    - Current impact: layout regressions can only be caught manually after browsing.
    - Recommended action: add a small Playwright smoke test for `/`, `/about`, and `/work` at 360px, 768px, 1024px, and desktop widths after build stability improves.

### Verification

- Checked current worktree with `git status --short --branch`.
- Searched responsive and visual-risk patterns with `rg` for media queries, viewport units, fixed positioning, overflow, word-break, font sizing, z-index, blackhole, gallery, and aspect-ratio usage.
- Inspected `NaviBox`, relevant `MainWrapper` styles, About slider/rail styles, Work gallery styles, and `config/breakboint.ts`.
- Checked disk state with `Get-PSDrive -Name C` before verification work.

### Next Review Angle

- Review state/effects lifecycle safety: unused state setters, timeout cleanup, ref null guards, scroll effects, Zustand usage, and whether effects can run after unmount.
- Consider adding browser screenshot QA once the build/dev server path is stable and disk space remains sufficient.

## 2026-05-25 03:00 KST - Review 25

### Scope

- State and effect lifecycle safety
- Ref null guards and direct DOM mutation
- Route-change behavior
- Scroll effect cost
- Zustand and unused state

### Findings

1. `EffectBox` schedules a timeout without cleanup.
   - Evidence: `components/EffectBox.tsx:28` calls `setTimeout` inside `useEffect`, but the effect does not return `clearTimeout`.
   - Current impact: if the component unmounts or the route changes before the timeout fires, the callback can still run against a stale lifecycle.
   - Recommended action: store the timer id and clear it in the effect cleanup.

2. `EffectBox` mutates `effectRef.current.style` before proving the ref exists.
   - Evidence: `components/EffectBox.tsx:22` writes `effectRef.current.style.width` immediately after the effect starts.
   - Current impact: a render timing issue or conditional wrapper change could throw at runtime before the later guarded timeout block.
   - Recommended action: assign `const el = effectRef.current; if (!el) return;` at the top of the effect and use `el` consistently.

3. `EffectBox` stores props in state that never updates.
   - Evidence: `pageState` and `rollingTextState` are initialized from `text` and `rollingText`, but `setPageState` and `setRollingTextState` are never called.
   - Current impact: if the component stays mounted across a prop change, the visual transition can show stale copy.
   - Recommended action: render directly from props, or add an explicit prop-sync effect if the transition needs local state.

4. `EffectBox` subscribes to unused runtime values.
   - Evidence: `windowHeight` from `useWindowSize` and `pathname` from `usePathname` are read but unused.
   - Current impact: the component is coupled to resize and routing data it does not need, making future lifecycle debugging harder.
   - Recommended action: remove unused subscriptions or intentionally wire pathname into the transition reset logic.

5. About and Work scroll effects guard the ref object, not `.current`.
   - Evidence: both `components/about/AboutWrapper.tsx:71` and `components/works/WorkWrapper.tsx:46` use `if (infoText)` before reading `mainContainer.current.offsetHeight` and `infoText.current.style`.
   - Current impact: `useRef()` always returns a truthy object, so the guard does not prevent null dereferences.
   - Recommended action: check `if (!mainContainer.current || !infoText.current) return;` before reading layout or mutating style.

6. About slider refs have the same ineffective guard.
   - Evidence: `components/about/AboutWrapper.tsx:85` uses `if (sliderRef)` before writing to `sliderRef.current`, `sliderJobRef.current`, and `sliderImgRef.current`.
   - Current impact: a partial render or future conditional slide section can throw when one of the three refs is unavailable.
   - Recommended action: guard all three `.current` values and consider deriving the slide position through state/className instead of imperative style writes.

7. Scroll-driven style mutation runs on every scroll update.
   - Evidence: About and Work subscribe to `useWindowScroll` and write `infoText.current.style.transform` whenever `scrollY`, `windowHeight`, or `windowWidth` changes.
   - Current impact: direct DOM writes can happen at scroll frequency, causing layout reads and style writes outside React's scheduling.
   - Recommended action: move this to CSS sticky behavior if possible; otherwise throttle with `requestAnimationFrame` and cache measured height with `ResizeObserver`.

8. Scroll effects read layout and write style in the same pass.
   - Evidence: the effects read `mainContainer.current.offsetHeight` and then set `infoText.current.style.transform`.
   - Current impact: repeated read/write cycles can increase layout thrashing risk, especially with Lenis smoothing active globally.
   - Recommended action: split measurement from mutation, cache the measured section height, and update transform from derived values.

9. `scrollX` is subscribed but unused.
   - Evidence: About and Work destructure `const { x: scrollX, y: scrollY } = useWindowScroll()`, but only `scrollY` is used.
   - Current impact: this is small, but it signals that hook outputs are being copied broadly instead of narrowly.
   - Recommended action: destructure only `y` to keep the dependency surface obvious.

10. Route changes close the mobile nav, but route navigation itself is handled imperatively.
    - Evidence: `components/NaviBox.tsx:26` closes nav on `pathname` change, while each item calls `router.push`.
    - Current impact: the component needs both route subscription and imperative navigation state, which makes focus/overlay lifecycle harder to reason about.
    - Recommended action: use `Link` for navigation and reserve state only for opening/closing the mobile menu.

11. `NaviBox` imports runtime hooks it does not use.
    - Evidence: `Link`, `useRef`, `useWindowSize`, `keyframes`, and `setRoute` are imported or destructured but unused.
    - Current impact: route and viewport lifecycle concerns appear larger than they are, increasing maintenance noise.
    - Recommended action: delete unused imports and remove `useCommonStore` from this component unless it drives visible behavior.

12. The global Zustand store has no active consumer.
    - Evidence: `stores/useCommon.ts` exports `route` and `setRoute`, but the only found import in runtime components is the unused `setRoute` destructuring in `NaviBox`.
    - Current impact: route state can drift from Next's router and gives future code a tempting but redundant source of truth.
    - Recommended action: remove the store for now, or replace it with a clearly scoped UI store only when multiple mounted components need shared UI state.

13. About and Work keep static transition text in mutable state.
    - Evidence: both pages create `effectTitle` and `effectRollingText` with setters that are never called.
    - Current impact: the code implies runtime mutability that does not exist.
    - Recommended action: use constants for these values until page transitions actually need to change them dynamically.

14. `GalleryBox` imports React hooks and `next/router` without using them.
    - Evidence: `components/GalleryBox.tsx` imports `useRouter`, `useEffect`, and `useState`, but the component is presentational.
    - Current impact: this can confuse future App Router work because `next/router` is the Pages Router API and should not be present here.
    - Recommended action: remove those imports and type image inputs as strings.

15. Lenis imports an unused hook.
    - Evidence: `lib/smoothScrolling.tsx:4` imports `useLenis`, but the component only renders `ReactLenis`.
    - Current impact: this is minor, but it reinforces the pattern of unused lifecycle hooks living near global behavior.
    - Recommended action: remove `useLenis`; if programmatic scrolling is needed later, centralize it in one tested helper.

### Verification

- Checked current worktree with `git status --short --branch`.
- Inspected `EffectBox`, `NaviBox`, `AboutWrapper`, `WorkWrapper`, `GalleryBox`, `useCommon`, `smoothScrolling`, and `app/layout.tsx`.
- Searched lifecycle and state patterns with `rg` for `useEffect`, `useState`, `useRef`, timers, direct DOM reads/writes, router hooks, Zustand usage, and window/scroll hooks.
- Confirmed no active committed source change was present before adding this review.

### Next Review Angle

- Review data modeling and content ownership: project data, profile/contact data, repeated literals, typed content configs, and whether portfolio copy can be maintained without editing layout components.
- Consider making the first implementation pass small and safe: remove unused hooks/imports, add ref guards, and clear the `EffectBox` timeout.
