import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Maximize2, Menu, User } from 'lucide-react'
import ThemeToggle from '@/features/shared/ThemeToggle'
import { useAuth } from '@/auth/useAuth'
export default function TopBar({ onOpenMenu }: { onOpenMenu: () => void }) {
  const navigate = useNavigate()
  const { aulaId } = useParams()
  const usuario = useAuth((s) => s.usuario)!
  const [error, setError] = useState('')
  async function pantallaCompleta() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen()
      else await document.documentElement.requestFullscreen()
      setError('')
    } catch {
      setError('Tu navegador no permite activar pantalla completa.')
    }
  }
  return (
    <header className="flex min-h-16 shrink-0 items-center justify-between gap-3 border-b border-emerald-500/20 bg-emerald-700 px-4 text-emerald-50 sm:px-6">
      <div className="flex min-w-0 items-center gap-2">
        <button
          onClick={onOpenMenu}
          aria-label="Abrir menú"
          className="rounded-lg p-2 hover:bg-white/10 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        {aulaId && (
          <button
            onClick={() => navigate('/app/aulas')}
            aria-label="Volver a los grupos"
            className="rounded-lg p-2 hover:bg-white/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        )}
        <span className="truncate text-sm font-semibold sm:text-base">
          {aulaId
            ? 'Supervisión de laboratorio'
            : 'Sistema de Telemetría · SATP-Lab'}
        </span>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <ThemeToggle variant="dark" />
        <button
          onClick={pantallaCompleta}
          title={error || 'Pantalla completa'}
          aria-label="Pantalla completa"
          className="hidden rounded-lg p-2 hover:bg-white/10 sm:block"
        >
          <Maximize2 className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-2">
          <User className="h-4 w-4" />
          <div className="hidden leading-tight md:block">
            <p className="text-sm font-medium">{usuario.nombre}</p>
            <p className="mt-0.5 text-xs text-emerald-100/80">
              {usuario.rol === 'administrador' ? 'Administrador' : 'Docente'} ·
              Demo
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}
