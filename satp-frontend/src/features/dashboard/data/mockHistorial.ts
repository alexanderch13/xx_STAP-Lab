export interface SesionHistorica {
  id: string
  fecha: string           // ISO date
  upn: string
  nombre: string
  codigo: string
  estacion: string
  tipo: 'LAB' | 'BYOD' | 'MOVIL'
  duracionSeg: number
  porcentaje: number      // 0–100 respecto a la duración total del bloque
  certificada: boolean
}

const BASE: Omit<SesionHistorica, 'id' | 'fecha'>[] = [
  { upn: 'jperez@ucsm.edu.pe',  nombre: 'Juan Pérez Quispe',     codigo: '20231234', estacion: 'LAB-014', tipo: 'LAB',   duracionSeg: 6840, porcentaje: 95, certificada: true },
  { upn: 'mlopez@ucsm.edu.pe',  nombre: 'María López Ramos',     codigo: '20231198', estacion: 'LAB-022', tipo: 'LAB',   duracionSeg: 6120, porcentaje: 85, certificada: true },
  { upn: 'cgarcia@ucsm.edu.pe', nombre: 'Carlos García Núñez',   codigo: '20231077', estacion: 'BYOD',    tipo: 'BYOD',  duracionSeg: 4680, porcentaje: 65, certificada: false },
  { upn: 'atorres@ucsm.edu.pe', nombre: 'Ana Torres Valdivia',   codigo: '20231301', estacion: 'MÓVIL',   tipo: 'MOVIL', duracionSeg: 5400, porcentaje: 75, certificada: true },
  { upn: 'rluna@ucsm.edu.pe',   nombre: 'Roberto Luna Chávez',   codigo: '20231045', estacion: 'LAB-008', tipo: 'LAB',   duracionSeg: 7200, porcentaje: 100, certificada: true },
  { upn: 'svargas@ucsm.edu.pe', nombre: 'Sofía Vargas Paredes',  codigo: '20231276', estacion: 'LAB-017', tipo: 'LAB',   duracionSeg: 3960, porcentaje: 55, certificada: false },
  { upn: 'dmamani@ucsm.edu.pe', nombre: 'Diego Mamani Flores',   codigo: '20231120', estacion: 'LAB-005', tipo: 'LAB',   duracionSeg: 1800, porcentaje: 25, certificada: false },
]

const FECHAS = [
  '2026-10-08',
  '2026-10-01',
  '2026-09-24',
]

export function getHistorial(aulaId: string): SesionHistorica[] {
  const out: SesionHistorica[] = []
  FECHAS.forEach((fecha, fi) => {
    // Variamos un poco según el aula para que no sea idéntico
    const offset = aulaId.charCodeAt(0) % 3
    BASE.forEach((b, i) => {
      if ((i + fi + offset) % 4 === 0) return // algunos faltaron
      out.push({
        ...b,
        id: `${aulaId}-${fecha}-${b.upn}`,
        fecha,
        // Pequeña variación de duración por fecha
        duracionSeg: b.duracionSeg - fi * 120,
        porcentaje: Math.max(0, b.porcentaje - fi * 5),
        certificada: b.porcentaje - fi * 5 >= 75,
      })
    })
  })
  return out.sort((a, b) => (a.fecha < b.fecha ? 1 : -1))
}
