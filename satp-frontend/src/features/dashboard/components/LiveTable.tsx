import type { FilaEstudiante } from '@/domain/academico'
import { formatDuration } from '@/lib/utils'
import DeviceBadge from './DeviceBadge'
import StatusDot from '@/features/shared/StatusDot'
export default function LiveTable({
  rows,
  onConectar,
  onDesconectar,
}: {
  rows: FilaEstudiante[]
  onConectar: (id: string) => void
  onDesconectar: (id: string) => void
}) {
  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>Estado</th>
            <th>Estudiante</th>
            <th>Dispositivos conectados</th>
            <th>Tiempo certificable</th>
            <th>Acciones demo</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td>
                <div className="flex items-center gap-2">
                  <StatusDot active={r.activo} />
                  <span className="text-xs text-[var(--text-muted)]">
                    {r.activo ? 'Conectado' : 'Sin conexión'}
                  </span>
                </div>
              </td>
              <td>
                <p className="font-medium">{r.nombre}</p>
                <p className="mt-1 text-xs text-[var(--text-muted)]">{r.upn}</p>
                <p className="mt-1 font-mono text-xs text-[var(--text-muted)]">
                  {r.codigo}
                </p>
              </td>
              <td>
                {r.conexiones.length ? (
                  <div className="flex flex-col items-start gap-2">
                    {r.conexiones.map((c) => (
                      <div key={c.id} className="flex items-center gap-2">
                        <DeviceBadge tipo={c.tipo} />
                        <span className="text-xs text-[var(--text-muted)]">
                          {c.equipo}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-[var(--text-muted)]">—</span>
                )}
              </td>
              <td>
                <p className="font-mono text-base font-medium tabular-nums">
                  {formatDuration(r.segundosCertificables)}
                </p>
                {r.presenciaMovil &&
                  !r.conexiones.some((c) => c.tipo !== 'MOVIL') && (
                    <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
                      Móvil: solo presencia
                    </p>
                  )}
              </td>
              <td>
                <div className="flex flex-col items-start gap-2">
                  <button
                    onClick={() => onConectar(r.id)}
                    className="text-xs font-semibold text-emerald-600 hover:underline dark:text-emerald-400"
                    aria-label={`Conectar dispositivo de ${r.nombre}`}
                  >
                    Conectar equipo
                  </button>
                  {r.activo && (
                    <button
                      onClick={() => onDesconectar(r.id)}
                      className="text-xs text-[var(--text-muted)] hover:text-red-500"
                      aria-label={`Desconectar dispositivos de ${r.nombre}`}
                    >
                      Desconectar
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td
                colSpan={5}
                className="py-12 text-center text-[var(--text-muted)]"
              >
                No hay estudiantes que coincidan con la búsqueda.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
