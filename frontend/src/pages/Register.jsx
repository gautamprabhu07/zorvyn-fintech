import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { registerUser } from '../api/authApi'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

const initialForm = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: 'VIEWER',
}

function Register() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const { showToast } = useToast()

  const [formData, setFormData] = useState(initialForm)
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }))

    if (errorMessage) {
      setErrorMessage('')
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (isLoading) {
      return
    }

    const name = formData.name.trim()
    const email = formData.email.trim().toLowerCase()
    const password = formData.password
    const confirmPassword = formData.confirmPassword
    const role = formData.role

    if (!name || !email || !password) {
      const message = 'Name, email, and password are required.'
      setErrorMessage(message)
      showToast(message, 'error')
      return
    }

    if (password.length < 6) {
      const message = 'Password must be at least 6 characters long.'
      setErrorMessage(message)
      showToast(message, 'error')
      return
    }

    if (password !== confirmPassword) {
      const message = 'Passwords do not match.'
      setErrorMessage(message)
      showToast(message, 'error')
      return
    }

    setIsLoading(true)
    setErrorMessage('')

    try {
      await registerUser({
        name,
        email,
        password,
        role,
      })

      showToast('Registration successful. Please login.', 'success')
      navigate('/login', { replace: true })
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
        <h1 className="text-2xl font-bold text-slate-900">Register</h1>

        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-700">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className="ui-input"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
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
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className="ui-input"
            required
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="mb-1 block text-sm font-medium text-slate-700">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="ui-input"
            required
          />
        </div>

        <div>
          <label htmlFor="role" className="mb-1 block text-sm font-medium text-slate-700">
            Role
          </label>
          <select id="role" name="role" value={formData.role} onChange={handleChange} className="ui-select">
            <option value="VIEWER">Viewer</option>
            <option value="ANALYST">Analyst</option>
          </select>
          <p className="mt-1 text-xs text-slate-500">Admin role is managed outside self-registration.</p>
        </div>

        <button type="submit" disabled={isLoading} className="ui-button-primary">
          {isLoading ? 'Registering...' : 'Register'}
        </button>

        <p className="text-sm text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-slate-900 underline">
            Login
          </Link>
        </p>

        {errorMessage && <p className="text-sm text-rose-700">{errorMessage}</p>}
      </form>
    </main>
  )
}

export default Register
