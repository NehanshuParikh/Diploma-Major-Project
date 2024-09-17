import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { LoadingProvider } from './Context/LoadingContext.jsx'

createRoot(document.getElementById('root')).render(
  <LoadingProvider>
    <StrictMode>
      <App />
    </StrictMode>
  </LoadingProvider>,
)
