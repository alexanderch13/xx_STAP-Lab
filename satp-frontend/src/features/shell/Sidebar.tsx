import { NavLink, useNavigate, useParams } from 'react-router-dom'
import {
  Activity,
  LayoutGrid,
  Monitor,
  History,
  Settings,
  LogOut,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Sidebar() {
  const navigate = useNavigate()
  const { aulaId } = useParams()

  const NAV = [
    { to: '/app/aulas',                                    label: 'Mis Aulas', icon: LayoutGrid, always: true },
    { to: aulaId ? `/app/aulas/${aulaId}` : '/app/aulas',  label: 'En Vivo',  icon: Monitor },
    { to: aulaId ? `/app/aulas/${aulaId}?tab=historial` : '/app/aulas', label: 'Historial', icon: History },
    { to: aulaId ? `/app/aulas/${aulaId}?tab=gestion` : '/app/aulas',   label: 'Gestión',   icon: Settings },
    { to: aulaId ? `/app/aulas/${aulaId}?tab=timeline` : '/app/aulas', label: 'Timeline', icon: Activity },
  ]
  return (
    <aside className="flex h-full w-[240px] shrink-0 flex-col border-r border-emerald-500/15 bg-[#071a10] text-emerald-100/80">
      <div className="flex items-center gap-3 border-b border-emerald-500/15 px-5 py-5">
        <img src="/ucsm-logo.png" alt="UCSM" className="h-10 w-10" />
        <div className="leading-tight">
          <p className="text-[11px] font-medium uppercase tracking-wider text-emerald-300/70">
            UCSM · EPIS
          </p>
          <p className="text-sm font-semibold text-emerald-100">SATP-Lab</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={label}
            to={to}
            end={label === 'Mis Aulas' || label === 'En Vivo'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition',
                'hover:bg-emerald-500/10 hover:text-emerald-100',
                isActive
                  ? 'bg-emerald-500/15 text-emerald-300 shadow-[inset_2px_0_0_0_#34d399]'
                  : 'text-emerald-100/70',
              )
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-emerald-500/15 p-3">
        <button
          onClick={() => navigate('/')}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-emerald-100/70 transition hover:bg-red-500/10 hover:text-red-300"
        >
          <LogOut className="h-4 w-4" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
