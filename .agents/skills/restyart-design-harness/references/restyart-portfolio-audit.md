# Restyart Portfolio 디자인/인터랙션 감사

관찰 대상: `https://portfolio.restyart.com/`  
확인일: 2026-06-29 KST  
목적: 신수호 포트폴리오를 같은 디자인 언어로 재구성하기 위한 하네스 기준 문서.

## 요약

레퍼런스는 이미지 중심 포트폴리오가 아니라 다크 모드 이력서형 싱글 페이지다. 핵심은 왼쪽 sticky 프로필 사이드바, 오른쪽 좁은 콘텐츠 컬럼, 작은 섹션 라벨, 2열 카드, 타임라인형 경력 리스트, pill 태그다.

## 레이아웃

### 데스크톱

- viewport `1440x900` 기준.
- 전체 페이지는 중앙에 약 `1072px` 폭의 컨테이너를 둔다.
- 왼쪽 `header`는 sticky, `top: 0`, `height: 100vh`, 폭 약 `44%`.
- 오른쪽 `main`은 폭 약 `56%`, 실제 콘텐츠 컬럼은 약 `564px`.
- 데스크톱 padding은 상하 약 `96px`.
- 첫 섹션 `About`의 시작 top은 약 `96px`.
- 각 nav 클릭 후 대상 섹션의 top은 약 `96px`에 맞춰진다.

### 모바일

- viewport `390x844` 기준.
- sticky top bar 높이는 약 `68px`.
- 상단 왼쪽에는 이름, 오른쪽에는 `36x36` 햄버거 버튼.
- 메뉴가 열리면 상단 헤더 아래에 full-width 드롭다운 nav가 나타난다.
- 모바일 본문은 `24px` 좌우 padding, 1열 배치.
- 데스크톱 사이드바 nav는 모바일에서 상단 메뉴로 대체한다.

## 색상과 토큰

실측 CSS 변수 계열:

- `--background`: 거의 검정, `lab(2.75381% 0 0)` 수준.
- `--foreground`: 거의 흰색, `lab(98.26% 0 0)`.
- `--card`: 매우 어두운 회색, `lab(7.78201% 0 0)`.
- `--muted`: 어두운 회색, `lab(15.204% 0 0)`.
- `--muted-foreground`: 중간 회색, `lab(66.128% 0 0)`.
- `--border`: 흰색 10% 투명도.
- `--primary`: 밝은 회색/흰색, `lab(90.952% 0 0)`.
- `--radius`: 약 `.625rem`.

배경 효과:

- `body`는 순수 어두운 배경.
- 별도 fixed div가 `radial-gradient(60rem 40rem at 70% -10%, oklch(0.8 0.13 185 / 0.08), transparent)` 형태의 아주 희미한 청록 glow를 만든다.
- 장식은 이 glow 하나 정도로 제한한다.

## 타이포그래피

- 기본 폰트: Geist 계열.
- 섹션 라벨/네비게이션: Geist Mono 계열.
- 본문 기본: `16px`, line-height `24px`.
- 모바일 h1: `48px`, line-height `48px`, font-weight `700`.
- 데스크톱 h1: 약 `60px` 계열.
- 섹션 라벨: `12px`, uppercase, letter-spacing 약 `0.2em ~ 0.25em`.
- 영문 이름은 serif/italic 느낌을 사용한다. 구현 시 기존 폰트 시스템 안에서 italic serif fallback을 둔다.

## 섹션 구조

### Profile Sidebar

구성:

- 직무 라벨: `SOFTWARE ENGINEER · CTO` 같은 mono uppercase 라벨.
- 큰 한글 이름.
- italic 영문 이름.
- 짧은 자기소개 2줄 안팎.
- 섹션 nav.
- 연락 링크.
- CTA 버튼.

신수호 포트폴리오 적용:

- 전화번호/주소는 노출하지 않는다.
- 이메일, GitHub, 선택적으로 SoundCloud/portfolio link를 둔다.
- CTA는 `Contact` 섹션 이동 또는 `mailto:` 링크로 실제 동작해야 한다.

### About

구성:

- 모바일에서만 작은 `ABOUT` 라벨 표시. 데스크톱은 왼쪽 nav가 섹션 라벨 역할을 한다.
- 소개 문단 2~3개.
- 왼쪽 border가 있는 quote 카드.
- 숫자 stat grid 4개.

Stat grid:

- container: rounded-xl, border, background는 border 색.
- desktop: 4열.
- mobile: 2열.
- 각 cell은 card background로 채우고 gap은 `1px`.

### Core Strengths

구성:

- 2열 카드 grid.
- 카드: rounded-xl, border, card background, padding `24px`.
- hover: border가 primary 40% 수준으로 밝아짐.
- 제목, 설명, pill 태그 묶음.

### Experience

구성:

- 리스트 아이템은 `grid`, desktop에서 `140px 1fr`.
- 왼쪽: 기간.
- 오른쪽: 직책/회사, 요약, bullet, pill 태그, 선택적 외부 회고 링크.
- 기본 배경은 투명이고 hover 시 card background가 생김.
- 각 item padding은 약 `16px`, radius 약 `14px`.

### Selected Projects

구성:

- 2열 프로젝트 카드.
- 카드 전체가 외부 링크 또는 상세 링크.
- title 옆에 external arrow 아이콘.
- 설명과 태그를 포함.

신수호 포트폴리오 적용:

- 외부 링크가 없거나 공개 불가한 프로젝트는 내부 상세 페이지 링크 또는 비활성 카드로 처리한다.
- 기존 `config/projects.ts`의 프로젝트를 우선 사용한다.

### Skills & Tools

구성:

- 2열 카드.
- 카테고리 제목 + pill 태그.
- 활동/자격 항목은 bullet 또는 pill로 정리.

### Project Gallery / Preview Grid

구성:

- 상단에 섹션 설명과 `전체 목록 보기` 버튼.
- 카드 grid는 desktop 3열, mobile 1열 또는 2열.
- 각 preview card는 상단 meta bar, 아래 iframe/screenshot preview.
- iframe은 `pointer-events: none`, 200% 크기를 `scale(0.5)`로 축소한다.
- hover 시 `bg-background/80`, `backdrop-blur(2px)`, `opacity: 1` overlay로 `사이트 열기`가 보인다.

신수호 포트폴리오 적용:

- 이 섹션은 AI 실험 모음이 아니라, 현재 프로젝트 중 실제 화면 이미지가 준비된 사례만 모아 보여주는 preview grid다.
- 외부 미니 사이트가 충분하지 않으면 `Project Gallery`, `Featured Work`, `Case Study Preview` 같은 이름으로 대체한다.
- iframe 대신 프로젝트 스크린샷 이미지를 사용할 수 있다.
- hover-only 정보는 focus-visible에서도 접근 가능해야 한다.

### Contact

구성:

- 간단한 문의 문단.
- primary button.
- Links 카드 grid.
- 마지막에 얇은 divider와 footer 문구.

신수호 포트폴리오 적용:

- 문의 버튼은 `mailto:`로 동작시키거나 contact form이 있으면 제출 흐름을 명확히 둔다.
- 링크 카드는 GitHub, 이메일, 배포 URL, 주요 프로젝트 링크 중심.

## 인터랙션 관찰

### 스크롤/Active Nav

데스크톱 nav는 버튼이다. 클릭하면 해당 섹션으로 스크롤한다.

확인된 섹션 id:

- `about`
- `strengths`
- `experience`
- `projects`
- `skills`
- `gallery`
- `contact`

active 상태:

- 현재 섹션 nav의 선은 약 `64px`.
- 비활성 선은 약 `32px`.
- active label은 primary 색.
- inactive label은 muted foreground.
- transition duration은 약 `300ms`.

직접 확인:

- `PROJECTS` 클릭 후 `projects` 섹션 top이 약 `96px`에 위치.
- `GALLERY` 클릭 후 `gallery` 섹션 top이 약 `96px`에 위치.

### 모바일 메뉴

직접 확인:

- 햄버거 버튼은 `aria-label="메뉴 열기"`.
- 메뉴 오픈 후 close 버튼은 `aria-label="메뉴 닫기"`.
- 메뉴 항목은 full-width row, 높이 약 `53px`, border-bottom 있음.
- 현재 섹션은 primary 색으로 표시.
- `PROJECTS` 메뉴 클릭 후 `projects` 섹션으로 스크롤하고 메뉴는 닫힘.

### 링크

- 이메일은 `mailto:` 링크.
- 전화번호는 `tel:` 링크로 되어 있으나, 신수호 포트폴리오에는 공개 전화번호를 넣지 않는다.
- 외부 링크는 대체로 `target="_blank"`와 `rel="noopener noreferrer"`를 사용한다.

### CTA

관찰된 CTA `이력서 / 포트폴리오 문의`는 `button`이고 DOM상 `href`가 없다. 테스트 중 클릭 후 URL 또는 스크롤 변화는 확인되지 않았다.

신수호 포트폴리오 구현 시:

- CTA를 장식 버튼으로 두지 않는다.
- `contact` 섹션 스크롤, `mailto:`, 또는 다운로드 가능한 공개용 resume 링크 중 하나로 명확히 연결한다.
- 원본 이력서 PDF는 public에 노출하지 않는다.

### Hover / Focus

관찰된 클래스 기준:

- Strength/project 카드: `hover:border-primary/40`.
- Experience item: `hover:bg-card`.
- 링크: `hover:text-primary` 또는 `hover:underline`.
- Contact primary button: `hover:opacity-90`.
- Project Gallery preview overlay: `opacity-0`에서 `group-hover:opacity-100`, `backdrop-blur-[2px]`.

구현 시 추가 기준:

- hover 효과는 keyboard focus에서도 동등하게 확인 가능해야 한다.
- `group-focus-within` 또는 `focus-visible` 상태를 추가한다.
- hover-only overlay 안의 텍스트는 focus로도 노출되어야 한다.

## 컴포넌트 설계 가이드

권장 컴포넌트:

- `PortfolioShell`
- `StickyProfileSidebar`
- `MobileTopNav`
- `SectionNav`
- `SectionLabel`
- `MetricGrid`
- `StrengthCard`
- `ExperienceTimeline`
- `ProjectCard`
- `SkillGroupCard`
- `PreviewGrid`
- `ContactSection`

권장 데이터:

- `config/profile.ts`: 이름, 역할, headline, email, socials.
- `config/projects.ts`: 프로젝트 카드와 상세 데이터.
- `resume-context/references/resume.md`: 경력/프로젝트 순서와 문구 근거.

## QA 체크리스트

### Desktop 1440x900

- 왼쪽 사이드바가 화면 높이를 채우고 sticky로 유지된다.
- 오른쪽 main column이 약 `560px` 내외로 과도하게 넓어지지 않는다.
- 첫 화면에서 About intro, quote, stat grid 일부가 자연스럽게 보인다.
- nav active 선 길이 변화가 보인다.
- `PROJECTS`, `SKILLS`, `CONTACT` 클릭 시 섹션 이동이 된다.

### Mobile 390x844

- 상단 sticky header가 본문 위에 안정적으로 고정된다.
- 햄버거 버튼의 열기/닫기 aria-label이 맞다.
- 메뉴를 열었을 때 ABOUT부터 CONTACT까지 row가 보인다.
- 메뉴 항목 클릭 후 메뉴가 닫히고 섹션으로 이동한다.
- 카드 텍스트가 버튼/카드 밖으로 넘치지 않는다.

### Accessibility

- icon-only button은 `aria-label`을 가진다.
- 외부 링크는 `rel="noopener noreferrer"`를 가진다.
- hover-only 정보는 focus로도 접근 가능하다.
- CTA는 실제 동작이 있다.

### Content Safety

- 원본 이력서 PDF는 public 경로에 두지 않는다.
- 전화번호/주소 등 민감정보는 공개 페이지에 노출하지 않는다.
- 내부 `source`, `Resume:` 메모가 client bundle에 노출되지 않도록 한다.
- 타인의 이름, 경력, 링크, 문구를 복사하지 않는다.
