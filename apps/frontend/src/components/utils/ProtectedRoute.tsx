import { Navigate, useLocation } from 'react-router-dom'
import { useAppSelector } from '../../hooks/useAppSelector'
import type { JSX } from 'react'
import { LOGIN_PATH } from '@/constants/routes'

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const user = useAppSelector((state) => state.auth.user)
  const location = useLocation()

  if (!user) {
    return <Navigate to={LOGIN_PATH + '?redirect=' + location.pathname} state={{ from: location }} replace />
  }

  return children
}
