import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
export default function AppShell() {
  const [open, setOpen] = useState(false)
  return (
    <div className="flex h-dvh w-full overflow-hidden bg-[var(--bg-base)]">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <TopBar onOpenMenu={() => setOpen(true)} />
        <div className="border-b border-[var(--border-color)] bg-[var(--bg-surface)] px-5 py-2 text-xs text-[var(--text-muted)] sm:px-8">
          <span className="font-semibold text-amber-600 dark:text-amber-400">
            Demostración
          </span>{' '}
          · Datos ficticios · Periodo 2026-II · Acceso de prueba
        </div>
        <main className="min-w-0 flex-1 overflow-y-auto p-4 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
