import assert from 'node:assert/strict'
import { test } from 'node:test'
import { readFileSync } from 'node:fs'
import ts from 'typescript'
const source = readFileSync(
  new URL('../src/domain/academico.ts', import.meta.url),
  'utf8',
)
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    target: ts.ScriptTarget.ES2023,
    module: ts.ModuleKind.ESNext,
  },
}).outputText
const {
  intervalosCertificables,
  segundosDeIntervalos,
  porcentajeCertificable,
} = await import(
  `data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`
)

const sesion = {
  id: 's',
  grupoId: 'g',
  estado: 'en_curso',
  inicio: 0,
  fin: null,
  duracionSeg: 7200,
}
const conexion = (tipo, inicio, fin) => ({
  id: `${tipo}-${inicio}`,
  estudianteId: 'e',
  grupoId: 'g',
  equipo: 'equipo',
  tipo,
  inicio,
  fin,
})
test('LAB y BYOD simultáneos cuentan una vez; el móvil no amplía el intervalo', () => {
  const resultado = intervalosCertificables(
    [
      conexion('LAB', 0, 1_800_000),
      conexion('BYOD', 900_000, 2_700_000),
      conexion('MOVIL', 0, 3_600_000),
    ],
    sesion,
    3_600_000,
  )
  assert.equal(segundosDeIntervalos(resultado), 2700)
})
test('un móvil conectado durante dos horas no obtiene tiempo certificable', () => {
  const intervalos = intervalosCertificables(
    [conexion('MOVIL', 0, null)],
    sesion,
    7_200_000,
  )
  assert.equal(segundosDeIntervalos(intervalos), 0)
  assert.equal(
    porcentajeCertificable(segundosDeIntervalos(intervalos), 7200),
    0,
  )
})
test('las interrupciones permanecen separadas en el timeline', () => {
  const resultado = intervalosCertificables(
    [conexion('LAB', 0, 600_000), conexion('LAB', 1_200_000, 1_800_000)],
    sesion,
    1_800_000,
  )
  assert.equal(resultado.length, 2)
  assert.equal(segundosDeIntervalos(resultado), 1200)
})
test('solo cuenta el intervalo dentro del inicio y fin reales de la sesión', () => {
  const resultado = intervalosCertificables(
    [conexion('LAB', 0, null)],
    { ...sesion, inicio: 600_000, fin: 1_200_000 },
    1_800_000,
  )
  assert.equal(segundosDeIntervalos(resultado), 600)
})
test('no se acumula tiempo antes de iniciar una clase', () => {
  assert.deepEqual(
    intervalosCertificables(
      [conexion('LAB', 0, null)],
      { ...sesion, inicio: null, estado: 'programada' },
      1000,
    ),
    [],
  )
})
