# Validación del frontend presentado

Fecha de revisión: 18 de octubre de 2026.

La entrega incluye el frontend de demostración y el informe elaborado con el formato de dossier proporcionado. La base de datos, el servidor y el agente conservan los archivos del proyecto original.

## Comprobaciones realizadas

| Revisión | Resultado |
| --- | --- |
| Compilación de producción con `npm run build` | Correcta |
| Revisión estática con `npm run lint` | Correcta |
| Pruebas de intervalos con `npm test` | 5 pruebas aprobadas |
| Comprobaciones de flujo en Chromium | 25 comprobaciones aprobadas |
| Evidencias visuales | 19 figuras de la aplicación ejecutada |
| Informe de Word | 25 páginas revisadas visualmente |

La revisión del navegador incluyó los perfiles Docente y Administrador, los grupos permitidos, los estados de las sesiones, las conexiones simuladas, los filtros, la descarga CSV, la persistencia de sesiones, la consulta de matrícula, las confirmaciones y el menú en una ventana de 390 píxeles de ancho. Se comprobó que la consulta no ofrece altas, edición ni retiros y que se descartan las matrículas modificadas con versiones anteriores del prototipo.

Las capturas se obtuvieron de la misma versión del código incluida en esta entrega. Los archivos de la carpeta `capturas` conservan las pantallas completas; los diálogos tienen además una imagen de detalle para facilitar su lectura en el informe. `capturas/indice.json` relaciona las figuras con sus archivos.

## Alcance de la demostración

- El botón **Iniciar sesión con Microsoft** se muestra como acceso principal y abre un perfil docente simulado. No solicita ni valida credenciales.
- **Opciones de demostración** permite revisar los perfiles Docente y Administrador.
- La sección de teoría, el grupo de laboratorio y el laboratorio físico se muestran como elementos diferentes.
- La matrícula se consulta desde un catálogo académico ficticio precargado y no se persiste como dato editable del navegador. Las sesiones, conexiones e historial de prueba sí se guardan localmente.
- Las altas, modificaciones y retiros de matrícula corresponden al sistema académico. SATP-Lab consulta estas asignaciones para formar las listas de supervisión.
- La autenticación de Microsoft, la autorización en el servidor, la base de datos y las conexiones reales del agente quedan pendientes de integración.
- El umbral del 75 % en el historial es provisional para la demostración.

El iniciador `iniciar_frontend.cmd` y la guía `LEEME_FRONTEND.md` permiten preparar la ejecución en Windows. La revisión automatizada del frontend se realizó en el entorno de pruebas; el iniciador no se ejecutó en un equipo Windows durante esta revisión.
