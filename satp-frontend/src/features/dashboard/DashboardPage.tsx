import { useState, useMemo, useEffect } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import { Search, AlertTriangle } from 'lucide-react'
import KpiBar from './components/KpiBar'
import LiveTable from './components/LiveTable'
import Tabs, { type TabId } from './components/Tabs'
import TimelineView from './components/TimelineView'
import HistorialView from './components/HistorialView'
import GestionView from './components/GestionView'
import { getAula, type Estudiante } from './data/mock'
import { formatDuration } from '@/lib/utils'

export default function DashboardPage() {
  const { aulaId } = useParams()
  const [params] = useSearchParams()
  const tab = (params.get('tab') ?? 'vivo') as TabId

  const aula = getAula(aulaId)

  const [rows, setRows] = useState<Estudiante[]>(aula?.estudiantes ?? [])
  const [query, setQuery] = useState('')

  useEffect(() => {
    setRows(aula?.estudiantes ?? [])
    setQuery('')
  }, [aulaId, aula])

  useEffect(() => {
    const t = setInterval(() => {
      setRows((prev) =>
        prev.map((r) =>
          r.activo ? { ...r, segundosConectado: r.segundosConectado + 1 } : r,
        ),
      )
    }, 1000)
    return () => clearInterval(t)
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const base = q
      ? rows.filter(
          (r) =>
            r.nombre.toLowerCase().includes(q) ||
            r.upn.toLowerCase().includes(q) ||
            r.codigo.includes(q),
        )
      : rows
    return [...base].sort((a, b) => {
      if (a.activo !== b.activo) return a.activo ? -1 : 1
      return b.segundosConectado - a.segundosConectado
    })
  }, [rows, query])

  if (!aula) {
    return (
      <div className="mx-auto max-w-2xl rounded-xl border border-amber-500/30 bg-amber-500/10 p-6 text-center">
        <AlertTriangle className="mx-auto h-8 w-8 text-amber-500" />
        <h2 className="mt-3 text-lg font-semibold text-[var(--text-primary)]">
          Aula no encontrada
        </h2>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          El aula <span className="font-mono">{aulaId}</span> no existe.
        </p>
        <Link
          to="/app/aulas"
          className="mt-4 inline-flex rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600"
        >
          Volver a mis aulas
        </Link>
      </div>
    )
  }

  const activos = rows.filter((r) => r.activo).length
  const offline = rows.length - activos
  const promedioSeg =
    rows.filter((r) => r.activo).reduce((a, r) => a + r.segundosConectado, 0) /
    (activos || 1)

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      {/* Encabezado */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Aula {aula.id} · Pabellón {aula.pabellon}
          </p>
          <h1 className="text-2xl font-semibold text-[var(--text-primary)]">
            {aula.curso} · Sección {aula.seccion}
          </h1>
          <p className="text-xs text-[var(--text-muted)]">{aula.horario}</p>
        </div>

        {tab === 'vivo' && (
          <div className="flex items-center gap-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] px-3 py-2 text-sm focus-within:border-emerald-500/50">
            <Search className="h-4 w-4 text-[var(--text-muted)]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por nombre, UPN o código…"
              className="w-64 bg-transparent outline-none placeholder:text-[var(--text-muted)]"
            />
          </div>
        )}
      </div>

      {/* Tabs */}
      <Tabs />

      {/* Contenido por tab */}
      {tab === 'vivo' && (
        <>
          <KpiBar
            matriculados={rows.length}
            activos={activos}
            offline={offline}
            tiempoPromedio={formatDuration(Math.round(promedioSeg))}
          />
          <LiveTable rows={filtered} />
        </>
      )}

      {tab === 'timeline' && <TimelineView rows={rows} />}

      {tab === 'historial' && <HistorialView aulaId={aula.id} />}

      {tab === 'gestion' && <GestionView aulaId={aula.id} activos={activos} />}
    </div>
  )
}
