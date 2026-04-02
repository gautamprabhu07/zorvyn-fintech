import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Navigate, useNavigate } from 'react-router-dom'
import { loginUser } from '../api/authApi'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

function Login() {
  const navigate = useNavigate()
  const { isAuthenticated, establishSession } = useAuth()
  const { showToast } = useToast()
  const [email, setEmail] = useState('admin@demo.com')
  const [password, setPassword] = useState('Admin123')
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (isLoading) return

    setErrorMessage('')
    setIsLoading(true)

    try {
      const responseData = await loginUser({ email, password })
      establishSession(responseData?.token, responseData?.data?.role)
      showToast('Login successful', 'success')
      navigate('/dashboard', { replace: true })
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || 'Something went wrong'
      setErrorMessage(message)
      showToast(message, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-4 py-8">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4 rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h1 className="text-2xl font-bold text-slate-900">Login</h1>

        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value)
              if (errorMessage) setErrorMessage('')
            }}
            className="ui-input"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value)
              if (errorMessage) setErrorMessage('')
            }}
            className="ui-input"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="ui-button-primary"
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>

        <p className="text-sm text-slate-600">
          New here?{' '}
          <Link to="/register" className="font-medium text-slate-900 underline">
            Create an account
          </Link>
        </p>

        {errorMessage && <p className="text-sm text-rose-700">{errorMessage}</p>}
      </form>
    </main>
  )
}

export default Login
