## Requirements

- `bun@1.4.0`
- Docker (for the local stack and production image)
- A Postgres database for API and database package work (the Docker stack provides one by default)

## Getting Started

Install dependencies:

```bash
bun install
```

To get started with local development, copy the `.env.example` to `.env.development`:

```bash
cp .env.example .env.development
```

Replace the values. You can see the rules these values need to adhere to in `apps/api/src/env.ts`.

## Auth

The API uses [better-auth](https://www.better-auth.com/) with the email OTP plugin and the Drizzle adapter. Auth is mounted at `/api/auth`.

The API expects the following environment variables:

- `BETTER_AUTH_URL` should point at the API's own origin, better-auth uses it to build callback URLs and validate requests.
- `BETTER_AUTH_SECRET` is used to sign sessions; set a strong random value outside local dev. The minimum for this project is 32 characters.

### Email delivery

OTP codes are dispatched through the `EmailSender` abstraction in `apps/api/src/email/`. The default implementation is a `ConsoleEmailSender` that prints the message (including the OTP) to stdout. Swap it for a real provider before running in production.

### Regenerating the auth schema

When better-auth plugins change, regenerate the Drizzle schema under `packages/db/src/schema/auth.ts`:

```bash
bun run --filter=api auth:generate
```

After regenerating, run `bun run db:generate` to produce a new migration.

## Common Commands

Run the full workspace in dev mode:

```bash
bun run dev
```

Run type checks across the workspace:

```bash
bun run check-types
```

Run Biome formatting and linting:

```bash
bun run format-and-lint
```

Auto-fix Biome issues:

```bash
bun run format-and-lint:fix
```

## Database Commands

All database commands are exposed from the repo root and target `packages/db`.

You must provide `DATABASE_URL` when running them, for example:

```bash
DATABASE_URL=postgres://postgres:12345@localhost:5432/example bun run db:push
```

As an alternative, you can create a .env file at the root.

Common commands:

```bash
bun run db:generate     # generate migration files
bun run db:migrate      # migrate using migration files
bun run db:push         # push changes to db without migration files
bun run db:studio       # used to open drizzle studio
```

## Docker

The API ships as a multi-stage Bun image. A Compose stack under `infra/docker/` runs the API together with Postgres for local, production-shaped runs.

### Compose stack (API + Postgres)

Copy the example env file and adjust as needed:

```bash
cp infra/docker/.env.example infra/docker/.env
```

Available knobs (see `infra/docker/.env.example`):

- `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` - database credentials
- `POSTGRES_PORT` - host-side port for Postgres (container always listens on 5432)
- `API_PORT` - host-side port for the API (container always listens on 3000)

Bring the stack up (root-level helpers wrap the Compose commands):

```bash
bun run docker:up          # start the stack
bun run docker:up:build    # start, rebuilding images
bun run docker:down        # stop (preserves the db-data volume)
```

The `api` service waits for the `db` healthcheck before starting and connects over the internal Docker network using `DATABASE_URL=postgres://<user>:<pass>@db:5432/<db>`.

### Building and running the API image directly

Root-level helpers are available for working with just the API image:

```bash
bun run docker:build:api   # build example-app-api:local
bun run docker:run:api     # run it, loading apps/api/.env
bun run docker:shell:api   # open a shell in the image
```

`docker:run:api` expects a valid `.env.development` file to exist and to contain a reachable `DATABASE_URL`.

## Conventions

This is for myself to remember, conventions are not the law and yours will differ from mine.

### Intended module layout

Domain modules in the `packages/core/` package follow this split:

```bash
core/src/module-name/
  types.ts       # no logic - shapes/contracts
  errors.ts      # no logic - domain vocabulary
  rules.ts       # business logic (pure)
  repo.ts        # database logic (access)
  service.ts     # business logic (orchestration)
  index.ts       # no logic - public exports
```

This is the target layout for new domain modules.

Keep schemas related to each module in the db package under `src/schema`.

### Path aliases

Inside `apps/api/src`, import from the package root with `@/…` (e.g. `@/auth`, `@/env`, `@/db`). Test-only helpers under `apps/api/tests` use `#tests/…` (e.g. `#tests/helpers/build-test-app`). Prefer aliases over long relative paths for anything outside the current directory.

### Environment variables

All env access goes through `apps/api/src/env.ts`, which parses `process.env` with a Zod schema and exits on invalid input. Import the default export (`import env from "@/env"`) instead of reading `process.env` directly in app code.

### Database package (`@repo/db`)

- Tables live in `packages/db/src/schema/<module>.ts` (one file per domain module).
- Relations are composed in a single `packages/db/src/relations.ts` via `defineRelations`. The exception to this rule are the relations generated by better-auth.
- Consumers import schemas through subpath exports, e.g. `@repo/db/schema` or `@repo/db/schema/auth`. When adding a new schema file, expose it in `packages/db/package.json` under `exports`, if you think it will be of benefit exposing it along `@repo/db/schema`.

### Hono app factory

`apps/api/src/lib/create-app.ts` exports `createApp()` (the base Hono app with shared middleware and error handlers wired up) and `createRouter()` for building route groups. `apps/api/src/app.ts` exports `buildApp()` to mount route groups onto that base app. New routers should use `createRouter()` so they inherit the shared `AppEnv` context (`user`, `session`, `logger`).

### Error and response shape

Use `http-status-codes` (`ReasonPhrases` / `StatusCodes`) for status codes and reason phrases in handlers to match the existing `notFound` and `onError` responses, don't hand-roll numeric literals or strings.

### Logging

Use the request-scoped pino logger from context (`c.var.logger`) instead of `console.log`. It's already tagged with `requestId` so logs stay correlated across a request.

### Commits

Follow Conventional Commits with a scope when applicable, e.g. `feat(api): …`, `chore(db): …`, `fix(web): …`, `style(api): …`, `refactor(api): …`, `docs: …`, `build: …`, `style(api): …`, `ci: …`, `perf(web): …`, `test: …`

### Branches

Follow Conventional Branches e.g. `feature/ …`, `bugfix/ …`, `hotfix/ …`, `release/ …`, `chore/ …`.

### Pull Requests

Refer to the existing template under `.github/pull_request_template.md`.

### Tests

Use `bun test` to run the suite.

- Co-locate tests next to the code as `*.test.ts` (for example `apps/api/src/routes/health.route.test.ts`).
- Put shared test helpers under `apps/api/tests/helpers` and import them through `#tests/*`.
- For API behavior tests, build the app through `buildTestApp()` rather than importing the production entrypoint.
