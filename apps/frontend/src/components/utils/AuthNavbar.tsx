import { useAppSelector } from '@/hooks/useAppSelector'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { Link, useNavigate } from 'react-router-dom'
import { BASE_PATH, PROFILE_PATH } from '@/constants/routes'
import { LogOut, Settings, User } from 'lucide-react'
import { toast } from 'sonner'
import { useEffect } from 'react'
import { clearUser } from '@/store/authSlice'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { useMutation } from '@apollo/client/react'
import { LOGOUT_MUTATION } from '@/graphql/auth'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

export default function AuthNavbar() {
  const { user } = useAppSelector((state) => state.auth)
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

  if (!user) return <></>

  return (
    <div className="sticky left-0 right-0 top-0 z-50 flex flex-row items-center justify-between border-b border-black/10 bg-neutral-100/90 px-4 py-2 backdrop-blur-md">
      <div>
        <div className="text-xl font-bold">Only Geeks</div>
      </div>
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger data-cy="dropdown-menu">
            <Avatar>
              <AvatarImage src={user.picture} alt="avatar" />
              <AvatarFallback className="bg-blue-300">
                {user.firstName[0].toUpperCase()}
                {user.lastName[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>
              {user.firstName} {user.lastName}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link to={PROFILE_PATH}>
              <DropdownMenuItem>
                <User /> Profile
              </DropdownMenuItem>
            </Link>
            <DropdownMenuItem>
              <Settings /> Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout} data-cy="logout">
              <LogOut /> Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
