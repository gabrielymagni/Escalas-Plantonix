import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import { router } from './router/router.jsx'
import { Toaster } from 'sonner'

createRoot(document.getElementById('root')).render(
  <>
    <RouterProvider router={router} />
    <Toaster richColors position="top-right" />
  </>
)
