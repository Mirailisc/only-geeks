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
import { ADMIN_DASHBOARD_PATH, CREATE_BLOG_PATH, CREATE_PROJECT_PATH, FEED_PATH, LOGIN_PATH, PROFILE_PATH, SETTINGS_PATH } from '@/constants/routes'
import { CodeIcon, FileTextIcon, LogInIcon, LogOut, PlusIcon, Settings, GaugeIcon, User, User2Icon } from 'lucide-react'
import { toast } from 'sonner'
import { useEffect } from 'react'
import { clearUser } from '@/store/authSlice'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { useApolloClient, useMutation } from '@apollo/client/react'
import { LOGOUT_MUTATION } from '@/graphql/auth'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import SearchBox from './searchBox'
import { Button } from '../ui/button'

export default function AuthNavbar() {
  const { user } = useAppSelector((state) => state.auth)
  const [logoutMutation, { error }] = useMutation(LOGOUT_MUTATION)
  const client = useApolloClient()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logoutMutation()
    await client.clearStore()
    dispatch(clearUser())
    navigate(LOGIN_PATH, { replace: true })
  }

  useEffect(() => {
    if (error) toast.error(error.message)
  }, [error])

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to={FEED_PATH}>
          <div className="flex flex-row items-center gap-2">
            <div className="flex aspect-square w-10 flex-row items-center justify-center rounded-lg bg-primary font-bold text-white dark:text-black">
              OG
            </div>
            <h1 className="text-xl font-bold">Only Geeks</h1>
          </div>
        </Link>

        <SearchBox />
        {!user && (
          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none" data-cy="noauth-dropdown-menu">
                <User2Icon />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  Guest user
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuSeparator />
                <Link to={LOGIN_PATH + "?redirect=" + window.location.pathname}>
                  <DropdownMenuItem data-cy="login">
                    <LogInIcon className="mr-2 h-4 w-4" />
                    <span>Sign In</span>
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
        {user && (
          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild data-cy="create-dropdown-menu" className="mr-4 focus:outline-none">
                <Button variant={'outline'} className="mx-0 h-10 w-10 justify-center rounded-full p-0 px-0">
                  <PlusIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Create New</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link to={CREATE_BLOG_PATH}>
                  <DropdownMenuItem data-cy="create-blog-dropdown-item" className="cursor-pointer">
                    <FileTextIcon className="mr-2 h-4 w-4" />
                    <span>Blog</span>
                  </DropdownMenuItem>
                </Link>
                <Link to={CREATE_PROJECT_PATH}>
                  <DropdownMenuItem data-cy="create-project-dropdown-item" className="cursor-pointer">
                    <CodeIcon className="mr-2 h-4 w-4" />
                    <span>Project</span>
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none" data-cy="dropdown-menu">
                <Avatar>
                  <AvatarImage src={user.picture || '/placeholder.svg'} alt="avatar" />
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
                <DropdownMenuLabel>
                  Admin Section
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link to={ADMIN_DASHBOARD_PATH}>
                  <DropdownMenuItem>
                    <GaugeIcon />
                    <span>Admin Dashboard</span>
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
        )}
      </div>
    </header>
  )
}
