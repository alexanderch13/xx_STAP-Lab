import { useState } from 'react'
import { Link } from 'react-router-dom'
import { LockKeyhole, Search } from 'lucide-react'
import { PERIODO_DEMO } from '@/domain/academico'
import {
  CURSOS,
  ESTUDIANTES,
  GRUPOS,
  SECCIONES_TEORIA,
  getCurso,
  urlGrupo,
} from '@/mocks/academico'
import { useDemoStore } from '@/stores/demoStore'

export default function MatriculaPage() {
  const matriculas = useDemoStore((s) => s.matriculas)
  const [cursoId, setCursoId] = useState('todos')
  const [grupoId, setGrupoId] = useState('todos')
  const [query, setQuery] = useState('')
  const grupos = GRUPOS.filter(
    (g) => cursoId === 'todos' || g.cursoId === cursoId,
  )
  const visibles = matriculas.filter((m) => {
    const est = ESTUDIANTES.find((e) => e.id === m.estudianteId)!
    return (
      (cursoId === 'todos' || m.cursoId === cursoId) &&
      (grupoId === 'todos' ||
        (grupoId === 'pendientes'
          ? !m.grupoLaboratorioId
          : m.grupoLaboratorioId === grupoId)) &&
      `${est.nombre} ${est.codigo} ${est.upn}`
        .toLowerCase()
        .includes(query.toLowerCase().trim())
    )
  })
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Consulta académica · {PERIODO_DEMO}</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Consulta de matrícula
          </h1>
          <p className="mt-2 max-w-2xl text-[var(--text-muted)]">
            Revisa las asignaciones de teoría y los grupos de laboratorio de
            los estudiantes.
          </p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border-color)] px-3 py-2 text-sm text-[var(--text-muted)]">
          <LockKeyhole className="h-4 w-4" aria-hidden="true" />
          Solo consulta
        </span>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Matrículas consultables', valor: matriculas.length },
          { label: 'Cursos disponibles', valor: CURSOS.length },
          { label: 'Grupos prácticos', valor: GRUPOS.length },
        ].map((i) => (
          <div key={i.label} className="panel p-5">
            <p className="text-sm text-[var(--text-muted)]">{i.label}</p>
            <p className="mt-2 text-2xl font-semibold">{i.valor}</p>
          </div>
        ))}
      </div>
      <div className="panel space-y-3 p-5 text-sm leading-relaxed text-[var(--text-muted)]">
        <p>
          <strong className="text-[var(--text-primary)]">
            La matrícula se administra en el sistema académico.
          </strong>{' '}
          SATP-Lab consulta estas asignaciones para mostrar los estudiantes de
          cada grupo. Las altas, los cambios y los retiros se realizan en el
          sistema académico.
        </p>
        <p>
          La sección corresponde a teoría; el grupo de laboratorio identifica
          la práctica. Un mismo laboratorio físico puede recibir varios grupos
          en horarios diferentes.
        </p>
        <p>
          Demostración con datos académicos precargados. La consulta a la base
          de datos aún no está conectada.
        </p>
      </div>
      <div className="grid gap-3 lg:grid-cols-[1fr_1fr_1.2fr]">
        <select
          aria-label="Filtrar matrículas por curso"
          className="field"
          value={cursoId}
          onChange={(e) => {
            setCursoId(e.target.value)
            setGrupoId('todos')
          }}
        >
          <option value="todos">Todos los cursos</option>
          {CURSOS.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>
        <select
          aria-label="Filtrar matrículas por grupo"
          className="field"
          value={grupoId}
          onChange={(e) => setGrupoId(e.target.value)}
        >
          <option value="todos">Todos los grupos prácticos</option>
          <option value="pendientes">Pendientes de grupo</option>
          {grupos.map((g) => (
            <option key={g.id} value={g.id}>
              {getCurso(g.cursoId).codigo} · Grupo {g.numero} ·{' '}
              {g.laboratorioId}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] px-4">
          <Search className="h-4 w-4 text-[var(--text-muted)]" aria-hidden="true" />
          <input
            aria-label="Buscar matrícula"
            className="min-h-12 min-w-0 w-full bg-transparent text-sm outline-none"
            placeholder="Buscar estudiante, código o correo…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
      </div>
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Estudiante</th>
              <th>Curso</th>
              <th>Teoría</th>
              <th>Grupo práctico</th>
              <th>Laboratorio</th>
            </tr>
          </thead>
          <tbody>
            {visibles.map((m) => {
              const est = ESTUDIANTES.find((e) => e.id === m.estudianteId)!
              const curso = getCurso(m.cursoId)
              const seccion = SECCIONES_TEORIA.find(
                (s) => s.id === m.seccionTeoriaId,
              )!
              const grupo = GRUPOS.find((g) => g.id === m.grupoLaboratorioId)
              return (
                <tr key={m.id}>
                  <td>
                    <p className="font-medium">{est.nombre}</p>
                    <p className="mt-1 font-mono text-xs text-[var(--text-muted)]">
                      {est.codigo}
                    </p>
                  </td>
                  <td>
                    <p className="font-medium">{curso.nombre}</p>
                    <p className="mt-1 text-xs text-[var(--text-muted)]">
                      {curso.horasTeoria} h teoría · {curso.horasPractica} h
                      práctica
                    </p>
                  </td>
                  <td>Sección {seccion.nombre}</td>
                  <td>
                    {grupo ? (
                      <Link
                        className="font-semibold text-emerald-600 underline-offset-4 hover:underline dark:text-emerald-400"
                        to={urlGrupo(grupo)}
                      >
                        Grupo {grupo.numero}
                      </Link>
                    ) : (
                      <span className="text-amber-600 dark:text-amber-400">
                        Pendiente
                      </span>
                    )}
                  </td>
                  <td>{grupo?.laboratorioId ?? '—'}</td>
                </tr>
              )
            })}
            {visibles.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="py-12 text-center text-[var(--text-muted)]"
                >
                  No hay matrículas que coincidan con los filtros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-[var(--text-muted)]" aria-live="polite">
        {visibles.length} de {matriculas.length} matrículas mostradas
      </p>
    </div>
  )
}
