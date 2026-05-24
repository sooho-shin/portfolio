import type { Metadata } from "next";
import StyledComponentsRegistry from "@/lib/registry";
import NaviComponent from "@/components/NaviBox";
import { Noto_Sans_KR } from "next/font/google";
import SmoothScrolling from "@/lib/smoothScrolling"; // 해당 폰트의 함수를 사용합니다.

export const metadata: Metadata = {
  title: "AI Developer Portfolio | Sooho",
  description: "AI 기능 개발, 업무 자동화, 웹 서비스 구축을 다루는 개발자 포트폴리오",
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
