# Vercel Spine - Next.js Full-Stack Template

Enterprise-ready Next.js 14 template with GraphQL, Prisma, comprehensive testing, and AI-assisted development tools.

## 🚀 Features

- **Next.js 14** - App Router with TypeScript
- **GraphQL** - Apollo Server + Apollo Client with SSR
- **Database** - Prisma ORM + PostgreSQL
- **Testing** - Jest (95% coverage) + Playwright + Lighthouse CI
- **Code Generation** - Plop.js for consistent components
- **UI** - Tailwind CSS + shadcn/ui components
- **Auth** - NextAuth.js (ready to configure)
- **Monorepo** - pnpm workspaces + TurboRepo
- **AI Docs** - Comprehensive `.ai-context/` documentation

## 📋 Quick Start

### Prerequisites

- Node.js 18+
- pnpm 8+
- PostgreSQL database

### Installation

```bash
# Clone repository
git clone https://github.com/Maxwell-Software-Solutions/Vercel-spine.git
cd Vercel-spine

# Install dependencies
pnpm install

# Set up environment
cp .env.example .env
# Edit .env with your database credentials

# Generate Prisma client
pnpm prisma generate

# Run development server
pnpm dev
```

Visit `http://localhost:3000`

## 🧪 Testing

### Unified Test Command

```bash
# Run ALL tests (unit + E2E + performance)
pnpm test:all
```

This command runs sequentially:
1. **Jest** - Unit tests with 95% coverage requirement
2. **Playwright** - End-to-end tests with visual feedback
3. **Lighthouse CI** - Performance testing with 90+ score requirement

### Individual Test Suites

```bash
# Unit tests (Jest)
pnpm test:unit              # Run with coverage
pnpm test:unit:watch        # Watch mode
pnpm test:unit:coverage     # Detailed coverage report

# E2E tests (Playwright)
pnpm test:e2e              # Headless mode
pnpm test:e2e:headed       # See browser
pnpm test:e2e:ui           # Interactive UI mode

# Performance tests (Lighthouse)
pnpm test:perf             # Run Lighthouse CI
```

### Coverage Requirements

**Jest enforces 95% coverage on:**
- Statements
- Branches
- Functions
- Lines

Build **FAILS** if coverage drops below 95%.

### Performance Budgets

**Lighthouse CI requires 90+ scores for:**
- Performance
- Accessibility
- Best Practices
- SEO

**Core Web Vitals must meet:**
- First Contentful Paint (FCP) < 2s
- Largest Contentful Paint (LCP) < 2.5s
- Cumulative Layout Shift (CLS) < 0.1
- Total Blocking Time (TBT) < 300ms

## 🛠️ Code Generation with Plop

Generate consistent code with built-in templates:

```bash
# Interactive mode
pnpm generate

# Direct generators
pnpm generate:component     # React component + test
pnpm generate:resolver      # GraphQL resolver
pnpm generate:api           # API route + test
pnpm generate:e2e          # Playwright E2E test
```

All generated files include:
- Proper TypeScript types
- Comprehensive test coverage
- Best practice patterns
- AI-friendly documentation

## 📁 Project Structure

```text
vercel-spine/
├── .ai-context/          # AI-friendly documentation
├── app/                  # Next.js App Router
│   ├── api/             # API routes
│   │   └── graphql/     # GraphQL endpoint
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Home page
├── components/          # React components
├── lib/                 # Utilities
│   ├── db.ts           # Prisma client
│   ├── graphql/        # GraphQL schema & resolvers
│   └── apolloClient.ts # Apollo Client setup
├── prisma/             # Database schema
├── tests/              # Test files
│   └── e2e/           # Playwright E2E tests
├── plop-templates/     # Code generation templates
└── plopfile.js        # Plop configuration
```

## 🔧 Development Commands

```bash
pnpm dev            # Start development server
pnpm build          # Build for production
pnpm start          # Start production server
pnpm lint           # Run ESLint
pnpm format         # Format with Prettier
```

## 🗄️ Database Management

```bash
# Generate Prisma client
pnpm prisma generate

# Create migration
pnpm prisma migrate dev --name migration_name

# Apply migrations
pnpm prisma migrate deploy

# Open Prisma Studio
pnpm prisma studio

# Push schema without migration (dev only)
pnpm prisma db push
```

## 🚢 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import in Vercel
3. Add environment variables
4. Deploy

### Environment Variables

Required:
```env
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=...
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:3000/api/graphql
```

Optional:
```env
GITHUB_ID=...
GITHUB_SECRET=...
```

See `.env.example` for complete list.

## 📚 Documentation

Comprehensive docs in `.ai-context/`:

- `getting-started.md` - Setup and installation
- `project-structure.md` - File organization
- `testing-guide.md` - All testing information
- `plop-usage-guide.md` - Code generation guide
- `coverage-requirements.md` - Coverage details
- `performance-budgets.md` - Performance requirements
- `graphql-integration.md` - GraphQL usage
- `component-patterns.md` - Component best practices

## 🤖 AI Agent Instructions

This template is optimized for AI-assisted development:

1. **Use Plop generators** instead of manual file creation
2. **Maintain 95% coverage** on all new code
3. **Run test:all** before committing
4. **Read .ai-context/** docs for guidance
5. **Follow Playwright** for E2E test patterns
6. **Check Lighthouse** scores regularly

## 🧩 Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 |
| Database | PostgreSQL + Prisma |
| API | GraphQL (Apollo) |
| Testing | Jest + Playwright + Lighthouse |
| UI | Tailwind CSS + shadcn/ui |
| Auth | NextAuth.js |
| Tooling | pnpm + TurboRepo + Plop |

## 📦 Package Scripts

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "format": "prettier --write .",
  "test:all": "pnpm test:unit && pnpm test:e2e && pnpm test:perf",
  "test:unit": "jest --coverage --ci",
  "test:e2e": "playwright test",
  "test:perf": "lhci autorun",
  "generate": "plop"
}
```

## 🎯 Quality Gates

All CI checks must pass:

✅ **ESLint** - No linting errors  
✅ **TypeScript** - Type checking  
✅ **Jest** - 95%+ coverage  
✅ **Playwright** - All E2E tests pass  
✅ **Lighthouse** - 90+ scores  
✅ **Build** - Successful production build  

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Run `pnpm test:all` to ensure quality
4. Commit changes (`git commit -m 'Add amazing feature'`)
5. Push to branch (`git push origin feature/amazing-feature`)
6. Open Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) file

## 🔗 Links

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Apollo GraphQL](https://www.apollographql.com/docs/)
- [Playwright Documentation](https://playwright.dev/)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)

## 💡 Tips

- Use `pnpm generate:component` for all new components
- Run `pnpm test:unit:watch` during development
- Check coverage reports in `coverage/` directory
- Review Playwright traces for failed E2E tests
- Monitor Lighthouse scores in CI artifacts

## 🆘 Troubleshooting

### Database Connection Issues

```bash
# Check PostgreSQL is running
# Verify DATABASE_URL in .env
pnpm prisma studio  # Test connection
```

### Test Failures

```bash
# Clear test cache
pnpm jest --clearCache

# Run tests with verbose output
pnpm test:unit --verbose

# Debug Playwright tests
pnpm test:e2e:ui
```

### Build Issues

```bash
# Clean build artifacts
rm -rf .next node_modules
pnpm install
pnpm build
```

---

**Built with ❤️ by Maxwell Software Solutions**
