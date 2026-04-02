import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, test } from 'vitest'
import ProtectedRoute from '../components/ProtectedRoute'
import { AuthProvider } from '../context/AuthContext'
import { clearAuthStorage, setToken, setUserRole } from '../utils/auth'

function renderProtectedRoute(initialPath) {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <div>Protected Content</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </MemoryRouter>,
  )
}

describe('ProtectedRoute', () => {
  beforeEach(() => {
    clearAuthStorage()
  })

  afterEach(() => {
    clearAuthStorage()
  })

  test('redirects to /login when user is not authenticated', async () => {
    renderProtectedRoute('/dashboard')

    expect(await screen.findByText('Login Page')).toBeInTheDocument()
  })

  test('renders protected route when token exists', async () => {
    setToken('dummy-token')
    setUserRole('ADMIN')

    renderProtectedRoute('/dashboard')

    expect(await screen.findByText('Protected Content')).toBeInTheDocument()
  })
})
