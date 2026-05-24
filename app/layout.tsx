import type { Metadata } from "next";
import StyledComponentsRegistry from "@/lib/registry";
import NaviComponent from "@/components/NaviBox";
import { Noto_Sans_KR } from "next/font/google";
import SmoothScrolling from "@/lib/smoothScrolling";

export const metadata: Metadata = {
  title: "AI Validation Engineer Portfolio | Sooho",
  description:
    "AI 결과물을 검증 가능한 제품과 자동화 시스템으로 구현하는 개발자 포트폴리오",
};

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={notoSansKr.className}>
        <SmoothScrolling>
          <StyledComponentsRegistry>
            <NaviComponent />
            {children}
          </StyledComponentsRegistry>
        </SmoothScrolling>
      </body>
    </html>
  );
}
