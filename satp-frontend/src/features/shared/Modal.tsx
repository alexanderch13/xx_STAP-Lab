import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { X } from 'lucide-react'
export default function Modal({
  titulo,
  onClose,
  children,
}: {
  titulo: string
  onClose: () => void
  children: ReactNode
}) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const dialog = ref.current!
    dialog.showModal()
    return () => dialog.close()
  }, [])
  return (
    <dialog
      ref={ref}
      aria-labelledby="modal-titulo"
      onCancel={onClose}
      className="m-auto max-h-[90dvh] w-[calc(100%_-_2rem)] max-w-lg overflow-y-auto rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-0 text-[var(--text-primary)] shadow-2xl backdrop:bg-black/65"
    >
      <div className="flex items-center justify-between gap-4 border-b border-[var(--border-color)] px-6 py-4">
        <h2 id="modal-titulo" className="text-lg font-semibold">
          {titulo}
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar diálogo"
          className="rounded-lg p-2 hover:bg-[var(--bg-elevated)]"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="p-6">{children}</div>
    </dialog>
  )
}
