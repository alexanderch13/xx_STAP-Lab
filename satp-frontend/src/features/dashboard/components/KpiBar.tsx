import { Clock, Laptop, Users, Wifi } from 'lucide-react'
interface Props {
  matriculados: number
  conectados: number
  conEquipo: number
  tiempoPromedio: string
}
export default function KpiBar({
  matriculados,
  conectados,
  conEquipo,
  tiempoPromedio,
}: Props) {
  const items = [
    { label: 'Matriculados en el grupo', value: matriculados, icon: Users },
    { label: 'Estudiantes conectados', value: conectados, icon: Wifi },
    { label: 'Con equipo LAB / BYOD', value: conEquipo, icon: Laptop },
    { label: 'Tiempo promedio del grupo', value: tiempoPromedio, icon: Clock },
  ]
  return (
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      {items.map(({ label, value, icon: Icon }) => (
        <div key={label} className="panel p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <p className="text-xs leading-relaxed text-[var(--text-muted)]">
              {label}
            </p>
            <Icon className="h-4 w-4 shrink-0 text-emerald-500" />
          </div>
          <p className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
            {value}
          </p>
        </div>
      ))}
    </div>
  )
}
