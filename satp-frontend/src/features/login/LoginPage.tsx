import { useState } from 'react'
import { LogIn } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const handleMicrosoftLogin = async () => {
    setLoading(true)
    // TODO: conectar MSAL aquí (siguiente paso)
    // Por ahora solo simulamos
    console.log('Iniciando sesión con Microsoft...')
    setTimeout(() => {
      setLoading(false)
      navigate('/app/aulas')
    }, 800)
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#07140d]">
      {/* Glow radial de fondo */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 40%, rgba(34,197,94,0.18), transparent 55%)',
        }}
      />

      {/* Card central */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <div
          className="
            w-full max-w-[420px]
            rounded-2xl
            border border-emerald-500/20
            bg-[#0b1f14]/80
            px-8 py-10
            backdrop-blur-sm
            shadow-[0_0_60px_-15px_rgba(34,197,94,0.35)]
          "
        >
          {/* Logo UCSM */}
          <div className="mb-6 flex justify-center">
            <img
              src="/ucsm-logo.png"
              alt="Universidad Católica de Santa María"
              className="h-24 w-24 object-contain"
            />
          </div>

          {/* Título */}
          <h1 className="text-center text-2xl font-semibold leading-snug text-white">
            Universidad{' '}
            <span className="text-emerald-400">Católica</span> de
            <br />
            Santa María
          </h1>

          {/* Subtítulo */}
          <p className="mt-4 text-center text-[11px] font-medium uppercase tracking-[0.18em] text-emerald-200/60">
            Computación en Red III
            <br />
            <span className="text-emerald-200/40">
              Sistema de Telemetría SATP-Lab
            </span>
          </p>

          {/* Botón Microsoft */}
          <button
            type="button"
            onClick={handleMicrosoftLogin}
            disabled={loading}
            className="
              mt-8 flex w-full items-center justify-center gap-3
              rounded-lg border border-gray-300
              bg-[#f3f4f6] px-4 py-3
              text-sm font-medium text-gray-800
              transition
              hover:bg-white
              active:scale-[0.99]
              disabled:cursor-not-allowed disabled:opacity-60
            "
          >
            <MicrosoftLogo className="h-5 w-5" />
            <span>
              {loading ? 'Conectando…' : 'Iniciar sesión con Microsoft'}
            </span>
          </button>

          {/* Footer: desarrolladores */}
          <div className="mt-10 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-emerald-200/50">
              Desarrollado por
            </p>
            <div className="mt-3 space-y-0.5 text-[12px] font-medium text-emerald-200/50">
              <p>Chipana Flores, Alexander Tomas</p>
              <p>Kana Zambrano, Luz Clarita</p>
              <p>Montenegro Gonzales, Orlando Jose</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* Logo oficial de Microsoft (4 cuadros) */
function MicrosoftLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 23 23" className={className} aria-hidden>
      <rect x="1" y="1" width="10" height="10" fill="#F25022" />
      <rect x="12" y="1" width="10" height="10" fill="#7FBA00" />
      <rect x="1" y="12" width="10" height="10" fill="#00A4EF" />
      <rect x="12" y="12" width="10" height="10" fill="#FFB900" />
    </svg>
  )
}
