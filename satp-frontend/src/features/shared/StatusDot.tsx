import { cn } from '@/lib/utils'

export default function StatusDot({
  active,
  className,
}: {
  active: boolean
  className?: string
}) {
  return (
    <span className={cn('relative flex h-2.5 w-2.5', className)}>
      {active && (
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
      )}
      <span
        className={cn(
          'relative inline-flex h-2.5 w-2.5 rounded-full',
          active ? 'bg-emerald-500' : 'bg-gray-900 dark:bg-gray-600',
        )}
      />
    </span>
  )
}
