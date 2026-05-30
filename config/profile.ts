const localSiteUrl = "http://localhost:3000";
const vercelSiteUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : undefined;

export const siteProfile = {
  name: "Sooho Shin",
  displayName: "Sooho",
  email: "soojoon92@gmail.com",
  role: "Service-oriented frontend developer",
  headline: "서비스 흐름, API 연동, 상태 구조, 검증 가능한 동작을 함께 설계하는 개발자",
  description:
    "React, Next.js, TypeScript 기반의 서비스 UI를 만들고, API 연동과 상태 관리, 자동화된 검증 흐름까지 제품 맥락에 맞게 정리합니다.",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || vercelSiteUrl || localSiteUrl,
  capabilities: [
    "Service Frontend",
    "React / Next.js",
    "TypeScript",
    "API Integration",
    "State Modeling",
    "React Query / Zustand",
    "AI Workflow Verification",
    "AI Recommendation Flow",
    "Validation Harness",
    "Map / Location UX",
    "Game UI Logic",
    "Realtime UI",
  ],
  socials: [
    {
      label: "SoundCloud",
      href: "https://soundcloud.com/soohozzang/sets/hiphop",
      icon: "/images/ico_soundcloud.png",
    },
  ],
};

export const siteMetadata = {
  title: "Sooho Shin | Service Frontend Developer",
  description:
    "React, Next.js, TypeScript 기반 서비스 프론트엔드와 API 연동, 상태 구조, AI 추천 흐름, 자동화 검증 경험을 정리한 포트폴리오입니다.",
};
