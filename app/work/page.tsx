import React from "react";
import type { Metadata } from "next";
import WorkWrapper from "@/components/works/WorkWrapper";

export const metadata: Metadata = {
  title: "Work",
  description:
    "이력서에 기반한 한국어 퍼즐 제품, 서비스 프론트엔드, AI-assisted workflow, 위치 기반 추천, 게임 UI 상태 관리 프로젝트 사례입니다.",
  alternates: {
    canonical: "/work",
  },
};

const Page = () => {
  return <WorkWrapper />;
};

export default Page;
