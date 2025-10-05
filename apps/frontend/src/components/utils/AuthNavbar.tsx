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
import { BASE_PATH, PROFILE_PATH, SETTINGS_PATH } from '@/constants/routes'
import { CodeIcon, FileTextIcon, LogOut, PlusIcon, Settings, User } from 'lucide-react'
import { toast } from 'sonner'
import { useEffect } from 'react'
import { clearUser } from '@/store/authSlice'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { useMutation } from '@apollo/client/react'
import { LOGOUT_MUTATION } from '@/graphql/auth'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import SearchBox from './searchBox'
import { Button } from '../ui/button'

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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center mx-auto justify-between px-4">
        <div className="flex items-center gap-2 flex-row">
          <div className='w-10 aspect-square bg-primary text-white rounded-lg flex flex-row justify-center items-center font-bold'>OG</div>
          <h1 className="text-xl font-bold">Only Geeks</h1>
        </div>

        <SearchBox />

        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild data-cy="create-dropdown-menu" className="focus:outline-none mr-4">
              <Button variant={"outline"} className='rounded-full px-0 mx-0 w-10 h-10 p-0 justify-center'>
                <PlusIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Create New</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link to="/create/blog">
                <DropdownMenuItem className='cursor-pointer'>
                  <FileTextIcon className="mr-2 h-4 w-4" />
                  <span>Blog</span>
                </DropdownMenuItem>
              </Link>
              <Link to="/create/project">
                <DropdownMenuItem className='cursor-pointer'>
                  <CodeIcon className="mr-2 h-4 w-4" />
                  <span>Project</span>
                </DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none" data-cy="dropdown-menu">
              <Avatar>
                <AvatarImage src={user.picture || "/placeholder.svg"} alt="avatar" />
                <AvatarFallback className="bg-primary/10">
                  {user.firstName[0].toUpperCase()}
                  {user.lastName[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                {user.firstName} {user.lastName}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link to={PROFILE_PATH}>
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
              </Link>
              <Link to={SETTINGS_PATH}>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} data-cy="logout">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
