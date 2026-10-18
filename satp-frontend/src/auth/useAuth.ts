import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Rol, UsuarioDemo } from '@/domain/academico'
import { USUARIOS_DEMO } from '@/mocks/academico'
interface AuthState {
  usuario: UsuarioDemo | null
  entrar: (rol: Rol) => void
  salir: () => void
}
// Solo demuestra flujos del frontend; no constituye autenticación ni autorización de servidor.
export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      usuario: null,
      entrar: (rol) => set({ usuario: USUARIOS_DEMO[rol] }),
      salir: () => set({ usuario: null }),
    }),
    { name: 'satp-demo-usuario-v1' },
  ),
)
