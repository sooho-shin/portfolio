---
name: resume-context
description: 포트폴리오, Work/About/Home 문구, 프로젝트 순서, 자기소개, 이력 기반 콘텐츠를 수정할 때 신수호 이력서 맥락을 참고하기 위한 스킬. 사용자가 이력서 기준으로 배치, 포트폴리오 개선, 경력 서술, 프로젝트 설명, AI 개발/검증 포지셔닝 정리를 요청하면 사용한다.
---

# Resume Context

## 기본 원칙

- 포트폴리오 콘텐츠를 수정하기 전에 `references/resume.md`를 먼저 읽고, 경력/프로젝트/기술 스택과 충돌하지 않게 작성한다.
- 공개 페이지에는 이력서의 민감 정보(전화번호 등)를 노출하지 않는다. 연락 수단은 기본적으로 이메일과 GitHub 중심으로 둔다.
- 없는 성과, 수치, 고객명, 배포 URL, 스크린샷은 새로 만들지 않는다. 이 스킬을 사용할 때는 `references/resume.md`에 있는 이력서 근거만 기준으로 삼는다.
- 문구는 "AI가 코드를 만들어줬다"가 아니라 "AI 개발 도구를 작업 규칙, 구현, 검증, 리팩터링, QA 루프에 활용한다"는 방향으로 쓴다.

## 콘텐츠 수정 절차

1. `references/resume.md`에서 관련 경력과 프로젝트를 확인한다.
2. 수정 대상이 Work 리스트라면 이력서에 등장하는 프로젝트만 우선 적용한다: `Narrow/Pinpoint`, `MMIS/AI Harness` 계열, `RedClick`, `Location`, `AmazonCar`, `Yummy Game`, 이후 `Zudice`, `Entropy Explorer`, `Fruttidino` 같은 과거 Web3/Game 프로젝트.
3. 수정 대상이 About/Home 문구라면 다음 축을 우선한다.
   - 사용자 경험을 구현하는 프론트엔드 개발
   - TypeScript, React, Next.js 기반 화면/상태/API 흐름
   - React Query/TanStack Query, Zustand 기반 데이터/상태 관리
   - Codex, Claude Code, Skills, AGENTS.md를 활용한 AI-assisted development
   - Figma, API, DB schema, 요구사항 문서 기준 검증
4. 상세 프로젝트 설명은 `문제 -> 역할 -> 검증 -> 결과 -> 기술 스택` 순서로 쓴다.
5. 표현이 이력서보다 과장되었는지 마지막에 점검한다.

## 선호 표현

- "AI 산출물을 그대로 수용하지 않고, 요구사항/설계/타입/API/화면 기준으로 검증한다."
- "Figma, Swagger/API 문서, DB schema, 요구사항 문서를 기준으로 화면과 데이터 흐름의 불일치를 찾는다."
- "서버 상태와 클라이언트 상태를 분리해 유지보수 가능한 UI 구조를 만든다."
- "반복 QA와 수정 검증을 Skills/AGENTS.md 기반 작업 규칙으로 표준화한다."

## 피해야 할 표현

- 근거 없는 "풀스택 전문가", "AI 전문가", "엔터프라이즈 전체 단독 설계" 같은 과장 표현.
- 아직 공개 이미지/URL이 없는 프로젝트를 실제 배포 사례처럼 단정하는 표현.
- 이력서에 없는 로컬 repo/문서 기반 프로젝트를 이력서 기반 Work 사례처럼 섞는 표현.
- 이력서의 비공개 업무나 내부 시스템명을 필요 이상으로 상세히 공개하는 표현.
