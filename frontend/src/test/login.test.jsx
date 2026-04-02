import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import Login from '../pages/Login'
import { loginUser } from '../api/authApi'

const mockEstablishSession = vi.fn()
const mockShowToast = vi.fn()

vi.mock('../api/authApi', () => ({
  loginUser: vi.fn(),
}))

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    isAuthenticated: false,
    establishSession: mockEstablishSession,
  }),
}))

vi.mock('../context/ToastContext', () => ({
  useToast: () => ({
    showToast: mockShowToast,
  }),
}))

describe('Login page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('submits credentials, calls login API, and triggers success handling', async () => {
    vi.mocked(loginUser).mockResolvedValue({
      token: 'test-token',
      data: { role: 'ADMIN' },
    })

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    )

    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /login/i })

    await userEvent.clear(emailInput)
    await userEvent.type(emailInput, 'admin@demo.com')
    await userEvent.clear(passwordInput)
    await userEvent.type(passwordInput, 'Admin123')
    await userEvent.click(submitButton)

    await waitFor(() => {
      expect(loginUser).toHaveBeenCalledWith({
        email: 'admin@demo.com',
        password: 'Admin123',
      })
    })

    expect(mockEstablishSession).toHaveBeenCalledWith('test-token', 'ADMIN')
    expect(mockShowToast).toHaveBeenCalledWith('Login successful', 'success')
  })
})
