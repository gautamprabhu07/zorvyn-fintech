import { render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import Records from '../pages/Records'
import { getRecords } from '../api/recordApi'

vi.mock('../api/recordApi', () => ({
  getRecords: vi.fn(),
  createRecord: vi.fn(),
  updateRecord: vi.fn(),
  deleteRecord: vi.fn(),
}))

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    isAdmin: true,
  }),
}))

vi.mock('../context/ToastContext', () => ({
  useToast: () => ({
    showToast: vi.fn(),
  }),
}))

describe('Records page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('renders records table rows from API data', async () => {
    vi.mocked(getRecords).mockResolvedValue({
      data: [
        {
          _id: 'record-1',
          amount: 2500,
          type: 'INCOME',
          category: 'Salary',
          date: '2025-03-15T00:00:00.000Z',
          note: 'March payroll',
        },
      ],
      totalCount: 1,
      pagination: {
        page: 1,
        totalPages: 1,
      },
    })

    render(<Records />)

    await waitFor(() => {
      expect(getRecords).toHaveBeenCalled()
    })

    expect(await screen.findByText('Salary')).toBeInTheDocument()
    expect(screen.getByText('March payroll')).toBeInTheDocument()
    expect(screen.getByText('INCOME')).toBeInTheDocument()
  })
})
