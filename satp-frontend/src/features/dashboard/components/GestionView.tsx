import { useState } from 'react'
import { Search, ShieldAlert, ShieldCheck } from 'lucide-react'
import { GRUPOS, LABORATORIOS, getLaboratorio } from '@/mocks/academico'
import { useDemoStore } from '@/stores/demoStore'
import StatusDot from '@/features/shared/StatusDot'
export default function GestionView({ aulaId }: { aulaId: string }) {
  const conexiones = useDemoStore((s) => s.conexiones)
  const [query, setQuery] = useState('')
  const laboratorio = getLaboratorio(aulaId)
  const identificadorMac = (LABORATORIOS.findIndex((l) => l.id === aulaId) + 1)
    .toString(16)
    .padStart(2, '0')
    .toUpperCase()
  const ocupados = new Set(
    conexiones
      .filter(
        (c) =>
          c.fin === null &&
          c.tipo === 'LAB' &&
          GRUPOS.find((g) => g.id === c.grupoId)?.laboratorioId === aulaId,
      )
      .map((c) => c.equipo),
  )
  const estaciones = Array.from({ length: laboratorio.capacidad }, (_, i) => {
    const id = `LAB-${String(i + 1).padStart(3, '0')}`
    return {
      id,
      hostname: `${aulaId}-${id}`,
      mac: `02:10:20:00:${identificadorMac}:${(i + 1).toString(16).padStart(2, '0').toUpperCase()}`,
      ip: `10.10.${aulaId === 'L-207' ? 20 : aulaId === 'L-204' ? 21 : 30}.${i + 11}`,
      tpm: i % 5 !== 0,
      online: ocupados.has(id),
    }
  })
  const visibles = estaciones.filter((e) =>
    `${e.id} ${e.hostname} ${e.mac} ${e.ip}`
      .toLowerCase()
      .includes(query.toLowerCase().trim()),
  )
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] px-4 py-3">
          <Search className="h-4 w-4 text-[var(--text-muted)]" />
          <input
            className="min-w-0 flex-1 bg-transparent text-sm outline-none"
            aria-label="Buscar equipo"
            placeholder="Buscar código, hostname, MAC o IP…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <p className="text-sm text-[var(--text-muted)]">
          <strong className="text-emerald-600 dark:text-emerald-400">
            {ocupados.size}
          </strong>{' '}
          / {estaciones.length} estaciones conectadas
        </p>
      </div>
      <p className="text-sm text-[var(--text-muted)]">
        Inventario simulado de {laboratorio.nombre}. Incluye los grupos que usan
        este espacio; BYOD y móviles se muestran en la lista de estudiantes.
      </p>
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Estado</th>
              <th>Código</th>
              <th>Hostname</th>
              <th>MAC</th>
              <th>IP</th>
              <th>TPM 2.0</th>
            </tr>
          </thead>
          <tbody>
            {visibles.map((e) => (
              <tr key={e.id}>
                <td>
                  <div className="flex items-center gap-2">
                    <StatusDot active={e.online} />
                    <span className="text-xs text-[var(--text-muted)]">
                      {e.online ? 'Conectado' : 'Sin conexión'}
                    </span>
                  </div>
                </td>
                <td className="font-mono">{e.id}</td>
                <td className="font-mono text-xs">{e.hostname}</td>
                <td className="font-mono text-xs text-[var(--text-muted)]">
                  {e.mac}
                </td>
                <td className="font-mono text-xs">{e.ip}</td>
                <td>
                  {e.tpm ? (
                    <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                      <ShieldCheck className="h-4 w-4" />
                      Sí
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                      <ShieldAlert className="h-4 w-4" />
                      No
                    </span>
                  )}
                </td>
              </tr>
            ))}
            {!visibles.length && (
              <tr>
                <td
                  colSpan={6}
                  className="py-12 text-center text-[var(--text-muted)]"
                >
                  No hay equipos que coincidan con la búsqueda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
