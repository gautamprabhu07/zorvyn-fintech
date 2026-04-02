import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import {
  clearAuthStorage,
  getRoleFromToken,
  getUserRole,
  isAuthenticated as hasStoredToken,
  getToken,
  setToken,
  setUserRole,
} from '../utils/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState(() => {
    const authenticated = hasStoredToken()
    const storedRole = getUserRole()
    const resolvedRole = storedRole || getRoleFromToken(getToken())

    return {
      isAuthenticated: authenticated,
      userRole: authenticated ? resolvedRole : null,
    }
  })

  const establishSession = useCallback((token, role) => {
    if (!token) {
      throw new Error('Authentication token missing in response')
    }

    const normalizedRole = role ? String(role).trim().toUpperCase() : getRoleFromToken(token)

    setToken(token)
    if (normalizedRole) {
      setUserRole(normalizedRole)
    }

    setAuthState({
      isAuthenticated: true,
      userRole: normalizedRole,
    })
  }, [])

  const logout = useCallback(() => {
    clearAuthStorage()
    setAuthState({ isAuthenticated: false, userRole: null })
  }, [])

  const value = useMemo(
    () => ({
      isAuthenticated: authState.isAuthenticated,
      userRole: authState.userRole,
      isAdmin: authState.userRole === 'ADMIN',
      isAnalyst: authState.userRole === 'ANALYST',
      isViewer: authState.userRole === 'VIEWER',
      establishSession,
      logout,
    }),
    [authState, establishSession, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
