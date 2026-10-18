import { Link } from 'react-router-dom'
import { ArrowRight, Clock, MapPin, Users } from 'lucide-react'
import type { GrupoLaboratorio } from '@/domain/academico'
import { getCurso, getLaboratorio, urlGrupo } from '@/mocks/academico'
import { useDemoStore } from '@/stores/demoStore'
export default function AulaCard({ grupo }: { grupo: GrupoLaboratorio }) {
  const matriculas = useDemoStore((s) => s.matriculas)
  const conexiones = useDemoStore((s) => s.conexiones)
  const sesion = useDemoStore((s) => s.sesiones[grupo.id])
  const curso = getCurso(grupo.cursoId)
  const laboratorio = getLaboratorio(grupo.laboratorioId)
  const estudiantes = new Set(
    matriculas
      .filter((m) => m.grupoLaboratorioId === grupo.id)
      .map((m) => m.estudianteId),
  )
  const conectados = new Set(
    conexiones
      .filter(
        (c) =>
          c.grupoId === grupo.id &&
          c.fin === null &&
          estudiantes.has(c.estudianteId),
      )
      .map((c) => c.estudianteId),
  ).size
  const enCurso = sesion.estado === 'en_curso'
  return (
    <Link
      to={urlGrupo(grupo)}
      className="group relative flex min-h-72 flex-col overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-6 transition hover:-translate-y-1 hover:border-emerald-500/60 hover:shadow-lg"
    >
      <span
        className={`absolute inset-x-0 top-0 h-1 ${enCurso ? 'bg-emerald-500' : 'bg-[var(--border-color)]'}`}
      />
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <span className="rounded-lg bg-emerald-500/10 px-3 py-1 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
          Grupo {grupo.numero}
        </span>
        <span
          className={`text-xs font-medium ${enCurso ? 'text-emerald-600 dark:text-emerald-400' : 'text-[var(--text-muted)]'}`}
        >
          {enCurso
            ? '● Sesión en curso'
            : sesion.estado === 'finalizada'
              ? 'Sesión finalizada'
              : 'Sin sesión iniciada'}
        </span>
      </div>
      <h2 className="text-xl font-semibold leading-snug">{curso.nombre}</h2>
      <p className="mt-2 flex items-center gap-2 text-sm text-[var(--text-muted)]">
        <MapPin className="h-4 w-4 shrink-0" />
        {laboratorio.nombre} · Pabellón {laboratorio.pabellon}
      </p>
      <div className="my-5 space-y-3 text-sm text-[var(--text-muted)]">
        <p className="flex items-center gap-2">
          <Clock className="h-4 w-4 shrink-0" />
          {grupo.horario}
        </p>
        <p className="flex items-center gap-2">
          <Users className="h-4 w-4 shrink-0" />
          <span>
            <strong className="font-semibold text-[var(--text-primary)]">
              {estudiantes.size}
            </strong>{' '}
            matriculados ·{' '}
            <strong className="font-semibold text-emerald-600 dark:text-emerald-400">
              {conectados}
            </strong>{' '}
            conectados
          </span>
        </p>
      </div>
      <div className="mt-auto flex items-center justify-between border-t border-[var(--border-color)] pt-4 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
        <span>Ver grupo de laboratorio</span>
        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
      </div>
    </Link>
  )
}
