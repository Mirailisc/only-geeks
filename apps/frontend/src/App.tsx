import { createBrowserRouter, RouterProvider } from 'react-router'
import { BASE_PATH } from './constants/routes'
import Home from './pages/Home'

const router = createBrowserRouter([
  {
    path: BASE_PATH,
    element: <Home />,
  },
])

function App() {
  return <RouterProvider router={router} />
}

export default App
