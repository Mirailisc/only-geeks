import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import {
  BASE_PATH,
  BLOG_READER_PATH,
  CREATE_BLOG_PATH,
  CREATE_PROJECT_PATH,
  PROFILE_PATH,
  SEARCH_PATH,
  SETTINGS_PATH,
  USER_PROFILE_PATH,
} from './constants/routes'
import Home from './pages/home'
import { Toaster } from 'sonner'
import Boot from './components/utils/Boot'
import ProtectedRoute from './components/utils/ProtectedRoute'
import Profile from './pages/profile'
import UserProfile from './pages/[_id]'
import Settings from './pages/settings'
import SearchQuery from './pages/[_query]'
import ErrorElement from './pages/error'
import CreateBlog from './pages/create_blog'
import ReadBlog from './pages/read_blog'
import CreateProject from './pages/create_project'

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
        ),
      },
      {
        path: SEARCH_PATH,
        element: (
          <ProtectedRoute>
            <SearchQuery />
          </ProtectedRoute>
        ),
      },
      {
        path: CREATE_BLOG_PATH,
        element: (
          <ProtectedRoute>
            <CreateBlog />
          </ProtectedRoute>
        ),
      },
      {
        path: BLOG_READER_PATH,
        element: (
          <ProtectedRoute>
            <ReadBlog />
          </ProtectedRoute>
        ),
      },
      {
        path: CREATE_PROJECT_PATH,
        element: (
          <ProtectedRoute>
            <CreateProject />
          </ProtectedRoute>
        ),
      },
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
