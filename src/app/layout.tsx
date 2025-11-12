// src/app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from 'next-themes'

export const metadata: Metadata = {
  title: 'LP CSS Hub',
  description: 'Buscador de inyecciones CSS por componente y template',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="max-w-6xl mx-auto px-4 py-8">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  )
}
