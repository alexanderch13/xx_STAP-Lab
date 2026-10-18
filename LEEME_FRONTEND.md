# Frontend de la presentación de SATP-Lab

Esta entrega contiene la aplicación React y el informe que documenta sus interfaces. La base de datos, el servidor Go y el agente se mantienen para una etapa posterior de integración.

## Abrir la versión correcta en Windows

1. Descomprime el ZIP completo en una carpeta nueva. Evita mezclarlo con archivos generados de versiones anteriores.
2. Detén cualquier servidor anterior con **Ctrl+C** en su terminal.
3. Ejecuta **iniciar_frontend.cmd** desde la carpeta principal. Requiere Node.js 22.12 o superior e instala las dependencias si faltan.
4. Abre la dirección que indique Vite, normalmente **http://127.0.0.1:5173**.
5. La pantalla correcta muestra **Acceso institucional** e **Iniciar sesión con Microsoft**. **Opciones de demostración** aparece cerrado debajo del botón.

También puedes ejecutar estos comandos desde `satp-frontend`:

```bash
npm ci
npm run dev
```

Esta aplicación usa React y Vite. El comando `uv run reflex run` no inicia este frontend. El panel del servidor Go en el puerto 8000 es otra interfaz y no corresponde a las capturas del informe de esta entrega.

## Recorrido de la demostración

- **Docente:** el botón de Microsoft simula su ingreso. Ve sus grupos asignados, En vivo, Timeline, Historial y Equipos.
- **Administrador:** despliega Opciones de demostración, elige Administrador y entra. Además de supervisar todos los grupos, puede consultar la matrícula académica, buscar estudiantes y filtrar por curso o grupo. No crea, edita ni retira matrículas.
- **Estudiante:** aparece en las listas de los grupos. No tiene un panel de usuario implementado.

La sección pertenece a la teoría del curso. La práctica se identifica mediante su grupo de laboratorio. El laboratorio físico puede alojar grupos distintos en horarios diferentes.

El acceso de Microsoft aún es simulado. Las conexiones, matrículas e inventario son datos de prueba. La matrícula se representa mediante un catálogo académico precargado de solo consulta; la conexión a su origen institucional se abordará con el backend. El móvil solo registra presencia; LAB y BYOD aportan tiempo sin duplicar intervalos simultáneos. El 75 % de Historial es un criterio provisional de demostración.

## Documentación y comprobaciones

El informe y las capturas de la misma versión se encuentran en `documentacion`. El archivo de validación indica los flujos revisados y las limitaciones que se conservan.

Desde `satp-frontend` se pueden repetir las comprobaciones incluidas en el proyecto:

```bash
npm run build
npm run lint
npm test
```

Las sesiones, conexiones e historial de la demostración se guardan en el navegador. Las matrículas no se guardan como registros editables locales. La versión actual descarta las matrículas modificadas con versiones anteriores del prototipo y muestra el catálogo académico de ejemplo. Para repetir una presentación desde cero se pueden borrar los datos del sitio en las herramientas del navegador.
