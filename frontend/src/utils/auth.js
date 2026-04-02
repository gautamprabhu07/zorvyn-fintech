const TOKEN_KEY = 'zorvyn_token'
const USER_ROLE_KEY = 'zorvyn_role'

export const getToken = () => localStorage.getItem(TOKEN_KEY)

export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token)
}

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY)
}

export const isAuthenticated = () => Boolean(getToken())

export const getUserRole = () => localStorage.getItem(USER_ROLE_KEY)

export const setUserRole = (role) => {
  if (!role) return
  localStorage.setItem(USER_ROLE_KEY, String(role).trim().toUpperCase())
}

export const removeUserRole = () => {
  localStorage.removeItem(USER_ROLE_KEY)
}

export const isAdmin = () => getUserRole() === 'ADMIN'

export const isAnalyst = () => getUserRole() === 'ANALYST'

export const isViewer = () => getUserRole() === 'VIEWER'

export const clearAuthStorage = () => {
  removeToken()
  removeUserRole()
}

export const getRoleFromToken = (token = getToken()) => {
  if (!token) return null

  try {
    const payload = token.split('.')[1]
    if (!payload) return null

    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    const normalizedBase64 = `${base64}${'='.repeat((4 - (base64.length % 4)) % 4)}`
    const parsed = JSON.parse(atob(normalizedBase64))
    return parsed?.role ? String(parsed.role).trim().toUpperCase() : null
  } catch {
    return null
  }
}
