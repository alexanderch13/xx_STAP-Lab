import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, GraduationCap, ShieldCheck } from 'lucide-react'
import type { Rol } from '@/domain/academico'
import { useAuth } from '@/auth/useAuth'
export default function LoginPage() {
  const [rol, setRol] = useState<Rol>('docente')
  const entrar = useAuth((s) => s.entrar)
  const navigate = useNavigate()
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-[#07140d] px-5 py-10 text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.14),transparent_65%)]"
      />
      <div className="relative w-full max-w-[460px] rounded-3xl border border-emerald-500/20 bg-[#0b1f14]/90 p-7 shadow-[0_0_80px_-25px_rgba(16,185,129,0.28)] sm:p-9">
        <div className="mb-6 flex items-center gap-4">
          <img
            src="/ucsm-logo.png"
            alt="Universidad Católica de Santa María"
            className="h-16 w-16 object-contain"
          />
          <p className="text-sm leading-relaxed text-emerald-100/85">
            Universidad Católica
            <br />
            de Santa María
            <span className="mt-1 block text-xs tracking-wider text-emerald-300/75">
              EPIS · AREQUIPA
            </span>
          </p>
        </div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
          Telemetría de laboratorios
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">SATP-Lab</h1>
        <p className="mt-3 text-base leading-relaxed text-emerald-100/75">
          Supervisa tus grupos de laboratorio y el registro de sus sesiones.
        </p>
        <p className="mt-7 text-sm font-semibold text-emerald-100">
          Acceso institucional
        </p>
        <button
          className="mt-3 flex min-h-12 w-full items-center justify-center gap-3 rounded-xl border border-gray-300 bg-[#f3f4f6] px-4 py-3 text-sm font-semibold text-gray-800 transition hover:bg-white"
          type="button"
          onClick={() => {
            entrar('docente')
            navigate('/app/aulas')
          }}
        >
          <MicrosoftLogo />
          Iniciar sesión con Microsoft
        </button>
        <p className="mt-3 text-xs leading-relaxed text-emerald-100/65">
          Modo de prueba: este botón simula el acceso institucional y abre una
          sesión de docente con datos ficticios. No solicita credenciales.
        </p>
        <details className="mt-6 border-t border-emerald-100/15 pt-4">
          <summary className="cursor-pointer rounded text-sm font-medium text-emerald-200/80 transition hover:text-emerald-100">
            Opciones de demostración
          </summary>
          <form
            className="mt-4"
            onSubmit={(e) => {
              e.preventDefault()
              entrar(rol)
              navigate('/app/aulas')
            }}
          >
            <fieldset>
              <legend className="mb-3 text-sm font-medium text-emerald-50">
                Probar un perfil
              </legend>
              <div className="grid grid-cols-2 gap-3">
                {(['docente', 'administrador'] as const).map((r) => (
                  <label
                    key={r}
                    className={`flex cursor-pointer flex-col items-center gap-2 rounded-xl border p-4 text-sm transition ${rol === r ? 'border-emerald-400 bg-emerald-500/10 text-emerald-200' : 'border-emerald-100/15 text-emerald-100/65 hover:border-emerald-500/50'}`}
                  >
                    <input
                      className="sr-only"
                      type="radio"
                      name="rol"
                      value={r}
                      checked={rol === r}
                      onChange={() => setRol(r)}
                    />
                    {r === 'docente' ? (
                      <GraduationCap className="h-5 w-5" />
                    ) : (
                      <ShieldCheck className="h-5 w-5" />
                    )}
                    {r === 'docente' ? 'Docente' : 'Administrador'}
                  </label>
                ))}
              </div>
            </fieldset>
            <button
              className="mt-5 flex min-h-12 w-full items-center justify-center gap-3 rounded-xl bg-emerald-500 px-4 py-3 font-semibold text-[#042617] transition hover:bg-emerald-400"
              type="submit"
            >
              Entrar a la demostración
              <ArrowRight className="h-5 w-5" />
            </button>
          </form>
          <p className="mt-4 text-xs leading-relaxed text-emerald-100/60">
            Estos perfiles solo permiten revisar las interfaces del prototipo.
            En el acceso institucional, los permisos dependerán del rol asignado
            a tu cuenta y de los grupos autorizados. Los estudiantes no tienen
            acceso al panel.
          </p>
        </details>
      </div>
      <footer className="relative mt-7 max-w-xl text-center text-xs leading-relaxed text-emerald-100/60">
        <p className="mb-2 font-medium text-emerald-100/80">
          Computación en Red III · UCSM
        </p>
        <p>
          Chipana Flores, Alexander Tomas · Kana Zambrano, Luz Clarita
          <br />
          Montenegro Gonzales, Orlando Jose
        </p>
      </footer>
    </div>
  )
}

function MicrosoftLogo() {
  return (
    <svg viewBox="0 0 23 23" className="h-5 w-5 shrink-0" aria-hidden="true">
      <rect x="1" y="1" width="10" height="10" fill="#F25022" />
      <rect x="12" y="1" width="10" height="10" fill="#7FBA00" />
      <rect x="1" y="12" width="10" height="10" fill="#00A4EF" />
      <rect x="12" y="12" width="10" height="10" fill="#FFB900" />
    </svg>
  )
}
