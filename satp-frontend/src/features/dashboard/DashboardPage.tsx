import { useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { AlertTriangle, Clock, Play, Plus, Search, Square } from 'lucide-react'
import type {
  FilaEstudiante,
  GrupoLaboratorio,
  TipoDispositivo,
} from '@/domain/academico'
import { useAuth } from '@/auth/useAuth'
import { getCurso, getLaboratorio, gruposPermitidos } from '@/mocks/academico'
import { filasDelGrupo, useDemoStore } from '@/stores/demoStore'
import { useNow } from '@/features/shared/hooks/useNow'
import { formatDuration } from '@/lib/utils'
import Modal from '@/features/shared/Modal'
import KpiBar from './components/KpiBar'
import LiveTable from './components/LiveTable'
import Tabs from './components/Tabs'
import TimelineView from './components/TimelineView'
import HistorialView from './components/HistorialView'
import GestionView from './components/GestionView'

function FormularioConexion({
  grupoId,
  estudianteInicial,
  rows,
  onClose,
}: {
  grupoId: string
  estudianteInicial: string
  rows: FilaEstudiante[]
  onClose: () => void
}) {
  const [estudianteId, setEstudianteId] = useState(
    estudianteInicial || rows[0]?.id || '',
  )
  const [tipo, setTipo] = useState<TipoDispositivo>('LAB')
  const [error, setError] = useState('')
  const conectar = useDemoStore((s) => s.conectar)
  return (
    <Modal titulo="Simular conexión de dispositivo" onClose={onClose}>
      <form
        className="space-y-5"
        onSubmit={(e) => {
          e.preventDefault()
          const fallo = conectar(grupoId, estudianteId, tipo)
          if (fallo) setError(fallo)
          else onClose()
        }}
      >
        <p className="text-sm leading-relaxed text-[var(--text-muted)]">
          Prueba cómo se agrupan varios dispositivos en una sola fila. El móvil
          solo aporta presencia; LAB y BYOD acumulan tiempo durante una sesión
          iniciada.
        </p>
        <label className="block text-sm font-medium">
          Estudiante del grupo
          <select
            required
            aria-label="Estudiante a conectar"
            className="field mt-2"
            value={estudianteId}
            onChange={(e) => {
              setEstudianteId(e.target.value)
              setError('')
            }}
          >
            {rows.map((r) => (
              <option key={r.id} value={r.id}>
                {r.nombre}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium">
          Tipo de dispositivo
          <select
            aria-label="Tipo de dispositivo"
            className="field mt-2"
            value={tipo}
            onChange={(e) => {
              setTipo(e.target.value as TipoDispositivo)
              setError('')
            }}
          >
            <option value="LAB">Equipo del laboratorio (LAB)</option>
            <option value="BYOD">Laptop personal (BYOD)</option>
            <option value="MOVIL">Móvil · solo presencia</option>
          </select>
        </label>
        {error && (
          <p
            role="alert"
            className="rounded-lg bg-red-500/10 p-3 text-sm text-red-500"
          >
            {error}
          </p>
        )}
        <div className="flex justify-end gap-3">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" className="btn-primary" disabled={!rows.length}>
            Conectar dispositivo
          </button>
        </div>
      </form>
    </Modal>
  )
}
function DashboardGrupo({ grupo }: { grupo: GrupoLaboratorio }) {
  const state = useDemoStore()
  const usuario = useAuth((s) => s.usuario)!
  const ahora = useNow()
  const [params, setParams] = useSearchParams()
  const [query, setQuery] = useState('')
  const [conectando, setConectando] = useState<string | null>(null)
  const [finalizando, setFinalizando] = useState(false)
  const [error, setError] = useState('')
  const rawTab = params.get('tab')
  const tab = ['vivo', 'timeline', 'historial', 'gestion'].includes(
    rawTab ?? '',
  )
    ? rawTab
    : 'vivo'
  const sesion = state.sesiones[grupo.id]
  const curso = getCurso(grupo.cursoId)
  const laboratorio = getLaboratorio(grupo.laboratorioId)
  const rows = filasDelGrupo(state, grupo.id, ahora)
  const filtered = rows
    .filter((r) =>
      `${r.nombre} ${r.codigo} ${r.upn}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
    )
    .sort(
      (a, b) =>
        Number(b.activo) - Number(a.activo) || a.nombre.localeCompare(b.nombre),
    )
  const conectados = rows.filter((r) => r.activo).length
  const conEquipo = rows.filter((r) =>
    r.conexiones.some((c) => c.tipo !== 'MOVIL'),
  ).length
  const promedio = rows.length
    ? Math.round(
        rows.reduce((s, r) => s + r.segundosCertificables, 0) / rows.length,
      )
    : 0
  const otrosGrupos = gruposPermitidos(usuario).filter(
    (g) => g.laboratorioId === grupo.laboratorioId,
  )
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">
            {laboratorio.nombre} · Pabellón {laboratorio.pabellon}
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            {curso.nombre}
          </h1>
          <p className="mt-2 text-[var(--text-muted)]">
            <strong className="font-semibold text-emerald-600 dark:text-emerald-400">
              Grupo {grupo.numero}
            </strong>
            <span className="mx-2">·</span>
            {grupo.horario}
          </p>
        </div>
        {otrosGrupos.length > 1 && (
          <label className="text-sm text-[var(--text-muted)]">
            Grupo en este laboratorio
            <select
              className="field mt-2 sm:w-64"
              aria-label="Cambiar grupo del laboratorio"
              value={grupo.id}
              onChange={(e) =>
                setParams((prev) => {
                  const next = new URLSearchParams(prev)
                  next.set('grupo', e.target.value)
                  return next
                })
              }
            >
              {otrosGrupos.map((g) => (
                <option key={g.id} value={g.id}>
                  {getCurso(g.cursoId).codigo} · Grupo {g.numero}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>
      <div className="panel flex flex-wrap items-center justify-between gap-4 p-4 sm:p-5">
        <div className="flex items-center gap-3">
          <span
            className={`h-2.5 w-2.5 rounded-full ${sesion.estado === 'en_curso' ? 'bg-emerald-500' : 'bg-[var(--text-muted)]'}`}
          />
          <div>
            <p className="text-sm font-semibold">
              {sesion.estado === 'en_curso'
                ? 'Sesión en curso'
                : sesion.estado === 'finalizada'
                  ? 'Sesión finalizada'
                  : 'Sesión sin iniciar'}
            </p>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
              <Clock className="h-3.5 w-3.5" />
              Bloque programado: {formatDuration(sesion.duracionSeg)}
              {sesion.inicio !== null && (
                <>
                  {' '}
                  · Transcurrido:{' '}
                  {formatDuration(
                    Math.max(0, ((sesion.fin ?? ahora) - sesion.inicio) / 1000),
                  )}
                </>
              )}
            </p>
          </div>
        </div>
        {sesion.estado === 'en_curso' ? (
          <button
            className="btn-secondary"
            onClick={() => setFinalizando(true)}
          >
            <Square className="h-4 w-4" />
            Finalizar sesión
          </button>
        ) : (
          <button
            className="btn-primary"
            onClick={() => setError(state.iniciarSesion(grupo.id) ?? '')}
          >
            <Play className="h-4 w-4" />
            {sesion.estado === 'finalizada' ? 'Nueva sesión' : 'Iniciar sesión'}
          </button>
        )}
      </div>
      {error && (
        <p
          role="alert"
          className="rounded-xl bg-amber-500/10 p-4 text-sm text-amber-600 dark:text-amber-300"
        >
          {error}
        </p>
      )}
      <Tabs />
      {tab === 'vivo' && (
        <>
          <KpiBar
            matriculados={rows.length}
            conectados={conectados}
            conEquipo={conEquipo}
            tiempoPromedio={formatDuration(promedio)}
          />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <label className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] px-4 py-3">
              <Search className="h-4 w-4 text-[var(--text-muted)]" />
              <input
                className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                aria-label="Buscar estudiante del grupo"
                placeholder="Buscar por nombre, correo o código…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>
            <button
              className="btn-secondary"
              disabled={!rows.length}
              onClick={() => setConectando('')}
            >
              <Plus className="h-4 w-4" />
              Simular conexión
            </button>
          </div>
          <LiveTable
            rows={filtered}
            onConectar={setConectando}
            onDesconectar={(id) => state.desconectar(grupo.id, id)}
          />
          <p className="text-xs leading-relaxed text-[var(--text-muted)]">
            Una fila por estudiante. Los intervalos simultáneos de LAB y BYOD
            cuentan una sola vez. El móvil no acumula tiempo certificable.
          </p>
        </>
      )}
      {tab === 'timeline' && (
        <TimelineView rows={rows} sesion={sesion} ahora={ahora} />
      )}
      {tab === 'historial' && <HistorialView grupoId={grupo.id} />}
      {tab === 'gestion' && <GestionView aulaId={grupo.laboratorioId} />}
      {conectando !== null && (
        <FormularioConexion
          grupoId={grupo.id}
          estudianteInicial={conectando}
          rows={rows}
          onClose={() => setConectando(null)}
        />
      )}
      {finalizando && (
        <Modal
          titulo="Finalizar sesión de laboratorio"
          onClose={() => setFinalizando(false)}
        >
          <p className="text-sm leading-relaxed">
            Se cerrará la sesión de{' '}
            <strong>
              {curso.nombre} · Grupo {grupo.numero}
            </strong>{' '}
            y se guardará su resumen en el historial de esta demostración.
          </p>
          <div className="mt-6 flex justify-end gap-3">
            <button
              className="btn-secondary"
              onClick={() => setFinalizando(false)}
            >
              Cancelar
            </button>
            <button
              className="btn-primary"
              onClick={() => {
                state.finalizarSesion(grupo.id)
                setFinalizando(false)
              }}
            >
              Finalizar y guardar
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}
export default function DashboardPage() {
  const { aulaId } = useParams()
  const [params] = useSearchParams()
  const usuario = useAuth((s) => s.usuario)!
  const grupo = gruposPermitidos(usuario).find(
    (g) =>
      g.laboratorioId === aulaId &&
      (!params.get('grupo') || g.id === params.get('grupo')),
  )
  if (!grupo)
    return (
      <div className="panel mx-auto max-w-2xl p-10 text-center">
        <AlertTriangle className="mx-auto h-9 w-9 text-amber-500" />
        <h1 className="mt-4 text-xl font-semibold">Grupo no disponible</h1>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          El grupo solicitado no existe en este laboratorio o no está asignado a
          tu perfil.
        </p>
        <Link to="/app/aulas" className="btn-primary mt-5">
          Volver a los grupos
        </Link>
      </div>
    )
  return <DashboardGrupo key={grupo.id} grupo={grupo} />
}
