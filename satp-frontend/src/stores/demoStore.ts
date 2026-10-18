import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  Conexion,
  FilaEstudiante,
  Matricula,
  RegistroHistorico,
  Sesion,
  TipoDispositivo,
} from '@/domain/academico'
import {
  PERIODO_DEMO,
  UMBRAL_DEMO,
  intervalosCertificables,
  porcentajeCertificable,
  segundosDeIntervalos,
} from '@/domain/academico'
import {
  ESTUDIANTES,
  GRUPOS,
  MATRICULAS_INICIALES,
} from '@/mocks/academico'

interface DemoData {
  readonly matriculas: ReadonlyArray<Readonly<Matricula>>
  conexiones: Conexion[]
  sesiones: Record<string, Sesion>
  historial: RegistroHistorico[]
}
interface DemoStore extends DemoData {
  iniciarSesion: (grupoId: string) => string | null
  finalizarSesion: (grupoId: string) => void
  conectar: (
    grupoId: string,
    estudianteId: string,
    tipo: TipoDispositivo,
  ) => string | null
  desconectar: (grupoId: string, estudianteId: string) => void
}
function crearDatosIniciales(): DemoData {
  const ahora = Date.now()
  const sesiones = Object.fromEntries(
    GRUPOS.map((g) => [
      g.id,
      {
        id: `sesion-${g.id}-${ahora}`,
        grupoId: g.id,
        estado: g.id === 'redes-01' ? 'en_curso' : 'programada',
        inicio: g.id === 'redes-01' ? ahora - 2700_000 : null,
        fin: null,
        duracionSeg: g.duracionSeg,
      } satisfies Sesion,
    ]),
  )
  const conexiones: Conexion[] = [
    ...[2533, 2282, 1904, 1720, 1450, 1201].map((seg, i) => ({
      id: `con-inicial-${i}`,
      estudianteId: `est-${i + 1}`,
      grupoId: 'redes-01',
      equipo:
        i === 2
          ? 'Laptop personal'
          : i === 3
            ? 'Teléfono'
            : `LAB-${String(i + 1).padStart(3, '0')}`,
      tipo: (i === 2 ? 'BYOD' : i === 3 ? 'MOVIL' : 'LAB') as TipoDispositivo,
      inicio: ahora - seg * 1000,
      fin: null,
    })),
    {
      id: 'con-movil-juan',
      estudianteId: 'est-1',
      grupoId: 'redes-01',
      equipo: 'Teléfono',
      tipo: 'MOVIL',
      inicio: ahora - 2400_000,
      fin: null,
    },
    // Un intervalo anterior permite mostrar una desconexión en el timeline.
    {
      id: 'con-terminada',
      estudianteId: 'est-7',
      grupoId: 'redes-01',
      equipo: 'LAB-007',
      tipo: 'LAB',
      inicio: ahora - 2400_000,
      fin: ahora - 1800_000,
    },
  ]
  const historial: RegistroHistorico[] = []
  GRUPOS.forEach((grupo) => {
    const alumnos = MATRICULAS_INICIALES.filter(
      (m) => m.grupoLaboratorioId === grupo.id,
    )
    ;['2026-10-08', '2026-10-01', '2026-09-24'].forEach((fecha, fi) =>
      alumnos.forEach((m, i) => {
        const est = ESTUDIANTES.find((e) => e.id === m.estudianteId)!
        const movil = i === 3
        const duracionSeg = movil ? 0 : Math.max(0, 6840 - i * 520 - fi * 120)
        const porcentaje = porcentajeCertificable(
          duracionSeg,
          grupo.duracionSeg,
        )
        historial.push({
          id: `hist-${grupo.id}-${fecha}-${est.id}`,
          sesionId: `hist-${grupo.id}-${fecha}`,
          grupoId: grupo.id,
          fecha,
          estudianteId: est.id,
          nombre: est.nombre,
          upn: est.upn,
          codigo: est.codigo,
          equipos: movil
            ? 'Móvil (solo presencia)'
            : i === 2
              ? 'BYOD'
              : `LAB-${String(i + 1).padStart(3, '0')}`,
          duracionSeg,
          bloqueSeg: grupo.duracionSeg,
          porcentaje,
          certificada: porcentaje >= UMBRAL_DEMO,
        })
      }),
    )
  })
  return {
    matriculas: MATRICULAS_INICIALES.map((m) => ({ ...m })),
    sesiones,
    conexiones,
    historial,
  }
}
export function filasDelGrupo(
  state: DemoData,
  grupoId: string,
  ahora: number,
): FilaEstudiante[] {
  const sesion = state.sesiones[grupoId]
  return state.matriculas
    .filter(
      (m) => m.grupoLaboratorioId === grupoId && m.periodo === PERIODO_DEMO,
    )
    .flatMap((m) => {
      const estudiante = ESTUDIANTES.find((e) => e.id === m.estudianteId)
      if (!estudiante || !sesion) return []
      const todas = state.conexiones.filter(
        (c) => c.grupoId === grupoId && c.estudianteId === estudiante.id,
      )
      const conexiones = todas.filter((c) => c.fin === null)
      const intervalos = intervalosCertificables(todas, sesion, ahora)
      return [
        {
          ...estudiante,
          conexiones,
          activo: conexiones.length > 0,
          presenciaMovil: conexiones.some((c) => c.tipo === 'MOVIL'),
          segundosCertificables: segundosDeIntervalos(intervalos),
          intervalos,
        },
      ]
    })
}
export const useDemoStore = create<DemoStore>()(
  persist(
    (set, get) => ({
      ...crearDatosIniciales(),
      iniciarSesion: (grupoId) => {
        const state = get()
        const grupo = GRUPOS.find((g) => g.id === grupoId)
        if (!grupo) return 'Grupo no encontrado.'
        if (state.sesiones[grupoId].estado === 'en_curso')
          return 'La sesión ya está en curso.'
        if (
          GRUPOS.some(
            (g) =>
              g.id !== grupoId &&
              g.laboratorioId === grupo.laboratorioId &&
              state.sesiones[g.id].estado === 'en_curso',
          )
        )
          return 'Ya existe otra sesión en curso en este laboratorio.'
        set({
          sesiones: {
            ...state.sesiones,
            [grupoId]: {
              id: crypto.randomUUID(),
              grupoId,
              estado: 'en_curso',
              inicio: Date.now(),
              fin: null,
              duracionSeg: grupo.duracionSeg,
            },
          },
        })
        return null
      },
      finalizarSesion: (grupoId) => {
        const state = get()
        const sesion = state.sesiones[grupoId]
        if (sesion.estado !== 'en_curso') return
        const ahora = Date.now()
        const registros = filasDelGrupo(state, grupoId, ahora).map((f) => {
          const porcentaje = porcentajeCertificable(
            f.segundosCertificables,
            sesion.duracionSeg,
          )
          return {
            id: crypto.randomUUID(),
            sesionId: sesion.id,
            grupoId,
            fecha: new Date(ahora).toLocaleDateString('en-CA', {
              timeZone: 'America/Lima',
            }),
            estudianteId: f.id,
            nombre: f.nombre,
            upn: f.upn,
            codigo: f.codigo,
            equipos:
              [
                ...new Set(
                  state.conexiones
                    .filter(
                      (c) =>
                        c.grupoId === grupoId &&
                        c.estudianteId === f.id &&
                        c.inicio <= ahora &&
                        (c.fin ?? ahora) >= sesion.inicio!,
                    )
                    .map((c) =>
                      c.tipo === 'MOVIL' ? 'Móvil (solo presencia)' : c.equipo,
                    ),
                ),
              ].join(', ') || 'Sin conexión',
            duracionSeg: f.segundosCertificables,
            bloqueSeg: sesion.duracionSeg,
            porcentaje,
            certificada: porcentaje >= UMBRAL_DEMO,
          }
        })
        set({
          sesiones: {
            ...state.sesiones,
            [grupoId]: { ...sesion, estado: 'finalizada', fin: ahora },
          },
          historial: [...registros, ...state.historial],
        })
      },
      conectar: (grupoId, estudianteId, tipo) => {
        const state = get()
        if (
          !state.matriculas.some(
            (m) =>
              m.grupoLaboratorioId === grupoId &&
              m.estudianteId === estudianteId,
          )
        )
          return 'El estudiante no está matriculado en este grupo.'
        if (
          state.conexiones.some(
            (c) =>
              c.grupoId === grupoId &&
              c.estudianteId === estudianteId &&
              c.tipo === tipo &&
              c.fin === null,
          )
        )
          return 'Ese tipo de dispositivo ya está conectado para este estudiante.'
        const grupo = GRUPOS.find((g) => g.id === grupoId)!
        const ocupados = new Set(
          state.conexiones
            .filter(
              (c) =>
                c.fin === null &&
                c.tipo === 'LAB' &&
                GRUPOS.find((g) => g.id === c.grupoId)?.laboratorioId ===
                  grupo.laboratorioId,
            )
            .map((c) => c.equipo),
        )
        const equipoLibre = Array.from(
          { length: grupo.capacidad },
          (_, i) => `LAB-${String(i + 1).padStart(3, '0')}`,
        ).find((e) => !ocupados.has(e))
        if (tipo === 'LAB' && !equipoLibre)
          return 'No hay estaciones de laboratorio disponibles.'
        const equipo =
          tipo === 'LAB'
            ? equipoLibre!
            : tipo === 'BYOD'
              ? 'Laptop personal'
              : 'Teléfono'
        set({
          conexiones: [
            ...state.conexiones,
            {
              id: crypto.randomUUID(),
              estudianteId,
              grupoId,
              tipo,
              equipo,
              inicio: Date.now(),
              fin: null,
            },
          ],
        })
        return null
      },
      desconectar: (grupoId, estudianteId) =>
        set({
          conexiones: get().conexiones.map((c) =>
            c.grupoId === grupoId &&
            c.estudianteId === estudianteId &&
            c.fin === null
              ? { ...c, fin: Date.now() }
              : c,
          ),
        }),
    }),
    {
      name: 'satp-demo-academico-v1',
      version: 2,
      // Las matrículas pertenecen al origen académico, no al estado editable local.
      partialize: (state) => ({
        conexiones: state.conexiones,
        sesiones: state.sesiones,
        historial: state.historial,
      }),
      // Descartar los cambios académicos de las versiones anteriores del prototipo.
      migrate: () => {
        const inicial = crearDatosIniciales()
        return {
          conexiones: inicial.conexiones,
          sesiones: inicial.sesiones,
          historial: inicial.historial,
        }
      },
      merge: (persisted, current) => {
        const saved = persisted as Partial<DemoData> | undefined
        return {
          ...current,
          conexiones: saved?.conexiones ?? current.conexiones,
          sesiones: saved?.sesiones ?? current.sesiones,
          historial: saved?.historial ?? current.historial,
        }
      },
    },
  ),
)
