import { useMemo, useState } from 'react'
import { Search, ShieldCheck, ShieldAlert } from 'lucide-react'
import { getEstaciones } from '../data/mockEstaciones'
import StatusDot from '@/features/shared/StatusDot'

function hace(seg: number) {
  if (seg < 5) return 'ahora'
  if (seg < 60) return `hace ${seg}s`
  const m = Math.floor(seg / 60)
  return `hace ${m} min`
}

export default function GestionView({ aulaId, activos }: { aulaId: string; activos: number }) {
  const [query, setQuery] = useState('')
  const estaciones = useMemo(() => getEstaciones(aulaId, activos), [aulaId, activos])

  const filtered = estaciones.filter((e) => {
    const q = query.trim().toLowerCase()
    if (!q) return true
    return (
      e.id.toLowerCase().includes(q) ||
      e.hostname.toLowerCase().includes(q) ||
      e.mac.toLowerCase().includes(q) ||
      e.ip.includes(q)
    )
  })

  const online = estaciones.filter((e) => e.estado === 'online').length

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-1 items-center gap-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] px-3 py-2 text-sm focus-within:border-emerald-500/50">
          <Search className="h-4 w-4 text-[var(--text-muted)]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por código, hostname, MAC o IP…"
            className="w-full bg-transparent outline-none placeholder:text-[var(--text-muted)]"
          />
        </div>
        <span className="text-xs text-[var(--text-muted)]">
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">{online}</span>
          {' / '}
          {estaciones.length} estaciones en línea
        </span>
      </div>

      <div className="overflow-hidden rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border-color)] bg-[var(--bg-elevated)] text-left">
              <th className="w-10 px-4 py-3"></th>
              <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Código</th>
              <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Hostname</th>
              <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">MAC</th>
              <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">IP</th>
              <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">TPM 2.0</th>
              <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Último ping</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((e) => (
              <tr
                key={e.id}
                className="border-b border-[var(--border-color)] last:border-0 hover:bg-[var(--bg-elevated)]"
              >
                <td className="px-4 py-3"><StatusDot active={e.estado === 'online'} /></td>
                <td className="px-4 py-3 font-mono text-xs font-medium text-[var(--text-primary)]">{e.id}</td>
                <td className="px-4 py-3 font-mono text-xs text-[var(--text-muted)]">{e.hostname}</td>
                <td className="px-4 py-3 font-mono text-xs text-[var(--text-muted)]">{e.mac}</td>
                <td className="px-4 py-3 font-mono text-xs text-[var(--text-primary)]">{e.ip}</td>
                <td className="px-4 py-3">
                  {e.tpm ? (
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                      <ShieldCheck className="h-3.5 w-3.5" /> Sí
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
                      <ShieldAlert className="h-3.5 w-3.5" /> No
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-right font-mono text-xs text-[var(--text-muted)]">
                  {hace(e.ultimoHeartbeat)}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-sm text-[var(--text-muted)]">
                  Sin resultados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
