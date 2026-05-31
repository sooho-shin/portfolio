import React from "react";
import type { Metadata } from "next";
import WorkWrapper from "@/components/works/WorkWrapper";
import { buildCanonicalUrl } from "@/config/seo";

export const metadata: Metadata = {
  title: "Work | 개발자 포트폴리오 프로젝트",
  description:
    "이력서에 기반한 한국어 퍼즐 제품, 서비스 프론트엔드, AI-assisted workflow, 위치 기반 추천, 게임 UI 상태 관리 프로젝트 사례입니다.",
  alternates: {
    canonical: buildCanonicalUrl("/work"),
  },
};

const Page = () => {
  return <WorkWrapper />;
};

export default Page;
