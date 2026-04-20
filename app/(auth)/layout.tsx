// =============================================================================
// app/(auth)/layout.tsx — Auth Layout (centered card, no sidebar)
// =============================================================================

import Link from 'next/link'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="px-6 py-4 border-b border-border">
        <Link href="/" className="flex items-center gap-2 w-fit">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">A</span>
          </div>
          <span className="font-semibold text-lg text-foreground">AffKit</span>
        </Link>
      </header>

      {/* Main: centered content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 text-center text-sm text-muted-foreground border-t border-border">
        © 2026 AffKit. Made with ❤️ in Vietnam.
      </footer>
    </div>
  )
}
