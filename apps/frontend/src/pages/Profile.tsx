import LogoutButton from '@/components/utils/LogoutButton'
import { BASE_PATH } from '@/constants/routes'
import { useAppSelector } from '@/hooks/useAppSelector'
import { Navigate } from 'react-router-dom'

export default function Profile() {
  const { user } = useAppSelector((state) => state.auth)

  if (!user) return <Navigate to={BASE_PATH} replace />

  return (
    <div>
      <div>{JSON.stringify(user, null, 2)}</div>
      {user.isAdmin && <div>You are an admin</div>}
      <LogoutButton />
    </div>
  )
}
