export type ProjectImage = {
  src: string;
  alt: string;
};

export type Project = {
  slug: string;
  title: string;
  type: string;
  company: string;
  period: string;
  summary: string;
  cardSummary: string;
  problem: string;
  role: string[];
  stack: string[];
  proofPoints: string[];
  verification: string[];
  result: string[];
  images?: readonly ProjectImage[];
  externalUrl?: string;
  externalLabel?: string;
  source?: string;
};

const yummygameImages = [
  {
    src: "/images/work/yummygame/1.png",
    alt: "Yummy Game game lobby and play screen",
  },
  {
    src: "/images/work/yummygame/2.png",
    alt: "Yummy Game betting interaction screen",
  },
  {
    src: "/images/work/yummygame/3.png",
    alt: "Yummy Game play result screen",
  },
] as const;

const mmisImages = [
  {
    src: "/images/work/mmis/login-masked.png",
    alt: "MMIS login screen for Uzbekistan High-Speed Railway Maintenance System",
  },
  {
    src: "/images/work/mmis/dashboard-masked.png",
    alt: "MMIS trainset dashboard with maintenance cards, calendar, and work order list",
  },
  {
    src: "/images/work/mmis/material-history-masked.png",
    alt: "MMIS material receipt and issue history management table",
  },
] as const;

const redclickImages = [
  {
    src: "/images/work/redclick/hero.png",
    alt: "RedClick landing page hero for Chinese local influencer automatic matching platform",
  },
  {
    src: "/images/work/redclick/about.png",
    alt: "RedClick introduction page explaining the service concept",
  },
  {
    src: "/images/work/redclick/influencers.png",
    alt: "RedClick partner influencer network visualization",
  },
] as const;

const amazoncarImages = [
  {
    src: "/images/work/amazoncar/list.png",
    alt: "AmazonCar vehicle list and filter screen",
  },
  {
    src: "/images/work/amazoncar/detail.png",
    alt: "AmazonCar vehicle detail and option selection screen",
  },
  {
    src: "/images/work/amazoncar/consultation.png",
    alt: "AmazonCar consultation modal screen",
  },
] as const;

export const projects: Project[] = [
  {
    slug: "mmis-ai-harness",
    title: "MMIS AI Harness",
    type: "AI-Assisted Enterprise Development",
    company: "Freelance",
    period: "2026.02 - 2026.05",
    summary:
      "Codex와 Claude Code를 개발 하네스로 활용해 요구사항 분석, 코드 탐색, 구현, 검증, 리팩터링, 빌드/테스트 실행까지 이어지는 반복 개발 루프를 정리했습니다.",
    cardSummary:
      "AI 작업 규칙과 검증 루프를 세워 멀티 모듈 업무 시스템의 화면, API, DB 정합성을 점검했습니다.",
    problem:
      "복수 업무 도메인과 화면, API, DB 스키마가 함께 움직이는 업무 시스템에서는 AI가 생성한 코드를 그대로 수용하면 기능 누락이나 구조 불일치가 발생하기 쉽습니다.",
    role: [
      "Codex/Claude Code 기반 반복 개발 루프 구축",
      "AGENTS.md, CLAUDE.md, 프로젝트 로컬 Skills 작업 규칙 정리",
      "Figma, 요구사항 문서, DB schema 기준 화면/기능 정합성 검증",
      "React/Vite/TypeScript 화면 구조와 컴포넌트 패턴 정리",
    ],
    stack: [
      "React",
      "Vite",
      "TypeScript",
      "SCSS Modules",
      "Zustand",
      "TanStack Query",
      ".NET 9",
      "SQL Server",
      "Codex",
      "Claude Code",
      "Figma MCP",
    ],
    proofPoints: ["AI Harness", "Figma QA", "Schema Verification"],
    verification: [
      "요구사항 문서, Figma, schema 기준으로 화면/프로그램/DB 스키마 간 불일치를 확인",
      "AI가 생성한 코드의 의도와 영향 범위를 빌드/테스트 실행과 코드 탐색으로 재검증",
      "페이지 단위 QA 수정, 재검증, Human QA Guide 생성 흐름을 작업 규칙으로 표준화",
    ],
    result: [
      "AI를 단순 코드 생성 도구가 아니라 개발 하네스로 활용하는 반복 작업 체계를 정리",
      "화면 구현, API 흐름, DB 영향 검증을 같은 루프 안에서 다루도록 작업 기준을 구체화",
    ],
    images: mmisImages,
    source: "Resume: MMIS, 2026.02 - 2026.05",
  },
  {
    slug: "redclick",
    title: "RedClick",
    type: "Full-Stack Product Architecture",
    company: "Freelance",
    period: "2025.10 - 2025.12",
    summary:
      "Next.js 프론트엔드, Express 백엔드, Chrome Extension 데이터 수집까지 포함하는 플랫폼 초기 구조와 캠페인/어드민 UI 흐름을 구축했습니다.",
    cardSummary:
      "Next.js, Express, Chrome Extension을 포함한 캠페인/어드민 플랫폼 구조를 AI 검증 루프와 함께 정리했습니다.",
    problem:
      "캠페인 생성, 관리자 대시보드, 유저 매칭 UI, 데이터 수집 흐름이 함께 맞물리면 초기 구조와 상태 관리가 빠르게 복잡해집니다.",
    role: [
      "Next.js App Router 기반 프론트엔드 구조 설계",
      "Express REST API와 Chrome Extension 수집 흐름을 포함한 초기 아키텍처 구축",
      "어드민/캠페인 시스템 UI 고도화",
      "AI 코드 검증과 핵심 비즈니스 로직 최적화",
    ],
    stack: [
      "Next.js",
      "TypeScript",
      "Node.js",
      "Express",
      "REST API",
      "Chrome Extension",
      "Claude Code",
      "Figma",
    ],
    proofPoints: ["Campaign Admin", "Chrome Extension", "AI Verification"],
    verification: [
      "AI가 만든 보일러플레이트를 실제 캠페인 생성 단계와 관리자 화면 흐름에 맞춰 검토",
      "복잡한 전역 상태 관리와 실시간 데이터 동기화 병목을 중심으로 구조를 점검",
      "프론트엔드, 백엔드, 확장 프로그램 사이의 책임 경계를 확인",
    ],
    result: [
      "복잡한 플랫폼 초기 구조를 빠르게 세우고, 이후 상태 관리와 데이터 동기화 병목 개선에 집중할 기반을 마련",
      "AI-assisted development를 실제 제품 구조 설계와 검증 과정에 적용",
    ],
    images: redclickImages,
    externalUrl: "https://redclick.net/",
    externalLabel: "Visit RedClick",
    source: "Resume: RedClick, 2025.10 - 2025.12",
  },
  {
    slug: "location",
    title: "Location",
    type: "AI Recommendation Service",
    company: "Freelance",
    period: "2025.05 - 2025.06",
    summary:
      "Next.js와 Express를 분리한 모노레포 구조에서 Gemini 추천과 Google Maps/Places 기반 실제 장소 데이터를 연결한 위치 기반 추천 서비스입니다.",
    cardSummary:
      "Gemini 추천을 실제 위치 API, 지도 UI, 타입 검증과 연결해 사용 가능한 장소 추천 흐름으로 정리했습니다.",
    problem:
      "AI 추천 결과가 실제 장소 정보와 동떨어지면 사용자가 바로 활용하기 어렵기 때문에, 추천 데이터와 지도/장소 상세 정보의 정합성을 함께 확인해야 했습니다.",
    role: [
      "Next.js/Express 모노레포 구조 설계",
      "Gemini API와 위치 API 기반 추천 데이터 흐름 구성",
      "Google Maps 기반 mobile-first 지도 UI 설계",
      "TypeScript 타입 하드닝과 컴포넌트 의존성 구조 검증",
    ],
    stack: [
      "Next.js",
      "React",
      "TypeScript",
      "Express",
      "Gemini API",
      "Google Maps API",
      "Google Places API",
      "Docker",
      "Vercel",
      "GitHub Actions",
    ],
    proofPoints: ["AI Recommendation", "Maps API", "Type Hardening"],
    verification: [
      "AI 추천 결과가 실제 장소 후보와 연결되는지 확인",
      "지도 마커, 상세 정보, 거리 기반 클러스터링이 mobile-first UI에서 자연스럽게 동작하는지 점검",
      "AI가 생성한 코드의 타입 안정성과 컴포넌트 의존성 구조를 재검토",
    ],
    result: [
      "AI 추천을 실제 위치 데이터와 지도 UI에 연결한 서비스 흐름을 구성",
      "프론트엔드와 백엔드를 분리한 TypeScript 모노레포 구조를 정리",
    ],
    source: "Resume: Location, 2025.05 - 2025.06",
  },
  {
    slug: "amazoncar",
    title: "AmazonCar",
    type: "Service Frontend",
    company: "Icons",
    period: "2025.01 - 2025.08",
    summary:
      "대규모 렌트/리스 서비스 구조를 고려해 React, TypeScript, React Query, Zustand 기반 화면과 상태 흐름을 구현했습니다.",
    cardSummary:
      "실무 렌트/리스 서비스에서 화면 구조, REST API 연동, 전역 상태 관리, 로딩 성능 개선을 다뤘습니다.",
    problem:
      "렌트/리스 서비스는 신청, 조회, 상세 정보, 서버 데이터 상태가 복합적으로 연결되어 화면 구조와 API 흐름이 쉽게 엉킬 수 있습니다.",
    role: [
      "컴포넌트 기반 프론트엔드 아키텍처 설계 및 화면 개발",
      "REST API 연동을 통한 실시간 데이터 처리",
      "React Query와 Zustand 기반 글로벌 상태 관리 설계",
      "Suspense, Lazy Loading 기반 초기 로딩 UX 개선",
    ],
    stack: [
      "React",
      "TypeScript",
      "React Query",
      "Zustand",
      "REST API",
      "Node.js",
      "Figma",
      "ESLint",
      "Prettier",
    ],
    proofPoints: ["Service Frontend", "API State", "Performance"],
    verification: [
      "REST API 응답과 화면 상태가 일관되게 이어지는지 확인",
      "React Query 서버 상태와 Zustand 클라이언트 상태의 책임을 분리",
      "Suspense와 Lazy Loading 적용 후 초기 로딩 흐름과 사용자 경험을 점검",
    ],
    result: [
      "대규모 서비스 화면을 컴포넌트 단위로 정리하고 데이터 흐름을 유지보수 가능한 구조로 구성",
      "코드 컨벤션과 협업 기준을 정리해 팀 개발 환경의 일관성을 높임",
    ],
    images: amazoncarImages,
    externalUrl: "https://www.amazoncar.co.kr/",
    externalLabel: "Visit AmazonCar",
    source: "Resume: AmazonCar, 2025.01 - 2025.08",
  },
  {
    slug: "yummygame",
    title: "Yummy Game",
    type: "Game UI Logic",
    company: "Homoludens",
    period: "2023.07 - 2024.03",
    summary:
      "게임 인터랙션과 서버 API 연동을 다루며 사용자 액션 상태와 게임 진행 상태를 분리한 프론트엔드 UI 로직을 구현했습니다.",
    cardSummary:
      "베팅, 캐시아웃, 게임 진행 상태를 분리해 실시간 게임 UI가 안정적으로 반응하도록 구성했습니다.",
    problem:
      "게임 UI는 사용자의 직접 액션과 서버/게임 루프의 진행 상태가 동시에 바뀌기 때문에 상태 기준이 섞이면 UI 로직이 쉽게 불안정해집니다.",
    role: [
      "프론트엔드 아키텍처 설계 및 화면 개발",
      "게임 인터랙션 및 UI 로직 구현",
      "서버 API 연동 및 게임 데이터 처리",
      "사용자 액션 상태와 게임 진행 상태 분리",
    ],
    stack: [
      "Node.js",
      "Next.js",
      "React",
      "React Query",
      "Zustand",
      "Game UI",
    ],
    proofPoints: ["Game State", "Realtime UI", "API Integration"],
    verification: [
      "`playing` 상태와 `gameState`를 분리해 사용자 액션과 게임 루프를 따로 확인",
      "베팅, 캐시아웃, 오토벳 흐름에서 상태 전환 조건이 섞이지 않는지 점검",
      "서버 API와 게임 데이터가 UI 상태에 반영되는 흐름을 확인",
    ],
    result: [
      "게임 인터랙션을 명시적인 상태 기준으로 정리",
      "사용자 직접 액션과 자동 진행 흐름을 같은 UI 안에서 구분해 처리",
    ],
    images: yummygameImages,
    source: "Resume: Yummy Game, 2023.07 - 2024.03",
  },
  {
    slug: "zudice",
    title: "Zudice",
    type: "Realtime Game Platform",
    company: "Monoverse",
    period: "2022.05 - 2023.06",
    summary:
      "온라인 카지노 플랫폼 특성을 고려해 재사용 가능한 UI 컴포넌트, 실시간 게임 데이터, WebSocket 상태 반영, 성능 개선을 다뤘습니다.",
    cardSummary:
      "Next.js 기반 게임 플랫폼에서 실시간 상태, WebSocket, 캐싱, 성능 최적화 경험을 쌓았습니다.",
    problem:
      "대규모 게임 플랫폼은 반복되는 게임 UI와 실시간 보상/진행 상태가 많아 컴포넌트 재사용성과 데이터 동기화 기준이 중요합니다.",
    role: [
      "컴포넌트 기반 UI 아키텍처 설계",
      "실시간 애니메이션 및 인터랙션 로직 구현",
      "REST API와 WebSocket 기반 게임 데이터 처리",
      "React Query/Zustand 기반 데이터와 세션 상태 관리",
    ],
    stack: [
      "Next.js",
      "React",
      "TypeScript",
      "React Query",
      "Zustand",
      "Node.js",
      "REST API",
      "WebSocket",
      "CI/CD",
    ],
    proofPoints: ["WebSocket", "Reusable UI", "Performance"],
    verification: [
      "게임 진행 상태와 보상 결과가 실시간으로 UI에 반영되는지 확인",
      "React Query 캐싱과 Zustand 세션 상태가 역할을 침범하지 않는지 점검",
      "Canvas/CSS 애니메이션과 SSR 초기 로딩 성능을 함께 확인",
    ],
    result: [
      "재사용 가능한 UI 컴포넌트 기반으로 신규 게임 개발 속도와 유지보수성을 개선",
      "실시간 게임 데이터 처리와 초기 로딩 경험 개선에 기여",
    ],
    source: "Resume: Zudice, 2022.05 - 2023.06",
  },
];

export const featuredProject = projects[0];

export function getProject(slug: string) {
  return projects.find(project => project.slug === slug);
}
