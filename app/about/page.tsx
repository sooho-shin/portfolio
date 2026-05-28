import React from "react";
import type { Metadata } from "next";
import AboutWrapper from "@/components/about/AboutWrapper";

export const metadata: Metadata = {
  title: "About",
  description:
    "Sooho Shin의 서비스 프론트엔드, API 연동, 상태 구조, 자동화 검증 경험을 정리한 소개 페이지입니다.",
  alternates: {
    canonical: "/about",
  },
};

const Page = () => {
  return <AboutWrapper />;
};

export default Page;
