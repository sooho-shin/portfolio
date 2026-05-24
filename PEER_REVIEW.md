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
