import { useSearchParams } from 'react-router-dom'
import { cn } from '@/lib/utils'
const TABS = [
  { id: 'vivo', label: 'En vivo' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'historial', label: 'Historial' },
  { id: 'gestion', label: 'Equipos' },
] as const
export type TabId = (typeof TABS)[number]['id']
export default function Tabs() {
  const [params, setParams] = useSearchParams()
  const current = ['vivo', 'timeline', 'historial', 'gestion'].includes(
    params.get('tab') ?? '',
  )
    ? params.get('tab')
    : 'vivo'
  return (
    <nav
      aria-label="Vistas del grupo"
      className="flex gap-1 overflow-x-auto border-b border-[var(--border-color)]"
    >
      {TABS.map((t) => (
        <button
          key={t.id}
          aria-current={current === t.id ? 'page' : undefined}
          onClick={() =>
            setParams((prev) => {
              const next = new URLSearchParams(prev)
              if (t.id === 'vivo') next.delete('tab')
              else next.set('tab', t.id)
              return next
            })
          }
          className={cn(
            'whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition',
            current === t.id
              ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]',
          )}
        >
          {t.label}
        </button>
      ))}
    </nav>
  )
}
