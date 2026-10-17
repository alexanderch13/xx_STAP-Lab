import { useMemo } from 'react'
import { formatDuration } from '@/lib/utils'
import type { Estudiante } from '../data/mock'

const DURACION_BLOQUE = 7200 // 2 h en segundos

export default function TimelineView({ rows }: { rows: Estudiante[] }) {
  const activos = useMemo(() => rows.filter((r) => r.activo), [rows])

  if (activos.length === 0) {
    return (
      <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-10 text-center">
        <p className="text-sm text-[var(--text-muted)]">
          Aún no hay actividad registrada para graficar el timeline.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-5">
      <div className="mb-4 flex items-center justify-between text-[10px] font-medium uppercase tracking-wider text-[var(--text-muted)]">
        <span>Inicio</span>
        <span>30 min</span>
        <span>1 h</span>
        <span>1 h 30</span>
        <span>Fin (2 h)</span>
      </div>

      <div className="space-y-3">
        {activos.map((r) => {
          const pct = Math.min(100, (r.segundosConectado / DURACION_BLOQUE) * 100)
          return (
            <div key={r.upn} className="grid grid-cols-[180px_1fr_80px] items-center gap-3">
              <div className="truncate">
                <p className="truncate text-sm font-medium text-[var(--text-primary)]">
                  {r.nombre}
                </p>
                <p className="truncate text-[10px] text-[var(--text-muted)]">
                  {r.estacion}
                </p>
              </div>

              <div className="relative h-6 overflow-hidden rounded-md bg-[var(--bg-elevated)]">
                <div className="absolute inset-0 grid grid-cols-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="border-r border-[var(--border-color)]" />
                  ))}
                </div>
                <div
                  className="relative h-full rounded-md bg-gradient-to-r from-emerald-500 to-emerald-400 shadow-[0_0_12px_-2px_rgba(16,185,129,0.6)] transition-[width] duration-700"
                  style={{ width: `${pct}%` }}
                />
              </div>

              <p className="text-right font-mono text-xs text-[var(--text-primary)]">
                {formatDuration(r.segundosConectado)}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
