import { useEffect, useRef } from 'react'
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom'
import {
  Activity,
  ClipboardList,
  History,
  LayoutGrid,
  LogOut,
  Monitor,
  Settings,
  X,
} from 'lucide-react'
import { useAuth } from '@/auth/useAuth'
import { getCurso, gruposPermitidos, urlGrupo } from '@/mocks/academico'
import { cn } from '@/lib/utils'
export default function Sidebar({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const usuario = useAuth((s) => s.usuario)!
  const salir = useAuth((s) => s.salir)
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { aulaId } = useParams()
  const [params] = useSearchParams()
  const permitidos = gruposPermitidos(usuario)
  const grupo = permitidos.find(
    (g) =>
      g.laboratorioId === aulaId &&
      (!params.get('grupo') || g.id === params.get('grupo')),
  )
  const rawTab = params.get('tab')
  const tab = ['vivo', 'timeline', 'historial', 'gestion'].includes(
    rawTab ?? '',
  )
    ? rawTab
    : 'vivo'
  const dialogRef = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    if (open) dialogRef.current?.showModal()
    else dialogRef.current?.close()
  }, [open])
  const enlaces = [
    {
      to: '/app/aulas',
      label:
        usuario.rol === 'administrador' ? 'Grupos de laboratorio' : 'Mis grupos',
      icon: LayoutGrid,
      active: pathname === '/app/aulas',
    },
    ...(usuario.rol === 'administrador'
      ? [
          {
            to: '/app/matricula',
            label: 'Matrícula',
            icon: ClipboardList,
            active: pathname === '/app/matricula',
          },
        ]
      : []),
    ...(grupo
      ? [
          {
            to: urlGrupo(grupo),
            label: 'En vivo',
            icon: Monitor,
            active: tab === 'vivo',
          },
          {
            to: urlGrupo(grupo, 'timeline'),
            label: 'Timeline',
            icon: Activity,
            active: tab === 'timeline',
          },
          {
            to: urlGrupo(grupo, 'historial'),
            label: 'Historial',
            icon: History,
            active: tab === 'historial',
          },
          {
            to: urlGrupo(grupo, 'gestion'),
            label: 'Equipos',
            icon: Settings,
            active: tab === 'gestion',
          },
        ]
      : []),
  ]
  const contenido = (
    <>
      <div className="flex items-center gap-3 border-b border-emerald-500/15 px-5 py-6">
        <img
          src="/ucsm-logo.png"
          alt="UCSM"
          className="h-11 w-11 object-contain"
        />
        <div>
          <p className="text-xs tracking-wider text-emerald-300/75">
            UCSM · EPIS
          </p>
          <p className="text-lg font-semibold text-white">SATP-Lab</p>
        </div>
        <button
          onClick={onClose}
          aria-label="Cerrar menú"
          className="ml-auto rounded-lg p-2 lg:hidden"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      {grupo && (
        <div className="mx-4 mt-5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3">
          <p className="text-xs text-emerald-300">
            {grupo.laboratorioId} · Grupo {grupo.numero}
          </p>
          <p className="mt-1 text-sm font-medium leading-snug text-emerald-50">
            {getCurso(grupo.cursoId).nombre}
          </p>
        </div>
      )}
      <nav aria-label="Menú principal" className="flex-1 space-y-1 px-3 py-5">
        {enlaces.map(({ to, label, icon: Icon, active }) => (
          <Link
            key={label}
            to={to}
            onClick={onClose}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition hover:bg-emerald-500/10',
              active
                ? 'bg-emerald-500/15 text-emerald-300 shadow-[inset_3px_0_0_0_#34d399]'
                : 'text-emerald-100/75',
            )}
          >
            <Icon className="h-[18px] w-[18px]" />
            {label}
          </Link>
        ))}
      </nav>
      <div className="border-t border-emerald-500/15 p-3">
        <button
          onClick={() => {
            salir()
            onClose()
            navigate('/')
          }}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-emerald-100/75 hover:bg-red-500/10 hover:text-red-300"
        >
          <LogOut className="h-[18px] w-[18px]" />
          Cerrar sesión
        </button>
      </div>
    </>
  )
  return (
    <>
      <aside className="hidden h-full w-64 shrink-0 flex-col border-r border-emerald-500/15 bg-[#071a10] lg:flex">
        {contenido}
      </aside>
      <dialog
        ref={dialogRef}
        aria-label="Navegación"
        onCancel={onClose}
        className="m-0 h-dvh max-h-none w-72 max-w-[85vw] border-0 bg-[#071a10] p-0 text-emerald-100 backdrop:bg-black/65"
      >
        <div className="flex h-full flex-col">{contenido}</div>
      </dialog>
    </>
  )
}
