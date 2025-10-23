export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">Vercel Spine</h1>
        <p className="text-center text-lg mb-4">
          Next.js Full-Stack Template with GraphQL, Prisma, and Comprehensive Testing
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">🚀 Features</h2>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>Next.js 14 App Router</li>
              <li>TypeScript</li>
              <li>Tailwind CSS</li>
              <li>GraphQL with Apollo</li>
            </ul>
          </div>
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">✅ Testing</h2>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>Jest (95% coverage)</li>
              <li>Playwright E2E</li>
              <li>Lighthouse CI</li>
              <li>Unified test command</li>
            </ul>
          </div>
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">🛠️ Tools</h2>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>Prisma ORM</li>
              <li>NextAuth.js</li>
              <li>Plop.js generators</li>
              <li>TurboRepo</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
