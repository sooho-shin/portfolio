"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";
import { breakpoints } from "@/config/breakboint";
import ContactSidebarLayout from "@/components/templates/ContactSidebarLayout";
import PortfolioPageShell from "@/components/templates/PortfolioPageShell";
import { projects } from "@/config/projects";
import { siteProfile } from "@/config/profile";

const AboutWrapper = () => {
  return (
    <PortfolioPageShell
      effectTitle="about"
      effectRollingText="SERVICE PROOF"
    >
      <ContactSidebarLayout>
        <AboutRoot>
          <Hero>
            <p className="eyebrow">About</p>
            <h1>{siteProfile.headline}</h1>
            <div className="copy">
              <p>
                저는 React와 Next.js 기반 서비스 화면을 만들고, API 연동,
                상태 구조, 사용자 흐름이 실제 운영에서 어긋나지 않도록
                검증 가능한 기준으로 정리합니다.
              </p>
              <p>
                렌트/리스 서비스, 블록체인 게임, 위치 기반 AI 추천,
                AI-assisted 업무 시스템처럼 화면과 데이터, 검증 기준이 함께
                움직이는 프로젝트를 다뤄왔습니다.
              </p>
            </div>
          </Hero>

          <ProjectProof>
            <div className="section-title">
              <p>Proof through projects</p>
              <span>{projects.length} cases</span>
            </div>
            <div className="project-list">
              {projects.map(project => (
                <Link href={`/work/${project.slug}`} key={project.slug}>
                  <article>
                    <div className="thumb">
                      {project.images?.[0] ? (
                        <Image
                          src={project.images[0].src}
                          alt={project.images[0].alt}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      ) : (
                        <span>{project.title.slice(0, 2)}</span>
                      )}
                    </div>
                    <div className="body">
                      <p className="type">{project.type}</p>
                      <h2>{project.title}</h2>
                      <p>{project.cardSummary}</p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </ProjectProof>

          <CapabilityWrapper>
            <p className="title">
              EXPERIENCE <span className="sec-font">AREAS:</span>
            </p>
            <ul>
              {siteProfile.capabilities.map(capability => (
                <li key={capability}>
                  <span>{capability}</span>
                </li>
              ))}
            </ul>
          </CapabilityWrapper>

          <SkillWrapper>
            <p className="title">
              WORKING <span className="sec-font">STACK:</span>
            </p>
            <div className="row">
              <div className="box">TYPESCRIPT</div>
              <div className="box">REACT / NEXT</div>
            </div>
            <div className="row">
              <div className="box">NODE / EXPRESS</div>
              <div className="box">REST / API CONTRACT</div>
            </div>
            <div className="row">
              <div className="box">REACT QUERY</div>
              <div className="box">ZUSTAND</div>
            </div>
            <div className="row">
              <div className="box">STYLED COMPONENTS</div>
              <div className="box">SCSS</div>
            </div>
            <div className="row">
              <div className="box">GEMINI / PLACES API</div>
              <div className="box">WORKFLOW VALIDATION</div>
            </div>
          </SkillWrapper>

          <SnsWrapper>
            <p className="title">
              CONTACT <span className="sec-font">CHANNELS</span>
            </p>
            <a href={`mailto:${siteProfile.email}`}>
              <span>{siteProfile.email}</span>
              <span className="arrow">MAIL</span>
              <div className="mask"></div>
            </a>
            {siteProfile.socials.map(social => (
              <a
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                key={social.label}
              >
                <span>{social.label}</span>
                <span className="arrow">OPEN</span>
                <div className="mask"></div>
              </a>
            ))}
          </SnsWrapper>
        </AboutRoot>
      </ContactSidebarLayout>
    </PortfolioPageShell>
  );
};

const AboutRoot = styled.div`
  margin-top: 84px;
  border-top: 4px solid #000;
  background: #fff;

  @media (max-width: ${breakpoints.sm}px) {
    margin-top: 0;
  }
`;

const Hero = styled.section`
  padding: 32px;
  border-bottom: 4px solid #000;

  @media (max-width: ${breakpoints.md}px) {
    padding: 24px 16px;
  }

  .eyebrow {
    font-size: 13px;
    font-weight: 700;
    text-transform: uppercase;
    margin-bottom: 16px;
  }

  h1 {
    max-width: 920px;
    font-size: clamp(38px, 6.5vw, 96px);
    line-height: 1.02;
    margin-bottom: 28px;
  }

  .copy {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 24px;
    max-width: 980px;

    @media (max-width: ${breakpoints.md}px) {
      grid-template-columns: 1fr;
    }

    p {
      font-size: 17px;
      line-height: 1.7;
    }
  }
`;

const ProjectProof = styled.section`
  border-bottom: 4px solid #000;

  .section-title {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    padding: 16px 32px;
    border-bottom: 4px solid #000;
    font-weight: 700;
    text-transform: uppercase;

    @media (max-width: ${breakpoints.md}px) {
      padding: 16px;
    }
  }

  .project-list {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));

    @media (max-width: ${breakpoints.md}px) {
      grid-template-columns: 1fr;
    }

    a {
      border-right: 4px solid #000;
      border-bottom: 4px solid #000;

      &:nth-child(2n) {
        border-right: none;
      }

      @media (max-width: ${breakpoints.md}px) {
        border-right: none;
      }
    }

    article {
      min-height: 100%;
      display: grid;
      grid-template-columns: 38% 1fr;

      @media (max-width: ${breakpoints.sm}px) {
        grid-template-columns: 1fr;
      }
    }

    .thumb {
      position: relative;
      min-height: 220px;
      border-right: 4px solid #000;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f4f1ea;

      @media (max-width: ${breakpoints.sm}px) {
        border-right: none;
        border-bottom: 4px solid #000;
      }

      img {
        object-fit: cover;
      }

      span {
        font-size: clamp(42px, 7vw, 84px);
        font-weight: 800;
        line-height: 1;
        text-transform: uppercase;
      }
    }

    .body {
      padding: 22px;

      .type {
        font-size: 12px;
        font-weight: 700;
        text-transform: uppercase;
        margin-bottom: 10px;
      }

      h2 {
        font-size: clamp(24px, 3vw, 42px);
        line-height: 1;
        margin-bottom: 14px;
        text-transform: uppercase;
      }

      p:last-child {
        font-size: 15px;
        line-height: 1.6;
      }
    }
  }
`;

const CapabilityWrapper = styled.section`
  padding-top: 0.5vw;
  padding-left: 2vw;
  border-bottom: 4px solid #000;

  .title {
    font-size: 2vw;

    @media (max-width: ${breakpoints.md}px) {
      font-size: 20px;
    }

    > span {
      display: block;
    }
  }

  ul {
    display: flex;
    align-items: center;
    justify-content: end;
    flex-wrap: wrap;
    width: 100%;
    margin-bottom: 6vw;
    padding-right: 10px;

    li {
      display: flex;
      align-items: center;
      justify-content: end;
      flex: 25% 0 0;
      margin-top: 16px;

      @media (max-width: ${breakpoints.md}px) {
        flex: 50% 0 0;
        margin-top: 8px;
      }

      > span {
        font-size: 16px;

        @media (max-width: ${breakpoints.md}px) {
          font-size: 13px;
        }
      }

      &::before {
        content: "";
        display: inline-block;
        width: 18px;
        height: 18px;
        border-radius: 10px;
        background-color: #000;
        margin-right: 12px;

        @media (max-width: ${breakpoints.md}px) {
          width: 10px;
          height: 10px;
          margin-right: 4px;
        }
      }
    }
  }
`;

const SkillWrapper = styled.section`
  padding-bottom: 6vw;

  .title {
    font-size: 2vw;
    border-bottom: 4px solid #000;
    text-align: center;
    padding: 0.5vw 0;

    @media (max-width: ${breakpoints.md}px) {
      font-size: 20px;
    }
  }

  .row {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .box {
      flex: 1;
      font-size: 1.25vw;
      border-bottom: 4px solid #000;
      padding: 0.5vw 0;
      padding-left: 2vw;

      @media (max-width: ${breakpoints.md}px) {
        font-size: 16px;
        padding: 1vw 0 1vw 2vw;
      }

      &:first-child {
        border-right: 4px solid #000;
      }
    }
  }
`;

const SnsWrapper = styled.section`
  .title {
    font-size: 2vw;
    padding-left: 2vw;
    border-bottom: 4px solid #000;

    @media (max-width: ${breakpoints.md}px) {
      font-size: 20px;
    }
  }

  a {
    padding: 0 2vw;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 4px solid #000;
    overflow: hidden;
    position: relative;

    @media (max-width: ${breakpoints.md}px) {
      padding: 1vw 2vw;
    }

    .mask {
      position: absolute;
      left: 0;
      top: 0;
      transform: translateY(100%);
      width: 100%;
      height: 100%;
      background-color: #000;
      display: block;
      transition: transform 150ms;
      z-index: -1;
    }

    span:first-child {
      color: #000;
      font-size: clamp(28px, 3vw, 52px);
      text-transform: uppercase;
      transition: all 150ms;
      word-break: break-word;
    }

    span.arrow {
      font-size: 13px;
      font-weight: 700;
      text-transform: uppercase;
    }

    &:hover,
    &:focus-visible {
      .mask {
        transform: translateY(0%);
      }

      span {
        color: #fff;
      }
    }
  }
`;

export default AboutWrapper;
