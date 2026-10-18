export type Rol = 'docente' | 'administrador'
export type TipoDispositivo = 'LAB' | 'BYOD' | 'MOVIL'
export type EstadoSesion = 'programada' | 'en_curso' | 'finalizada'
export interface Curso {
  id: string
  codigo: string
  nombre: string
  horasTeoria: number
  horasPractica: number
}
export interface SeccionTeoria {
  id: string
  cursoId: string
  nombre: string
  horario: string
}
export interface Laboratorio {
  id: string
  pabellon: string
  nombre: string
  capacidad: number
}
export interface GrupoLaboratorio {
  id: string
  cursoId: string
  numero: string
  laboratorioId: string
  docenteId: string
  horario: string
  duracionSeg: number
  capacidad: number
}
export interface Estudiante {
  id: string
  codigo: string
  nombre: string
  upn: string
}
export interface Matricula {
  id: string
  estudianteId: string
  cursoId: string
  periodo: string
  seccionTeoriaId: string
  grupoLaboratorioId: string | null
}
export interface UsuarioDemo {
  id: string
  nombre: string
  rol: Rol
}
export interface Conexion {
  id: string
  estudianteId: string
  grupoId: string
  equipo: string
  tipo: TipoDispositivo
  inicio: number
  fin: number | null
}
export interface Sesion {
  id: string
  grupoId: string
  estado: EstadoSesion
  inicio: number | null
  fin: number | null
  duracionSeg: number
}
export interface Intervalo {
  inicio: number
  fin: number
}
export interface FilaEstudiante extends Estudiante {
  conexiones: Conexion[]
  activo: boolean
  presenciaMovil: boolean
  segundosCertificables: number
  intervalos: Intervalo[]
}
export interface RegistroHistorico {
  id: string
  sesionId: string
  grupoId: string
  fecha: string
  estudianteId: string
  nombre: string
  upn: string
  codigo: string
  equipos: string
  duracionSeg: number
  bloqueSeg: number
  porcentaje: number
  certificada: boolean
}
export const PERIODO_DEMO = '2026-II'
// Criterio provisional para demostrar el frontend. La política institucional sigue pendiente.
export const UMBRAL_DEMO = 75

export function unirIntervalos(intervalos: Intervalo[]): Intervalo[] {
  const ordenados = intervalos
    .filter((i) => i.fin > i.inicio)
    .map((i) => ({ ...i }))
    .sort((a, b) => a.inicio - b.inicio)
  return ordenados.reduce<Intervalo[]>((out, actual) => {
    const ultimo = out.at(-1)
    if (ultimo && actual.inicio <= ultimo.fin)
      ultimo.fin = Math.max(ultimo.fin, actual.fin)
    else out.push(actual)
    return out
  }, [])
}
export function intervalosCertificables(
  conexiones: Conexion[],
  sesion: Sesion,
  ahora: number,
): Intervalo[] {
  if (sesion.inicio === null) return []
  const finSesion = Math.min(sesion.fin ?? ahora, ahora)
  return unirIntervalos(
    conexiones
      .filter((c) => c.tipo !== 'MOVIL')
      .map((c) => ({
        inicio: Math.max(c.inicio, sesion.inicio!),
        fin: Math.min(c.fin ?? ahora, finSesion),
      })),
  )
}
export function segundosDeIntervalos(intervalos: Intervalo[]): number {
  return Math.floor(
    intervalos.reduce((total, i) => total + i.fin - i.inicio, 0) / 1000,
  )
}
export function porcentajeCertificable(
  segundos: number,
  bloque: number,
): number {
  return bloque > 0
    ? Math.min(100, Math.max(0, Math.floor((segundos / bloque) * 100)))
    : 0
}

