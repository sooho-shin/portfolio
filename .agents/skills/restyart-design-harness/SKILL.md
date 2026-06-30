---
name: restyart-design-harness
description: portfolio.restyart.com 레퍼런스와 같은 다크 이력서형 포트폴리오 디자인을 구현하거나 검증할 때 사용하는 프로젝트 로컬 스킬. Restyart, dark resume portfolio, sticky sidebar, interaction harness, visual QA 키워드에 반응한다.
---

# Restyart Design Harness

## 목적

이 스킬은 현재 포트폴리오를 `https://portfolio.restyart.com/` 레퍼런스와 같은 다크 이력서형 싱글 페이지로 재구성할 때 사용한다. 콘텐츠는 신수호 이력서와 기존 프로젝트 데이터를 기준으로 유지하고, 시각 구조와 인터랙션 패턴만 레퍼런스에 맞춘다.

## 먼저 읽을 문서

- 상세 디자인/인터랙션 관찰값은 `references/restyart-portfolio-audit.md`를 읽는다.
- 이력서 기반 콘텐츠를 배치하거나 문구를 바꿀 때는 `../resume-context/references/resume.md`와 `../resume-context/SKILL.md`도 함께 읽는다.

## 구현 원칙

- 홈을 중심으로 `About`, `Strengths`, `Experience`, `Projects`, `Skills`, `Project Gallery`, `Contact` 섹션을 한 페이지에 배치한다.
- `Project Gallery`는 AI 실험 모음이 아니라, 현재 프로젝트 중 실제 화면 이미지가 준비된 사례만 모아 보여주는 preview grid로 사용한다.
- 데스크톱은 왼쪽 sticky 프로필 사이드바와 오른쪽 콘텐츠 컬럼 구조를 유지한다.
- 모바일은 상단 sticky 헤더와 햄버거 드롭다운 메뉴 구조를 유지한다.
- 개인 정보는 그대로 복제하지 않는다. 전화번호/주소 대신 이 프로젝트의 공개 가능한 이메일, GitHub, 포트폴리오 링크 중심으로 구성한다.
- 레퍼런스의 타인 콘텐츠, 이름, 링크, 문구는 복사하지 않는다. 레이아웃, 시각 밀도, 인터랙션 규칙만 적용한다.
- 과장된 성과나 이력서에 없는 수치를 새로 만들지 않는다.

## 검증 절차

1. 데스크톱 `1440x900`에서 첫 화면을 확인한다.
   - 왼쪽 프로필 사이드바가 viewport 높이에 sticky로 고정되어야 한다.
   - 오른쪽 콘텐츠 컬럼은 약 560px 전후의 좁은 이력서형 폭을 유지해야 한다.
   - `ABOUT` active nav는 긴 선과 밝은 텍스트로 표시되어야 한다.
2. 데스크톱에서 nav 클릭을 확인한다.
   - `PROJECTS`, `GALLERY` 또는 대응 섹션 클릭 시 섹션 상단이 약 96px offset 위치로 이동해야 한다.
   - 스크롤 위치에 따라 active nav 선이 `32px`에서 `64px` 수준으로 길어져야 한다.
3. 모바일 `390x844`에서 메뉴를 확인한다.
   - 상단 sticky 헤더에 이름과 햄버거 버튼이 있어야 한다.
   - 메뉴 열기/닫기 버튼은 `aria-label`을 가져야 한다.
   - 메뉴 항목 클릭 시 해당 섹션으로 이동하고 메뉴는 닫혀야 한다.
4. 카드와 링크 상태를 확인한다.
   - 카드 hover/focus에서 border 또는 title color 변화가 있어야 한다.
   - 외부 링크는 `target="_blank"`와 `rel="noopener noreferrer"`를 함께 사용한다.
   - CTA는 장식 버튼으로 두지 말고 `contact` 섹션 이동 또는 `mailto:`로 명확히 연결한다.
5. 실행 검증은 프로젝트의 실제 명령을 사용한다.
   - `yarn typecheck`
   - `yarn lint`
   - `yarn build`

## 구현 완료 기준

- 데스크톱/모바일 스크린샷이 레퍼런스의 레이아웃 밀도, 다크 톤, 카드 구조, nav 인터랙션과 일치한다.
- 공개 페이지에 이력서 원본 PDF, 전화번호, 비공개 출처 메모가 노출되지 않는다.
- 기존 SEO metadata, sitemap, robots 흐름을 깨지 않는다.
