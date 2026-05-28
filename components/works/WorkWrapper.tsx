"use client";

import React from "react";
import Link from "next/link";
import styled from "styled-components";
import { breakpoints } from "@/config/breakboint";
import ContactSidebarLayout from "@/components/templates/ContactSidebarLayout";
import PortfolioPageShell from "@/components/templates/PortfolioPageShell";
import { projects } from "@/config/projects";

const WorkWrapper = () => {
  return (
    <PortfolioPageShell
      effectTitle="work"
      effectRollingText="RESUME PROOF"
    >
      <ContactSidebarLayout>
        <WorkRoot>
          <Intro>
            <p className="eyebrow">Selected work</p>
            <h1>서비스가 완성되는 순간까지 화면과 흐름을 다듬어온 기록입니다.</h1>
            <p>
              React, TypeScript, Next.js 기반 화면 구현부터 API 연동, 상태
              관리, AI-assisted workflow, 실시간 게임 UI까지 제품이 실제로
              움직이는 과정에서 맡았던 작업들을 모았습니다.
            </p>
          </Intro>

          <SummaryBar aria-label="Work summary">
            <div>
              <strong>{projects.length}</strong>
              <span>Project cases</span>
            </div>
            <div>
              <strong>6Y+</strong>
              <span>Frontend career</span>
            </div>
            <div>
              <strong>AI QA</strong>
              <span>Assisted workflow</span>
            </div>
          </SummaryBar>

          <ProjectList>
            {projects.map((project, index) => (
              <ProjectCard href={`/work/${project.slug}`} key={project.slug}>
                <span className="index">{String(index + 1).padStart(2, "0")}</span>
                <div className="content">
                  <div className="meta">
                    <span>{project.type}</span>
                    <span>{project.period}</span>
                  </div>
                  <h2>{project.title}</h2>
                  <p className="summary">{project.cardSummary}</p>
                  <ul className="proof">
                    {project.proofPoints.map(point => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>
                <span className="arrow" aria-hidden="true">
                  View
                </span>
              </ProjectCard>
            ))}
          </ProjectList>
        </WorkRoot>
      </ContactSidebarLayout>
    </PortfolioPageShell>
  );
};

const WorkRoot = styled.div`
  margin-top: 84px;
  background: #fff;
  border-top: 4px solid #000;

  @media (max-width: ${breakpoints.sm}px) {
    margin-top: 0;
  }
`;

const Intro = styled.section`
  padding: 40px 32px 36px;
  border-bottom: 4px solid #000;
  background: #fff;

  @media (max-width: ${breakpoints.sm}px) {
    padding: 28px 16px;
  }

  .eyebrow {
    font-size: 13px;
    font-weight: 700;
    text-transform: uppercase;
    margin-bottom: 12px;
  }

  h1 {
    max-width: 900px;
    font-size: clamp(36px, 5.8vw, 86px);
    line-height: 1.02;
    margin-bottom: 20px;
    letter-spacing: 0;
  }

  p:last-child {
    max-width: 780px;
    font-size: 17px;
    line-height: 1.75;
  }
`;

const SummaryBar = styled.aside`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border-bottom: 4px solid #000;

  @media (max-width: ${breakpoints.sm}px) {
    grid-template-columns: 1fr;
  }

  > div {
    min-height: 108px;
    padding: 20px 24px;
    border-right: 4px solid #000;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    &:last-child {
      border-right: none;
    }

    @media (max-width: ${breakpoints.sm}px) {
      min-height: 88px;
      border-right: none;
      border-bottom: 4px solid #000;

      &:last-child {
        border-bottom: none;
      }
    }
  }

  strong {
    font-size: clamp(32px, 5vw, 64px);
    line-height: 0.9;
  }

  span {
    font-size: 13px;
    font-weight: 700;
    text-transform: uppercase;
  }
`;

const ProjectList = styled.div`
  display: flex;
  flex-direction: column;
`;

const ProjectCard = styled(Link)`
  min-height: 260px;
  display: grid;
  grid-template-columns: 88px minmax(0, 1fr) 88px;
  gap: 24px;
  padding: 28px 32px;
  border-bottom: 4px solid #000;
  color: #000;
  background: #fff;
  transition:
    background-color 180ms ease,
    color 180ms ease;

  &:hover,
  &:focus-visible {
    background: #000;
    color: #fff;

    .proof li {
      border-color: #fff;
    }
  }

  @media (max-width: ${breakpoints.md}px) {
    grid-template-columns: 64px minmax(0, 1fr);
    gap: 16px;

    .arrow {
      grid-column: 2;
      justify-self: start;
    }
  }

  @media (max-width: ${breakpoints.sm}px) {
    min-height: auto;
    grid-template-columns: 1fr;
    padding: 24px 16px;
  }

  .index {
    font-size: clamp(32px, 5vw, 64px);
    line-height: 0.9;
    font-weight: 800;
  }

  .content {
    min-width: 0;
  }

  .meta {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 18px;

    span {
      border: 2px solid currentColor;
      padding: 4px 8px;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      line-height: 1.2;
    }
  }

  h2 {
    font-size: clamp(34px, 6vw, 92px);
    line-height: 0.96;
    margin-bottom: 18px;
    text-transform: uppercase;
    letter-spacing: 0;
    overflow-wrap: anywhere;
  }

  .summary {
    max-width: 760px;
    font-size: 17px;
    line-height: 1.7;
    margin-bottom: 22px;
  }

  .proof {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin: 0;
    padding: 0;
    list-style: none;

    li {
      border: 2px solid #000;
      padding: 6px 10px;
      font-size: 13px;
      font-weight: 700;
      text-transform: uppercase;
      transition: border-color 180ms ease;
    }
  }

  .arrow {
    align-self: start;
    justify-self: end;
    border: 2px solid currentColor;
    padding: 8px 10px;
    font-size: 13px;
    font-weight: 800;
    text-transform: uppercase;
  }
`;

export default WorkWrapper;
