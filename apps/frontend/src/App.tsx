import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { BASE_PATH, BLOG_SEARCH_PATH, DEFAULT_SEARCH_PATH, PROFILE_PATH, PROFILE_SEARCH_PATH, SETTINGS_PATH, USER_PROFILE_PATH } from './constants/routes'
import Home from './pages/home'
import { Toaster } from 'sonner'
import Boot from './components/utils/Boot'
import ProtectedRoute from './components/utils/ProtectedRoute'
import Profile from './pages/profile'
import UserProfile from './pages/[_id]'
import Settings from './pages/settings'
import SearchQuery from './pages/[_query]'

const router = createBrowserRouter([
  {
    element: <Boot />,
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
        path: DEFAULT_SEARCH_PATH,
        element: (
          <ProtectedRoute>
            <SearchQuery type="all" />
          </ProtectedRoute>
        )
      },
      {
        path: PROFILE_SEARCH_PATH,
        element: (
          <ProtectedRoute>
            <SearchQuery type="profile" />
          </ProtectedRoute>
        )
      },
      {
        path: BLOG_SEARCH_PATH,
        element: (
          <ProtectedRoute>
            <SearchQuery type="blog" />
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
