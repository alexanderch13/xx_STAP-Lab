---
title: "SATP-Lab: Telemetry Core Engine & Protocolo de Red"
date: 2026-10-05
tags:
  - redes-3
  - golang
  - websockets
  - tcp-ip
  - telemetria
  - ucsm
  - trl4
status: "TRL-4 (Validado en Entorno Local)"
author: "Chipana Flores, Alexander Tomas | Kana Zambrano, Luz Clarita | Montenegro Gonzales, Orlando Jose"
---

# SATP-Lab: Sistema Ciberfísico de Telemetría y Certificación de Trabajo Activo en Laboratorios

> [!ABSTRACT] Resumen Ejecutivo
> Plataforma distribuida de telemetría de red y auditoría continua diseñada para la **certificación determinística de presencia y trabajo efectivo** en estaciones de cómputo universitarias. Sustituye los esquemas convencionales de pase de lista analógico o formularios web por un modelo autónomo de bajo nivel basado en binarios monolíticos en **Go** y tramas de control **RFC 6455**, garantizando latencia sub-milisegundo y cero sobrecarga de red.

---

> [!INFO] Metadatos Académicos e Institucionales
> - **Institución:** Universidad Católica de Santa María (UCSM)
> - **Facultad:** Facultad de Ciencias e Ingenierías Físicas y Formales
> - **Escuela Profesional:** Ingeniería de Sistemas (EPIS)
> - **Asignatura:** Computación en Red III — Sección B
> - **Integrantes:**
>   - Chipana Flores, Alexander Tomas
>   - Kana Zambrano, Luz Clarita
>   - Montenegro Gonzales, Orlando Jose
> - **Docente Evaluador:** `jangulo@ucsm.edu.pe`
> - **Versión:** `v1.0.0-rc1` | **Estado:** TRL 4 (Laboratorio Validado)

---

## 1. Arquitectura de Telemetría (Fase 1: Núcleo en Memoria RAM)

```mermaid
flowchart TD
    subgraph CLIENTES[" Terminales de Laboratorio "]
        A1["Laptop Win11 / Linux<br/><b>satp-agent daemon</b>"]
    end

    subgraph BACKEND[" Servidor Concentrador Go (RAM Hub) "]
        B1["Gorilla WebSocket Upgrader<br/><b>/ws/agent</b>"]
        B2[("RAM State Hub<br/>sync.RWMutex")]
        B3["Event Broadcaster<br/><b>/ws/dashboard</b>"]
    end

    subgraph MONITOR[" Visualización Docente "]
        C1["Dashboard Reactivo Local<br/><b>HTTP /ws/dashboard</b>"]
    end

    A1 -- "1. Handshake TCP / UPN<br/>2. Ping/Pong RFC 6455 (3s)" --> B1
    B1 --> B2
    B2 --> B3
    B3 -- "Snapshot & Diff Events<br/>(Latencia < 50ms)" --> C1

    classDef client fill:#ffe6cc,stroke:#d79b00,stroke-width:2px,color:#000;
    classDef server fill:#d5e8d4,stroke:#82b366,stroke-width:2px,color:#000;
    classDef dash fill:#dae8fc,stroke:#6c8ebf,stroke-width:2px,color:#000;

    class A1 client;
    class B1,B2,B3 server;
    class C1 dash;

2. Auditoría Forense de Red y Métricas Empíricas

    [!SUCCESS] Validación de Red Exitosa
    Se auditó el comportamiento del protocolo en capa de transporte e inspección hexadecimal mediante tcpdump y Wireshark en interfaz loopback IPv6 (::1), obteniendo métricas que superan los requerimientos de diseño:

Parámetro Evaluado	Especificación Teórica	Medición Real en Cable	Método de Verificación
Establecimiento TCP	<100 ms	53 μs	3-Way Handshake ([S], [S.], [.])
Negociación L7	HTTP Upgrade a RFC 6455	129 bytes	HTTP/1.1 101 Switching Protocols
Carga de Ping (Keep-Alive)	<50 bytes	21 bytes	Opcode 0x09 + UnixNano Payload
Carga de Pong (Heartbeat)	<50 bytes	25 bytes	Opcode 0x0A + 4B Client Mask
Consumo de Ancho de Banda	<1.0 KB/s	≈0.023 KB/s	46 B transmitidos cada 3 segundos
Latencia RTT Promedio	<15 ms	0.32 ms−0.51 ms	Marca de tiempo embebida en frame
Detección de Caída / Logoff	<200 ms	<50 ms	Paquetes TCP FIN / syscall.SIGTERM

    [!NOTE] Cómputo de Ancho de Banda Sostenido
    Traˊfico=3 s21 B (Ping)+25 B (Pong)​=15.33 Bytes/segundo≈0.015 KB/s

    En una hora completa de sesión práctica ininterrumpida, una estación de cómputo consume únicamente ≈55.2 KB, lo que representa un impacto nulo sobre el ancho de banda del laboratorio.

3. Estructura del Repositorio
Plaintext

xx_STAP-Lab/
├── agent/                      # Demonio cliente en Go (Multiplataforma)
│   ├── go.mod                  # Módulo satp-agent
│   ├── go.sum                  # Checksums gorilla/websocket
│   ├── main.go                 # Telemetría de bajo nivel y Keep-Alive
│   └── satp-agent.exe          # Binario compilado para Windows 11 (amd64)
├── backend/                    # Servidor concentrador de sockets (Go)
│   ├── go.mod                  # Módulo satp-backend
│   ├── go.sum                  # Dependencias del servidor
│   └── main.go                 # Hub en RAM, WebSockets y Dashboard embebido
├── database/                   # Modelado relacional (En espera de validación)
│   └── init.sql                # DDL para usuarios, sesiones y auditoría
├── docker-compose.yml          # Orquestación de contenedores auxiliares
├── .gitignore                  # Filtro de binarios, temporales y credenciales
└── README.md                   # Documentación principal del proyecto

4. Guía de Ejecución y Pruebas Locales
Paso 1: Levantar el Backend Concentrador

En una primera terminal, arranque el servidor en Go:
Bash

cd backend
go run main.go

    [!TIP] Salida Esperada:
    Plaintext

    2026/10/05 10:35:46 [SERVIDOR GO] SATP-Lab Telemetry Core iniciado en :8000
    2026/10/05 10:35:46 [INFO] Abre http://localhost:8000/dashboard en tu navegador

Acceda con su navegador a: http://localhost:8000/dashboard para visualizar el panel reactivo.
Paso 2: Conectar el Agente de Telemetría

En una segunda terminal, ejecute el agente cliente en Linux:
Bash

cd agent
go run .

    [!TIP] Salida Esperada:
    Plaintext

    2026/10/05 10:35:54 [AGENTE] Conectando a ws://localhost:8000/ws/agent...
    2026/10/05 10:35:54 [CONECTADO] Identidad: dyth@ucsm.edu.pe en dyth

    En el dashboard web la estación pasará inmediatamente a color VERDE (ONLINE).

Paso 3: Compilación Cruzada para Windows 11 (VMware / Laptops)

Genere el binario autónomo para las estaciones Windows sin dependencias externas:
Bash

cd agent
GOOS=windows GOARCH=amd64 go build -ldflags="-s -w" -o satp-agent.exe .

Copie satp-agent.exe a la máquina virtual con Windows 11 en VMware y ejecútelo desde PowerShell:
PowerShell

.\satp-agent.exe -server=192.168.1.XX:8000

5. Inspección de Paquetes en Vivo (Kali Linux)

Para auditar el paso de las tramas de control WebSocket con tcpdump:
Bash

sudo tcpdump -i lo -nn -XX "tcp port 8000"

    [!WARNING] Criterio de Acreditación Práctica
    La desconexión intencional o cierre de sesión de Windows (Ctrl + C, Logoff o Shutdown) emite un paquete TCP FIN que el backend atrapa en menos de 50 ms, cambiando el estado de la estación a ROJO (OFFLINE) y deteniendo la acumulación de minutos válidos para el umbral mínimo del 75%.
