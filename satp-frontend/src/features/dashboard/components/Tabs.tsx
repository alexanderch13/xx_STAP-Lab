import { useSearchParams } from 'react-router-dom'
import { cn } from '@/lib/utils'

const TABS = [
  { id: 'vivo',      label: 'En vivo' },
  { id: 'timeline',  label: 'Timeline' },
  { id: 'historial', label: 'Historial' },
  { id: 'gestion',   label: 'Gestión' },
] as const

export type TabId = typeof TABS[number]['id']

export default function Tabs() {
  const [params, setParams] = useSearchParams()
  const current = (params.get('tab') ?? 'vivo') as TabId

  return (
    <div className="flex gap-1 border-b border-[var(--border-color)]">
      {TABS.map((t) => {
        const active = t.id === current
        return (
          <button
            key={t.id}
            onClick={() =>
              setParams(t.id === 'vivo' ? {} : { tab: t.id }, { replace: true })
            }
            className={cn(
              'relative -mb-px px-4 py-2.5 text-sm font-medium transition',
              active
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]',
            )}
          >
            {t.label}
            {active && (
              <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-emerald-500" />
            )}
          </button>
        )
      })}
    </div>
  )
}
