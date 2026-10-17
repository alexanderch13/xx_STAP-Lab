type Tipo = 'LAB' | 'BYOD' | 'MOVIL'

const STYLES: Record<Tipo, string> = {
  LAB:   'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
  BYOD:  'bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/30',
  MOVIL: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30',
}

export default function DeviceBadge({ tipo }: { tipo: Tipo | null }) {
  if (!tipo) return <span className="text-xs text-[var(--text-muted)]">—</span>
  return (
    <span className={`inline-flex rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${STYLES[tipo]}`}>
      {tipo}
    </span>
  )
}
