export type Tipo = 'LAB' | 'BYOD' | 'MOVIL'

export interface Estudiante {
  upn: string
  codigo: string
  nombre: string
  estacion: string | null
  tipo: Tipo | null
  activo: boolean
  segundosConectado: number
}

export interface AulaData {
  id: string
  pabellon: string
  nombre: string
  curso: string
  seccion: string
  horario: string
  matriculados: number
  activos: number
  estudiantes: Estudiante[]
}

/* ============================================================
   Helpers para generar estudiantes mock rápido
   ============================================================ */
function est(
  upn: string,
  codigo: string,
  nombre: string,
  estacion: string | null,
  tipo: Tipo | null,
  activo: boolean,
  segundos = 0,
): Estudiante {
  return { upn, codigo, nombre, estacion, tipo, activo, segundosConectado: segundos }
}

/* ============================================================
   Datos por aula
   ============================================================ */

const L207: AulaData = {
  id: 'L-207',
  pabellon: 'L',
  nombre: 'Laboratorio L-207',
  curso: 'Computación en Red III',
  seccion: 'B',
  horario: 'Lunes · 17:00 – 19:00',
  matriculados: 10,
  activos: 6,
  estudiantes: [
    est('jperez@ucsm.edu.pe',  '20231234', 'Juan Pérez Quispe',    'LAB-014', 'LAB',   true, 2533),
    est('mlopez@ucsm.edu.pe',  '20231198', 'María López Ramos',    'LAB-022', 'LAB',   true, 2282),
    est('cgarcia@ucsm.edu.pe', '20231077', 'Carlos García Núñez',  'BYOD',    'BYOD',  true, 1904),
    est('atorres@ucsm.edu.pe', '20231301', 'Ana Torres Valdivia',  'MÓVIL',   'MOVIL', true, 1720),
    est('rluna@ucsm.edu.pe',   '20231045', 'Roberto Luna Chávez',  'LAB-008', 'LAB',   true, 1450),
    est('svargas@ucsm.edu.pe', '20231276', 'Sofía Vargas Paredes', 'LAB-017', 'LAB',   true, 1201),
    est('dmamani@ucsm.edu.pe', '20231120', 'Diego Mamani Flores',  null,      null,    false),
    est('lchoque@ucsm.edu.pe', '20231432', 'Lucía Choque Huanca',  null,      null,    false),
    est('fmedina@ucsm.edu.pe', '20231389', 'Fernando Medina Ríos', null,      null,    false),
    est('pcastro@ucsm.edu.pe', '20231670', 'Patricia Castro León', null,      null,    false),
  ],
}

const L204: AulaData = {
  id: 'L-204',
  pabellon: 'L',
  nombre: 'Laboratorio L-204',
  curso: 'Gestión de Datos e Información',
  seccion: 'A',
  horario: 'Miércoles · 19:00 – 21:00',
  matriculados: 8,
  activos: 3,
  estudiantes: [
    est('rhuaman@ucsm.edu.pe', '20232011', 'Rosa Huamán Ttito',    'LAB-003', 'LAB',   true, 3210),
    est('jquispe@ucsm.edu.pe', '20232055', 'Jorge Quispe Apaza',   'LAB-009', 'LAB',   true, 2870),
    est('lnina@ucsm.edu.pe',   '20232102', 'Lucía Niña Ccama',     'BYOD',    'BYOD',  true, 1540),
    est('mflores@ucsm.edu.pe', '20232214', 'Marco Flores Sullo',   null,      null,    false),
    est('acondori@ucsm.edu.pe','20232088', 'Ana Condori Mamani',   null,      null,    false),
    est('pccopa@ucsm.edu.pe',  '20232301', 'Pedro Ccopa Villca',   null,      null,    false),
    est('srojas@ucsm.edu.pe',  '20232145', 'Sara Rojas Yupanqui',  null,      null,    false),
    est('ecalsina@ucsm.edu.pe','20232276', 'Elena Calsina Turpo',  null,      null,    false),
  ],
}

const A410: AulaData = {
  id: 'A-410',
  pabellon: 'A',
  nombre: 'Laboratorio A-410',
  curso: 'Algoritmos y Estructuras de Datos',
  seccion: 'B',
  horario: 'Viernes · 15:00 – 17:00',
  matriculados: 6,
  activos: 0,
  estudiantes: [
    est('bgomez@ucsm.edu.pe',  '20233001', 'Bruno Gómez Salas',    null, null, false),
    est('cramos@ucsm.edu.pe',  '20233012', 'Carla Ramos Herrera',  null, null, false),
    est('dzevallos@ucsm.edu.pe','20233034','Diego Zevallos Puma',  null, null, false),
    est('fvilca@ucsm.edu.pe',  '20233056', 'Fiorella Vilca Soto',  null, null, false),
    est('gparedes@ucsm.edu.pe','20233078', 'Gabriel Paredes Llerena', null, null, false),
    est('hchura@ucsm.edu.pe',  '20233090', 'Héctor Chura Zapana',  null, null, false),
  ],
}

/* ============================================================
   Índice por aulaId
   ============================================================ */
export const AULAS: Record<string, AulaData> = {
  'L-207': L207,
  'L-204': L204,
  'A-410': A410,
}

export const AULAS_LIST = Object.values(AULAS)

export function getAula(id?: string): AulaData | null {
  if (!id) return null
  return AULAS[id] ?? null
}

/* Retro-compatibilidad (por si algo importa MOCK_ESTUDIANTES) */
export const MOCK_ESTUDIANTES = L207.estudiantes
