import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function AppLayout() {
  const navigate = useNavigate()
  const { isViewer, logout, userRole } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="text-lg font-semibold text-slate-900">
              Finance Dashboard
            </Link>

            <nav className="flex items-center gap-2">
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `rounded-md px-3 py-1.5 text-sm ${isActive ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'}`
                }
              >
                Dashboard
              </NavLink>
              {!isViewer && (
                <NavLink
                  to="/records"
                  className={({ isActive }) =>
                    `rounded-md px-3 py-1.5 text-sm ${isActive ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'}`
                  }
                >
                  Records
                </NavLink>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {userRole && <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">{userRole}</span>}
            <button type="button" onClick={handleLogout} className="ui-button-secondary">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}

export default AppLayout
