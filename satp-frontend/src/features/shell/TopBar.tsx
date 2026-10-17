import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Maximize2, User } from 'lucide-react'
import ThemeToggle from '@/features/shared/ThemeToggle'

export default function TopBar() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const params = useParams()
  const enDashboard = !!params.aulaId

  return (
    <header
      className="
        flex h-14 shrink-0 items-center justify-between gap-4
        border-b border-emerald-500/20
        bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-700
        px-4 text-emerald-50
        shadow-[0_1px_0_0_rgba(255,255,255,0.06)]
      "
    >
      <div className="flex items-center gap-3">
        {enDashboard && (
          <button
            onClick={() => navigate('/app/aulas')}
            className="rounded-md p-1.5 transition hover:bg-emerald-500/30"
            aria-label="Volver"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        )}
        <span className="text-sm font-medium">
          {enDashboard ? 'Monitoreo de aula' : 'Sistema de Telemetría · SATP-Lab'}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle variant="dark" />
        <button className="rounded-md p-1.5 transition hover:bg-emerald-500/30">
          <Maximize2 className="h-4 w-4" />
        </button>
        <div className="ml-1 flex items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-1.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
            <User className="h-3.5 w-3.5" />
          </div>
          <span className="text-xs font-medium">Ing. Docente</span>
        </div>
      </div>
    </header>
  )
}
