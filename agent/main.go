package main

import (
	"encoding/json"
	"flag"
	"log"
	"os"
	"os/exec"
	"os/signal"
	"strings"
	"syscall"
	"time"

	"github.com/gorilla/websocket"
)

type Handshake struct {
	DeviceID string `json:"device_id"`
	UPN      string `json:"upn"`
}

// Obtener el usuario institucional de Windows
func getInstitutionalUser() string {
	// whoami /upn obtiene el correo del usuario logueado en Windows
	cmd := exec.Command("whoami", "/upn")
	output, err := cmd.Output()
	if err == nil {
		upn := strings.TrimSpace(strings.ToLower(string(output)))
		if upn != "" {
			return upn
		}
	}
	// Fallback para pruebas locales en Linux/Mac
	user := os.Getenv("USER")
	if user == "" {
		user = "estudiante_lab"
	}
	return user + "@ucsm.edu.pe"
}

func main() {
	serverAddr := flag.String("server", "localhost:8000", "Dirección IP:Puerto del servidor SATP")
	flag.Parse()

	url := "ws://" + *serverAddr + "/ws/agent"
	log.Printf("[AGENTE] Conectando a %s...\n", url)

	conn, _, err := websocket.DefaultDialer.Dial(url, nil)
	if err != nil {
		log.Fatalf("[ERROR] No se pudo conectar al servidor: %v", err)
	}
	defer conn.Close()

	// Configurar receptor de Ping nativo
	conn.SetPingHandler(func(appData string) error {
		return conn.WriteControl(websocket.PongMessage, []byte(appData), time.Now().Add(2*time.Second))
	})

	hostname, _ := os.Hostname()
	upn := getInstitutionalUser()

	// 1. Enviar Handshake inicial
	initPayload, _ := json.Marshal(Handshake{
		DeviceID: hostname,
		UPN:      upn,
	})

	if err := conn.WriteMessage(websocket.TextMessage, initPayload); err != nil {
		log.Fatalf("[ERROR] Fallo al enviar handshake: %v", err)
	}
	log.Printf("[CONECTADO] Identidad: %s en %s\n", upn, hostname)

	// Capturar eventos de terminación del SO (Ctrl+C, Logoff, SIGTERM)
	interrupt := make(chan os.Signal, 1)
	signal.Notify(interrupt, os.Interrupt, syscall.SIGTERM)

	// Goroutine para leer el socket
	done := make(chan struct{})
	go func() {
		defer close(done)
		for {
			_, _, err := conn.ReadMessage()
			if err != nil {
				log.Println("[INFO] Conexión cerrada por el servidor.")
				return
			}
		}
	}()

	select {
	case <-interrupt:
		log.Println("[CIERRE] Interrupción detectada. Emitiendo paquete TCP FIN...")
		// Enviar frame de cierre formal
		_ = conn.WriteMessage(websocket.CloseMessage, websocket.FormatCloseMessage(websocket.CloseNormalClosure, "Logoff"))
		time.Sleep(100 * time.Millisecond)
	case <-done:
		log.Println("[INFO] Socket finalizado.")
	}
}
