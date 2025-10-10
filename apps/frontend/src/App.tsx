import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { BASE_PATH, CREATE_BLOG, PROFILE_PATH, SEARCH_PATH, SETTINGS_PATH, USER_PROFILE_PATH } from './constants/routes'
import Home from './pages/home'
import { Toaster } from 'sonner'
import Boot from './components/utils/Boot'
import ProtectedRoute from './components/utils/ProtectedRoute'
import Profile from './pages/profile'
import UserProfile from './pages/[_id]'
import Settings from './pages/settings'
import SearchQuery from './pages/[_query]'
import CreateBlog from './pages/create/blog'
import ErrorElement from './pages/error'

const router = createBrowserRouter([
  {
    element: <Boot />,
    errorElement: <ErrorElement />,
    children: [
      {
        path: PROFILE_PATH,
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: SETTINGS_PATH,
        element: (
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        ),
      },
      {
        path: USER_PROFILE_PATH,
        element: (
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        )
      },
      {
        path: SEARCH_PATH,
        element: (
          <ProtectedRoute>
            <SearchQuery />
          </ProtectedRoute>
        )
      },
      {
        path: CREATE_BLOG,
        element: (
          <ProtectedRoute>
            <CreateBlog />
          </ProtectedRoute>
        )
      }
    ],
  },
  {
    path: BASE_PATH,
    element: <Home />,
  },
])

function App() {
  return (
    <div>
      <Toaster richColors position="bottom-right" />
      <RouterProvider router={router} />
    </div>
  )
}

export default App
