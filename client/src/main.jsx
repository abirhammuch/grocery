import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import axios from 'axios'  // ← ADD THIS IMPORT
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AppContextProvider } from './context/AppContext.jsx'

// ✅ ADD THIS LINE - fixes all 401 errors
axios.defaults.withCredentials = true
axios.defaults.baseURL = 'https://grocery-backend-livid-six.vercel.app/api'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AppContextProvider>
      <App />
    </AppContextProvider>
  </BrowserRouter>
)