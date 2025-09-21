import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { BASE_PATH, PROFILE_PATH } from './constants/routes'
import Home from './pages/Home'
import { Toaster } from 'sonner'
import Boot from './components/utils/Boot'
import ProtectedRoute from './components/utils/ProtectedRoute'
import Profile from './pages/Profile'

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
      <Toaster position="bottom-right" />
      <RouterProvider router={router} />
    </div>
  )
}

export default App
