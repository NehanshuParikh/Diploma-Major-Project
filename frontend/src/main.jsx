import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import './styles/custom.css'; // our custom styles
import { LoadingProvider } from './Context/LoadingContext.jsx'

createRoot(document.getElementById('root')).render(
  <LoadingProvider>
    <StrictMode>
      <App />
    </StrictMode>
  </LoadingProvider>,
)
