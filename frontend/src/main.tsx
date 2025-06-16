import { createRoot } from 'react-dom/client'
import './styles/global.css'
import { BrowserRouter } from "react-router-dom"
import MainRoutes from './routes'
import { AuthProvider } from './contexts/AuthContext'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <AuthProvider>
      <MainRoutes/>
    </AuthProvider>
  </BrowserRouter>
)
