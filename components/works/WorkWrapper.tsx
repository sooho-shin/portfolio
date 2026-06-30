"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import styled from "styled-components";
import { projects } from "@/config/projects";

const WorkWrapper = () => {
  return (
    <WorkPage>
      <div className="ambient" aria-hidden="true" />
      <div className="frame">
        <header className="page-header">
          <Link href="/" className="back-link">
            ← HOME
          </Link>
          <p className="eyebrow">SELECTED WORK</p>
          <h1>서비스 흐름과 검증 루프를 함께 정리한 프로젝트 기록입니다.</h1>
          <p className="intro">
            React, TypeScript, Next.js 기반 화면 구현부터 API 연동, 상태 관리,
            AI-assisted workflow, 실시간 UI까지 실제 제품 흐름 안에서 맡았던 작업을
            모았습니다.
          </p>
        </header>

        <aside className="summary-bar" aria-label="Work summary">
          <div>
            <strong>{projects.length}</strong>
            <span>Project cases</span>
          </div>
          <div>
            <strong>6Y+</strong>
            <span>Frontend career</span>
          </div>
          <div>
            <strong>Type</strong>
            <span>API and UI check</span>
          </div>
        </aside>

        <section className="project-list" aria-label="Project list">
          {projects.map((project, index) => {
            const image = project.images?.[0];

            return (
              <Link href={`/work/${project.slug}`} className="project-card" key={project.slug}>
                <div className="index">{String(index + 1).padStart(2, "0")}</div>
                <div className="card-copy">
                  <div className="meta">
                    <span>{project.type}</span>
                    <span>{project.period}</span>
                  </div>
                  <h2>{project.title}</h2>
                  <p>{project.cardSummary}</p>
                  <div className="tag-list">
                    {project.proofPoints.map(point => (
                      <span key={point}>{point}</span>
                    ))}
                  </div>
                </div>
                <div className="preview" aria-hidden={!image}>
                  {image ? (
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, 260px"
                    />
                  ) : (
                    <span>{project.title.slice(0, 1)}</span>
                  )}
                </div>
              </Link>
            );
          })}
        </section>
      </div>
    </WorkPage>
  );
};

const WorkPage = styled.main`
  --background: #050505;
  --foreground: #fafafa;
  --card: #141414;
  --muted: #262626;
  --muted-foreground: #a3a3a3;
  --border: rgb(255 255 255 / 10%);
  --primary: #e8e8e8;
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

  .frame {
    position: relative;
    z-index: 1;
    width: min(1072px, calc(100% - 48px));
    margin: 0 auto;
    padding: 96px 0 120px;
  }

  .back-link,
  .eyebrow,
  .meta,
  .tag-list,
  .summary-bar span {
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  }

  .back-link {
    display: inline-flex;
    min-height: 36px;
    align-items: center;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--card);
    padding: 8px 12px;
    color: var(--muted-foreground);
    font-size: 12px;
    letter-spacing: 0.18em;
    transition:
      border-color 180ms ease,
      color 180ms ease;

    &:hover,
    &:focus-visible {
      border-color: rgb(232 232 232 / 40%);
      color: var(--primary);
    }
  }

  .page-header {
    max-width: 760px;
  }

  .eyebrow {
    margin-top: 56px;
    color: var(--primary);
    font-size: 12px;
    line-height: 16px;
    letter-spacing: 0.25em;
  }

  h1 {
    margin-top: 22px;
    color: var(--foreground);
    font-size: 54px;
    line-height: 1.08;
    font-weight: 800;
    letter-spacing: 0;
  }

  .intro {
    margin-top: 24px;
    color: var(--muted-foreground);
    font-size: 16px;
    line-height: 1.75;
  }

  .summary-bar {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1px;
    overflow: hidden;
    margin-top: 46px;
    border: 1px solid var(--border);
    border-radius: 14px;
    background: var(--border);

    > div {
      min-height: 124px;
      background: var(--card);
      padding: 22px;
    }

    strong {
      display: block;
      color: var(--foreground);
      font-size: 32px;
      line-height: 1;
      font-weight: 800;
      letter-spacing: 0;
    }

    span {
      display: block;
      margin-top: 16px;
      color: var(--muted-foreground);
      font-size: 12px;
      line-height: 1.5;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }
  }

  .project-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-top: 54px;
  }

  .project-card {
    display: grid;
    grid-template-columns: 72px minmax(0, 1fr) 240px;
    gap: 24px;
    min-height: 248px;
    border: 1px solid var(--border);
    border-radius: 14px;
    background: var(--card);
    padding: 24px;
    color: inherit;
    transition:
      border-color 180ms ease,
      background-color 180ms ease;

    &:hover,
    &:focus-visible {
      border-color: rgb(232 232 232 / 40%);
      background: #171717;
    }
  }

  .index {
    color: #737373;
    font-family: Georgia, "Times New Roman", serif;
    font-size: 36px;
    line-height: 1;
    font-style: italic;
  }

  .card-copy {
    min-width: 0;
  }

  .meta {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;

    span {
      min-height: 26px;
      border-radius: 999px;
      background: var(--muted);
      padding: 6px 10px;
      color: var(--muted-foreground);
      font-size: 11px;
      line-height: 1;
      white-space: nowrap;
    }
  }

  h2 {
    margin-top: 20px;
    color: var(--foreground);
    font-size: 28px;
    line-height: 1.2;
    font-weight: 800;
    letter-spacing: 0;
  }

  .card-copy p {
    max-width: 620px;
    margin-top: 16px;
    color: var(--muted-foreground);
    font-size: 15px;
    line-height: 1.75;
  }

  .tag-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 22px;

    span {
      display: inline-flex;
      min-height: 27px;
      align-items: center;
      border-radius: 999px;
      background: var(--muted);
      padding: 5px 11px;
      color: var(--primary);
      font-size: 11px;
      font-weight: 700;
      line-height: 1;
      white-space: nowrap;
    }
  }

  .preview {
    position: relative;
    overflow: hidden;
    min-height: 200px;
    border: 1px solid var(--border);
    border-radius: 12px;
    background: #0d0d0d;

    img {
      object-fit: cover;
      object-position: top center;
    }

    > span {
      display: flex;
      width: 100%;
      height: 100%;
      min-height: 200px;
      align-items: center;
      justify-content: center;
      color: var(--primary);
      font-size: 42px;
      font-weight: 800;
    }
  }

  @media (max-width: 900px) {
    .frame {
      padding: 72px 0 96px;
    }

    h1 {
      font-size: 42px;
    }

    .project-card {
      grid-template-columns: 52px minmax(0, 1fr);

      .preview {
        grid-column: 1 / -1;
      }
    }
  }

  @media (max-width: 640px) {
    .frame {
      width: min(100% - 48px, 720px);
      padding: 40px 0 72px;
    }

    .summary-bar {
      grid-template-columns: 1fr;
    }

    .project-card {
      grid-template-columns: 1fr;
      padding: 20px;
    }

    h1 {
      font-size: 34px;
    }

    .preview {
      min-height: 220px;
    }
  }
`;

export default WorkWrapper;
