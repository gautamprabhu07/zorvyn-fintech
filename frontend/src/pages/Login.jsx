import { Navigate, useNavigate } from 'react-router-dom'
import { isAuthenticated, setToken } from '../utils/auth'
import PageContainer from '../components/PageContainer'

function Login() {
  const navigate = useNavigate()

  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />
  }

  const handleLogin = () => {
    setToken('demo-auth-token')
    navigate('/dashboard')
  }

  return (
    <PageContainer title="Login">
      <section className="max-w-md space-y-4 rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <p className="text-sm text-slate-700">
          Placeholder login page. Click the button below to simulate authentication and access protected routes.
        </p>
        <button
          type="button"
          onClick={handleLogin}
          className="rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
        >
          Login
        </button>
      </section>
    </PageContainer>
  )
}

export default Login
