import { LOGOUT_MUTATION } from '@/graphql/auth'
import { useMutation } from '@apollo/client/react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '../ui/button'
import { LogOut } from 'lucide-react'
import { BASE_PATH } from '@/constants/routes'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { clearUser } from '@/store/authSlice'

export default function LogoutButton() {
  const [logoutMutation, { error }] = useMutation(LOGOUT_MUTATION)

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logoutMutation()
    dispatch(clearUser())
    navigate(BASE_PATH, { replace: true })
  }

  useEffect(() => {
    if (error) toast.error(error.message)
  }, [error])

  return (
    <Button variant="default" onClick={handleLogout} data-cy="logout">
      <LogOut /> Sign Out
    </Button>
  )
}
