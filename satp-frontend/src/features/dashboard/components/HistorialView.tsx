import { useMemo, useState } from 'react'
import { CheckCircle2, XCircle } from 'lucide-react'
import { formatDuration } from '@/lib/utils'
import { getHistorial } from '../data/mockHistorial'

export default function HistorialView({ aulaId }: { aulaId: string }) {
  const [filtro, setFiltro] = useState<'todas' | 'certificadas' | 'no-certificadas'>('todas')
  const [fecha, setFecha] = useState<string | 'todas'>('todas')

  const sesiones = useMemo(() => getHistorial(aulaId), [aulaId])
  const fechas = useMemo(
    () => Array.from(new Set(sesiones.map((s) => s.fecha))).sort().reverse(),
    [sesiones],
  )

  const filtered = sesiones.filter((s) => {
    if (filtro === 'certificadas' && !s.certificada) return false
    if (filtro === 'no-certificadas' && s.certificada) return false
    if (fecha !== 'todas' && s.fecha !== fecha) return false
    return true
  })

  return (
    <div className="space-y-4">
      {/* Controles */}
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={filtro}
          onChange={(e) => setFiltro(e.target.value as typeof filtro)}
          className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none focus:border-emerald-500/50"
        >
          <option value="todas">Todas las sesiones</option>
          <option value="certificadas">Solo certificadas</option>
          <option value="no-certificadas">Solo no certificadas</option>
        </select>

        <select
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none focus:border-emerald-500/50"
        >
          <option value="todas">Todas las fechas</option>
          {fechas.map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>

        <span className="ml-auto text-xs text-[var(--text-muted)]">
          {filtered.length} {filtered.length === 1 ? 'sesión' : 'sesiones'}
        </span>
      </div>

      {/* Tabla */}
      <div className="overflow-hidden rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border-color)] bg-[var(--bg-elevated)] text-left">
              <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Fecha</th>
              <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Estudiante</th>
              <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Laptop</th>
              <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Duración</th>
              <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">%</th>
              <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Estado</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr
                key={s.id}
                className="border-b border-[var(--border-color)] last:border-0 hover:bg-[var(--bg-elevated)]"
              >
                <td className="px-4 py-3 font-mono text-xs text-[var(--text-muted)]">{s.fecha}</td>
                <td className="px-4 py-3">
                  <p className="font-medium text-[var(--text-primary)]">{s.nombre}</p>
                  <p className="text-xs text-[var(--text-muted)]">{s.upn}</p>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-[var(--text-primary)]">{s.estacion}</td>
                <td className="px-4 py-3 font-mono text-xs text-[var(--text-primary)]">
                  {formatDuration(s.duracionSeg)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-16 overflow-hidden rounded-full bg-[var(--bg-elevated)]">
                      <div
                        className={
                          'h-full rounded-full ' +
                          (s.certificada ? 'bg-emerald-500' : 'bg-red-500')
                        }
                        style={{ width: `${s.porcentaje}%` }}
                      />
                    </div>
                    <span className="font-mono text-xs text-[var(--text-muted)]">
                      {s.porcentaje}%
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  {s.certificada ? (
                    <span className="inline-flex items-center gap-1 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="h-3 w-3" />
                      Certificada
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-md border border-red-500/30 bg-red-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-red-600 dark:text-red-400">
                      <XCircle className="h-3 w-3" />
                      No certificada
                    </span>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-sm text-[var(--text-muted)]">
                  No hay sesiones que coincidan con los filtros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
