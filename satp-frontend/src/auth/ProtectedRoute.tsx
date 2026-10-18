import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './useAuth'
export default function ProtectedRoute({ admin = false }: { admin?: boolean }) {
  const usuario = useAuth((s) => s.usuario)
  if (!usuario) return <Navigate to="/" replace />
  if (admin && usuario.rol !== 'administrador')
    return <Navigate to="/app/aulas" replace />
  return <Outlet />
}
