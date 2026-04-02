import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import ErrorBoundary from './components/ErrorBoundary'
import ToastContainer from './components/ToastContainer'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <ToastProvider>
        <ToastContainer />
        <AuthProvider>
          <App />
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  </StrictMode>,
)
