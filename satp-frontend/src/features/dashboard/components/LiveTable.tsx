import StatusDot from '@/features/shared/StatusDot'
import DeviceBadge from './DeviceBadge'
import { formatDuration } from '@/lib/utils'
import type { Estudiante } from '../data/mock'

export default function LiveTable({ rows }: { rows: Estudiante[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)]">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--border-color)] bg-[var(--bg-elevated)] text-left">
            <th className="w-10 px-4 py-3"></th>
            <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Estudiante</th>
            <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Código</th>
            <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Laptop</th>
            <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Tipo</th>
            <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Tiempo</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr
              key={r.upn}
              className={
                'border-b border-[var(--border-color)] last:border-0 transition ' +
                (r.activo
                  ? 'bg-emerald-500/[0.04] hover:bg-emerald-500/[0.08]'
                  : 'opacity-60 hover:bg-[var(--bg-elevated)]')
              }
            >
              <td className="px-4 py-3"><StatusDot active={r.activo} /></td>
              <td className="px-4 py-3">
                <p className="font-medium text-[var(--text-primary)]">{r.nombre}</p>
                <p className="text-xs text-[var(--text-muted)]">{r.upn}</p>
              </td>
              <td className="px-4 py-3 font-mono text-xs text-[var(--text-muted)]">{r.codigo}</td>
              <td className="px-4 py-3 font-mono text-xs text-[var(--text-primary)]">
                {r.estacion ?? '—'}
              </td>
              <td className="px-4 py-3"><DeviceBadge tipo={r.tipo} /></td>
              <td className="px-4 py-3 text-right font-mono text-xs text-[var(--text-primary)]">
                {r.activo ? formatDuration(r.segundosConectado) : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
