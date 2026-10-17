import AulaCard from './AulaCard'
import { AULAS_LIST } from '@/features/dashboard/data/mock'

export default function AulaSelectorPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[var(--text-primary)]">
          Mis aulas asignadas
        </h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Selecciona un laboratorio para iniciar el monitoreo en tiempo real.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {AULAS_LIST.map((a) => (
          <AulaCard key={a.id} aula={a} />
        ))}
      </div>
    </div>
  )
}
