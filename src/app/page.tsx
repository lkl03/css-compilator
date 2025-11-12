// app/page.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { useTheme } from 'next-themes'
import { SearchBar } from '../components/SearchBar'
import TemplateSelect from '../components/TemplateSelect'
import { ResultCard } from '../components/ResultCard'
import Spinner from '../components/Spinner'
import type { Injection } from '../lib/types'
import { useDebouncedValue } from '../lib/useDebouncedValue'

export default function HomePage() {
  const { theme, setTheme } = useTheme()

  const [query, setQuery] = useState('')
  const [template, setTemplate] = useState<string>('GLOBAL')
  const [results, setResults] = useState<Injection[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')

  const debounced = useDebouncedValue(query, 180)
  const controllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    const run = async () => {
      setLoading(true)
      setError('')
      controllerRef.current?.abort()
      controllerRef.current = new AbortController()

      try {
        const params = new URLSearchParams()
        if (debounced) params.set('q', debounced)
        if (template) params.set('template', template)
        params.set('elementOnly', '1')
        params.set('limit', '27')

        const res = await fetch(`/api/injections?${params.toString()}`, {
          signal: controllerRef.current.signal,
          cache: 'no-store',
        })
        if (!res.ok) throw new Error('HTTP error')

        const data = (await res.json()) as { items: Injection[]; total: number }
        setResults(Array.isArray(data.items) ? data.items : [])
        setTotal(typeof data.total === 'number' ? data.total : 0)
      } catch (err: any) {
        if (err?.name !== 'AbortError') setError('Could not search. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    run()
  }, [debounced, template])

  const hasQuery = query.trim().length > 0
  const templateLabel = template === 'GLOBAL' ? 'Global CSS' : template

  return (
    <>
      <main className="space-y-6">
        <header>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-center">LP CSS Hub</h1>
        </header>

        <section className="glass p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <SearchBar
                placeholder="Search component, element, tag…"
                value={query}
                onChange={setQuery}
              />
            </div>
            <TemplateSelect value={template} onChange={setTemplate} />
          </div>
          <p className="mt-2 text-sm muted-text text-center sm:text-left">
            Tip: type the component or element name (e.g., “card”, “header”, “CTA”). You can filter by template.
          </p>
        </section>

        <section className="text-center text-sm text-slate-600 dark:text-slate-300">
          {loading ? (
            <div className="flex justify-center"><Spinner label="Searching…" /></div>
          ) : (
            `Showing ${results.length} of ${total} result${total === 1 ? '' : 's'}${hasQuery ? ` for “${query}”` : ''} in ${templateLabel}`
          )}
        </section>

        <section className="panel p-3">
          {!loading && results.length === 0 && hasQuery && (
            <div className="p-3 text-sm text-center">No results for “{query}”.</div>
          )}

          <div className="h-[72vh] overflow-y-auto pr-1 thin-scrollbar">
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 auto-rows-max">
              {results.map((item) => (<ResultCard key={item.id} item={item} />))}
            </div>
          </div>
        </section>

        <footer className="pt-6 pb-10 text-center text-sm muted-text">
          Inquiries, suggestions? Reach me on{' '}
          <a
            href="/slack"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-4 text-ink hover:opacity-90"
          >
            Slack
          </a>
          ! -<span className='italic'> Luca</span> 
        </footer>
      </main>

      <div className="fixed inset-0 pointer-events-none z-50">
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="icon-btn pointer-events-auto fixed bottom-6 right-6 h-14 w-14 text-2xl flex items-center justify-center"
          aria-label={theme === 'dark' ? 'Switch to light' : 'Switch to dark'}
          title={theme === 'dark' ? 'Switch to light' : 'Switch to dark'}
        >
          {theme === 'dark' ? '🌙' : '🌞'}
        </button>
      </div>
    </>
  )
}



