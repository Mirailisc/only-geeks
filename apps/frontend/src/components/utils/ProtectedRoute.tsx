import { Navigate, useLocation } from 'react-router-dom'
import { useAppSelector } from '../../hooks/useAppSelector'
import type { JSX } from 'react'
import { BASE_PATH } from '@/constants/routes'

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const user = useAppSelector((state) => state.auth.user)
  const location = useLocation()

  if (!user) {
    return <Navigate to={BASE_PATH} state={{ from: location }} replace />
  }

  return children
}
