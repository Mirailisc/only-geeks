import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import {
  LOGIN_PATH,
  BLOG_READER_PATH,
  CREATE_ACHIEVEMENT_PATH,
  CREATE_BLOG_PATH,
  CREATE_EDUCATION_PATH,
  CREATE_PROJECT_PATH,
  PROFILE_PATH,
  SEARCH_PATH,
  SETTINGS_PATH,
  USER_PROFILE_PATH,
  FEED_PATH,
} from './constants/routes'
import Login from './pages/login'
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
import FeedHome from './pages/home'
import CreateProject from './pages/create_project'
import CreateAchievement from './pages/create_achievements'
import CreateEducation from './pages/create_education'
import { ThemeProvider } from 'next-themes'

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
        element: (<UserProfile />),
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
        element: (<ReadBlog />),
      },
      {
        path: FEED_PATH,
        element: (<FeedHome />)
      },
      {
        path: CREATE_PROJECT_PATH,
        element: (
          <ProtectedRoute>
            <CreateProject />
          </ProtectedRoute>
        ),
      },
      {
        path: CREATE_EDUCATION_PATH,
        element: (
          <ProtectedRoute>
            <CreateEducation />
          </ProtectedRoute>
        ),
      },
      {
        path: CREATE_ACHIEVEMENT_PATH,
        element: (
          <ProtectedRoute>
            <CreateAchievement />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: LOGIN_PATH,
    element: <Login />,
  },
])

function App() {
  return (
    <ThemeProvider defaultTheme="light" attribute="class" storageKey="onlygeek-theme">
      <div>
        <Toaster richColors position="bottom-right" />
        <RouterProvider router={router} />
      </div>
    </ThemeProvider>
  )
}

export default App
