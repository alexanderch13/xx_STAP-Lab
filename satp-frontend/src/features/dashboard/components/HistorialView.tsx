import { useState } from 'react'
import { CheckCircle2, Download, XCircle } from 'lucide-react'
import { useDemoStore } from '@/stores/demoStore'
import { UMBRAL_DEMO } from '@/domain/academico'
import { formatDuration } from '@/lib/utils'
export default function HistorialView({ grupoId }: { grupoId: string }) {
  const historial = useDemoStore((s) => s.historial)
  const [filtro, setFiltro] = useState('todas')
  const [fecha, setFecha] = useState('todas')
  const sesiones = historial.filter((s) => s.grupoId === grupoId)
  const fechas = [...new Set(sesiones.map((s) => s.fecha))].sort().reverse()
  const filtered = sesiones
    .filter(
      (s) =>
        (fecha === 'todas' || s.fecha === fecha) &&
        (filtro === 'todas' ||
          (filtro === 'certificadas' ? s.certificada : !s.certificada)),
    )
    .sort((a, b) => b.fecha.localeCompare(a.fecha))
  function descargar() {
    const cell = (value: string | number) =>
      `"${String(value).replaceAll('"', '""')}"`
    const lines = [
      [
        'Fecha',
        'Estudiante',
        'Código',
        'Equipos',
        'Tiempo certificable',
        'Porcentaje',
        'Resultado demo',
      ],
      ...filtered.map((s) => [
        s.fecha,
        s.nombre,
        s.codigo,
        s.equipos,
        formatDuration(s.duracionSeg),
        s.porcentaje,
        s.certificada ? 'Cumple' : 'No cumple',
      ]),
    ]
    const url = URL.createObjectURL(
      new Blob(
        ['\ufeff' + lines.map((row) => row.map(cell).join(';')).join('\r\n')],
        { type: 'text/csv;charset=utf-8;' },
      ),
    )
    const link = document.createElement('a')
    link.href = url
    link.download = `historial-${grupoId}.csv`
    link.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
  return (
    <div className="space-y-4">
      <p className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-sm leading-relaxed text-[var(--text-muted)]">
        Criterio provisional de demostración: {UMBRAL_DEMO}% del bloque
        programado. Solo LAB y BYOD acumulan tiempo certificable; el móvil
        registra presencia.
      </p>
      <div className="flex flex-wrap gap-3">
        <select
          aria-label="Filtrar historial por resultado"
          className="field sm:w-auto"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        >
          <option value="todas">Todos los resultados</option>
          <option value="certificadas">Certificadas (demo)</option>
          <option value="no-certificadas">No certificadas (demo)</option>
        </select>
        <select
          aria-label="Filtrar historial por fecha"
          className="field sm:w-auto"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
        >
          <option value="todas">Todas las fechas</option>
          {fechas.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
        <button
          className="btn-secondary sm:ml-auto"
          disabled={!filtered.length}
          onClick={descargar}
        >
          <Download className="h-4 w-4" />
          Exportar CSV
        </button>
      </div>
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Estudiante</th>
              <th>Equipos</th>
              <th>Tiempo certificable</th>
              <th>% del bloque</th>
              <th>Resultado demo</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id}>
                <td className="whitespace-nowrap font-mono text-xs">
                  {s.fecha}
                </td>
                <td>
                  <p className="font-medium">{s.nombre}</p>
                  <p className="mt-1 text-xs text-[var(--text-muted)]">
                    {s.codigo}
                  </p>
                </td>
                <td className="text-xs text-[var(--text-muted)]">
                  {s.equipos}
                </td>
                <td className="font-mono">{formatDuration(s.duracionSeg)}</td>
                <td>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-16 overflow-hidden rounded-full bg-[var(--bg-elevated)]">
                      <div
                        className={`h-full ${s.certificada ? 'bg-emerald-500' : 'bg-red-400'}`}
                        style={{ width: `${s.porcentaje}%` }}
                      />
                    </div>
                    <span className="text-xs">{s.porcentaje}%</span>
                  </div>
                </td>
                <td>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium ${s.certificada ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300' : 'bg-red-500/10 text-red-600 dark:text-red-300'}`}
                  >
                    {s.certificada ? (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    ) : (
                      <XCircle className="h-3.5 w-3.5" />
                    )}
                    {s.certificada ? 'Certificada' : 'No certificada'}
                  </span>
                </td>
              </tr>
            ))}
            {!filtered.length && (
              <tr>
                <td
                  colSpan={6}
                  className="py-12 text-center text-[var(--text-muted)]"
                >
                  No hay registros que coincidan con los filtros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-[var(--text-muted)]">
        {filtered.length} registros del grupo
      </p>
    </div>
  )
}
