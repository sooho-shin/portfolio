# 신수호 이력서 기준 문서

Source: `/Users/sinsuho/Downloads/신수호_이력서 (1).pdf`
Extracted: 2026-05-28 KST

이 문서는 포트폴리오 수정 시 참고할 이력 기반 맥락이다. 공개 페이지에는 민감 정보나 비공개 세부사항을 그대로 노출하지 말고, 역할과 검증 가능한 기술 경험 중심으로 재작성한다.

## 핵심 포지셔닝

- 사용자 경험을 기술로 구현하는 프론트엔드 개발자.
- 화면 구현에 그치지 않고 사용자 흐름, 성능, 유지보수성, API 예외 상황을 함께 고려한다.
- 주요 스택은 TypeScript, React, Next.js.
- 컴포넌트 구조 설계, 상태 관리, 비동기 데이터 처리, React Query/TanStack Query 기반 서버 상태 관리, Zustand 기반 클라이언트 상태 관리 경험이 있다.
- Codex, Claude Code 같은 AI 개발 도구를 요구사항 분석, 코드 구조 설계, 반복 구현, 리팩터링, 검증 과정에 활용한다.
- Skills, AGENTS.md, CLAUDE.md 같은 프로젝트 규칙 문서를 활용해 AI가 일관된 기준으로 작업하고 검증하도록 만든 경험이 있다.
- AI가 생성한 코드를 그대로 수용하지 않고 의도와 동작을 검토해 실제 서비스 품질 기준에 맞게 다듬는 관점을 강조한다.

## 공개 포트폴리오 작성 기준

- 연락 정보는 이메일과 GitHub 중심으로 사용한다. 전화번호는 공개 페이지에 노출하지 않는다.
- "AI 개발자"보다 "AI-assisted frontend/service developer", "AI workflow verification", "AI harness engineering" 계열 표현이 이력서와 더 일치한다.
- Work 페이지는 단순 썸네일 갤러리보다 `문제`, `역할`, `검증`, `결과`, `기술 스택`을 빠르게 비교할 수 있는 구조가 적합하다.
- 최신 이력에서는 AI 도구 활용과 검증 루프가 강점이므로, Work 정렬은 최근 프로젝트와 AI/검증/서비스 흐름 증거를 우선한다.

## 경력 요약

총 경력: 약 6년 6개월.

### 프리랜서

기간: 2025.05 - 재직중.

#### MMIS

기간: 2026.02 - 2026.05.

핵심 역할:

- AI 주도 개발 환경 도입 및 MMIS 풀스택 아키텍처 구축 참여.
- Codex와 Claude Code를 활용해 멀티 모듈 모놀리포 구조를 분석하고, .NET 9 기반 Clean Architecture, CQRS/MediatR, SQL Server 2022 데이터 모델, React/Vite 프론트엔드 구조를 일관된 개발 체계로 정리.
- Account, Base, Material, Equipment, Vehicle Maintenance 등 복수 업무 도메인을 단일 API와 단일 DB 구조로 통합하는 아키텍처 설계 및 구현에 참여.
- Codex를 개발 하네스로 활용해 요구사항 분석, 코드 탐색, 구현, 검증, 리팩터링, 빌드/테스트 실행으로 이어지는 반복 개발 루프 구축.
- CLAUDE.md, AGENTS.md, 프로젝트 로컬 Skills 문서를 기반으로 AI 작업 규칙을 체계화.
- Figma 검증, QA 수정, 페이지 검수, Human QA Guide 생성 등 반복 업무 표준화.
- MMIS.xlsx, Figma MCP, schema-v2, 최종 요구사항 문서를 기준으로 기능 누락, 화면/프로그램/DB 스키마 불일치 탐지.
- React, Vite, TypeScript, SCSS Modules 기반 업무 화면 UI 구조와 컴포넌트 패턴 정리.
- Figma MCP로 디자인 토큰, 좌표, 간격, 색상, 폰트 기준을 확인해 화면 구현에 반영.
- TanStack Query와 Zustand 중심으로 화면별 데이터 흐름과 상태 관리 복잡도 완화.

기술 스택:

- Frontend: React, Vite, TypeScript, SCSS Modules, Zustand, TanStack Query.
- Backend: .NET 9, ASP.NET Core Web API, Clean Architecture, CQRS, MediatR.
- Database: SQL Server 2022, Entity Framework Core, SQL Migration.
- Architecture: Multi-module Monolith, REST API, JWT + 2FA.
- AI Engineering: Codex, Claude Code, Skills, Figma MCP, AI Verification, Harness Engineering.
- Collaboration: Git, GitHub, AI-assisted development workflow.

포트폴리오 활용 방향:

- "AI 코드 생성"보다 "AI 작업 규칙과 검증 루프를 설계하고 운영한 경험"으로 표현한다.
- 내부 프로젝트 세부사항은 과하게 공개하지 말고, 화면/API/DB/요구사항 간 정합성 검증 경험을 일반화한다.

#### RedClick

기간: 2025.10 - 2025.12.

핵심 역할:

- Claude Code 등을 활용한 AI 주도 개발 도입 및 풀스택 아키텍처 구축.
- Next.js 프론트엔드, Express 백엔드, Chrome Extension 데이터 수집까지 포함하는 플랫폼 초기 구조 설계 및 구축.
- AI 코드 검증과 핵심 비즈니스 로직 최적화.
- 어드민/캠페인 시스템 UI 고도화 및 상태 관리 최적화.
- 캠페인 생성 프로세스, 관리자 대시보드, 유저 매칭 UI 보일러플레이트 구축.
- 복잡한 전역 상태 관리와 실시간 데이터 동기화 병목 해결에 집중.

기술 스택:

- Frontend: Next.js App Router, TypeScript, Claude.
- Backend: Node.js, Express, REST API.
- Collaboration: Claude Code, Git, Figma.

포트폴리오 활용 방향:

- Chrome Extension, 관리자 대시보드, 캠페인 워크플로우, 상태 관리 최적화 경험을 강조할 수 있다.
- 구체 URL/스크린샷이 repo에 없으면 배포 사례처럼 단정하지 않는다.

#### Location

기간: 2025.05 - 2025.06.

핵심 역할:

- Claude Code를 활용해 프론트엔드(Next.js)와 백엔드(Express) 패키지를 분리하는 모노레포 구조 설계 및 구축.
- AI가 생성한 코드의 무분별한 수용을 피하고 TypeScript 기반 타입 하드닝과 컴포넌트 의존성 구조 검증 수행.
- Google Maps API 기반 mobile-first UI 설계.
- 거리 기반 marker clustering 적용으로 지도 렌더링 성능 최적화.
- Gemini 2.0 Flash, Google Places, Kakao Local 등 위치 API를 통합해 장소 추천 데이터를 실시간으로 제공하는 REST API 설계.
- GitHub Actions, Docker, Vercel 기반 배포 아키텍처 구성 경험.

기술 스택:

- Frontend: Next.js App Router, TypeScript, Google Maps API, styled-components.
- Backend: Node.js, Express, REST API, Gemini API.
- DevOps/Infra: Docker, Vercel, GitHub Actions.
- Collaboration: Claude Code, Git, Figma.

포트폴리오 활용 방향:

- AI 추천을 실제 장소 데이터와 결합하고 검증하는 대표 사례로 우선 노출한다.
- Work 설명에서는 `AI 추천 -> 실제 후보 데이터 -> 지도/상세 정보 -> 사용자 이동 흐름` 구조를 강조한다.

### 주식회사 아이콘스

기간: 2024.04 - 2025.05.
직무: 웹개발 대리.

#### AmazonCar

기간: 2025.01 - 2025.08.

핵심 역할:

- 대규모 서비스 구조를 고려한 컴포넌트 기반 프론트엔드 아키텍처 설계 및 화면 개발.
- REST API 연동을 통한 실시간 데이터 처리.
- React Query, Zustand 기반 글로벌 상태 관리 설계.
- Suspense, Lazy Loading 적용으로 초기 로딩 속도 개선 및 UX 향상.
- ESLint, Prettier 도입으로 코드 컨벤션 통일 및 협업 환경 개선.

기술 스택:

- Frontend: React, TypeScript, React Query, Zustand.
- Backend 연계: Node.js 기반 REST API.
- Collaboration: Git, Figma.

URL: `https://www.amazoncar.co.kr/`

포트폴리오 활용 방향:

- 실무 서비스 프론트엔드 대표 사례로 Work 상단에 배치하기 좋다.
- Figma, API 연동, 상태 관리, 성능/협업 품질은 이력서에 있는 범위에서 보강한다.

### 주식회사 호모루덴스

기간: 2023.07 - 2024.03.
직무: 웹개발 대리.

#### Yummy Game

기간: 2023.07 - 2024.03.
직무: Frontend Developer.

핵심 역할:

- 프론트엔드 아키텍처 설계 및 화면 개발.
- 게임 인터랙션 및 UI 로직 구현.
- 서버 API 연동 및 게임 데이터 처리.

기술 스택:

- Node.js, Next.js, React, React Query, Zustand.

포트폴리오 활용 방향:

- 사용자 액션 상태와 게임 진행 상태를 분리한 UI 로직 사례로 쓰기 좋다.
- Work에서 서비스 증거보다는 상태 모델링/게임 인터랙션 사례로 배치한다.

### 주식회사 모노버스

기간: 2021.05 - 2023.06.
직무: 웹개발 대리.

#### Zudice

기간: 2022.05 - 2023.06.
직무: Frontend Developer.

핵심 역할:

- 대규모 온라인 카지노 플랫폼 특성을 고려한 컴포넌트 기반 UI 아키텍처 설계.
- 재사용 가능한 UI 컴포넌트 설계로 유지보수 비용 절감 및 신규 게임 개발 속도 향상.
- 사용자 액션 기반 실시간 애니메이션 및 인터랙션 로직 구현.
- Canvas 및 CSS 애니메이션 최적화.
- Node.js/Next.js 기반 서버 REST API 연동 및 실시간 게임 데이터 처리.
- React Query 기반 데이터 fetching, 캐싱, 동기화.
- WebSocket 기반 게임 진행 상태 및 보상 결과 실시간 반영.
- Zustand 기반 게임 상태 및 유저 세션 관리.
- Next.js SSR 기반 초기 로딩 속도 개선 및 SEO 최적화.
- Lighthouse 성능 지표 개선 경험.
- Git Flow, ESLint, Prettier 기반 코드 품질 관리 및 CI/CD 자동화 구축.

기술 스택:

- Frontend: Next.js, React, TypeScript, React Query, Zustand.
- Backend 연계: Node.js, REST API, WebSocket.
- DevOps/Collaboration: Git, CI/CD, Figma, 성능 모니터링.

포트폴리오 활용 방향:

- 게임 UI/실시간 상태/WebSocket/성능 최적화 경험을 보강하는 과거 대표 사례로 활용한다.

#### Entropy Explorer

직무: Frontend Developer.

핵심 역할:

- MetaMask 지갑 연동 및 계정 인증 로직.
- Web3 Provider 이벤트 처리.
- Web3.js 기반 스마트 컨트랙트 연동 및 트랜잭션 처리.
- 블록, 트랜잭션, 이벤트 로그 데이터 조회 및 가공.
- 대용량 블록체인 데이터 테이블, 필터, 페이징, 검색.
- Node.js API 서버 연동을 통한 데이터 캐싱 및 조회 성능 개선.

기술 스택:

- Frontend: HTML, CSS, JavaScript, jQuery.
- Blockchain: Web3.js, MetaMask, Ethereum Smart Contract.
- Backend 연계: Node.js.
- Collaboration: Git, Figma.

#### Simplepad

기간: 2022.03 - 2022.05.
직무: Frontend Developer.

핵심 역할:

- MetaMask 지갑 연동 및 사용자 인증 처리.
- 스마트 컨트랙트 함수 호출 기능 개발.
- 프론트엔드 UI 개발 및 퍼블리싱.

기술 스택:

- HTML, CSS, JavaScript, jQuery, Web3.js.

#### Fruttidino

기간: 2022.01 - 2022.03.
직무: Full Stack Developer.

핵심 역할:

- Express 기반 백엔드 API 서버 설계 및 구현.
- 사용자 인증, 게임 데이터 처리.
- RESTful API 설계를 통한 프론트엔드 연동 구조 개선.
- Node.js 서버 성능 최적화 및 에러 핸들링.
- Web3.js 기반 토큰 발행/전송 로직 및 스마트 컨트랙트 연동.
- MetaMask 지갑 연동을 통한 사용자 인증 및 트랜잭션 서명 처리.
- 배포 자동화 및 로그 모니터링 적용.

기술 스택:

- Frontend: HTML, CSS, JavaScript, jQuery.
- Backend: Node.js, Express.
- Blockchain: Web3.js, MetaMask, Ethereum Smart Contract.
- 기타: Git, REST API.

### 주식회사 알투온

기간: 2020.04 - 2021.05.
직무: 웹개발 대리.

#### Trade Now

기간: 2021.01 - 2021.03.
직무: Mobile App Developer (Flutter).

핵심 역할:

- Flutter 기반 Android/iOS 크로스플랫폼 앱 UI 설계 및 화면 개발.
- 반응형 레이아웃 및 커스텀 위젯 구현.
- REST API 연동으로 계정, 자산, 거래 내역 데이터 처리.
- MediaQuery, Flexible 기반 모바일/태블릿 해상도 대응.
- API 스펙 정의와 데이터 처리 로직 개선 협업.

기술 스택:

- Flutter, Dart, REST API, Git, GetX, 성능 최적화.

#### CatchCatch

기간: 2020.03 - 2020.06.

핵심 역할:

- React 기반 SPA 개발.
- 사용자 이벤트 처리 및 화면 구현.
- 퍼포먼스 최적화 및 상태관리 구조 설계.
- Web 기반 게임 화면 UI 제작.

기술 스택:

- React.

### 언라이크

기간: 2019.06 - 2019.09.
직무: 웹개발.

프로젝트:

- 에너집 웹사이트: 초기 기획 참여, UI 구조 설계, React 프론트엔드 개발, 관리자 페이지 구현.
- 셀렉온 홈페이지: PC/모바일 적응형 웹 퍼블리싱, UI 마크업, 스크립트 구현.
- 화물선생 웹사이트: 사이트 구성 기획 및 설계, 관리자 페이지, 퍼블리싱.
- 멀티파워텍 관리자 페이지: UI 설계, 유지보수, 기능 개발, 퍼블리싱.

기술 스택:

- React, HTML, CSS, jQuery, JavaScript.

## 학력

- 동양미래대학교, 시각정보디자인, 2011.03 - 2016.02 졸업.
- 서울우신고등학교, 인문계, 2008.03 - 2011.02 졸업.

## 스킬 키워드

- TypeScript
- React
- Next.js
- JavaScript
- HTML
- CSS
- jQuery
- Node.js
- AJAX
- Flutter
- MySQL
- React Query / TanStack Query
- Zustand
- REST API
- WebSocket
- Web3.js
- MetaMask
- Gemini API
- Google Maps / Places API
- Codex
- Claude Code
- Skills
- Figma MCP
- AI Verification
- Harness Engineering

## 수상/자격

- SQL개발자(SQLD자격), 2022.04, 한국데이터베이스진흥센터.
- 제5회 교통데이터 활용 공모전, 2017.06, 한국교통연구원장상.
- 제6회 교통데이터 활용 공모전, 2018.06, 교통안전공단 이사장상.

## 링크

- GitHub: `https://github.com/sooho-shin?tab=repositories`

## Work 페이지 추천 우선순위

1. MMIS 또는 AI Harness Engineering 계열 사례가 공개 가능하면 최상단에 둔다. 단, 비공개 내부 정보는 일반화한다.
2. RedClick: Next.js/Express/Chrome Extension, 캠페인/어드민 시스템, AI 코드 검증, 상태 관리 최적화.
3. Location: AI 추천, 실제 위치 API, 지도 UI, 타입/아키텍처 검증.
4. AmazonCar: 실무 서비스 프론트엔드, 상태 관리, API 연동, 성능/협업 품질.
5. Yummy Game: 게임 UI 상태 모델링, 사용자 액션과 게임 루프 분리.
6. Zudice/Entropy Explorer/Fruttidino: 과거 게임/Web3/실시간 상태 경험 보강용.

## 톤 가이드

- 강점은 "프론트엔드 구현 + API/상태/검증 + AI-assisted workflow"로 묶는다.
- 문장 끝은 과장보다 검증 가능한 행위로 마무리한다.
- "참여", "구축", "정리", "검증", "최적화", "표준화" 같은 이력서 근거가 있는 동사를 사용한다.
- "세계 최고", "완전 자동", "단독 개발"처럼 근거 확인이 어려운 표현은 피한다.
