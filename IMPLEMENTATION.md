# Next.js Full-Stack Template — Implementation Plan

This document outlines the full implementation plan for the Next.js full-stack template monorepo. It mirrors the project todo list and provides concrete commands, file paths, configuration snippets, and verification steps.

## Goals

- Monorepo layout with pnpm + TurboRepo
- Next.js 13+ App Router with TypeScript
- GraphQL API layer with Apollo Server + Prisma
- **Plop.js code generation** for consistent component/API/test creation
- **Unified test command** running Jest + Playwright + Lighthouse CI
- **Strict test coverage requirements** (95%+ enforced by Jest)
- **Lighthouse CI performance tracking** for Core Web Vitals monitoring
- Playwright E2E with visual artifacts for AI-assisted review
- NextAuth authentication with Prisma adapter
- Tailwind CSS and shadcn/ui for UI components
- Jest + React Testing Library for unit tests with coverage reporting
- CI: GitHub Actions with caching, test artifacts, and performance reports
- AI documentation in `.ai-context/` for Copilot/Bolt agents

---

## Workspace layout

Recommended layout (monorepo-ready):

- apps/web/            -> Next.js application (or app/ at repo root)
- packages/ui/         -> shared UI components (optional)
- packages/db/         -> shared database utilities (optional)
- .ai-context/         -> AI-friendly docs
- prisma/              -> Prisma schema (or apps/web/prisma)

For this template, we place the Next.js app at the repo root `app/` to keep things simple but remain monorepo-compatible.

---

## 1) Initialize project (pnpm + Turborepo)

Commands (run locally):

```powershell
pnpm create next-app@latest -- --typescript --use-pnpm --app
# If asked about Tailwind, you can choose "Yes" to preconfigure
```

If you started with npm, remove `package-lock.json` and run `pnpm install`.

Create `pnpm-workspace.yaml` at repo root:

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

Root `package.json` (add/adjust scripts):

```json
{
  "private": true,
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "test": "turbo run test",
    "test:all": "pnpm test:unit && pnpm test:e2e && pnpm test:perf",
    "test:unit": "jest --coverage --ci",
    "test:e2e": "playwright test",
    "test:perf": "lhci autorun"
  }
}
```

**Key Script Explanation:**
- `test:all` — Unified command that runs all tests sequentially (unit → E2E → performance)
- `test:unit` — Jest with coverage reporting and CI mode
- `test:e2e` — Playwright end-to-end tests
- `test:perf` — Lighthouse CI performance audits

Create `turbo.json`:

```json
{
  "$schema": "https://turborepo.com/schema.json",
  "pipeline": {
    "build": { "dependsOn": ["^build"], "outputs": [".next/**", "!.next/cache/**"] },
    "lint": {},
    "test": { "dependsOn": ["^build"] },
    "dev": { "cache": false }
  }
}
```

Verification:
- `pnpm install` should produce `pnpm-lock.yaml`
- `pnpm dev` should start Next dev server

---

## 2) Testing: Jest + React Testing Library with Coverage Requirements

Install dev dependencies:

```powershell
pnpm add -D jest @types/jest ts-jest jest-environment-jsdom @testing-library/react @testing-library/dom @testing-library/jest-dom
```

Create `jest.config.ts` with **strict coverage thresholds**:

```ts
import nextJest from 'next/jest';
import type { Config } from 'jest';

const createJestConfig = nextJest({ dir: './' });

const config: Config = {
  testEnvironment: 'jsdom',
  coverageProvider: 'v8',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    'components/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
    '!**/coverage/**',
    '!**/tests/**',
  ],
  coverageThreshold: {
    global: {
      statements: 95,
      branches: 95,
      functions: 95,
      lines: 95,
    },
  },
};

export default createJestConfig(config);
```

Create `jest.setup.ts`:

```ts
import '@testing-library/jest-dom';
```

Package.json scripts:

```json
{
  "test:unit": "jest --coverage --ci",
  "test:unit:watch": "jest --watch",
  "test:unit:coverage": "jest --coverage --coverageReporters=html lcov text"
}
```

**Coverage Requirements:**
- 95% minimum coverage for statements, branches, functions, and lines
- Jest will **fail** if coverage falls below thresholds
- Coverage reports generated in `coverage/` directory
- CI uploads coverage to GitHub Actions artifacts

Notes:

- For API route tests that need Node environment, use `/** @jest-environment node */` at top of test file.

---

## 3) Lint & Format (ESLint + Prettier)

Install:

```powershell
pnpm add -D eslint eslint-config-next prettier eslint-config-prettier
```

Create `.eslintrc.json`:

```json
{
  "extends": ["next/core-web-vitals", "prettier"],
  "rules": {}
}
```

Create `.prettierrc.json`:

```json
{
  "semi": true,
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

Scripts:

```json
{"lint":"eslint . --ext .js,.jsx,.ts,.tsx --fix","format":"prettier --write ."}
```

---

## 4) UI: Tailwind + shadcn/ui

If Tailwind wasn't generated earlier, install and initialize:

```powershell
pnpm add -D tailwindcss postcss autoprefixer
pnpm dlx tailwindcss init -p
```

Edit `tailwind.config.js` content paths to include `./app/**/*.{js,ts,jsx,tsx}` and `./components/**/*.{js,ts,jsx,tsx}` and enable `@tailwindcss/forms` plugin if desired.

Initialize shadcn UI:

```powershell
pnpm dlx shadcn@latest init
# Follow prompts: select Next.js, confirm Tailwind is configured
pnpm dlx shadcn@latest add button
```

This creates `components/ui/` and helper `lib/utils/cn.ts`.

---

## 5) Plop.js: Component Generation Templates

Install Plop for consistent code generation:

```powershell
pnpm add -D plop
```

Create `plopfile.js` at repo root:

```js
export default function (plop) {
  // React Component (Client or Server)
  plop.setGenerator('component', {
    description: 'Create a new React component',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Component name (PascalCase):',
      },
      {
        type: 'list',
        name: 'type',
        message: 'Component type:',
        choices: ['client', 'server'],
        default: 'server',
      },
      {
        type: 'confirm',
        name: 'withTest',
        message: 'Include test file?',
        default: true,
      },
    ],
    actions: (data) => {
      const actions = [
        {
          type: 'add',
          path: 'components/{{pascalCase name}}.tsx',
          templateFile: 'plop-templates/component.hbs',
        },
      ];
      
      if (data.withTest) {
        actions.push({
          type: 'add',
          path: 'components/{{pascalCase name}}.test.tsx',
          templateFile: 'plop-templates/component.test.hbs',
        });
      }
      
      return actions;
    },
  });

  // GraphQL Resolver
  plop.setGenerator('resolver', {
    description: 'Create a new GraphQL resolver',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Resolver name (camelCase):',
      },
      {
        type: 'list',
        name: 'type',
        message: 'Resolver type:',
        choices: ['Query', 'Mutation'],
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'lib/graphql/resolvers/{{camelCase name}}.ts',
        templateFile: 'plop-templates/resolver.hbs',
      },
    ],
  });

  // API Route
  plop.setGenerator('api-route', {
    description: 'Create a new API route',
    prompts: [
      {
        type: 'input',
        name: 'path',
        message: 'API route path (e.g., users/profile):',
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'app/api/{{path}}/route.ts',
        templateFile: 'plop-templates/api-route.hbs',
      },
      {
        type: 'add',
        path: 'app/api/{{path}}/route.test.ts',
        templateFile: 'plop-templates/api-route.test.hbs',
      },
    ],
  });

  // Playwright E2E Test
  plop.setGenerator('e2e-test', {
    description: 'Create a new Playwright E2E test',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Test name (kebab-case):',
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'tests/e2e/{{kebabCase name}}.spec.ts',
        templateFile: 'plop-templates/e2e-test.hbs',
      },
    ],
  });
}
```

Create `plop-templates/` directory with Handlebars templates:

**`plop-templates/component.hbs`:**
```handlebars
{{#if (eq type 'client')}}'use client';

{{/if}}import React from 'react';

interface {{pascalCase name}}Props {
  // Add your props here
}

export function {{pascalCase name}}({}: {{pascalCase name}}Props) {
  return (
    <div className="{{kebabCase name}}">
      <h2>{{pascalCase name}}</h2>
      {/* Component content */}
    </div>
  );
}
```

**`plop-templates/component.test.hbs`:**
```handlebars
import { render, screen } from '@testing-library/react';
import { {{pascalCase name}} } from './{{pascalCase name}}';

describe('{{pascalCase name}}', () => {
  it('renders without crashing', () => {
    render(<{{pascalCase name}} />);
    expect(screen.getByText('{{pascalCase name}}')).toBeInTheDocument();
  });

  // Add more tests to meet 95% coverage requirement
});
```

**`plop-templates/resolver.hbs`:**
```handlebars
import { prisma } from '@/lib/db';

export const {{camelCase name}}Resolver = {
  {{type}}: {
    {{camelCase name}}: async (_parent: any, args: any, context: any) => {
      // Implement resolver logic
      // Example: return await prisma.model.findMany();
      throw new Error('Not implemented');
    },
  },
};
```

**`plop-templates/api-route.hbs`:**
```handlebars
/**
 * @jest-environment node
 */
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Implement GET logic
    return NextResponse.json({ message: 'Success' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Implement POST logic
    return NextResponse.json({ message: 'Created' }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

**`plop-templates/api-route.test.hbs`:**
```handlebars
/**
 * @jest-environment node
 */
import { GET, POST } from './route';
import { NextRequest } from 'next/server';

describe('API Route: {{path}}', () => {
  it('GET returns success', async () => {
    const request = new NextRequest('http://localhost:3000/api/{{path}}');
    const response = await GET(request);
    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data).toHaveProperty('message');
  });

  it('POST creates resource', async () => {
    const request = new NextRequest('http://localhost:3000/api/{{path}}', {
      method: 'POST',
      body: JSON.stringify({ test: 'data' }),
    });
    const response = await POST(request);
    expect(response.status).toBe(201);
  });
});
```

**`plop-templates/e2e-test.hbs`:**
```handlebars
import { test, expect } from '@playwright/test';

test.describe('{{pascalCase name}}', () => {
  test('should load page successfully', async ({ page }) => {
    await page.goto('/{{kebabCase name}}');
    
    // Take screenshot for visual feedback
    await page.screenshot({ path: 'tests/e2e/screenshots/{{kebabCase name}}.png' });
    
    // Add assertions
    await expect(page).toHaveTitle(/{{pascalCase name}}/);
  });

  test('should meet performance budgets', async ({ page }) => {
    await page.goto('/{{kebabCase name}}');
    
    // Lighthouse will validate Core Web Vitals in CI
    // This test ensures page loads without errors
    await expect(page.locator('body')).toBeVisible();
  });
});
```

Add Plop scripts to `package.json`:

```json
{
  "plop": "plop",
  "generate": "plop",
  "generate:component": "plop component",
  "generate:resolver": "plop resolver",
  "generate:api": "plop api-route",
  "generate:e2e": "plop e2e-test"
}
```

**Usage Examples:**

```powershell
# Interactive mode
pnpm plop

# Direct component generation
pnpm generate:component

# Generate API route
pnpm generate:api

# Generate E2E test
pnpm generate:e2e
```

**Benefits for Copilot AI:**

- Consistent file structure across the codebase
- Auto-generated test files ensure coverage targets are met
- Pre-configured templates enforce best practices
- Reduces boilerplate and copy-paste errors
- AI agents can use `pnpm generate:component` instead of manually creating files

---

## 6) Database: Prisma + PostgreSQL (with GraphQL layer)

Install Prisma and client:

```powershell
pnpm add -D prisma
pnpm add @prisma/client
pnpm prisma init --datasource-provider postgresql
```

In `.env.example` add:

```
DATABASE_URL=postgresql://<user>:<password>@<host>/<db>?schema=public
```

Example `prisma/schema.prisma` models:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id    String @id @default(cuid())
  email String @unique
  name  String?
}

model Message {
  id        String   @id @default(cuid())
  text      String
  authorId  String?
  author    User?    @relation(fields: [authorId], references: [id])
  createdAt DateTime @default(now())
}
```

Create `lib/db.ts`:

```ts
import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== 'production') global.prisma = prisma;
```

Run `pnpm prisma generate` and `pnpm prisma db push` (or `migrate`) as needed.

---

## 6) GraphQL: Apollo Server + Apollo Client

Install:

```powershell
pnpm add @apollo/client graphql
pnpm add -D @apollo/server graphql
```

Create GraphQL schema and resolvers under `lib/graphql/`:

- `lib/graphql/typeDefs.ts` — GraphQL SDL for `Message`, `User`, queries, mutations
- `lib/graphql/resolvers.ts` — resolver functions using `prisma` from `lib/db`

Example `app/api/graphql/route.ts` (Next.js App Router route handler):

```ts
import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { typeDefs } from '@/lib/graphql/typeDefs';
import { resolvers } from '@/lib/graphql/resolvers';

const server = new ApolloServer({ typeDefs, resolvers });
export default startServerAndCreateNextHandler(server);
```

Frontend: create `lib/apolloClient.ts` and wrap client in a `Providers` client component using `ApolloProvider`.

Queries & Mutations: Create `graphql/queries.ts` for `GET_MESSAGES` and `CREATE_MESSAGE`.

---

## 7) Authentication: NextAuth.js with Prisma Adapter

Install:

```powershell
pnpm add next-auth @next-auth/prisma-adapter
```

Create `lib/auth.ts` with `authOptions` using `PrismaAdapter(prisma)` and providers like GitHub.

Create route handler `app/api/auth/[...nextauth]/route.ts`:

```ts
import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

Middleware `middleware.ts` (optional) to protect routes using `next-auth/middleware`.

Add `SessionProvider` client wrapper and include it in `app/layout.tsx` via a client `Providers` component.

---

## 8) Playwright: E2E + Visual Feedback

Install Playwright and initialize:

```powershell
pnpm add -D @playwright/test
pnpm dlx playwright@latest install --with-deps
```

Run `pnpm dlx playwright init` if you want interactive scaffolding. Create `playwright.config.ts` with:

- testDir: `tests/e2e`
- use: `{ headless: true, screenshot: 'only-on-failure', video: 'retain-on-failure' }`
- projects for chromium/webkit/firefox if desired

Example test `tests/e2e/message-board.spec.ts` to:
1. Start dev server (or use `baseURL` pointing to preview URL)
2. Navigate to `/messages`
3. Fill form and submit
4. Assert message appears
5. Capture screenshot/video on failure (automated)

CI: upload Playwright artifacts (screenshots/videos/traces) to GitHub Actions job for review. This provides visual feedback to Copilot AI.

Scripts in `package.json`:

```json
{
  "test:e2e": "playwright test",
  "test:e2e:headed": "playwright test --headed",
  "test:e2e:ui": "playwright test --ui"
}
```

---

## 9) Lighthouse CI: Performance Tracking

Install Lighthouse CI:

```powershell
pnpm add -D @lhci/cli
```

Create `lighthouserc.json` at repo root:

```json
{
  "ci": {
    "collect": {
      "startServerCommand": "pnpm build && pnpm start",
      "startServerReadyPattern": "Ready",
      "url": ["http://localhost:3000", "http://localhost:3000/messages"],
      "numberOfRuns": 3
    },
    "assert": {
      "preset": "lighthouse:recommended",
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 0.9 }],
        "categories:best-practices": ["error", { "minScore": 0.9 }],
        "categories:seo": ["error", { "minScore": 0.9 }],
        "first-contentful-paint": ["error", { "maxNumericValue": 2000 }],
        "largest-contentful-paint": ["error", { "maxNumericValue": 2500 }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.1 }],
        "total-blocking-time": ["error", { "maxNumericValue": 300 }]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
```

**Performance Budgets:**
- Performance score: 90+
- Accessibility score: 90+
- Best practices: 90+
- SEO: 90+
- First Contentful Paint: < 2s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1
- Total Blocking Time: < 300ms

Package.json scripts:

```json
{
  "test:perf": "lhci autorun",
  "test:perf:local": "lhci autorun --collect.url=http://localhost:3000"
}
```

**CI Integration:**
- Lighthouse runs in GitHub Actions after build
- Performance reports uploaded as artifacts
- Copilot AI can track metrics across commits
- Fails CI if performance budgets are not met

---

## 11) AI Documentation (.ai-context)

Create `.ai-context/` files:

- `getting-started.md` — install, run, env vars
- `project-structure.md` — describe app/, lib/, prisma/, .ai-context
- `testing-guide.md` — unified test command, Jest + Playwright + Lighthouse instructions
- `coverage-requirements.md` — 95% coverage thresholds, how to maintain coverage
- `performance-budgets.md` — Lighthouse CI budgets, Core Web Vitals targets
- `component-patterns.md` — server vs client components, using shadcn
- `graphql-integration.md` — schema, resolvers, where to update
- `visual-testing-guide.md` — how Playwright artifacts help AI
- **`plop-usage-guide.md`** — how to use Plop generators, available templates, AI agent instructions

Keep these short and focused; AI agents should read these to understand the repo quickly.

---

## 12) Example Full-stack Feature (Message Board) using GraphQL

Prisma model: `Message` (see earlier schema)

GraphQL typeDefs (example):

```graphql
type Message {
  id: ID!
  text: String!
  createdAt: String!
  author: User
}

type Query {
  messages: [Message!]!
}

type Mutation {
  createMessage(text: String!, authorId: ID): Message!
}
```

Resolvers will use `prisma.message.findMany()` and `prisma.message.create()`.

Frontend:

- `app/messages/page.tsx` (Server Component) uses Apollo Client SSR or fetches via server-side call to GraphQL endpoint
- `components/NewMessageForm.tsx` (client) uses `useMutation` to call `CREATE_MESSAGE`
- **Use Plop to generate components**: `pnpm generate:component` for consistent structure

Tests:

- Unit test `NewMessageForm.test.tsx` mocking `fetch` or Apollo client (must meet 95% coverage)
- Playwright E2E that posts a message and verifies UI and screenshot (use `pnpm generate:e2e`)
- Lighthouse CI run to ensure page meets performance budgets (90+ scores)

---

## 13) CI/CD: GitHub Actions

Create `.github/workflows/ci.yml` with steps:

- Checkout, setup Node + pnpm
- Install dependencies `pnpm install`
- Lint `pnpm lint`
- **Run unified tests** `pnpm test:all` (Jest + Playwright + Lighthouse)
- Upload coverage reports (Jest HTML + LCOV)
- Upload Playwright artifacts (screenshots, videos, traces)
- Upload Lighthouse reports (HTML + JSON)
- Build `pnpm build`

Add Turbo remote caching env vars if you use Vercel remote cache (TURBO_TOKEN).

**Playwright CI notes:**

- Use `playwright install-deps` on Linux runners
- Upload `playwright-report`, screenshots, videos using `actions/upload-artifact`

**Lighthouse CI notes:**

- Run Lighthouse after successful build
- Upload performance reports as artifacts
- Track Core Web Vitals trends over time
- Fail CI if performance budgets not met

---

## 14) Dev Tooling: Husky, VSCode

Install Husky and add pre-commit hook to run unified tests:

```powershell
pnpm add -D husky
pnpm dlx husky-init && pnpm install
# Edit .husky/pre-commit to run
# pnpm lint && pnpm test:all
```

**Note:** For faster pre-commit, you can run just `pnpm lint && pnpm test:unit` and let CI run the full suite.

Add `.vscode/launch.json` with configurations for Next.js dev and Jest tests (see earlier notes).

---

## 15) Final cleanup and README

- Remove placeholder Next.js pages
- Ensure `tsconfig.json` has `strict: true`
- Update `.gitignore` to exclude `.env`, `.turbo`, `.next`, `node_modules`, `coverage/`, `.lhci/`
- Create comprehensive `README.md` with:
  - Quick start guide
  - Testing section explaining `test:all` command
  - Coverage requirements (95%+)
  - Performance budgets (Lighthouse CI)
  - **Plop.js code generation section**
  - GraphQL and Playwright sections
  - Link to `.ai-context` docs
- Add `LICENSE` (MIT suggested)

---

## Quick Commands Reference

```powershell
pnpm install
pnpm dev
pnpm build
pnpm lint
pnpm format
pnpm test:all        # Run ALL tests (unit + E2E + performance)
pnpm test:unit       # Jest with coverage
pnpm test:e2e        # Playwright E2E
pnpm test:perf       # Lighthouse CI
pnpm generate        # Interactive Plop generator
pnpm generate:component  # Generate React component
pnpm generate:api    # Generate API route
```

---

## File map (high-value files to create/edit)

- `pnpm-workspace.yaml`
- `turbo.json`
- `package.json` (root) scripts with unified test commands and Plop generators
- `plopfile.js` (Plop configuration)
- `plop-templates/*.hbs` (Handlebars templates for code generation)
- `jest.config.ts` (with coverage thresholds), `jest.setup.ts`
- `playwright.config.ts` (with visual settings)
- `lighthouserc.json` (with performance budgets)
- `.eslintrc.json`, `.prettierrc.json`
- `tailwind.config.js`, `postcss.config.js`
- `prisma/schema.prisma`, `lib/db.ts`
- `lib/graphql/typeDefs.ts`, `lib/graphql/resolvers.ts`
- `app/api/graphql/route.ts`
- `lib/apolloClient.ts`, `components/Providers.tsx`
- `app/messages/page.tsx`, `components/NewMessageForm.tsx`
- `tests/e2e/message-board.spec.ts` (Playwright)
- `.ai-context/*.md` (9 files including coverage-requirements.md, performance-budgets.md, and plop-usage-guide.md)
- `.github/workflows/ci.yml`

---

## Verification & Quality Gates

Before finalizing, run the following checks locally:

1. `pnpm install` (PASS: lockfile created)
2. `pnpm lint` (PASS/FAIL)
3. `pnpm test:unit` (PASS with 95%+ coverage)
4. `pnpm build` (PASS/FAIL)
5. `pnpm test:e2e` (Playwright) (PASS/FAIL)
6. `pnpm test:perf` (Lighthouse CI) (PASS with 90+ scores)
7. `pnpm test:all` (Full unified test suite) (PASS/FAIL)

If any step fails, fix configs and run again. Aim to have all PASS before marking the template ready.

**Coverage Gate:** Jest must report ≥95% coverage or build fails.

**Performance Gate:** Lighthouse must report ≥90 scores or build fails.

---

## Next Actions (what I'll do if you ask me to proceed)

1. Implement project scaffolding files and package.json scripts with unified test command
2. Add Prisma schema + `lib/db.ts`
3. Set up Plop.js with generators and templates for components, API routes, resolvers, and tests
4. Add GraphQL typeDefs/resolvers and `app/api/graphql/route.ts`
5. Configure Jest with 95% coverage thresholds
6. Configure Playwright with visual feedback settings
7. Configure Lighthouse CI with performance budgets
8. Add Apollo Client provider and example message page/components (using Plop generators)
9. Write comprehensive tests meeting coverage requirements
10. Add `.ai-context` docs (including coverage-requirements.md, performance-budgets.md, and plop-usage-guide.md)
11. Configure CI/CD with unified test pipeline and artifact uploads

If you want me to start now, I'll begin with task 1 and work through implementation systematically.
