import { createBrowserRouter, Navigate } from 'react-router-dom'
import LoginPage from '@/features/login/LoginPage'
import AppShell from '@/features/shell/AppShell'
import AulaSelectorPage from '@/features/aula-selector/AulaSelectorPage'
import DashboardPage from '@/features/dashboard/DashboardPage'
import MatriculaPage from '@/features/matricula/MatriculaPage'
import ProtectedRoute from '@/auth/ProtectedRoute'
export const router = createBrowserRouter([
  { path: '/', element: <LoginPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/app',
        element: <AppShell />,
        children: [
          { index: true, element: <Navigate to="/app/aulas" replace /> },
          { path: 'aulas', element: <AulaSelectorPage /> },
          { path: 'aulas/:aulaId', element: <DashboardPage /> },
          {
            element: <ProtectedRoute admin />,
            children: [{ path: 'matricula', element: <MatriculaPage /> }],
          },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
])
