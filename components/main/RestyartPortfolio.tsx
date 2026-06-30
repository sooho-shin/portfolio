"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { projects } from "@/config/projects";
import { siteProfile } from "@/config/profile";

const sections = [
  { id: "about", label: "ABOUT" },
  { id: "strengths", label: "STRENGTHS" },
  { id: "experience", label: "EXPERIENCE" },
  { id: "projects", label: "PROJECTS" },
  { id: "skills", label: "SKILLS" },
  { id: "gallery", label: "GALLERY" },
  { id: "contact", label: "CONTACT" },
] as const;

const metrics = [
  { value: "6년+", label: "서비스 프론트엔드 경험" },
  { value: "7개+", label: "이력 기반 대표 프로젝트" },
  { value: "AI", label: "작업 규칙과 검증 루프" },
  { value: "Type", label: "타입·API·상태 검증" },
];

const strengths = [
  {
    title: "서비스 흐름을 구현하는 프론트엔드",
    body: "화면 구현에서 끝내지 않고 사용자 흐름, 서버 응답, 예외 상태, 유지보수 가능한 컴포넌트 구조까지 함께 설계합니다.",
    tags: ["React", "Next.js", "TypeScript", "UX Flow"],
  },
  {
    title: "서버 상태와 클라이언트 상태 분리",
    body: "React Query/TanStack Query와 Zustand를 기준으로 서버 데이터, 사용자 입력, UI 진행 상태를 분리해 복잡도를 낮춥니다.",
    tags: ["React Query", "Zustand", "State Modeling", "API"],
  },
  {
    title: "AI-assisted 개발 하네스",
    body: "Codex, Claude Code, Skills, AGENTS.md를 활용해 요구사항 분석, 구현, 리팩터링, QA 수정이 반복 가능한 작업 루프가 되도록 정리합니다.",
    tags: ["Codex", "Claude Code", "Skills", "AGENTS.md"],
  },
  {
    title: "문서·디자인·API 기준 검증",
    body: "Figma, API 문서, DB schema, 요구사항 문서를 기준으로 화면과 데이터 흐름의 불일치를 찾고 회귀를 줄입니다.",
    tags: ["Figma MCP", "Schema", "QA", "Verification"],
  },
  {
    title: "AI 추천과 실제 데이터 연결",
    body: "AI 추천 결과를 실제 장소, 지도, 후보 데이터와 연결해 사용자가 바로 행동할 수 있는 서비스 흐름으로 다듬습니다.",
    tags: ["Gemini API", "Maps", "Places", "Recommendation"],
  },
  {
    title: "게임·실시간 UI 상태",
    body: "사용자 액션, 게임 루프, WebSocket/서버 응답이 섞이는 화면에서 상태 기준을 명확히 나누고 안정적인 반응을 만듭니다.",
    tags: ["Realtime UI", "WebSocket", "Game UI", "Interaction"],
  },
];

const experience = [
  {
    period: "2026.04 - 2026.05",
    title: "AI Puzzle Product Developer · Narrow",
    summary:
      "한국어 연상 퍼즐 서비스의 일일 퍼즐, 정답 판정, 랭킹, 그룹 공유, 피드백 흐름을 Next.js와 Supabase 기반으로 구현했습니다.",
    bullets: [
      "Codex 기반 요구사항 분석, 구현, 검증, QA 수정 루프 구축",
      "로그인/비로그인 플레이, 랭킹 projection, 닉네임 흐름 안정화",
      "퍼즐 후보 검증, dry-run 저장, 계약 검증으로 운영 리스크 감소",
    ],
    tags: ["Next.js", "Supabase", "Codex", "AI Harness"],
  },
  {
    period: "2026.02 - 2026.05",
    title: "AI Harness Engineer · MMIS",
    summary:
      "멀티 모듈 업무 시스템에서 AI 개발 도구를 작업 규칙, 코드 탐색, 구현, 검증, 리팩터링 루프로 묶는 하네스를 정리했습니다.",
    bullets: [
      "AGENTS.md, CLAUDE.md, Skills 기반 작업 규칙 체계화",
      "Figma, 요구사항 문서, DB schema 기준 화면/API/DB 정합성 검증",
      "React/Vite/TypeScript 화면 구조와 TanStack Query/Zustand 흐름 정리",
    ],
    tags: ["React", "Vite", "Figma MCP", "Schema QA"],
  },
  {
    period: "2025.10 - 2025.12",
    title: "Full-stack Product Builder · RedClick",
    summary:
      "Next.js 프론트엔드, Express 백엔드, Chrome Extension 데이터 수집을 포함한 캠페인/어드민 플랫폼 초기 구조를 구축했습니다.",
    bullets: [
      "캠페인 생성 프로세스와 관리자 대시보드 UI 보일러플레이트 구성",
      "프론트엔드, 백엔드, 확장 프로그램 사이의 책임 경계 점검",
      "AI 코드 검증과 핵심 비즈니스 로직 최적화",
    ],
    tags: ["Next.js", "Express", "Chrome Extension", "Claude Code"],
  },
  {
    period: "2025.05 - 2025.06",
    title: "Map Recommendation Developer · Location",
    summary:
      "Gemini 추천과 Google Maps/Places 데이터를 연결해 사용자가 실제 장소 후보를 탐색할 수 있는 mobile-first 위치 추천 흐름을 만들었습니다.",
    bullets: [
      "Next.js/Express 분리 모노레포 구조 설계",
      "Google Maps marker clustering과 장소 상세 흐름 구현",
      "AI 추천 결과와 실제 위치 API 데이터의 타입/의존성 검증",
    ],
    tags: ["Gemini API", "Google Maps", "TypeScript", "Docker"],
  },
  {
    period: "2024.04 - 2025.05",
    title: "웹개발 대리 · 주식회사 아이콘스",
    summary:
      "AmazonCar 실무 서비스에서 대규모 화면 구조, REST API 연동, React Query/Zustand 기반 상태 관리, 초기 로딩 UX 개선을 다뤘습니다.",
    bullets: [
      "컴포넌트 기반 프론트엔드 아키텍처와 화면 개발",
      "REST API 응답과 화면 상태가 일관되게 이어지는 흐름 점검",
      "Suspense, Lazy Loading, ESLint, Prettier 기반 협업 품질 개선",
    ],
    tags: ["React", "React Query", "Zustand", "REST API"],
  },
  {
    period: "2023.07 - 2024.03",
    title: "Frontend Developer · 주식회사 호모루덴스",
    summary:
      "Yummy Game에서 게임 인터랙션, 서버 API 연동, 사용자 액션과 게임 진행 상태를 분리한 UI 로직을 구현했습니다.",
    bullets: [
      "게임 인터랙션과 진행 상태를 분리한 UI 로직 구성",
      "React Query와 Zustand 기반 게임 데이터 처리",
      "베팅, 캐시아웃, 게임 결과 흐름의 상태 전환 기준 점검",
    ],
    tags: ["Next.js", "React", "Game UI", "Zustand"],
  },
  {
    period: "2022.05 - 2023.06",
    title: "Realtime Game Frontend · Zudice",
    summary:
      "Next.js 기반 게임 플랫폼에서 재사용 가능한 UI 컴포넌트, 실시간 게임 데이터, WebSocket 상태 반영, 성능 개선을 다뤘습니다.",
    bullets: [
      "컴포넌트 기반 UI 아키텍처와 실시간 애니메이션 로직 구현",
      "React Query/Zustand 기반 데이터와 세션 상태 관리",
      "Canvas/CSS 애니메이션, SSR 초기 로딩, Lighthouse 성능 점검",
    ],
    tags: ["Next.js", "WebSocket", "Game UI", "Performance"],
  },
  {
    period: "2021.05 - 2022.05",
    title: "Web3 Frontend Developer · Entropy Explorer",
    summary:
      "MetaMask 지갑 연동, Web3 Provider 이벤트, 스마트 컨트랙트 호출, 블록체인 데이터 조회 UI를 구현했습니다.",
    bullets: [
      "Web3.js 기반 계정 인증과 트랜잭션 처리",
      "블록, 트랜잭션, 이벤트 로그 테이블의 필터/페이징/검색 구현",
      "Node.js API 캐싱 흐름과 대용량 조회 UI 연결",
    ],
    tags: ["Web3.js", "MetaMask", "Data Table", "Node.js"],
  },
  {
    period: "2022.01 - 2022.03",
    title: "Full-stack Web3 Developer · Fruttidino",
    summary:
      "Express 기반 API 서버와 Web3.js/MetaMask 연동을 함께 다루며 게임 데이터 처리, 사용자 인증, 트랜잭션 서명 흐름을 구현했습니다.",
    bullets: [
      "Node.js/Express 기반 REST API와 에러 핸들링 구성",
      "Web3.js 기반 토큰 발행/전송, 스마트 컨트랙트 연동",
      "프론트엔드 UI와 인증/게임 데이터 처리 흐름 연결",
    ],
    tags: ["Express", "REST API", "Web3.js", "MetaMask"],
  },
  {
    period: "2021.01 - 2021.03",
    title: "Mobile App Developer · Trade Now",
    summary:
      "Flutter 기반 Android/iOS 크로스플랫폼 앱에서 계정, 자산, 거래 내역 데이터를 REST API와 연결하는 화면 흐름을 구현했습니다.",
    bullets: [
      "MediaQuery, Flexible 기반 모바일/태블릿 해상도 대응",
      "REST API 연동으로 계정, 자산, 거래 내역 데이터 처리",
      "API 스펙 정의와 데이터 처리 로직 개선 협업",
    ],
    tags: ["Flutter", "Dart", "REST API", "GetX"],
  },
  {
    period: "2019.06 - 2020.06",
    title: "React / Web UI Developer · CatchCatch & Unlike",
    summary:
      "React SPA, 웹 기반 게임 화면, 관리자 페이지, PC/모바일 적응형 웹 퍼블리싱을 통해 초기 서비스 화면 구현 경험을 쌓았습니다.",
    bullets: [
      "React 기반 SPA와 사용자 이벤트 처리 화면 구현",
      "웹 기반 게임 화면 UI와 상태 구조 설계",
      "관리자 페이지, 반응형 마크업, jQuery 스크립트 유지보수",
    ],
    tags: ["React", "HTML/CSS", "jQuery", "Responsive"],
  },
];

const skillGroups = [
  {
    title: "Frontend",
    tags: ["TypeScript", "React", "Next.js", "JavaScript", "HTML", "CSS"],
  },
  {
    title: "State & Data",
    tags: ["React Query", "TanStack Query", "Zustand", "REST API", "WebSocket"],
  },
  {
    title: "AI Workflow",
    tags: ["Codex", "Claude Code", "Skills", "Figma MCP", "Harness Engineering"],
  },
  {
    title: "Backend / Infra",
    tags: ["Node.js", "Express", "Supabase", "PostgreSQL", "Vercel"],
  },
  {
    title: "Delivery Check",
    tags: ["Type Check", "Lint", "Build", "UI Review", "API Check", "QA Fix"],
  },
  {
    title: "Certifications",
    tags: ["SQLD", "교통데이터 공모전 수상", "시각정보디자인"],
  },
];

const linkCards = [
  {
    title: "GitHub",
    body: "공개 가능한 코드와 실험 저장소",
    href: "https://github.com/sooho-shin?tab=repositories",
  },
  {
    title: "Email",
    body: siteProfile.email,
    href: `mailto:${siteProfile.email}`,
  },
  {
    title: "Work Index",
    body: "프로젝트 상세 페이지",
    href: "/work",
  },
  {
    title: "Narrow",
    body: "AI 기반 한국어 연상 퍼즐",
    href: "https://pinpoint-seven.vercel.app/",
  },
  {
    title: "AmazonCar",
    body: "렌트/리스 서비스 프론트엔드",
    href: "https://www.amazoncar.co.kr/",
  },
  {
    title: "RedClick",
    body: "캠페인/어드민 플랫폼 구조",
    href: "https://redclick.net/",
  },
];

function scrollToSection(id: string) {
  const target = document.getElementById(id);
  if (!target) return;

  document.body.style.overflow = "";
  const top = target.getBoundingClientRect().top + window.scrollY - 96;
  window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
}

const RestyartPortfolio = () => {
  const [activeSection, setActiveSection] = useState<(typeof sections)[number]["id"]>("about");
  const [menuOpen, setMenuOpen] = useState(false);
  const featuredProjects = useMemo(() => projects.slice(0, 6), []);
  const previewProjects = useMemo(
    () => projects.filter(project => project.images?.[0]).slice(0, 6),
    [],
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        const visible = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target.id) {
          setActiveSection(visible.target.id as (typeof sections)[number]["id"]);
        }
      },
      {
        rootMargin: "-20% 0px -55% 0px",
        threshold: [0.1, 0.25, 0.5],
      },
    );

    sections.forEach(section => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const handleNav = (id: string, event?: React.MouseEvent<HTMLAnchorElement>) => {
    event?.preventDefault();
    setMenuOpen(false);
    window.setTimeout(() => {
      scrollToSection(id);
      window.history.pushState(null, "", `#${id}`);
    }, 0);
  };

  return (
    <Wrapper>
      <div className="ambient" aria-hidden="true" />
      <MobileTopbar>
        <a className="mobile-brand" href="#about" onClick={event => handleNav("about", event)}>
          신수호
        </a>
        <button
          className="mobile-menu-button"
          type="button"
          aria-label={menuOpen ? "메뉴 닫기" : "메뉴 열기"}
          aria-expanded={menuOpen}
          aria-controls="mobile-section-navigation"
          onClick={() => setMenuOpen(open => !open)}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
      </MobileTopbar>
      <MobileMenu id="mobile-section-navigation" $open={menuOpen}>
        {sections.map(section => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className={activeSection === section.id ? "active" : ""}
            onClick={event => handleNav(section.id, event)}
          >
            <span aria-hidden="true" />
            {section.label}
          </a>
        ))}
        <a className="mobile-cta" href="#contact" onClick={event => handleNav("contact", event)}>
          <FileIcon />
          포트폴리오 문의
        </a>
      </MobileMenu>

      <div className="page-frame">
        <Sidebar>
          <div>
            <p className="eyebrow">SOFTWARE ENGINEER · AI</p>
            <h1>신수호</h1>
            <p className="latin-name">Sooho Shin</p>
            <p className="intro">
              사용자 흐름, API 연동, 상태 구조, AI 개발 도구의 검증 루프까지 함께
              설계하는 서비스 프론트엔드 개발자입니다.
            </p>

            <nav className="desktop-nav" aria-label="섹션 이동">
              {sections.map(section => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className={activeSection === section.id ? "active" : ""}
                  onClick={event => handleNav(section.id, event)}
                >
                  <span className="line" aria-hidden="true" />
                  <span className="label">{section.label}</span>
                </a>
              ))}
            </nav>
          </div>

          <div className="sidebar-footer">
            <a href={`mailto:${siteProfile.email}`} className="contact-link">
              <MailIcon />
              {siteProfile.email}
            </a>
            <a
              href="https://github.com/sooho-shin?tab=repositories"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-link"
            >
              <ExternalIcon />
              GitHub repositories
            </a>
            <a className="sidebar-cta" href="#contact" onClick={event => handleNav("contact", event)}>
              <FileIcon />
              포트폴리오 문의
            </a>
          </div>
        </Sidebar>

        <MainContent>
          <section id="about" className="section about-section">
            <SectionTitle>About</SectionTitle>
            <div className="lead-copy">
              <p>
                저는 TypeScript, React, Next.js 기반으로 실제 서비스 화면과 데이터 흐름을
                구현하는 프론트엔드 개발자입니다. 화면만 만드는 대신 사용자가 어떤 상태를
                거쳐 목적지에 도달하는지, API 예외와 서버 상태가 UI에 어떻게 반영되는지 함께
                살핍니다.
              </p>
              <p>
                최근에는 Codex, Claude Code, Skills, AGENTS.md를 활용해 AI 산출물을 그대로
                수용하지 않고 요구사항, 타입, API, 화면 기준으로 재검증하는 작업 루프를
                만들고 있습니다.
              </p>
              <p>
                Figma, API 문서, DB schema, 요구사항 문서를 기준으로 화면과 데이터 흐름의
                불일치를 찾고, 반복 QA를 통해 제품에 들어갈 수 있는 수준까지 다듬는 일을
                중요하게 봅니다.
              </p>
            </div>
            <figure className="quote-card">
              <blockquote>
                &ldquo;AI가 만든 코드를 빠르게 붙이는 것보다, 실제 서비스 기준으로 의도와
                동작을 검증하는 개발 루프를 만드는 데 집중합니다.&rdquo;
              </blockquote>
              <figcaption>AI-assisted workflow · validation harness</figcaption>
            </figure>
            <dl className="metric-grid">
              {metrics.map(metric => (
                <div key={metric.label}>
                  <dt>{metric.value}</dt>
                  <dd>{metric.label}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section id="strengths" className="section">
            <SectionTitle>Core Strengths</SectionTitle>
            <div className="card-grid">
              {strengths.map(strength => (
                <article className="info-card" key={strength.title}>
                  <h3>{strength.title}</h3>
                  <p>{strength.body}</p>
                  <TagList tags={strength.tags} />
                </article>
              ))}
            </div>
          </section>

          <section id="experience" className="section">
            <SectionTitle>Experience</SectionTitle>
            <ul className="timeline">
              {experience.map(item => (
                <li key={item.title} className="timeline-item">
                  <time>{item.period}</time>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.summary}</p>
                    <ul className="bullets">
                      {item.bullets.map(bullet => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                    <TagList tags={item.tags} />
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section id="projects" className="section">
            <SectionTitle>Selected Projects</SectionTitle>
            <div className="project-grid">
              {featuredProjects.map(project => {
                const href = project.externalUrl || `/work/${project.slug}`;
                const external = Boolean(project.externalUrl);

                return (
                  <Link
                    key={project.slug}
                    href={href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    className="project-card"
                  >
                    <div>
                      <h3>
                        {project.title}
                        {external ? <ExternalIcon /> : <ArrowIcon />}
                      </h3>
                      <p className="company">{project.company}</p>
                      <p>{project.cardSummary}</p>
                    </div>
                    <TagList tags={project.proofPoints} />
                  </Link>
                );
              })}
            </div>
          </section>

          <section id="skills" className="section">
            <SectionTitle>Skills & Tools</SectionTitle>
            <div className="skill-grid">
              {skillGroups.map(group => (
                <article className="info-card compact" key={group.title}>
                  <h3>{group.title}</h3>
                  <TagList tags={group.tags} />
                </article>
              ))}
            </div>
          </section>

          <section id="gallery" className="section">
            <div className="section-headline">
              <div>
                <SectionTitle>Project Gallery</SectionTitle>
                <p>프로젝트 중 실제 화면 이미지를 확인할 수 있는 사례만 모아둔 프리뷰입니다.</p>
              </div>
              <Link href="/work" className="subtle-button">
                전체 목록 보기
                <ExternalIcon />
              </Link>
            </div>
            <div className="preview-grid">
              {previewProjects.map(project => {
                const image = project.images?.[0];
                if (!image) return null;
                const href = project.externalUrl || `/work/${project.slug}`;
                const external = Boolean(project.externalUrl);

                return (
                  <Link
                    key={project.slug}
                    href={href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    className="preview-card"
                  >
                    <div className="preview-meta">
                      <span>{project.title.slice(0, 1)}</span>
                      <div>
                        <strong>{project.title}</strong>
                        <small>{project.type}</small>
                      </div>
                    </div>
                    <div className="preview-image">
                      <Image src={image.src} alt={image.alt} fill sizes="180px" />
                      <div className="preview-overlay">사례 보기</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          <section id="contact" className="section contact-section">
            <SectionTitle>Contact</SectionTitle>
            <p>
              서비스 화면 구현, API·상태 구조 정리, AI-assisted workflow 검증이 필요한
              프로젝트라면 편하게 연락 주세요. 아래 버튼은 작성하신 메일 앱으로 바로
              연결됩니다.
            </p>
            <a className="primary-button" href={`mailto:${siteProfile.email}`}>
              <SendIcon />
              문의 보내기
            </a>

            <div className="links-heading">LINKS</div>
            <div className="link-grid">
              {linkCards.map(card => {
                const external = card.href.startsWith("http");
                return (
                  <Link
                    key={card.title}
                    href={card.href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    className="link-card"
                  >
                    <strong>
                      {card.title}
                      {external ? <ExternalIcon /> : <ArrowIcon />}
                    </strong>
                    <span>{card.body}</span>
                  </Link>
                );
              })}
            </div>
            <footer className="page-footer">
              <p>함께 만들고 싶은 제품이 있다면 언제든 연락 주세요. {siteProfile.email}</p>
              <p>© 2026 신수호 · Built with Next.js & styled-components</p>
            </footer>
          </section>
        </MainContent>
      </div>
    </Wrapper>
  );
};

const TagList = ({ tags }: { tags: readonly string[] }) => (
  <div className="tag-list">
    {tags.map(tag => (
      <span key={tag}>{tag}</span>
    ))}
  </div>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="section-title">{children}</h2>
);

const MailIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M4 6h16v12H4z" />
    <path d="m4 7 8 6 8-6" />
  </svg>
);

const FileIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M7 3h7l4 4v14H7z" />
    <path d="M14 3v5h5" />
    <path d="M9 13h6M9 17h4" />
  </svg>
);

const ExternalIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M7 17 17 7" />
    <path d="M9 7h8v8" />
  </svg>
);

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M5 12h14" />
    <path d="m13 6 6 6-6 6" />
  </svg>
);

const SendIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="m22 2-7 20-4-9-9-4z" />
    <path d="M22 2 11 13" />
  </svg>
);

const Wrapper = styled.div`
  --background: #050505;
  --foreground: #fafafa;
  --card: #141414;
  --muted: #262626;
  --muted-foreground: #a3a3a3;
  --border: rgb(255 255 255 / 10%);
  --primary: #e8e8e8;
  --primary-foreground: #050505;
  min-height: 100vh;
  background: var(--background);
  color: var(--foreground);
  font-family:
    "Geist",
    "Noto Sans KR",
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;

  .ambient {
    pointer-events: none;
    position: fixed;
    inset: 0;
    background: radial-gradient(
      60rem 40rem at 70% -10%,
      rgb(48 193 178 / 8%),
      transparent
    );
  }

  .page-frame {
    position: relative;
    z-index: 1;
    width: min(1072px, calc(100% - 48px));
    margin: 0 auto;
    display: flex;
    gap: 64px;
  }

  svg {
    width: 16px;
    height: 16px;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.8;
    stroke-linecap: round;
    stroke-linejoin: round;
    flex: 0 0 auto;
  }

  @media (max-width: 1023px) {
    .page-frame {
      width: min(100% - 48px, 720px);
      display: block;
    }
  }
`;

const MobileTopbar = styled.div`
  display: none;

  @media (max-width: 1023px) {
    position: sticky;
    top: 0;
    z-index: 40;
    display: flex;
    height: 68px;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid var(--border);
    background: rgb(5 5 5 / 92%);
    padding: 0 24px;
    backdrop-filter: blur(16px);

    .mobile-brand {
      color: var(--foreground);
      font-size: 16px;
      font-weight: 700;
      letter-spacing: 0;
    }

    .mobile-menu-button {
      display: inline-flex;
      width: 36px;
      height: 36px;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      gap: 5px;
      border: 1px solid var(--border);
      border-radius: 8px;
      color: var(--foreground);

      span {
        width: 16px;
        height: 1px;
        background: currentColor;
        transition: transform 180ms ease;
      }

      &[aria-expanded="true"] span:first-child {
        transform: translateY(3px) rotate(45deg);
      }

      &[aria-expanded="true"] span:last-child {
        transform: translateY(-3px) rotate(-45deg);
      }
    }
  }
`;

const MobileMenu = styled.nav<{ $open: boolean }>`
  display: none;

  @media (max-width: 1023px) {
    position: sticky;
    top: 68px;
    z-index: 35;
    display: ${props => (props.$open ? "flex" : "none")};
    flex-direction: column;
    border-bottom: 1px solid var(--border);
    background: rgb(5 5 5 / 96%);
    padding: 2px 24px 20px;
    backdrop-filter: blur(16px);

    a {
      display: flex;
      min-height: 53px;
      align-items: center;
      gap: 12px;
      border-bottom: 1px solid rgb(255 255 255 / 7%);
      color: var(--muted-foreground);
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      font-size: 14px;
      letter-spacing: 0.2em;
      text-align: left;
      transition: color 180ms ease;

      span {
        width: 24px;
        height: 1px;
        background: rgb(163 163 163 / 50%);
      }

      &.active {
        color: var(--primary);

        span {
          background: var(--primary);
        }
      }
    }

    .mobile-cta {
      justify-content: center;
      min-height: 42px;
      margin-top: 16px;
      border: 1px solid rgb(232 232 232 / 40%);
      border-radius: 8px;
      background: var(--muted);
      color: var(--primary);
      font-family: inherit;
      font-size: 14px;
      letter-spacing: 0;
      font-weight: 500;
    }
  }
`;

const Sidebar = styled.header`
  position: sticky;
  top: 0;
  display: flex;
  width: 44%;
  height: 100vh;
  max-height: 100vh;
  flex-direction: column;
  justify-content: space-between;
  padding: 96px 0;

  .eyebrow {
    color: var(--muted-foreground);
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-size: 12px;
    letter-spacing: 0.28em;
    text-transform: uppercase;
  }

  h1 {
    margin-top: 18px;
    color: var(--foreground);
    font-size: 60px;
    line-height: 1;
    font-weight: 800;
    letter-spacing: 0;
  }

  .latin-name {
    margin-top: 8px;
    color: var(--primary);
    font-family: Georgia, "Times New Roman", serif;
    font-size: 24px;
    font-style: italic;
    opacity: 0.86;
  }

  .intro {
    max-width: 420px;
    margin-top: 30px;
    color: var(--muted-foreground);
    font-size: 16px;
    line-height: 1.75;
  }

  .desktop-nav {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-top: 52px;
  }

  .desktop-nav a {
    display: flex;
    align-items: center;
    gap: 16px;
    width: fit-content;
    color: var(--muted-foreground);

    .line {
      width: 32px;
      height: 1px;
      background: rgb(163 163 163 / 50%);
      transition:
        width 300ms ease,
        background-color 300ms ease;
    }

    .label {
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      font-size: 12px;
      letter-spacing: 0.2em;
      transition: color 300ms ease;
    }

    &:hover,
    &:focus-visible,
    &.active {
      color: var(--primary);

      .line {
        width: 64px;
        background: var(--primary);
      }
    }
  }

  .sidebar-footer {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .contact-link {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    color: var(--muted-foreground);
    font-size: 14px;
    transition: color 180ms ease;

    &:hover,
    &:focus-visible {
      color: var(--primary);
    }
  }

  .sidebar-cta {
    display: inline-flex;
    width: fit-content;
    align-items: center;
    gap: 8px;
    margin-top: 18px;
    border: 1px solid rgb(232 232 232 / 40%);
    border-radius: 8px;
    background: var(--muted);
    padding: 9px 16px;
    color: var(--primary);
    font-size: 14px;
    font-weight: 500;
    transition:
      background-color 180ms ease,
      color 180ms ease;

    &:hover,
    &:focus-visible {
      background: var(--primary);
      color: var(--primary-foreground);
    }
  }

  @media (max-width: 1023px) {
    display: none;
  }
`;

const MainContent = styled.main`
  width: 56%;
  padding: 96px 0;

  .section {
    scroll-margin-top: 96px;
    padding-top: 112px;

    &:first-child {
      padding-top: 0;
    }
  }

  .about-section > .section-title {
    display: none;
  }

  .about-section .lead-copy {
    padding-top: 96px;
  }

  .section-title {
    margin-bottom: 24px;
    color: var(--primary);
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-size: 12px;
    line-height: 16px;
    font-weight: 400;
    letter-spacing: 0.25em;
    text-transform: uppercase;
  }

  .lead-copy {
    display: flex;
    flex-direction: column;
    gap: 24px;
    color: #b8b8b8;
    font-size: 16px;
    font-weight: 400;
    line-height: 1.75;

    p:first-child::first-letter {
      font-family: Georgia, "Times New Roman", serif;
      font-size: 1.35em;
      font-style: italic;
    }
  }

  .quote-card {
    margin-top: 34px;
    border-left: 2px solid var(--primary);
    border-radius: 14px;
    background: rgb(20 20 20 / 60%);
    padding: 22px;

    blockquote {
      color: var(--primary);
      font-family: Georgia, "Times New Roman", serif;
      font-size: 20px;
      font-style: italic;
      line-height: 1.8;
    }

    figcaption {
      margin-top: 18px;
      color: var(--muted-foreground);
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      font-size: 12px;
      letter-spacing: 0.08em;
    }
  }

  .metric-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 1px;
    overflow: hidden;
    margin-top: 40px;
    border: 1px solid var(--border);
    border-radius: 14px;
    background: var(--border);

    div {
      min-height: 150px;
      background: var(--card);
      padding: 24px 20px;
    }

    dt {
      color: var(--foreground);
      font-size: 30px;
      line-height: 1;
      font-weight: 800;
      letter-spacing: 0;
    }

    dd {
      margin-top: 12px;
      color: var(--muted-foreground);
      font-size: 13px;
      line-height: 1.5;
    }
  }

  .card-grid,
  .project-grid,
  .skill-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 20px;
  }

  .info-card,
  .project-card {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 276px;
    border: 1px solid var(--border);
    border-radius: 14px;
    background: var(--card);
    padding: 24px;
    transition:
      border-color 180ms ease,
      background-color 180ms ease;

    &:hover,
    &:focus-visible,
    &:focus-within {
      border-color: rgb(232 232 232 / 40%);
    }

    h3 {
      color: var(--foreground);
      font-size: 18px;
      line-height: 1.55;
      font-weight: 700;
      letter-spacing: 0;
    }

    p {
      margin-top: 18px;
      color: var(--muted-foreground);
      font-size: 15px;
      line-height: 1.75;
    }
  }

  .compact {
    min-height: 0;
  }

  .tag-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 24px;

    span {
      display: inline-flex;
      min-height: 27px;
      align-items: center;
      border-radius: 999px;
      background: var(--muted);
      padding: 5px 11px;
      color: var(--primary);
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      font-size: 11px;
      font-weight: 700;
      line-height: 1;
      white-space: nowrap;
    }
  }

  .timeline {
    display: flex;
    flex-direction: column;
  }

  .timeline-item {
    display: grid;
    grid-template-columns: 140px 1fr;
    gap: 24px;
    border-radius: 14px;
    padding: 24px 16px;
    transition: background-color 180ms ease;

    &:hover,
    &:focus-within {
      background: var(--card);
    }

    time {
      color: var(--muted-foreground);
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      font-size: 12px;
      line-height: 1.6;
    }

    h3 {
      color: var(--foreground);
      font-size: 18px;
      line-height: 1.55;
      font-weight: 700;
    }

    p,
    .bullets {
      margin-top: 14px;
      color: var(--muted-foreground);
      font-size: 15px;
      line-height: 1.75;
    }

    .bullets {
      display: flex;
      flex-direction: column;
      gap: 8px;
      list-style: disc;
      padding-left: 18px;
    }
  }

  .project-card {
    color: inherit;

    h3 {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 12px;
      transition: color 180ms ease;
    }

    &:hover h3,
    &:focus-visible h3 {
      color: var(--primary);
    }

    .company {
      margin-top: 4px;
      color: #737373;
      font-size: 13px;
    }
  }

  .section-headline {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 24px;

    .section-title {
      margin-bottom: 14px;
    }

    p {
      color: var(--muted-foreground);
      font-size: 15px;
      line-height: 1.6;
    }
  }

  .subtle-button {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    flex: 0 0 auto;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--card);
    padding: 9px 12px;
    color: var(--foreground);
    font-size: 12px;
    font-weight: 600;
    transition:
      color 180ms ease,
      border-color 180ms ease;

    &:hover,
    &:focus-visible {
      border-color: rgb(232 232 232 / 40%);
      color: var(--primary);
    }
  }

  .preview-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
  }

  .preview-card {
    overflow: hidden;
    border: 1px solid var(--border);
    border-radius: 14px;
    background: var(--card);
    color: inherit;

    &:hover .preview-overlay,
    &:focus-visible .preview-overlay,
    &:focus-within .preview-overlay {
      opacity: 1;
    }
  }

  .preview-meta {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px;

    > span {
      display: inline-flex;
      width: 28px;
      height: 28px;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      background: #3b82f6;
      color: white;
      font-size: 13px;
      font-weight: 800;
    }

    strong,
    small {
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    strong {
      max-width: 120px;
      color: var(--foreground);
      font-size: 14px;
    }

    small {
      max-width: 120px;
      margin-top: 3px;
      color: var(--muted-foreground);
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      font-size: 11px;
    }
  }

  .preview-image {
    position: relative;
    aspect-ratio: 1 / 1.12;
    overflow: hidden;
    background: #f5f5f5;

    img {
      object-fit: cover;
      object-position: top center;
    }
  }

  .preview-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgb(5 5 5 / 80%);
    color: var(--primary);
    font-size: 13px;
    font-weight: 700;
    opacity: 0;
    backdrop-filter: blur(2px);
    transition: opacity 180ms ease;
  }

  .contact-section {
    min-height: 860px;

    > p {
      color: var(--muted-foreground);
      font-size: 17px;
      line-height: 1.8;
    }
  }

  .primary-button {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-top: 28px;
    border-radius: 8px;
    background: var(--primary);
    padding: 13px 24px;
    color: var(--primary-foreground);
    font-size: 14px;
    font-weight: 800;
    transition: opacity 180ms ease;

    &:hover,
    &:focus-visible {
      opacity: 0.9;
    }
  }

  .links-heading {
    margin-top: 66px;
    margin-bottom: 18px;
    color: var(--muted-foreground);
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-size: 12px;
    letter-spacing: 0.25em;
  }

  .link-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
  }

  .link-card {
    min-height: 118px;
    border: 1px solid var(--border);
    border-radius: 12px;
    background: var(--card);
    padding: 18px;
    color: inherit;
    transition: border-color 180ms ease;

    &:hover,
    &:focus-visible {
      border-color: rgb(232 232 232 / 40%);
    }

    strong {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 8px;
      color: var(--foreground);
      font-size: 14px;
      line-height: 1.5;
    }

    span {
      display: block;
      margin-top: 10px;
      color: var(--muted-foreground);
      font-size: 13px;
      line-height: 1.5;
      overflow-wrap: anywhere;
    }
  }

  .page-footer {
    margin-top: 100px;
    border-top: 1px solid var(--border);
    padding-top: 34px;
    color: var(--muted-foreground);
    font-size: 13px;
    line-height: 1.8;

    p + p {
      margin-top: 12px;
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      font-size: 12px;
    }
  }

  @media (max-width: 1023px) {
    width: 100%;
    padding: 0 0 80px;

    .section {
      scroll-margin-top: 96px;
      padding-top: 88px;
    }

    .about-section > .section-title {
      display: block;
    }

    .about-section .lead-copy {
      padding-top: 0;
    }

    .metric-grid,
    .card-grid,
    .project-grid,
    .skill-grid,
    .link-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .preview-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 640px) {
    .lead-copy,
    .contact-section > p {
      font-size: 16px;
    }

    .quote-card blockquote {
      font-size: 18px;
    }

    .metric-grid,
    .card-grid,
    .project-grid,
    .skill-grid,
    .preview-grid,
    .link-grid {
      grid-template-columns: 1fr;
    }

    .metric-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .timeline-item {
      grid-template-columns: 1fr;
      gap: 10px;
      padding: 16px 0;
    }

    .info-card,
    .project-card {
      min-height: auto;
    }

    .section-headline {
      display: block;
    }

    .subtle-button {
      margin-top: 18px;
    }
  }
`;

export default RestyartPortfolio;
