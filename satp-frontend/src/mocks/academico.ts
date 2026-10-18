import type {
  Curso,
  Estudiante,
  GrupoLaboratorio,
  Laboratorio,
  Matricula,
  SeccionTeoria,
  UsuarioDemo,
} from '@/domain/academico'
import { PERIODO_DEMO } from '@/domain/academico'

export const USUARIOS_DEMO: Record<'docente' | 'administrador', UsuarioDemo> = {
  docente: { id: 'docente-1', nombre: 'Patricia Rivera', rol: 'docente' },
  administrador: {
    id: 'admin-1',
    nombre: 'Administración EPIS',
    rol: 'administrador',
  },
}
export const CURSOS: Curso[] = [
  {
    id: 'redes',
    codigo: 'CR-III',
    nombre: 'Computación en Red III',
    horasTeoria: 2,
    horasPractica: 2,
  },
  {
    id: 'datos',
    codigo: 'GDI',
    nombre: 'Gestión de Datos e Información',
    horasTeoria: 2,
    horasPractica: 2,
  },
  {
    id: 'algoritmos',
    codigo: 'AED',
    nombre: 'Algoritmos y Estructuras de Datos',
    horasTeoria: 3,
    horasPractica: 2,
  },
]
export const SECCIONES_TEORIA: SeccionTeoria[] = CURSOS.flatMap((c) => [
  {
    id: `${c.id}-teoria-a`,
    cursoId: c.id,
    nombre: 'A',
    horario: 'Martes · 09:00–11:00',
  },
  {
    id: `${c.id}-teoria-b`,
    cursoId: c.id,
    nombre: 'B',
    horario: 'Jueves · 11:00–13:00',
  },
])
export const LABORATORIOS: Laboratorio[] = [
  { id: 'L-207', pabellon: 'L', nombre: 'Laboratorio L-207', capacidad: 24 },
  { id: 'L-204', pabellon: 'L', nombre: 'Laboratorio L-204', capacidad: 20 },
  { id: 'A-410', pabellon: 'A', nombre: 'Laboratorio A-410', capacidad: 16 },
]
export const GRUPOS: GrupoLaboratorio[] = [
  {
    id: 'redes-01',
    cursoId: 'redes',
    numero: '01',
    laboratorioId: 'L-207',
    docenteId: 'docente-1',
    horario: 'Lunes · 17:00–19:00',
    duracionSeg: 7200,
    capacidad: 24,
  },
  {
    id: 'redes-02',
    cursoId: 'redes',
    numero: '02',
    laboratorioId: 'L-207',
    docenteId: 'docente-2',
    horario: 'Martes · 17:00–19:00',
    duracionSeg: 7200,
    capacidad: 24,
  },
  {
    id: 'datos-02',
    cursoId: 'datos',
    numero: '02',
    laboratorioId: 'L-204',
    docenteId: 'docente-1',
    horario: 'Miércoles · 19:00–21:00',
    duracionSeg: 7200,
    capacidad: 20,
  },
  {
    id: 'algoritmos-01',
    cursoId: 'algoritmos',
    numero: '01',
    laboratorioId: 'A-410',
    docenteId: 'docente-1',
    horario: 'Viernes · 15:00–17:00',
    duracionSeg: 7200,
    capacidad: 16,
  },
]
const NOMBRES = [
  'Juan Pérez Quispe',
  'María López Ramos',
  'Carlos García Núñez',
  'Ana Torres Valdivia',
  'Roberto Luna Chávez',
  'Sofía Vargas Paredes',
  'Diego Mamani Flores',
  'Lucía Choque Huanca',
  'Fernando Medina Ríos',
  'Patricia Castro León',
  'Rosa Huamán Ttito',
  'Jorge Quispe Apaza',
  'Lucía Nina Ccama',
  'Marco Flores Sullo',
  'Ana Condori Mamani',
  'Pedro Ccopa Villca',
  'Sara Rojas Yupanqui',
  'Elena Calsina Turpo',
  'Bruno Gómez Salas',
  'Carla Ramos Herrera',
  'Diego Zevallos Puma',
  'Fiorella Vilca Soto',
  'Gabriel Paredes Llerena',
  'Héctor Chura Zapana',
  'Luis Mendoza Rojas',
  'Valeria Salas Pinto',
]
export const ESTUDIANTES: Estudiante[] = NOMBRES.map((nombre, i) => ({
  id: `est-${i + 1}`,
  codigo: String(20231001 + i),
  nombre,
  upn: `alumno${i + 1}@estudiante.ucsm.edu.pe`,
}))
function matricula(
  indice: number,
  cursoId: string,
  grupoId: string,
  teoria: 'A' | 'B',
): Matricula {
  return {
    id: `mat-${cursoId}-${indice + 1}`,
    estudianteId: ESTUDIANTES[indice].id,
    cursoId,
    periodo: PERIODO_DEMO,
    seccionTeoriaId: `${cursoId}-teoria-${teoria.toLowerCase()}`,
    grupoLaboratorioId: grupoId,
  }
}
// Los grupos prácticos son independientes de las secciones de teoría.
export const MATRICULAS_INICIALES: Matricula[] = [
  ...Array.from({ length: 10 }, (_, i) =>
    matricula(i, 'redes', 'redes-01', i % 2 ? 'B' : 'A'),
  ),
  ...[10, 11, 24, 25].map((i, n) =>
    matricula(i, 'redes', 'redes-02', n % 2 ? 'B' : 'A'),
  ),
  ...Array.from({ length: 8 }, (_, i) =>
    matricula(i + 10, 'datos', 'datos-02', i % 2 ? 'A' : 'B'),
  ),
  ...Array.from({ length: 6 }, (_, i) =>
    matricula(i + 18, 'algoritmos', 'algoritmos-01', i % 2 ? 'B' : 'A'),
  ),
]
export function getCurso(id: string) {
  return CURSOS.find((c) => c.id === id)!
}
export function getLaboratorio(id: string) {
  return LABORATORIOS.find((l) => l.id === id)!
}
export function gruposPermitidos(usuario: UsuarioDemo) {
  return GRUPOS.filter(
    (g) => usuario.rol === 'administrador' || g.docenteId === usuario.id,
  )
}
export function urlGrupo(grupo: GrupoLaboratorio, tab = 'vivo') {
  const params = new URLSearchParams({ grupo: grupo.id })
  if (tab !== 'vivo') params.set('tab', tab)
  return `/app/aulas/${grupo.laboratorioId}?${params}`
}
