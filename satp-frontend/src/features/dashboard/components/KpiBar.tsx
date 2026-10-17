import { Users, Wifi, WifiOff, Clock } from 'lucide-react'

interface Props {
  matriculados: number
  activos: number
  offline: number
  tiempoPromedio: string
}

export default function KpiBar({ matriculados, activos, offline, tiempoPromedio }: Props) {
  const items = [
    { label: 'Matriculados', value: matriculados, icon: Users,    color: 'text-[var(--text-primary)]' },
    { label: 'Activos',      value: activos,      icon: Wifi,     color: 'text-emerald-600 dark:text-emerald-400' },
    { label: 'Offline',      value: offline,      icon: WifiOff,  color: 'text-[var(--text-muted)]' },
    { label: 'Tiempo prom.', value: tiempoPromedio, icon: Clock,  color: 'text-emerald-600 dark:text-emerald-400' },
  ]
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {items.map(({ label, value, icon: Icon, color }) => (
        <div
          key={label}
          className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] px-4 py-3"
        >
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-medium uppercase tracking-wider text-[var(--text-muted)]">
              {label}
            </p>
            <Icon className={`h-4 w-4 ${color}`} />
          </div>
          <p className={`mt-1 text-xl font-semibold ${color}`}>{value}</p>
        </div>
      ))}
    </div>
  )
}
