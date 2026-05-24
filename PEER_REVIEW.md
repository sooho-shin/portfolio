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

## 2026-05-25 04:00 KST - Review 26

### Scope

- Data modeling and content ownership
- Portfolio copy maintainability
- Project/contact/social data duplication
- Typed content config gaps
- Data-driven rendering risks

### Findings

1. There is no content configuration layer.
   - Evidence: `config/` only contains `breakboint.ts`; profile copy, project data, contact data, skills, and social links live inside components.
   - Current impact: changing portfolio positioning requires editing layout components instead of content files.
   - Recommended action: add typed content modules such as `config/profile.ts`, `config/projects.ts`, `config/contact.ts`, and `config/social.ts`.

2. Main page portfolio copy is embedded directly in a large layout component.
   - Evidence: `components/main/MainWrapper.tsx` contains hero copy, service copy, skill labels, CTA labels, email text, and marquee text.
   - Current impact: copy iteration for the AI validation positioning is mixed with layout and animation code.
   - Recommended action: extract homepage copy into a typed object and render from that object.

3. Desktop and mobile homepage copy are duplicated.
   - Evidence: `MainWrapper` has separate desktop and tablet/mobile sections for the same hero and contact concepts.
   - Current impact: copy can drift between responsive variants, especially while changing Korean messaging.
   - Recommended action: render both responsive layouts from the same content constants.

4. Contact data is repeated across multiple components.
   - Evidence: the email appears in `MainWrapper`, `Footer`, `AboutWrapper`, and `WorkWrapper`; About and Work also repeat the same inquiry/address block.
   - Current impact: correcting the email or replacing placeholder address text requires several edits.
   - Recommended action: centralize contact data and pass it into shared contact/rail/footer components.

5. Social links are inconsistent across surfaces.
   - Evidence: `Footer` links SoundCloud, Naver, and Instagram; About links Facebook and a different Instagram handle, plus a Twitter label without `href`.
   - Current impact: the site cannot present a trustworthy professional identity until social data has a single source of truth.
   - Recommended action: create one typed social link list with label, url, icon, visibility, and `rel` policy.

6. Project data is local to the Work page.
   - Evidence: `components/works/WorkWrapper.tsx:64` defines `workArray` inside the component.
   - Current impact: project cards cannot be reused for homepage previews, SEO metadata, detail pages, or tests without duplicating data.
   - Recommended action: move projects into `config/projects.ts` with fields for slug, title, summary, role, stack, proof, images, and links.

7. Work project keys are not stable because data titles repeat.
   - Evidence: `WorkWrapper` maps `workArray` with `key={c.text}`, while three entries use `text: "yummy yummy"`.
   - Current impact: React reconciliation can behave incorrectly when duplicate keys are rendered.
   - Recommended action: add unique project `id` or `slug` fields and use them as keys and route params.

8. Work image paths are assembled by string concatenation.
   - Evidence: `WorkWrapper` stores image paths like `"/yummygame/1.png"` and renders `"/images/work" + c.images[0]`.
   - Current impact: path ownership is split between data and renderer, making broken image paths easier to create.
   - Recommended action: store full public image paths or model images as typed objects with `src` and `alt`.

9. Project images have no data-level alt text.
   - Evidence: `GalleryBox` receives only three image paths and uses CSS background images.
   - Current impact: project visuals cannot expose accessible text, audit notes, or proof labels.
   - Recommended action: model each image with `src`, `alt`, and optional caption; render inspectable images where content is meaningful.

10. About page slide data is defined inside the component.
    - Evidence: `memberArrayData` is declared inside `AboutWrapper`.
    - Current impact: the array is recreated on each render and mixes content with slider state logic.
    - Recommended action: move it to module scope or a typed content config; rename it from member data to project/case-study data if it represents work.

11. The About "client" list is aspirational placeholder content but is treated like data.
    - Evidence: `clientArrayData` contains brand names under "Clients i wish i had worked for".
    - Current impact: a portfolio reviewer can confuse placeholder aspirational data with real client proof.
    - Recommended action: remove it or model it explicitly as a playful placeholder, separate from professional proof sections.

12. Skills are hard-coded as repeated boxes.
    - Evidence: `SkillWrapper` renders React, Next JS, Node JS, Express, HTML, JavaScript, CSS/SCSS, and SQL as static JSX.
    - Current impact: adding AI evaluation, RAG testing, observability, or QA automation skills requires editing layout markup.
    - Recommended action: define a `skills` array grouped by domain and render rows from data.

13. Footer copy is duplicated between mobile and desktop blocks.
    - Evidence: `Footer` renders the same headline/email concept in `InfoMobile` and `.info.pc`.
    - Current impact: future copy updates can diverge by breakpoint.
    - Recommended action: extract a footer copy component or data object used by both responsive branches.

14. Metadata is not derived from the same content source as visible page copy.
    - Evidence: `app/layout.tsx` defines `metadata.title` and `metadata.description` separately from homepage copy.
    - Current impact: SEO snippets can drift from the visible portfolio positioning.
    - Recommended action: export site title and description from a profile config and import them into metadata and UI.

15. Repeated decorative text is manually generated in multiple places.
    - Evidence: homepage project marquee repeats `VERIFY AI` across several `Array.from({ length: 10 })` blocks; `GalleryBox` manually repeats `text` spans many times.
    - Current impact: visual repetition logic is embedded in content-heavy components.
    - Recommended action: create a small marquee component that accepts `label`, `repeat`, and direction props.

16. Contact CTA data lacks typed intent.
    - Evidence: email and inquiry labels are plain strings or `href="#"`; there is no model for contact reason, CTA type, or mailto subject.
    - Current impact: the portfolio cannot tailor CTAs for recruiters, consulting leads, or AI QA project inquiries.
    - Recommended action: model contact CTAs with `label`, `href`, `intent`, and optional `mailtoSubject`.

### Verification

- Checked current worktree with `git status --short --branch`.
- Listed app, component, and config files to confirm there are no existing content config modules beyond breakpoints.
- Searched repeated literals and data structures with `rg` for emails, contact labels, social labels, project arrays, client arrays, skill labels, metadata, and image path construction.
- Inspected `MainWrapper`, `Footer`, `AboutWrapper`, `WorkWrapper`, `GalleryBox`, and `app/layout.tsx`.
- Counted repeated email and marquee literals with a UTF-8 Python scan.

### Next Review Angle

- Review accessibility and semantic HTML in detail: buttons vs links, missing labels, image alt text, heading order, focus management, keyboard paths, target blank safety, and decorative SVG handling.
- Consider implementing `config/contact.ts` and `config/projects.ts` first because they would remove repeated high-risk portfolio data without changing visual behavior.

## 2026-05-25 05:00 KST - Review 27

### Scope

- Accessibility and semantic HTML
- Links, buttons, and keyboard paths
- Heading and landmark structure
- Image and SVG labeling
- Focus and overlay behavior

### Findings

1. Pages do not expose a semantic page structure.
   - Evidence: scans found no `<main>`, `<nav>`, `<header>`, `<footer>`, `<h1>`, or `<h2>` in the primary app/page components.
   - Current impact: screen readers and search crawlers receive mostly anonymous `div`/`p` structure.
   - Recommended action: wrap route content in `<main>`, render navigation as `<nav>`, footer as `<footer>`, and promote the primary visual headline to an actual `h1`.

2. Navigation links are implemented as buttons with imperative routing.
   - Evidence: `components/NaviBox.tsx` renders HOME, WORK, and ABOUT as `<button>` elements that call `router.push`.
   - Current impact: users lose normal link affordances such as open-in-new-tab, copied URL, link context, and expected screen-reader semantics.
   - Recommended action: render these items as Next `Link` elements and keep buttons only for opening/closing the menu.

3. The mobile hamburger button has no accessible name.
   - Evidence: `components/NaviBox.tsx:34` renders a visual hamburger button containing only empty `div` bars.
   - Current impact: assistive technology cannot announce what the control does.
   - Recommended action: add `aria-label="Open navigation"` and expose expanded state with `aria-expanded={naviState}`.

4. The mobile overlay close control is an unlabeled full-screen button.
   - Evidence: `components/NaviBox.tsx:48` renders `.dim` as an empty button.
   - Current impact: keyboard and screen-reader users can tab to a nameless control with unclear behavior.
   - Recommended action: label it as "Close navigation", or make the backdrop inert and provide a visible close button.

5. The mobile nav overlay is only visually hidden when closed.
   - Evidence: `NaviBox` moves `.navi-group` to `left: -100%` while leaving its buttons mounted.
   - Current impact: hidden menu controls may remain reachable in the accessibility tree or tab order.
   - Recommended action: toggle `aria-hidden`, use `inert` where supported, manage focus on open/close, and return focus to the hamburger after closing.

6. Footer "back to top" is a clickable `div`.
   - Evidence: `components/Footer.tsx:71` attaches `onClick` to a `div.top`.
   - Current impact: the control is not keyboard accessible by default and has no button semantics.
   - Recommended action: replace it with `<button type="button" aria-label="Back to top">`.

7. External links that open a new tab lack `rel`.
   - Evidence: Footer and About external anchors use `target="_blank"` without `rel="noopener noreferrer"`.
   - Current impact: opened pages keep an unnecessary `window.opener` relationship and audits will flag the links.
   - Recommended action: add a shared external link helper that always applies safe `rel` values.

8. The homepage email link is not actionable.
   - Evidence: `components/main/MainWrapper.tsx:38` renders `<a href="#">soojoon92@gmail.com</a>`.
   - Current impact: the element announces as a link but does not perform a useful contact action.
   - Recommended action: use a real `mailto:` link with a clear subject, or render plain text if it is not meant to be a link.

9. About has an anchor without `href`.
   - Evidence: `components/about/AboutWrapper.tsx:325` renders `<a>` for Twitter without a destination.
   - Current impact: the element looks like a link but is not a valid navigable anchor.
   - Recommended action: provide a real `href`, remove the item, or render it as disabled text with an explicit reason.

10. Icon-only social links rely on image alt text instead of link labels.
    - Evidence: Footer social anchors contain only icon images such as `alt="icoSoundcloud"` and `alt="icoFacebook"`.
    - Current impact: screen readers may announce implementation-oriented icon names rather than clear destinations.
    - Recommended action: add `aria-label` to each anchor and use cleaner alt text, or mark the icon image as decorative with `alt=""`.

11. Project images are implemented as CSS backgrounds.
    - Evidence: `GalleryBox` renders project visuals through `background-image` on `.project` divs.
    - Current impact: meaningful project screenshots are not discoverable by assistive technology and cannot carry alt text.
    - Recommended action: use semantic images or `next/image` for meaningful screenshots, with project-specific alt text from data.

12. Decorative SVGs are not marked as hidden.
    - Evidence: large blackhole and arrow SVGs are rendered inline without `aria-hidden` or `focusable="false"`.
    - Current impact: some assistive tech can include decorative SVGs in the accessibility tree.
    - Recommended action: mark purely decorative SVGs with `aria-hidden="true"` and `focusable="false"`; use labels only for functional SVG controls.

13. Slider arrow buttons have no accessible names.
    - Evidence: About slider buttons contain only decorative SVG arrows and a circle `div`.
    - Current impact: users cannot know whether a button moves to the previous or next project.
    - Recommended action: add `aria-label="Previous project"` and `aria-label="Next project"` and disable buttons at bounds instead of returning `false`.

14. Focus styling is not defined for custom controls.
    - Evidence: searches found hover/cursor styling but no `:focus-visible` styling in the reviewed components.
    - Current impact: keyboard users may not see which custom link or button is active.
    - Recommended action: add global or component-level `:focus-visible` outlines that meet contrast requirements.

15. The Work cards are links but the accessible name is weak and destinations are all `/`.
    - Evidence: `components/works/WorkWrapper.tsx:107` wraps each `GalleryBox` in `<Link href={"/"} key={c.text}>`.
    - Current impact: keyboard and screen-reader users get repeated links to the same destination, with duplicate labels when project titles repeat.
    - Recommended action: link each card to a unique project slug and provide an accessible label such as `View project: {title}`.

16. Visual section titles are mostly paragraphs or `Textfit`.
    - Evidence: main and About headings such as `VERIFIED AI`, `INFO`, and section titles are rendered with `Textfit`, `p`, or styled `div` containers.
    - Current impact: users cannot navigate by headings, and SEO has less reliable page hierarchy.
    - Recommended action: use actual heading tags and style them visually through CSS/Textfit wrappers where needed.

### Verification

- Checked current worktree with `git status --short --branch`.
- Searched semantic/accessibility patterns with `rg` for headings, landmarks, anchors, buttons, images, SVGs, ARIA attributes, `target`, `rel`, focus styles, and click handlers.
- Inspected `NaviBox`, `Footer`, `MainWrapper`, `AboutWrapper`, `WorkWrapper`, and `GalleryBox`.
- Counted key accessibility markers with a UTF-8 Python scan across the same components.

### Next Review Angle

- Review SEO and metadata readiness: per-route metadata, Open Graph/Twitter cards, canonical URLs, sitemap/robots, semantic headings, content language, and whether portfolio proof is indexable.
- Consider an early accessibility fix pass: convert nav items to `Link`, make footer top a button, add `rel` to external links, and add labels for icon-only controls.

## 2026-05-25 06:00 KST - Review 28

### Scope

- SEO and metadata readiness
- Route-level metadata
- Indexable portfolio proof
- Social preview metadata
- Sitemap, robots, and canonical URL coverage

### Findings

1. Only root metadata is defined.
   - Evidence: `app/layout.tsx` is the only source file with `export const metadata`.
   - Current impact: `/`, `/about`, and `/work` share the same generic title and description.
   - Recommended action: add route-level `metadata` or `generateMetadata` in `app/page.tsx`, `app/about/page.tsx`, and `app/work/page.tsx`.

2. There is no `metadataBase`.
   - Evidence: `app/layout.tsx` metadata has `title` and `description`, but no `metadataBase`.
   - Current impact: absolute canonical and social URLs cannot be generated reliably by Next metadata helpers.
   - Recommended action: define `metadataBase` from the production domain once the deployment URL is known.

3. Canonical URLs are not configured.
   - Evidence: no `alternates.canonical` was found in `app/`.
   - Current impact: crawlers have no explicit canonical signal for the homepage, About page, or Work page.
   - Recommended action: add canonical URLs per route through metadata `alternates`.

4. Open Graph metadata is missing.
   - Evidence: searches found no `openGraph` metadata in `app/`.
   - Current impact: portfolio links shared in chat, social feeds, and recruiting tools may render with weak or generic previews.
   - Recommended action: define Open Graph title, description, URL, site name, locale, type, and preview image.

5. Twitter card metadata is missing.
   - Evidence: searches found no `twitter` metadata in `app/`.
   - Current impact: shared links on Twitter/X-like previews will not have a controlled card.
   - Recommended action: add `twitter.card`, title, description, and image metadata once an OG image exists.

6. There is no sitemap route or static sitemap file.
   - Evidence: neither `app/sitemap.ts` nor `public/sitemap.xml` exists.
   - Current impact: crawlers have to discover the small route set only through links.
   - Recommended action: add `app/sitemap.ts` with `/`, `/about`, `/work`, and future project detail URLs.

7. There is no robots route or static robots file.
   - Evidence: neither `app/robots.ts` nor `public/robots.txt` exists.
   - Current impact: crawler policy is implicit and cannot point to a sitemap.
   - Recommended action: add `app/robots.ts` with allow rules and sitemap location.

8. The route pages do not expose visible semantic headlines.
   - Evidence: scans found no `<h1>` or `<h2>` in `app/page.tsx`, `app/about/page.tsx`, `app/work/page.tsx`, or their main wrappers.
   - Current impact: search engines and assistive tools get weak page topic signals.
   - Recommended action: add one meaningful `h1` per route while preserving the current visual style.

9. The Work page has no indexable project detail routes.
   - Evidence: `app/work/page.tsx` only renders `WorkWrapper`; no `app/work/[slug]/page.tsx` exists.
   - Current impact: each project cannot have its own title, description, canonical URL, or share preview.
   - Recommended action: add typed project data and generate static detail routes from project slugs.

10. Work cards link to the homepage.
    - Evidence: `components/works/WorkWrapper.tsx:107` renders `<Link href={"/"} key={c.text}>`.
    - Current impact: crawlers and visitors cannot reach project-specific proof from the Work grid.
    - Recommended action: link cards to `/work/{slug}` and expose project summaries in semantic text.

11. Project proof is largely visual and not indexable.
    - Evidence: `GalleryBox` renders screenshots as CSS `background-image` divs and only exposes the project title text.
    - Current impact: search engines cannot understand the work proof, role, stack, challenge, validation method, or result.
    - Recommended action: render project summaries, stack, and verification outcomes as text near each project.

12. The homepage primary signal is rendered through visual components, not semantic metadata or headings.
    - Evidence: `components/main/MainWrapper.tsx` uses `Textfit`, paragraphs, styled divs, and background images for the main message.
    - Current impact: the intended AI validation positioning is less machine-readable than it should be.
    - Recommended action: make the main "AI validation engineer" proposition an `h1` and align it with route metadata.

13. Metadata is not sourced from shared content data.
    - Evidence: `app/layout.tsx` hard-codes metadata separately from visible homepage copy.
    - Current impact: SEO snippets can drift from the portfolio copy during future AI-developer messaging edits.
    - Recommended action: export site profile fields from a typed config and import them into metadata and UI.

14. There is no social preview image asset.
    - Evidence: no `opengraph-image.*`, `twitter-image.*`, or obvious OG preview asset was found in `app/` or `public/`.
    - Current impact: link previews will not show a controlled portfolio card.
    - Recommended action: create a 1200x630 OG image focused on the AI validation positioning and register it in metadata.

15. The site still ships default public assets.
    - Evidence: `public/next.svg` and `public/vercel.svg` remain in the project.
    - Current impact: default starter assets are harmless but add noise and can accidentally be referenced later.
    - Recommended action: remove unused starter assets once confirmed unused.

16. Language is set globally to Korean, but some visible labels are English-only or placeholder-style.
    - Evidence: `app/layout.tsx` sets `<html lang="ko">`, while navigation, work labels, social labels, and skill labels are mostly English.
    - Current impact: language metadata is broadly correct for Korean copy but does not fully describe mixed-language content.
    - Recommended action: keep `lang="ko"` for the page, but use `lang="en"` on substantial English labels only if pronunciation or screen-reader output matters.

### Verification

- Checked current worktree with `git status --short --branch`.
- Listed `app`, `public`, `config`, and component files to verify SEO-related route/file coverage.
- Searched for `metadata`, `generateMetadata`, Open Graph, Twitter, canonical, robots, sitemap, manifest, headings, and image patterns.
- Inspected `app/layout.tsx`, the three route page files, `MainWrapper`, `WorkWrapper`, and `GalleryBox`.
- Counted route metadata and heading markers with a UTF-8 Python scan.

### Next Review Angle

- Review deployment and production runtime readiness: build/start scripts, PM2 config, environment assumptions, lockfile consistency, Next config, static asset serving, and whether the project can be deployed repeatably.
- Consider adding route-level metadata and `app/sitemap.ts` first; they are low-risk SEO improvements once the production domain is known.

## 2026-05-25 07:00 KST - Review 29

### Scope

- Deployment and production runtime readiness
- Package manager and install reproducibility
- Build/start script semantics
- PM2 process configuration
- Runtime environment assumptions

### Findings

1. The project has two package lockfiles.
   - Evidence: both `package-lock.json` and `yarn.lock` are tracked.
   - Current impact: production installs can resolve different dependency trees depending on whether npm or Yarn is used.
   - Recommended action: choose one package manager, remove the other lockfile, and document the exact install command.

2. `package.json` does not declare `packageManager`.
   - Evidence: no `packageManager` field exists in `package.json`.
   - Current impact: Corepack cannot enforce a consistent package manager/version for developers or CI.
   - Recommended action: add a field such as `packageManager: "yarn@1.22.22"` or standardize on npm and remove Yarn usage.

3. `npm ci --dry-run` currently fails.
   - Evidence: `npm ci --dry-run` fails with `ERESOLVE` because `react-textfit@1.1.1` declares React peer support for `^15.0.0 || ^16.0.0` while the project uses React 18.
   - Current impact: a clean npm-based CI or production install is not repeatable without `--legacy-peer-deps` or dependency changes.
   - Recommended action: replace `react-textfit`, remove it, or explicitly standardize on a package manager path that can install the project.

4. Yarn install also has reproducibility risk in the current workspace.
   - Evidence: `corepack yarn install --frozen-lockfile --ignore-scripts --non-interactive` warns about mixed lockfiles and `react-textfit` peer dependencies, then fails with `EPERM` while removing `node_modules/.bin`.
   - Current impact: a developer or server updating dependencies in this OneDrive-backed workspace can corrupt local install shims.
   - Recommended action: avoid installing inside synced folders for production work, and validate a clean clone install path in CI.

5. The `start` script rebuilds before starting.
   - Evidence: `package.json` defines `"start": "next build && next start"`.
   - Current impact: production start becomes slow and failure-prone because each restart performs a full build.
   - Recommended action: use `"start": "next start"` and run `"build": "next build"` in a separate deploy step.

6. PM2 starts Next without building.
   - Evidence: `ecosystem.config.js` uses `script: "next"` and `args: "start"`.
   - Current impact: PM2 assumes a valid `.next` build already exists, but `only-start` does not create it.
   - Recommended action: document the required `yarn build`/`npm run build` step before `pm2 start`, or deploy a prebuilt artifact.

7. There is no current `.next` production artifact.
   - Evidence: `.next` is missing in the current workspace.
   - Current impact: `next start` or the PM2 config cannot serve the app until a build succeeds.
   - Recommended action: make build success a required deployment gate and avoid treating PM2 start as a full deployment command.

8. PM2 production environment variables are commented out.
   - Evidence: `env_production` with `NODE_ENV` and `PORT` is present only in comments in `ecosystem.config.js`.
   - Current impact: `pm2 start ecosystem.config.js --env production` does not actually apply the intended production port or environment settings.
   - Recommended action: uncomment and verify `env_production`, or move runtime configuration to the deployment platform.

9. PM2 instances are set to 4 without cluster mode.
   - Evidence: `instances: 4` is set, while `exec_mode: "cluster"` is commented out.
   - Current impact: PM2 defaults can be misunderstood, and multiple Next processes may not behave as intended.
   - Recommended action: either set `exec_mode: "cluster"` deliberately or run one instance behind the platform's process manager.

10. The app does not use Next standalone output.
    - Evidence: `next.config.mjs` only enables `compiler.styledComponents`; there is no `output: "standalone"`.
    - Current impact: server deployments must ship the full install rather than a smaller standalone server bundle.
    - Recommended action: consider `output: "standalone"` if deploying to a custom Node server or PM2.

11. Node version is only documented in README.
    - Evidence: `README.md` mentions `v20.12.2`, but `package.json` has no `engines` and there is no `.nvmrc`.
    - Current impact: hosting providers and CI can use a different Node version.
    - Recommended action: add `engines.node` and optionally `.nvmrc` or `.node-version`.

12. There is no CI workflow.
    - Evidence: no tracked `.github/workflows` files were found.
    - Current impact: typecheck, lint, install, and build regressions are only caught manually.
    - Recommended action: add a CI workflow that runs install, typecheck, lint, and build on pull requests.

13. The lint script uses the legacy Next lint command.
    - Evidence: `package.json` defines `"lint": "next lint"` on Next 14.2.3.
    - Current impact: the project is tied to a Next lint path that has been deprecated in newer Next versions.
    - Recommended action: migrate toward direct ESLint invocation when upgrading Next.

14. Production deployment docs are incomplete.
    - Evidence: `README.md` only covers local dev commands and a Node version note; it does not describe build, start, PM2, port, or package manager decisions.
    - Current impact: a fresh deployment depends on implicit operator knowledge.
    - Recommended action: add a deployment section with the chosen install command, build command, start command, env vars, and rollback notes.

15. The custom `only-start` script name hides what it does.
    - Evidence: `package.json` defines `"only-start": "pm2 start ecosystem.config.js --env production"`.
    - Current impact: the name suggests a server start, but it actually delegates to PM2 and depends on a prior build.
    - Recommended action: rename it to `pm2:start` or `deploy:start` and pair it with explicit `pm2:reload` and `pm2:stop` scripts.

16. The current install state was disturbed by an install attempt.
    - Evidence: after the failed Yarn install, `node_modules/.bin/tsc` and `node_modules/.bin/next` are missing, while the package binaries still exist under `node_modules/typescript/bin` and `node_modules/next/dist/bin`.
    - Current impact: scripts relying on `.bin` shims may fail until dependencies are reinstalled cleanly.
    - Recommended action: perform dependency install in a clean, non-synced workspace and avoid relying on the current `node_modules` state as production evidence.

### Verification

- Checked current worktree with `git status --short --branch`.
- Inspected `package.json`, `ecosystem.config.js`, `next.config.mjs`, `README.md`, `.gitignore`, `.editorconfig`, `.prettierrc`, and `.eslintrc.json`.
- Listed tracked deployment-related files and confirmed both npm and Yarn lockfiles are tracked.
- Checked that `.next` is missing in the current workspace.
- Ran `npm ci --dry-run` and recorded the React peer dependency failure.
- Ran `corepack yarn install --frozen-lockfile --ignore-scripts --non-interactive` and recorded the mixed-lockfile warnings plus `EPERM` failure.
- Checked Node/npm/Corepack/Yarn versions and confirmed TypeScript/Next package binaries still exist outside `.bin`.

### Next Review Angle

- Review security and dependency risk: outdated packages, peer dependency mismatches, unused dependencies, external links, third-party runtime surface, and whether dependency upgrades need a controlled plan.
- Consider stabilizing installs before production work: pick npm or Yarn, fix/remove `react-textfit`, add `packageManager` or `engines`, and rebuild from a clean clone.

## 2026-05-25 08:00 KST - Review 30

### Scope

- Security and dependency risk
- Audit findings and upgrade pressure
- Lockfile trust boundaries
- External link hygiene
- Third-party runtime surface

### Findings

1. `npm audit` reports a critical direct dependency issue through Next.
   - Evidence: `npm audit --json` reports `next` as a direct critical vulnerability with a non-major fix available at `14.2.35`.
   - Current impact: the deployed framework version has known advisories affecting cache, middleware, image optimization, server components, and request handling.
   - Recommended action: plan an immediate patch upgrade from `next@14.2.3` to a safe 14.2.x version, then rerun typecheck, lint, build, and visual smoke checks.

2. Audit output contains 18 total vulnerabilities.
   - Evidence: audit metadata reports 7 moderate, 10 high, and 1 critical vulnerability across 325 dependencies.
   - Current impact: even if many are transitive or dev-only, the project has no clean security baseline.
   - Recommended action: create a dependency remediation pass that separates production runtime fixes from dev tooling fixes.

3. `eslint-config-next` is directly vulnerable through its transitive chain.
   - Evidence: `npm audit --json` reports `eslint-config-next` as a direct high severity finding through `@next/eslint-plugin-next` and `glob`.
   - Current impact: lint tooling introduces high-severity dev dependency risk.
   - Recommended action: upgrade Next lint tooling in a controlled branch and be ready for semver-major ESLint/Next lint changes.

4. `package-lock.json` is stale relative to `package.json`.
   - Evidence: the root package in `package-lock.json` lists only `next`, `react`, and `react-dom` as dependencies, while `package.json` also lists Lenis, styled-components, Zustand, classnames, react-use, and react-textfit.
   - Current impact: npm audit/install evidence is incomplete for the declared package manifest.
   - Recommended action: regenerate the chosen lockfile from a clean install after deciding npm vs Yarn.

5. Several declared runtime dependencies are absent from `package-lock.json`.
   - Evidence: `node_modules/react-textfit`, `node_modules/@studio-freight/react-lenis`, `node_modules/lenis`, `node_modules/react-use`, `node_modules/styled-components`, `node_modules/zustand`, and `node_modules/classnames` are missing from the lockfile package map.
   - Current impact: npm-based environments may not install the same runtime surface as the current workspace expects.
   - Recommended action: do not treat the npm lockfile as authoritative until it is regenerated or removed.

6. `react-textfit` is both incompatible and security-maintenance risky.
   - Evidence: npm install checks report `react-textfit@1.1.1` has React peer support only for React 15/16, while this project uses React 18.
   - Current impact: future React or Next upgrades can break around an unmaintained layout dependency.
   - Recommended action: replace `react-textfit` with CSS clamp/container sizing or a maintained fit-text utility.

7. Next is pinned, but React is range-based.
   - Evidence: `package.json` pins `next` to `14.2.3` but uses `react: "^18"` and `react-dom: "^18"`.
   - Current impact: React can move within the major while Next stays old, creating unplanned compatibility combinations.
   - Recommended action: pin React/ReactDOM to a tested patch version or update the full Next/React stack together.

8. `npm outdated` shows the framework is far behind current major versions.
   - Evidence: `npm outdated --json` reports `next` current/wanted `14.2.3` and latest `16.2.6`.
   - Current impact: a future upgrade will likely involve multiple migration steps, not just a patch.
   - Recommended action: first apply the latest safe 14.2 patch, then plan a separate major upgrade path.

9. Some dependencies are likely unused or redundant.
   - Evidence: `styled` is declared in `package.json` but no `from "styled"` import was found; `zustand` is only used by a route store with no active consumer; `@studio-freight/react-lenis` is declared while runtime code imports from `lenis/react`.
   - Current impact: unused packages expand install and audit surface without product value.
   - Recommended action: remove unused dependencies after confirming imports and lockfiles in a clean branch.

10. The project has two Lenis-related packages.
    - Evidence: dependencies include both `@studio-freight/react-lenis` and `lenis`, but `lib/smoothScrolling.tsx` imports `ReactLenis` from `lenis/react`.
    - Current impact: scroll behavior ownership is unclear and may carry old package surface unnecessarily.
    - Recommended action: keep one Lenis integration path and remove the unused package.

11. External links still miss safe new-tab attributes.
    - Evidence: Footer and About links use `target="_blank"` without `rel="noopener noreferrer"`.
    - Current impact: opened pages can access `window.opener`, and security audits will flag the pattern.
    - Recommended action: add a shared external link component or helper that always sets `rel`.

12. Footer links to a generic external site under a social icon.
    - Evidence: `components/Footer.tsx` renders the Facebook icon link with `href="https://www.naver.com/"`.
    - Current impact: users can be sent to an unexpected destination, which weakens trust and can look like a phishing or placeholder link.
    - Recommended action: remove placeholder links or replace them with verified profile URLs.

13. There is no security header configuration.
    - Evidence: `next.config.mjs` has no `headers()` configuration for CSP, frame protections, referrer policy, or permissions policy.
    - Current impact: the site relies on platform defaults for browser security controls.
    - Recommended action: add a conservative baseline header set after confirming image/font/script needs.

14. The app does not use dangerous HTML APIs today.
    - Evidence: searches found no `dangerouslySetInnerHTML`, `eval`, `Function`, `document.cookie`, `innerHTML`, `outerHTML`, `window.open`, or `postMessage` usage in app/components/lib.
    - Current impact: direct XSS and arbitrary execution risk from local code is currently lower than the dependency/runtime risk.
    - Recommended action: keep this invariant and add lint rules or review checks before introducing rich text or embedded content.

15. Public image paths are local, but image optimization risk still follows Next version.
    - Evidence: project visuals are local CSS backgrounds and plain `<img>` icons; audit still reports multiple Next image optimization advisories for the installed Next version.
    - Current impact: current usage may reduce exposure, but framework advisories still matter if `next/image` or optimizer routes are added later.
    - Recommended action: patch Next before expanding image optimization usage.

16. There is no automated dependency policy.
    - Evidence: no CI workflow, Renovate, Dependabot, audit script, or package manager policy file was found.
    - Current impact: security updates are manual and easy to miss.
    - Recommended action: add Dependabot or Renovate, plus a CI audit/typecheck/build gate after lockfile stabilization.

### Verification

- Checked current worktree with `git status --short --branch`.
- Searched app and config code for external links, unsafe HTML APIs, storage/cookie APIs, environment usage, router imports, image patterns, and dependency imports.
- Ran `npm audit --json` and recorded the critical Next finding plus total vulnerability counts.
- Ran `npm outdated --json` and recorded outdated framework, React, tooling, and utility packages.
- Inspected `package.json`, `package-lock.json`, and `yarn.lock` dependency evidence.
- Confirmed the npm lockfile root dependency set does not match the current package manifest.

### Next Review Angle

- Review maintainability and refactor sequencing: which fixes should be batched first, dependency cleanup order, component extraction order, risk of touching large wrappers, and a practical stabilization roadmap.
- Consider the first security fix to be a clean dependency baseline: pick one lockfile, remove unused packages, replace `react-textfit`, patch Next within 14.2.x, and add CI.

## 2026-05-25 09:00 KST - Review 31

### Scope

- Maintainability and refactor sequencing
- Large wrapper risk
- Dependency cleanup order
- Component extraction order
- Practical stabilization roadmap

### Findings

1. The largest components are also the highest-risk edit targets.
   - Evidence: `AboutWrapper.tsx` has 971 lines and `MainWrapper.tsx` has 947 lines.
   - Current impact: copy, styling, state, animation, data, and layout changes collide in the same files.
   - Recommended action: avoid starting with broad rewrites; first extract data and low-risk shared helpers.

2. `AboutWrapper` combines at least six responsibilities.
   - Evidence: it owns contact rail copy, biography copy, slider data, slider state, scroll transform effects, client list, skills, social links, footer, and transition overlay.
   - Current impact: changing one area can accidentally affect scroll behavior, slider behavior, or page layout.
   - Recommended action: split in stages: data constants, contact rail, slider, skill list, social list, then scroll behavior.

3. `MainWrapper` combines content, hero media, CTA, gallery, marquee, and page transition state.
   - Evidence: it imports `Textfit`, `Link`, `FooterComponent`, `EffectComponent`, Playfair font, shared wrappers, and contains 13 styled component definitions.
   - Current impact: portfolio copy changes and visual gallery changes are tightly coupled.
   - Recommended action: first move homepage copy to `config/home.ts`, then extract `HeroSection`, `ValidationAreas`, and `HomeProjectPreview`.

4. `WorkWrapper` is smaller but still repeats page shell concerns.
   - Evidence: it repeats contact rail markup, scroll transform effect, page transition state, footer, and shared left/right wrappers.
   - Current impact: fixes to About rail/scroll behavior must be duplicated in Work.
   - Recommended action: extract a shared `ContactRail` and `PageShell` before changing page-specific work data.

5. Contact data should be extracted before visual refactors.
   - Evidence: contact email/address/inquiry labels appear in Main, About, Work, and Footer.
   - Current impact: a content fix touches several large components.
   - Recommended action: create `config/contact.ts` and update consumers in a small PR that preserves current markup.

6. Project data should be extracted before adding project routes.
   - Evidence: Work project data is a local `workArray`; homepage project preview hard-codes product image paths separately.
   - Current impact: adding `/work/[slug]` without shared data will duplicate content again.
   - Recommended action: introduce `config/projects.ts` with stable `slug`, title, images, summary, stack, and proof fields before route work.

7. Dependency cleanup should happen before UI component rewrites.
   - Evidence: `react-textfit` affects multiple large wrappers and blocks clean npm install; Next also needs a patch upgrade.
   - Current impact: a UI refactor can be obscured by install/framework noise.
   - Recommended action: stabilize lockfile/package manager, patch Next, and replace/remove `react-textfit` before major layout edits.

8. `Textfit` removal has broad visual blast radius.
   - Evidence: `Textfit` appears in Main and About, and About/Work import it even where not clearly needed.
   - Current impact: replacing it may shift major heading and layout dimensions.
   - Recommended action: isolate `Textfit` behind a local `ResponsiveHeadline` component first, then replace the implementation after screenshots exist.

9. Shared layout wrappers are too primitive for the repeated page shell.
   - Evidence: `LeftWrapper` and `RightWrapper` only wrap children, while page-level sections repeatedly assemble rails, right content, footer, and transition overlay.
   - Current impact: repeated composition remains in every page.
   - Recommended action: create a `PortfolioPageShell` only after contact rail and transition overlay props are clarified.

10. `EffectBox` is a good early refactor candidate.
    - Evidence: it is 220 lines, has isolated responsibilities, and its issues are clear: timeout cleanup, ref guards, unused state, and repeated spans.
    - Current impact: fixing it reduces lifecycle risk without touching main layout structure.
    - Recommended action: refactor `EffectBox` before About/Main layout extraction.

11. `GalleryBox` is another isolated candidate, but it depends on project data modeling.
    - Evidence: it has typed `any` image props, repeated span markup, and CSS background screenshots.
    - Current impact: improving it without project data can produce another temporary API.
    - Recommended action: extract project image data first, then refactor `GalleryBox` to accept typed image objects and render repeated marquee through a helper.

12. `Footer` is a medium-risk shared component.
    - Evidence: `Footer.tsx` has 302 lines, repeated mobile/desktop copy, external links, icon images, and back-to-top behavior.
    - Current impact: a footer fix affects all routes.
    - Recommended action: first centralize footer/contact/social data; then convert the top control and external links.

13. Dead scaffold files should be removed early after confirming no imports.
    - Evidence: `List.tsx`, `ListItem.tsx`, `ListDetail.tsx`, and `works/CatchCatch.tsx` appear as small scaffold remnants.
    - Current impact: they add search noise and can confuse future ownership decisions.
    - Recommended action: run an import search and delete unused scaffold files in a focused cleanup.

14. Naming cleanup should be low priority unless the module is already touched.
    - Evidence: `breakboint.ts`, `SwipeWrppaer`, and `border-gorup` are misspelled.
    - Current impact: renaming has import/style selector churn but limited user-visible benefit.
    - Recommended action: fix names opportunistically during nearby edits, not as a standalone high-risk sweep.

15. Review findings should be converted into an ordered backlog before implementation.
    - Evidence: the review document now contains repeated issues across accessibility, SEO, data, dependency, lifecycle, and responsive reviews.
    - Current impact: without a sequenced backlog, fixes can start in the most visible but riskiest files.
    - Recommended action: add a roadmap section or issue list grouped by `install baseline`, `content data`, `safe accessibility`, `SEO`, `component extraction`, and `visual QA`.

16. The safest first implementation batch is not visual.
    - Evidence: low-risk changes include removing unused scaffold/dependencies, centralizing contact/social/project data, adding metadata/sitemap, and adding ARIA/rel labels.
    - Current impact: these improve reliability and portfolio trust without large visual regressions.
    - Recommended action: delay broad responsive/layout redesign until a dev server and screenshot QA path are stable.

### Verification

- Checked current worktree with `git status --short --branch`.
- Measured source file sizes across `app`, `components`, `config`, `lib`, `stores`, and `styles`.
- Searched responsibilities and coupling markers: data arrays, hooks, refs, Textfit, page shells, wrappers, links, background images, repeated arrays, contact text, and shared components.
- Inspected `MainWrapper`, `AboutWrapper`, `WorkWrapper`, `GalleryBox`, `Footer`, `NaviBox`, and `EffectBox`.
- Counted selected risk markers per major component with a UTF-8 Python scan.

### Next Review Angle

- Review visual asset and media strategy: image sizes, background images vs semantic images, optimization path, public asset hygiene, alt text readiness, and how asset choices affect performance and portfolio proof.
- Consider turning the accumulated findings into an implementation roadmap before touching the 900-line wrappers.

## 2026-05-25 10:00 KST - Review 32

### Scope

- Visual asset and media strategy
- Image size and format risk
- CSS background images vs semantic images
- Optimization path and public asset hygiene
- Portfolio proof readability

### Findings

1. The public image payload is large for a portfolio.
   - Evidence: `public/images` contains 20 files totaling about 20.9 MB.
   - Current impact: even a small portfolio can become slow if large images are requested early or repeatedly.
   - Recommended action: set an image budget and compress/resize assets before broader visual work.

2. The largest single asset is oversized.
   - Evidence: `public/images/img_user_1.jpg` is 3543x3543 and about 6.98 MB.
   - Current impact: the About slider can require a multi-megabyte transfer for one image.
   - Recommended action: generate responsive derivatives and use a smaller display-size source.

3. Product PNGs are heavy for animated previews.
   - Evidence: `img_product_second.png` is 1150x1558 at about 2.89 MB and `img_product_third.png` is 1228x1628 at about 3.54 MB.
   - Current impact: the homepage hover preview can load large transparent/raster assets for decorative animation.
   - Recommended action: convert to optimized WebP/AVIF or right-size PNGs after checking alpha-channel needs.

4. Work gallery images are repeated across multiple cards.
   - Evidence: `WorkWrapper` repeats the same `/images/work/yummygame/{1,2,3}.png` set for four cards.
   - Current impact: the UI looks like it has multiple projects but relies on the same asset proof.
   - Recommended action: make project image ownership data-driven and avoid duplicate placeholder cards.

5. Meaningful project images are rendered as CSS backgrounds.
   - Evidence: `GalleryBox` uses `background-image` for all three project screenshots.
   - Current impact: project proof images cannot carry alt text, dimensions, loading policy, or priority hints.
   - Recommended action: render meaningful screenshots with `next/image` or semantic `<img>` elements using typed `alt` data.

6. Homepage product images are also CSS backgrounds.
   - Evidence: `MainWrapper` uses background images for `img_product_first.png`, `img_product_second.png`, and `img_product_third.png`.
   - Current impact: the browser cannot get explicit width/height metadata from markup, and assistive tech cannot identify the visual proof.
   - Recommended action: decide whether these are decorative; if proof, render semantic images; if decorative, reduce size and mark the container hidden from accessibility.

7. About slider profile/work images are CSS backgrounds from inline style.
   - Evidence: `AboutWrapper` builds `backgroundImage: url('/images/img_user_${user.user_idx}.jpg')`.
   - Current impact: the image path is tied to a numeric id convention and has no alt/caption data.
   - Recommended action: model each slide image as `{ src, alt, width, height }` and render through a component.

8. The app does not use `next/image` at all.
   - Evidence: searches found no `next/image` import or `<Image>` usage.
   - Current impact: the project misses built-in sizing, lazy loading, format negotiation, and responsive image generation.
   - Recommended action: introduce `next/image` only after patching Next to a safe version and defining image data.

9. Image loading policy is absent.
   - Evidence: reviewed image usage has no `priority`, `loading`, or `sizes` attributes.
   - Current impact: above-the-fold and below-the-fold images are not intentionally prioritized.
   - Recommended action: mark the true hero image as priority and lazy-load gallery/work images.

10. Footer icons use plain `<img>` with weak alt text.
    - Evidence: `Footer` icon alt values are implementation names like `icoSoundcloud`, `icoFacebook`, and `icoInsta`.
    - Current impact: icons do not provide clear destination semantics.
    - Recommended action: put labels on the links and use empty alt for decorative icons, or use descriptive alt text matching the destination.

11. An icon asset is much larger than necessary.
    - Evidence: `ico_soundcloud.png` is a 512x512 JPEG at about 23 KB while displayed at 20x20 CSS pixels.
    - Current impact: a tiny icon carries avoidable bytes and format mismatch.
    - Recommended action: replace social icons with SVGs or a small icon component.

12. There are unused public assets.
    - Evidence: searches found no current source references to `img_main.jpg`, `ico_twitter.png`, `ico_arrow_left.svg`, `ico_arrow_right.svg`, `public/next.svg`, or `public/vercel.svg`.
    - Current impact: unused assets add repository noise and can confuse future asset ownership.
    - Recommended action: confirm manually and remove unused assets in a cleanup pass.

13. The project lacks an asset manifest or ownership data.
    - Evidence: image paths are hard-coded in components and assembled by string concatenation.
    - Current impact: it is hard to know which images are proof, decoration, placeholders, or social icons.
    - Recommended action: create typed `media` or project image data with role, source, alt, dimensions, and usage notes.

14. There is no clear OG/social preview asset.
    - Evidence: no `opengraph-image.*` or `twitter-image.*` was found during the SEO review, and current public images are not shaped as a share card.
    - Current impact: social previews cannot present the AI validation portfolio positioning consistently.
    - Recommended action: create a dedicated 1200x630 social image rather than reusing arbitrary gallery assets.

15. Image dimensions are not encoded near render sites.
    - Evidence: CSS backgrounds and inline style URLs do not include intrinsic dimensions in component props.
    - Current impact: layout sizing is controlled by CSS boxes, making crop and aspect-ratio regressions harder to test.
    - Recommended action: store dimensions with image metadata and use aspect-ratio containers consistently.

16. Asset optimization should happen before screenshot QA.
    - Evidence: current largest files and background usage can affect load timing and perceived layout state.
    - Current impact: visual QA snapshots may capture slow-loading or inconsistently framed images.
    - Recommended action: normalize image formats/sizes before adding Playwright screenshot baselines.

### Verification

- Checked current worktree with `git status --short --branch`.
- Listed `public/images` recursively by file size and grouped asset bytes by extension.
- Used Pillow to inspect image dimensions and formats where possible.
- Searched source for `next/image`, `<Image>`, `<img>`, `background-image`, `backgroundImage`, image paths, alt text, priority/loading/sizes attributes, and unused public asset references.
- Inspected `MainWrapper`, `AboutWrapper`, `WorkWrapper`, `GalleryBox`, `Footer`, and `next.config.mjs`.

### Next Review Angle

- Review testing strategy and QA automation: typecheck/lint/build reliability, Playwright feasibility, visual regression points, route smoke tests, and how to verify fixes before touching visual-heavy components.
- Consider starting media work by creating typed image metadata and deleting confirmed unused starter assets after a clean import search.

## 2026-05-25 11:00 KST - Review 33

### Scope

- Testing strategy and QA automation
- Typecheck, lint, and build reliability
- Route smoke test coverage
- Visual regression feasibility
- CI readiness

### Findings

1. There is no dedicated test script.
   - Evidence: `package.json` defines `dev`, `build`, `start`, `lint`, and `only-start`, but no `test` script.
   - Current impact: behavioral checks are entirely manual.
   - Recommended action: add a `test` script once a test runner is chosen, even if the first version only runs smoke tests.

2. There is no typecheck script.
   - Evidence: `tsconfig.json` supports `noEmit`, but `package.json` does not expose `tsc --noEmit`.
   - Current impact: contributors must know the hidden command or rely on `next build`.
   - Recommended action: add `"typecheck": "tsc --noEmit"` after dependency shims are restored.

3. Local `.bin` shims are missing.
   - Evidence: `node_modules/.bin/tsc` and `node_modules/.bin/next` are missing, while `node_modules/typescript/bin/tsc` and `node_modules/next/dist/bin/next` still exist.
   - Current impact: package scripts may fail locally even though direct binary paths work.
   - Recommended action: restore dependencies from a clean install in a non-synced workspace before relying on script-based QA.

4. TypeScript checking currently passes through the direct binary path.
   - Evidence: `node .\node_modules\typescript\bin\tsc --noEmit` exits successfully.
   - Current impact: the TypeScript surface is currently clean, but the command is not encoded as a project gate.
   - Recommended action: wire this into CI after package manager stabilization.

5. Lint currently passes with warnings.
   - Evidence: `node .\node_modules\next\dist\bin\next lint` exits successfully but reports three `@next/next/no-img-element` warnings in `components/Footer.tsx`.
   - Current impact: lint does not block today, but image performance warnings are visible and repeat during build.
   - Recommended action: fix the footer images or intentionally configure the rule only after media strategy is decided.

6. Production build currently succeeds.
   - Evidence: `node .\node_modules\next\dist\bin\next build` compiled, linted, typechecked, generated 7 static pages, and emitted routes for `/`, `/about`, and `/work`.
   - Current impact: the app has a viable build path in the current state.
   - Recommended action: preserve this as a required CI gate before visual or dependency refactors.

7. Build still emits maintenance warnings.
   - Evidence: build output repeats the three Footer `<img>` warnings and two Browserslist `caniuse-lite is outdated` messages.
   - Current impact: warning noise can hide future meaningful warnings.
   - Recommended action: reduce known warnings to zero before enforcing stricter CI.

8. Build artifacts are large enough to matter in this workspace.
   - Evidence: the generated `.next` directory contains 235 files totaling about 52.8 MB.
   - Current impact: repeated build attempts consume disk in a workspace that has already hit space pressure.
   - Recommended action: document cleanup and run CI/build work outside OneDrive or on clean runners.

9. There are no route smoke tests.
   - Evidence: source search found no Playwright, Cypress, Jest, Vitest, Storybook, or route test files.
   - Current impact: `/`, `/about`, and `/work` can build but still break visually or interactively without automated detection.
   - Recommended action: add a minimal Playwright smoke suite that checks each route renders, has no console errors, and exposes key text.

10. There is no visual regression coverage.
    - Evidence: no screenshot test, Storybook, Percy, Chromatic, or Playwright screenshot baseline exists.
    - Current impact: responsive and animation regressions in the highly visual layout are manual-only.
    - Recommended action: add screenshot checks only after image optimization and dev server stability are addressed.

11. There is no accessibility automation.
    - Evidence: `axe-core` appears only as a transitive package in the npm lockfile; there is no project-level axe or accessibility test.
    - Current impact: repeated nav/link/label issues can return without detection.
    - Recommended action: add axe checks to the Playwright smoke pass after semantic HTML fixes begin.

12. There is no CI workflow.
    - Evidence: no tracked `.github/workflows` directory exists.
    - Current impact: install, typecheck, lint, build, and future smoke tests are not enforced before push.
    - Recommended action: add a CI workflow after choosing one package manager and restoring a clean lockfile.

13. Current scripts mix development, build, and runtime concerns.
    - Evidence: `start` runs `next build && next start`, while `only-start` delegates to PM2.
    - Current impact: a future CI pipeline cannot clearly separate install, typecheck, build, and runtime smoke phases.
    - Recommended action: split scripts into `typecheck`, `lint`, `build`, `start`, `pm2:start`, and `verify`.

14. There is no quality gate for image budgets.
    - Evidence: prior media review found about 20.9 MB of public images, but no script checks file size budgets.
    - Current impact: future assets can grow without triggering any automated warning.
    - Recommended action: add a lightweight asset budget script before adding visual regression baselines.

15. There is no dependency audit gate.
    - Evidence: `npm audit` found vulnerabilities, but there is no `audit` script or CI policy.
    - Current impact: security regressions stay manual.
    - Recommended action: add dependency audit policy after the stale lockfile problem is resolved.

16. QA should be introduced in phases.
    - Evidence: build works, lint warns, typecheck passes, install state is damaged, and no route/visual/accessibility tests exist.
    - Current impact: adding all QA at once would mix infrastructure repairs with product checks.
    - Recommended action: sequence as `install baseline`, `typecheck/lint/build scripts`, `CI`, `route smoke`, `accessibility checks`, then `visual regression`.

### Verification

- Checked current worktree with `git status --short --branch`.
- Searched the repository for test, spec, Playwright, Cypress, Jest, Vitest, Storybook, coverage, CI, Lighthouse, axe, lint, build, and script references.
- Inspected `package.json`, `tsconfig.json`, `.eslintrc.json`, and `next.config.mjs`.
- Confirmed project-level `.github` workflow files are missing.
- Confirmed `.bin` shims for `tsc` and `next` are missing while package binary entry points still exist.
- Ran direct typecheck, direct Next lint, and direct Next build.
- Measured generated `.next` artifact size after build.

### Next Review Angle

- Review routing and information architecture: current route set, missing project detail routes, navigation semantics, conversion paths, page hierarchy, and how the portfolio should scale beyond three routes.
- Consider adding `typecheck`, `verify`, and a minimal CI workflow after package manager cleanup restores script reliability.

## 2026-05-25 12:00 KST - Review 34

### Scope

- Routing and information architecture
- Current route inventory and navigation semantics
- Project proof paths and conversion paths
- Page hierarchy for portfolio scalability
- Crawler-readable route exposure

### Findings

1. The public route tree is too flat for a proof-driven portfolio.
   - Evidence: the only app routes are `app/page.tsx`, `app/about/page.tsx`, and `app/work/page.tsx`.
   - Current impact: the site can introduce positioning, but it cannot route visitors into case-study evidence, validation artifacts, or project-specific reasoning.
   - Recommended action: define a target route map before more copy edits, for example `/`, `/work`, `/work/[slug]`, `/about`, and a contact path.

2. Work cards do not lead to work.
   - Evidence: `components/works/WorkWrapper.tsx` wraps every gallery card in `<Link href={"/"} key={c.text}>`.
   - Current impact: clicking a project returns to the home page, so the main proof surface becomes a dead end.
   - Recommended action: route each card to a stable slug such as `/work/yummygame` after project data is centralized.

3. Project identity is not modeled as route data.
   - Evidence: `workArray` stores only `text` and `images`, with no `slug`, `title`, `summary`, `role`, `problem`, `validation`, `metrics`, or external link fields.
   - Current impact: adding dynamic project pages would require another refactor instead of simply rendering existing structured data.
   - Recommended action: create a typed `projects` config that includes route slugs, display copy, image metadata, and validation proof fields.

4. Duplicate project labels break URL and React-key readiness.
   - Evidence: three work entries use the same `text: "yummy yummy"`, and that same text is used as the React key.
   - Current impact: the list cannot safely become a slug-based route list, and duplicate keys can hide rendering bugs.
   - Recommended action: use unique project IDs or slugs as keys and keep display labels separate.

5. Navigation is implemented as button-driven route mutation instead of links.
   - Evidence: `components/NaviBox.tsx` imports `Link` but uses `router.push("/")`, `router.push("/work")`, and `router.push("/about")` inside buttons.
   - Current impact: the primary IA is less crawlable, less copyable from markup, and less consistent with the rest of the app.
   - Recommended action: render primary navigation as `next/link` anchors, then reserve buttons for menu open and close actions.

6. The global navigation lacks semantic navigation markup.
   - Evidence: the nav shell is a styled `div`, and source search found no active `<nav>` markup in `app` or primary components.
   - Current impact: assistive technology and automated scanners cannot identify the main site navigation reliably.
   - Recommended action: wrap the link group in `<nav aria-label="Primary">` and keep the mobile overlay behavior inside that landmark.

7. There is no direct conversion route or consistent contact action.
   - Evidence: the main page uses `<a href="#">soojoon92@gmail.com</a>`, while About and Work render the email as plain text.
   - Current impact: visitors see contact copy but do not get a reliable action path.
   - Recommended action: use one shared contact component with `mailto:soojoon92@gmail.com` or add a focused `/contact` route if a form or intake flow is planned.

8. Contact information is repeated across route wrappers.
   - Evidence: About and Work each render an `Inquiries` block with the same email and placeholder address text.
   - Current impact: future edits can drift across pages, and the IA hides whether contact is global site chrome or page content.
   - Recommended action: centralize contact data and render it from a shared component or shell region.

9. The page hierarchy is visually strong but structurally weak.
   - Evidence: source search found no active `<main>` or `<h1>` in the route wrappers; important headings are mostly `p`, `div`, or `Textfit` output.
   - Current impact: screen readers, search engines, and automated tests cannot infer the page outline that the visual design implies.
   - Recommended action: give each route one `<main>` and one route-level `<h1>`, then style those elements to match the current visual system.

10. Route metadata is only defined globally.
    - Evidence: `app/layout.tsx` exports a single `metadata` object, and no route-level `metadata` or `generateMetadata` was found.
    - Current impact: `/about` and `/work` cannot describe their distinct purpose in search results or social previews.
    - Recommended action: add page-level metadata for About, Work, and future project detail routes.

11. The route graph is not exposed through sitemap or robots files.
    - Evidence: no tracked `app/sitemap.ts`, `app/robots.ts`, `sitemap.*`, or `robots.*` file was found.
    - Current impact: crawlers must infer the small route set from page links, and future dynamic project pages will have no explicit discovery path.
    - Recommended action: add `app/sitemap.ts` and `app/robots.ts` once canonical production URL and project slugs are defined.

12. There is no custom not-found path for future dynamic project routes.
    - Evidence: the app currently relies on Next's default not-found output, and no `app/not-found.tsx` exists.
    - Current impact: invalid project slugs would fall out of the portfolio's visual and content language.
    - Recommended action: add `app/not-found.tsx` before shipping `/work/[slug]`.

13. The About page contains a work carousel that is not connected to Work routing.
    - Evidence: `AboutWrapper` has a `memberArrayData` carousel labeled `Work`, but it does not link to `/work` or any project detail route.
    - Current impact: the same project concepts appear in multiple IA locations without a navigable relationship.
    - Recommended action: drive both the About carousel and Work gallery from the same project config, then link each item to its project route.

14. Social and external paths are not part of a coherent IA.
    - Evidence: Footer links point to SoundCloud, Naver under a Facebook icon, and Instagram; About has another set of social links including an unlinked Twitter anchor.
    - Current impact: outbound paths feel like inherited template content rather than intentional portfolio affordances.
    - Recommended action: decide whether social links support the AI developer portfolio; remove or correct any that do not.

15. `useCommonStore` appears to preserve a route abstraction that is not used.
    - Evidence: `NaviBox` reads `setRoute` from `useCommonStore`, but no call updates it in the active code path.
    - Current impact: there are two implied routing systems, Next Router and Zustand state, but only one is actually authoritative.
    - Recommended action: remove the unused store route state or explicitly define why it exists before adding route-aware UI.

16. The route IA should be fixed before adding more portfolio claims.
    - Evidence: current copy positions the site around verified AI systems, but there is no route where a visitor can inspect the verification method per project.
    - Current impact: stronger claims can increase skepticism if the navigation still blocks the evidence trail.
    - Recommended action: prioritize a single high-quality case-study route with problem, system, eval method, failure cases, and measured result before broadening the work grid.

### Verification

- Checked current worktree and recent commit history before starting the review.
- Listed all files under `app` and confirmed the active route set is `/`, `/about`, and `/work`.
- Searched for dynamic route files, sitemap, robots, custom not-found, contact route, route metadata, and slug handling.
- Inspected `app/layout.tsx`, route page files, `components/NaviBox.tsx`, `components/main/MainWrapper.tsx`, `components/works/WorkWrapper.tsx`, `components/about/AboutWrapper.tsx`, and `components/Footer.tsx`.
- Searched for semantic landmarks, mailto links, hash contact links, route pushes, `next/link` usage, and route-related Zustand state.

### Next Review Angle

- Review content credibility and proof architecture: project claims, validation evidence, metric placement, failure-case disclosure, and whether each AI developer claim has an inspectable artifact.
- Consider creating a typed `projects` config before implementing `/work/[slug]`, so route, content, image, and metadata ownership are solved together.

## 2026-05-25 13:00 KST - Review 35

### Scope

- Content credibility and proof architecture
- AI developer positioning versus inspectable evidence
- Project claim structure and validation artifacts
- Metric, failure-case, and reproducibility signals
- Portfolio trust model for technical reviewers

### Findings

1. The AI validation positioning is claim-led, not evidence-led.
   - Evidence: `MainWrapper` and `Footer` include terms such as `VERIFIED AI SYSTEMS`, `VERIFY AI`, `EVALUATION`, `RAG`, `LLM`, `AGENT`, and `Eval / RAG / Agent`.
   - Current impact: visitors understand the intended positioning, but they cannot inspect what was validated or how.
   - Recommended action: pair every major AI claim with at least one linked proof artifact or case-study section.

2. There is no structured case-study model.
   - Evidence: repository search found no `content`, `data`, `projects`, `case`, or case-study source file other than local arrays inside visual components.
   - Current impact: credibility content cannot scale beyond hard-coded decorative sections.
   - Recommended action: create a typed case-study schema with `problem`, `role`, `system`, `evaluation`, `failureModes`, `metrics`, `artifacts`, and `links`.

3. Project cards contain no proof fields.
   - Evidence: `WorkWrapper` project entries contain only `text` and `images`.
   - Current impact: the Work page can show thumbnails, but it cannot communicate why a project proves AI validation ability.
   - Recommended action: expand project records to include a short claim, validation method, measurable result, and artifact links.

4. The current Work page repeats placeholder evidence.
   - Evidence: all four work cards use images from `/images/work/yummygame`, and three entries share the label `yummy yummy`.
   - Current impact: repeated placeholder cards weaken trust because the page looks broader than the underlying evidence.
   - Recommended action: show fewer projects with real proof, or clearly mark draft/private projects until evidence exists.

5. The strongest homepage claim has no direct artifact path.
   - Evidence: the homepage says the work is about trusting AI output only after validating it with criteria and evidence, then routes only to `/about` and `/work`.
   - Current impact: a technical reviewer cannot jump from the claim to a validation report, benchmark, repo, demo, or trace.
   - Recommended action: add a primary proof CTA such as `View validation case` that lands on the strongest project detail route.

6. There are no measurable outcomes.
   - Evidence: searches found no project metrics such as accuracy, latency, cost, pass rate, regression count, recall, precision, or benchmark results.
   - Current impact: the portfolio sounds methodical but does not quantify impact.
   - Recommended action: for each case, include at least one before/after metric and explain the measurement setup.

7. Failure discovery is mentioned but not demonstrated.
   - Evidence: homepage copy frames failure discovery as important, but no source data describes discovered failures, edge cases, or fixes.
   - Current impact: the differentiating claim is not yet testable by the reader.
   - Recommended action: add a `Failure cases found` section per case with examples, severity, root cause, and resulting mitigation.

8. Evaluation criteria are named generically.
   - Evidence: source text includes `EVALUATION` and `Eval`, but no criteria, rubric, thresholds, or acceptance rules are encoded.
   - Current impact: readers cannot distinguish real evaluation design from branding language.
   - Recommended action: publish representative rubrics such as groundedness, citation correctness, task success, latency budget, and fallback behavior.

9. RAG and agent claims need domain-specific proof.
   - Evidence: the skill list includes `RAG`, `LLM`, `AGENT`, and `AUTOMATION`, but no retrieved sources, tools, agent traces, or workflow diagrams appear in source content.
   - Current impact: the terms read as tags rather than demonstrated engineering experience.
   - Recommended action: include one RAG retrieval example and one agent/tool execution trace in a case-study page.

10. There is no reproducibility story.
    - Evidence: there are no scripts, fixtures, datasets, golden answers, or evaluation outputs tied to portfolio claims.
    - Current impact: the portfolio cannot show that validation can be repeated by another engineer.
    - Recommended action: add sanitized eval fixtures or a small public demo evaluation with command, dataset shape, and expected output.

11. Visual proof is not labeled as evidence.
    - Evidence: gallery components render screenshots as background images without captions, image roles, dates, or result context.
    - Current impact: screenshots function as decoration rather than technical proof.
    - Recommended action: attach captions to each image that explain what the viewer is seeing and why it matters.

12. About page content still dilutes the AI validation narrative.
    - Evidence: `AboutWrapper` still contains generic developer biography, broad frontend/backend skills, dream-client copy, and inherited social sections.
    - Current impact: the portfolio identity competes with older template content.
    - Recommended action: rewrite About around validation engineering: judgment, debugging process, quality gates, and examples of technical decisions.

13. Skill claims are broad but not prioritized.
    - Evidence: About lists `REACT`, `NEXT JS`, `NODE JS`, `EXPRESS`, `HTML`, `JAVASCRIPT`, `CSS / SCSS`, and `SQL`, while the home page emphasizes Eval, RAG, LLM, Agent, QA, and Frontend.
    - Current impact: reviewers may not know whether the candidate is selling frontend delivery, full-stack work, or AI validation systems.
    - Recommended action: group skills by evidence-backed capability instead of technology inventory.

14. The README does not reinforce the portfolio thesis.
    - Evidence: `README.md` is still a basic Next.js getting-started note with node version and reference-site link.
    - Current impact: anyone reviewing the repo sees scaffolding notes rather than the intended technical identity.
    - Recommended action: add a concise repo README describing the portfolio goal, architecture, validation-content plan, and verification commands.

15. No portfolio content has ownership metadata.
    - Evidence: project and about data are local constants inside components, with no source, date, client status, or confidentiality marker.
    - Current impact: real versus placeholder content cannot be audited safely.
    - Recommended action: add content metadata fields such as `status`, `source`, `lastReviewed`, `clientVisible`, and `publicEvidenceLevel`.

16. There is no trust boundary for private or unreleased work.
    - Evidence: work entries and copied client lists do not distinguish shipped work, experiments, private prototypes, or aspirational examples.
    - Current impact: the portfolio can unintentionally overclaim.
    - Recommended action: explicitly label each case as `production`, `prototype`, `internal`, `sanitized`, or `concept`.

17. The next implementation step should be one strong proof path, not more general copy.
    - Evidence: the site already has enough high-level AI validation language, but lacks a single complete example.
    - Current impact: adding more slogans would increase the gap between claim and proof.
    - Recommended action: build one detailed case-study data object and render it before expanding the work grid.

### Verification

- Checked current worktree and latest commits before starting the review.
- Searched source for AI validation, evaluation, metric, benchmark, failure, trace, artifact, result, case-study, and project-proof terminology.
- Listed project files and confirmed there is no dedicated content or project data directory.
- Inspected `MainWrapper`, `WorkWrapper`, `AboutWrapper`, `GalleryBox`, `Footer`, `README.md`, and the small `CatchCatch` placeholder component.
- Confirmed current proof-related content is embedded in visual components rather than modeled as reusable portfolio evidence.

### Next Review Angle

- Review implementation readiness for a first proof path: identify the smallest data model, route shape, and component split needed to add one credible AI validation case without destabilizing the current visual shell.
- Consider drafting `config/projects.ts` and a single `/work/[slug]` case page before touching the rest of the Work grid.
