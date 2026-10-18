import { useState } from 'react'
import { Search } from 'lucide-react'
import AulaCard from './AulaCard'
import { useAuth } from '@/auth/useAuth'
import {
  CURSOS,
  gruposPermitidos,
  getCurso,
  getLaboratorio,
} from '@/mocks/academico'
export default function AulaSelectorPage() {
  const usuario = useAuth((s) => s.usuario)!
  const [cursoId, setCursoId] = useState('todos')
  const [busqueda, setBusqueda] = useState('')
  const permitidos = gruposPermitidos(usuario)
  const grupos = permitidos.filter(
    (g) =>
      (cursoId === 'todos' || g.cursoId === cursoId) &&
      `${getCurso(g.cursoId).nombre} grupo ${g.numero} ${getLaboratorio(g.laboratorioId).nombre}`
        .toLowerCase()
        .includes(busqueda.trim().toLowerCase()),
  )
  return (
    <div className="mx-auto max-w-7xl space-y-7">
      <div>
        <p className="eyebrow">
          {usuario.rol === 'administrador'
            ? 'Administración de laboratorios'
            : 'Supervisión docente'}{' '}
          · 2026-II
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Grupos de laboratorio
        </h1>
        <p className="mt-2 text-[var(--text-muted)]">
          Selecciona el curso y grupo práctico que deseas supervisar.
        </p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="flex flex-1 items-center gap-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] px-4 py-3">
          <Search className="h-5 w-5 text-[var(--text-muted)]" />
          <input
            aria-label="Buscar grupo de laboratorio"
            className="min-w-0 flex-1 bg-transparent outline-none"
            placeholder="Buscar curso, grupo o laboratorio…"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </label>
        <select
          aria-label="Filtrar grupos por curso"
          className="field sm:max-w-80"
          value={cursoId}
          onChange={(e) => setCursoId(e.target.value)}
        >
          <option value="todos">Todos los cursos</option>
          {CURSOS.filter((c) => permitidos.some((g) => g.cursoId === c.id)).map(
            (c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ),
          )}
        </select>
      </div>
      <p className="text-sm text-[var(--text-muted)]">
        {grupos.length} grupos disponibles · El grupo práctico y el laboratorio
        físico se muestran por separado.
      </p>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {grupos.map((grupo) => (
          <AulaCard key={grupo.id} grupo={grupo} />
        ))}
      </div>
      {grupos.length === 0 && (
        <div className="panel p-10 text-center text-[var(--text-muted)]">
          No hay grupos que coincidan con la búsqueda.
        </div>
      )}
    </div>
  )
}
