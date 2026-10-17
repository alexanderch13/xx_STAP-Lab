import { useNavigate } from 'react-router-dom'
import { MapPin, Clock, Users, ArrowRight } from 'lucide-react'

interface Aula {
  id: string
  pabellon: string
  nombre: string
  curso: string
  seccion: string
  horario: string
  matriculados: number
  activos: number
}

export default function AulaCard({ aula }: { aula: Aula }) {
  const navigate = useNavigate()
  const activa = aula.activos > 0

  return (
    <button
      onClick={() => navigate(`/app/aulas/${aula.id}`)}
      className="
        group relative overflow-hidden rounded-xl
        border border-[var(--border-color)]
        bg-[var(--bg-surface)]
        p-5 text-left
        transition
        hover:-translate-y-0.5
        hover:border-emerald-500/40
        hover:shadow-[0_8px_30px_-12px_rgba(16,185,129,0.35)]
      "
    >
      {/* Franja superior */}
      <div
        className={
          'absolute left-0 top-0 h-1 w-full ' +
          (activa
            ? 'bg-gradient-to-r from-emerald-400 to-emerald-600'
            : 'bg-[var(--border-color)]')
        }
      />

      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wider text-[var(--text-muted)]">
            Pabellón {aula.pabellon} · {aula.seccion}
          </p>
          <h3 className="mt-0.5 text-base font-semibold text-[var(--text-primary)]">
            {aula.nombre}
          </h3>
          <p className="text-sm text-emerald-600 dark:text-emerald-400">
            {aula.curso}
          </p>
        </div>
        {activa && (
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
          </span>
        )}
      </div>

      <div className="mt-5 space-y-2 text-sm text-[var(--text-muted)]">
        <div className="flex items-center gap-2">
          <Clock className="h-3.5 w-3.5" />
          {aula.horario}
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-3.5 w-3.5" />
          <span>
            <span className="font-medium text-[var(--text-primary)]">{aula.matriculados}</span> matriculados
            {activa && (
              <>
                {' · '}
                <span className="font-medium text-emerald-600 dark:text-emerald-400">
                  {aula.activos} activos
                </span>
              </>
            )}
          </span>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-[var(--border-color)] pt-3">
        <span className="text-xs font-medium uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
          {activa ? 'En curso' : 'Abrir aula'}
        </span>
        <ArrowRight className="h-4 w-4 text-emerald-600 transition group-hover:translate-x-1 dark:text-emerald-400" />
      </div>
    </button>
  )
}
