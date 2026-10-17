export interface Estacion {
  id: string
  hostname: string
  mac: string
  ip: string
  tpm: boolean
  ultimoHeartbeat: number  // segundos desde el último ping
  estado: 'online' | 'offline'
}

function mk(i: number, activo: boolean): Estacion {
  const n = i.toString().padStart(3, '0')
  return {
    id: `LAB-${n}`,
    hostname: `LAB-L207-${n}`,
    mac: `AA:BB:CC:${n.slice(0,2)}:${n.slice(1,3)}:${(i*3%255).toString(16).padStart(2,'0').toUpperCase()}`,
    ip: `10.10.20.${10 + i}`,
    tpm: i % 5 !== 0,
    ultimoHeartbeat: activo ? Math.floor(Math.random() * 3) : 60 + i * 7,
    estado: activo ? 'online' : 'offline',
  }
}

export function getEstaciones(aulaId: string, activos: number): Estacion[] {
  const total = 16
  return Array.from({ length: total }, (_, i) => mk(i + 1, i < activos))
}
