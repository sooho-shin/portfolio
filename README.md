# Portfolio

## Requirements

- Node.js `20.12.2` 이상, `23` 미만
- Yarn `1.22.22`

## Environment

canonical URL, sitemap, robots, Open Graph URL은 `config/seo.ts`의 대표 URL을 기준으로 생성한다.

- 대표 URL: `https://portfolio-beta-navy-98.vercel.app`
- Search Console 준비 문서: `docs/search-console-seo-checklist.md`

## Commands

의존성 설치:

```bash
yarn install --frozen-lockfile
```

개발 서버:

```bash
yarn dev
```

검증:

```bash
yarn typecheck
yarn lint
yarn build
```

프로덕션 실행:

```bash
yarn start
```

## Reference

- https://blumenkopf.spatzek.studio/home
