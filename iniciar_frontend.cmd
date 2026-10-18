@echo off
setlocal
cd /d "%~dp0satp-frontend"
where node >nul 2>nul
if errorlevel 1 (
  echo No se encontro Node.js. Se requiere Node.js 22.12 o superior.
  pause
  exit /b 1
)
node -e "const [a,b]=process.versions.node.split('.').map(Number);process.exit(a>22||(a===22&&b>=12)?0:1)"
if errorlevel 1 (
  echo Se requiere Node.js 22.12 o superior. Version instalada:
  node --version
  pause
  exit /b 1
)
if not exist "node_modules\vite\bin\vite.js" (
  echo Instalando las dependencias del frontend...
  call npm ci
  if errorlevel 1 (
    echo No se pudieron instalar las dependencias.
    pause
    exit /b 1
  )
)
echo.
echo SATP-Lab - Frontend de presentacion
echo Abre la direccion que indique Vite en esta ventana.
echo El login debe mostrar Iniciar sesion con Microsoft.
echo Para detener el programa, presiona Ctrl+C.
echo.
call npm run dev -- --host 127.0.0.1 --strictPort
if errorlevel 1 (
  echo.
  echo Si el puerto 5173 esta ocupado, detiene el servidor anterior con Ctrl+C.
  echo Luego vuelve a ejecutar este archivo.
  pause
)
endlocal
