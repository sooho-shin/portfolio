# Portfolio

## Requirements

- Node.js `20.12.2` 이상, `23` 미만
- Yarn `1.22.22`

## Environment

배포 환경에서는 canonical URL, sitemap, robots, Open Graph URL 생성을 위해 `NEXT_PUBLIC_SITE_URL`을 실제 사이트 주소로 설정한다.

Vercel에서는 `VERCEL_URL`이 있으면 보조 fallback으로 사용한다. GitHub Actions에서는 repository variable `NEXT_PUBLIC_SITE_URL`을 설정한다. 로컬 개발에서만 `http://localhost:3000`을 fallback으로 사용한다.

```bash
NEXT_PUBLIC_SITE_URL=https://your-production-domain.example
```

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
