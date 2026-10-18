import type { FilaEstudiante, Sesion } from '@/domain/academico'
import { formatDuration } from '@/lib/utils'
export default function TimelineView({
  rows,
  sesion,
  ahora,
}: {
  rows: FilaEstudiante[]
  sesion: Sesion
  ahora: number
}) {
  if (sesion.inicio === null)
    return (
      <div className="panel p-10 text-center text-[var(--text-muted)]">
        Inicia una sesión para registrar intervalos en el timeline.
      </div>
    )
  const inicio = sesion.inicio
  const ancho = Math.max(
    sesion.duracionSeg * 1000,
    (sesion.fin ?? ahora) - inicio,
  )
  return (
    <div className="panel overflow-x-auto p-5 sm:p-6">
      <div className="min-w-[650px]">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-semibold">Intervalos de conexión certificable</h2>
          <p className="text-xs text-[var(--text-muted)]">
            LAB / BYOD · Las interrupciones se conservan
          </p>
        </div>
        <div className="mb-4 ml-[190px] mr-24 flex justify-between font-mono text-xs text-[var(--text-muted)]">
          {[0, 1, 2, 3, 4].map((i) => (
            <span key={i}>{Math.round(((ancho / 1000 / 60) * i) / 4)} min</span>
          ))}
        </div>
        <div className="space-y-4">
          {rows.map((r) => (
            <div
              key={r.id}
              className="grid grid-cols-[175px_1fr_80px] items-center gap-4"
            >
              <div>
                <p className="truncate text-sm font-medium" title={r.nombre}>
                  {r.nombre}
                </p>
                <p className="mt-1 text-xs text-[var(--text-muted)]">
                  {r.activo ? 'Conectado' : 'Sin conexión'}
                </p>
              </div>
              <div className="relative h-8 overflow-hidden rounded-lg bg-[var(--bg-elevated)]">
                {[25, 50, 75].map((p) => (
                  <div
                    key={p}
                    className="absolute inset-y-0 border-l border-[var(--border-color)]"
                    style={{ left: `${p}%` }}
                  />
                ))}
                {r.intervalos.map((i, n) => (
                  <div
                    key={`${i.inicio}-${n}`}
                    title={`${formatDuration((i.fin - i.inicio) / 1000)} certificables`}
                    className="absolute inset-y-1 rounded bg-emerald-500"
                    style={{
                      left: `${((i.inicio - inicio) / ancho) * 100}%`,
                      width: `${Math.max(0.25, ((i.fin - i.inicio) / ancho) * 100)}%`,
                    }}
                  />
                ))}
                {!r.intervalos.length && (
                  <span className="absolute inset-0 flex items-center justify-center text-xs text-[var(--text-muted)]">
                    {r.presenciaMovil
                      ? 'Móvil: solo presencia'
                      : 'Sin tiempo registrado'}
                  </span>
                )}
              </div>
              <span className="text-right font-mono text-xs">
                {formatDuration(r.segundosCertificables)}
              </span>
            </div>
          ))}
        </div>
        {rows.length === 0 && (
          <p className="py-10 text-center text-[var(--text-muted)]">
            Este grupo no tiene estudiantes matriculados.
          </p>
        )}
      </div>
    </div>
  )
}
