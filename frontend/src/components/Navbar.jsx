import { Link, NavLink, useNavigate } from 'react-router-dom'
import { isAuthenticated, removeToken } from '../utils/auth'

function Navbar() {
  const navigate = useNavigate()
  const authenticated = isAuthenticated()

  const handleLogout = () => {
    removeToken()
    navigate('/login')
  }

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
        <Link to={authenticated ? '/dashboard' : '/login'} className="text-lg font-semibold text-slate-900">
          Zorvyn Frontend
        </Link>

        <nav className="flex items-center gap-2">
          {!authenticated && (
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `rounded px-3 py-1.5 text-sm ${isActive ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'}`
              }
            >
              Login
            </NavLink>
          )}
          {authenticated && (
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `rounded px-3 py-1.5 text-sm ${isActive ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'}`
              }
            >
              Dashboard
            </NavLink>
          )}
          {authenticated && (
            <NavLink
              to="/records"
              className={({ isActive }) =>
                `rounded px-3 py-1.5 text-sm ${isActive ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'}`
              }
            >
              Records
            </NavLink>
          )}
          {authenticated && (
            <button
              type="button"
              onClick={handleLogout}
              className="rounded bg-rose-50 px-3 py-1.5 text-sm text-rose-700 hover:bg-rose-100"
            >
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Navbar
