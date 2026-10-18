import type { TipoDispositivo } from '@/domain/academico'
const STYLES: Record<TipoDispositivo, string> = {
  LAB: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
  BYOD: 'border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300',
  MOVIL:
    'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300',
}
export default function DeviceBadge({ tipo }: { tipo: TipoDispositivo }) {
  return (
    <span
      className={`inline-flex rounded-md border px-2 py-1 text-xs font-semibold ${STYLES[tipo]}`}
    >
      {tipo === 'MOVIL' ? 'Móvil' : tipo}
    </span>
  )
}
