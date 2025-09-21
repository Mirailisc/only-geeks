import { createBrowserRouter, RouterProvider } from 'react-router'
import { BASE_PATH } from './constants/routes'
import Home from './pages/Home'
import { Toaster } from 'sonner'

const router = createBrowserRouter([
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
