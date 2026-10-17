import { createBrowserRouter, Navigate } from 'react-router-dom'
import LoginPage from '@/features/login/LoginPage'
import AppShell from '@/features/shell/AppShell'
import AulaSelectorPage from '@/features/aula-selector/AulaSelectorPage'
import DashboardPage from '@/features/dashboard/DashboardPage'

export const router = createBrowserRouter([
  { path: '/', element: <LoginPage /> },
  {
    path: '/app',
    element: <AppShell />,
    children: [
      { index: true, element: <Navigate to="/app/aulas" replace /> },
      { path: 'aulas', element: <AulaSelectorPage /> },
      { path: 'aulas/:aulaId', element: <DashboardPage /> },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
])
