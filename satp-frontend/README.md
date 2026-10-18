# SATP-Lab · Frontend de demostración

React + TypeScript + Vite + Tailwind CSS. Esta entrega funciona de forma autónoma con un catálogo académico ficticio de solo consulta y datos de sesiones almacenados en el navegador. La integración con el backend Go y el origen académico está pendiente.

## Ejecutar

Desde esta carpeta, con Node.js 22.12 o superior:

```bash
npm ci
npm run dev
```

Abrir la dirección que indique Vite, normalmente `http://localhost:5173`.

```bash
npm run build
npm run lint
npm test
```

`npm run preview` sirve la compilación de producción después de ejecutar el build.

## Flujo de las pantallas

1. **Inicio de sesión:** el acceso principal muestra **Iniciar sesión con Microsoft**. Durante esta etapa el botón simula una sesión de docente, sin pedir ni validar credenciales. Para revisar otros perfiles, desplegar **Opciones de demostración** y elegir Docente o Administrador. El inicio de sesión real con Microsoft sigue pendiente de integración.
2. **Grupos de laboratorio:** buscar y filtrar por curso; cada tarjeta identifica curso, grupo práctico, laboratorio físico, horario y matriculados. Un laboratorio puede aparecer en varias tarjetas para diferentes grupos.
3. **En vivo:** una fila por estudiante, dispositivos simultáneos, estado y tiempo certificable. Los controles de conexión son una simulación explícita.
4. **Timeline:** intervalos de LAB/BYOD, con interrupciones y alumnos desconectados visibles.
5. **Historial:** filtro por fecha y resultado de demostración; exportación CSV. Los resúmenes de sesiones finalizadas se conservan.
6. **Equipos:** inventario ficticio del laboratorio físico, independiente de BYOD/móviles y del número de estudiantes.
7. **Matrícula (Administrador):** consultar las asignaciones recibidas del sistema académico, buscar por estudiante, código o correo, filtrar por curso/grupo y abrir la supervisión del grupo. SATP-Lab no crea, modifica ni retira matrículas.

El perfil Docente muestra únicamente sus grupos asignados en los datos de ejemplo. No hay una vista de estudiante. Las restricciones de rutas solo demuestran el comportamiento del frontend; la autorización real del servidor está pendiente.

## Modelo simulado

- `Curso`: asignatura, código y horas de teoría/práctica.
- `SeccionTeoria`: sección asociada a la teoría de un curso.
- `Laboratorio`: espacio físico, pabellón y capacidad.
- `GrupoLaboratorio`: grupo práctico asociado a curso, laboratorio, horario y docente.
- `Matricula`: estudiante + curso + periodo, con sección de teoría y grupo práctico independientes.

Ejemplo de laboratorio: **Computación en Red III · Grupo 01 · Laboratorio L-207**. La sección de teoría no se usa para nombrar ni identificar un laboratorio. Estas entidades organizan los datos de prueba; no son un esquema definitivo de base de datos.

## Pruebas rápidas

### Comprobar la matrícula

1. En el login, desplegar **Opciones de demostración**, entrar como Administrador y abrir Matrícula.
2. Comprobar el indicador **Solo consulta** y el aviso sobre el origen académico.
3. Filtrar por curso y grupo práctico y buscar un estudiante por su código.
4. Revisar por separado las columnas Teoría, Grupo práctico y Laboratorio.
5. Abrir el grupo desde el enlace de la tabla y comprobar que aparece el estudiante en la supervisión.
6. Volver a Matrícula y recargar: el catálogo conserva sus 28 asignaciones de ejemplo.

Las altas, los cambios de sección o grupo y los retiros corresponden al sistema académico. El frontend muestra un catálogo precargado para demostrar la consulta; todavía no obtiene registros de una base de datos. El filtro de asignaciones pendientes permite consultar ese estado cuando exista en el origen, sin asignar el grupo desde SATP-Lab.

### Comprobar las sesiones y los dispositivos

1. En vivo permite iniciar/finalizar una sesión ficticia.
2. Simular conexiones LAB, BYOD o móvil para los estudiantes matriculados.
3. LAB + BYOD simultáneos cuentan una sola vez; el móvil no suma tiempo certificable.
4. Desconectar y volver a conectar conserva los intervalos previos.
5. Finalizar la sesión congela el tiempo y crea un resumen en Historial.

El umbral del 75% sobre el bloque programado es **provisional y exclusivo de la demostración**. La política institucional, las extensiones de horario, QR y la evidencia real de presencia están pendientes de definición e integración.

## Datos de la demostración

Las sesiones, conexiones e historial de prueba se conservan en el navegador. La matrícula no se persiste como dato editable local y las modificaciones de versiones anteriores se descartan al migrar. Para iniciar de nuevo una presentación se pueden borrar los datos del sitio desde las herramientas del navegador. Los datos de prueba no se comparten entre navegadores.

## Archivos principales

- `src/domain/academico.ts`: tipos académicos y unión de intervalos.
- `src/mocks/academico.ts`: catálogo académico ficticio.
- `src/stores/demoStore.ts`: consulta del catálogo de matrícula y estado persistente de sesiones y conexiones.
- `src/features/matricula/MatriculaPage.tsx`: consulta de matrícula con filtros y enlaces a los grupos.
- `src/features/dashboard/`: vistas del grupo práctico.

Los endpoints REST, WebSockets reales, MSAL y base de datos se abordarán en una etapa posterior.
