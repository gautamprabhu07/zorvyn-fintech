import { useEffect, useMemo, useState } from 'react'
import { getRecords } from '../api/recordApi'
import PageContainer from '../components/PageContainer'
import { useAuth } from '../context/AuthContext'

const defaultFilterValues = {
  type: '',
  category: '',
  startDate: '',
  endDate: '',
  search: '',
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
})

const formatCurrency = (value) => currencyFormatter.format(Number(value) || 0)
const toUserErrorMessage = (error) => {
  const message = error?.response?.data?.message
  if (typeof message === 'string' && message.trim()) {
    return message
  }
  return 'Failed to load data. Please try again.'
}

function Records() {
  const { isAdmin } = useAuth()
  const [records, setRecords] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [pagination, setPagination] = useState({ page: 1, totalPages: 0, totalCount: 0 })

  const [filters, setFilters] = useState(defaultFilterValues)
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    const searchDebounce = setTimeout(() => {
      setDebouncedSearch(filters.search.trim())
      setPage(1)
    }, 350)

    return () => clearTimeout(searchDebounce)
  }, [filters.search])

  const queryParams = useMemo(
    () => ({
      page,
      limit,
      type: filters.type,
      category: filters.category.trim(),
      startDate: filters.startDate,
      endDate: filters.endDate,
      search: debouncedSearch,
    }),
    [debouncedSearch, filters.category, filters.endDate, filters.startDate, filters.type, limit, page],
  )

  useEffect(() => {
    const controller = new AbortController()

    const loadRecords = async () => {
      setIsLoading(true)

      try {
        const response = await getRecords(queryParams, { signal: controller.signal })
        setErrorMessage('')

        setRecords(response?.data || [])
        setPagination({
          page: response?.pagination?.page || page,
          totalPages: response?.pagination?.totalPages || 0,
          totalCount: response?.totalCount || 0,
        })
      } catch (error) {
        if (error?.code === 'ERR_CANCELED') {
          return
        }

        setErrorMessage(toUserErrorMessage(error))
        setRecords([])
      } finally {
        setIsLoading(false)
      }
    }

    loadRecords()

    return () => {
      controller.abort()
    }
  }, [queryParams, retryCount])

  const handleFilterInputChange = (event) => {
    const { name, value } = event.target
    setFilters((previous) => ({
      ...previous,
      [name]: value,
    }))

    if (name !== 'search') {
      setPage(1)
    }
  }

  const handleResetFilters = () => {
    setFilters(defaultFilterValues)
    setDebouncedSearch('')
    setPage(1)
  }

  const hasPagination = pagination.totalPages > 1

  return (
    <PageContainer title="Records">
      <div className="space-y-6">
        <section className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Filters</h2>

          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <div>
              <label htmlFor="type" className="mb-1 block text-sm font-medium text-slate-700">
                Type
              </label>
              <select
                id="type"
                name="type"
                value={filters.type}
                onChange={handleFilterInputChange}
                className="ui-select"
              >
                <option value="">All</option>
                <option value="INCOME">Income</option>
                <option value="EXPENSE">Expense</option>
              </select>
            </div>

            <div>
              <label htmlFor="category" className="mb-1 block text-sm font-medium text-slate-700">
                Category
              </label>
              <input
                id="category"
                name="category"
                type="text"
                value={filters.category}
                onChange={handleFilterInputChange}
                placeholder="e.g. Salary"
                className="ui-input"
              />
            </div>

            <div>
              <label htmlFor="search" className="mb-1 block text-sm font-medium text-slate-700">
                Search
              </label>
              <input
                id="search"
                name="search"
                type="text"
                value={filters.search}
                onChange={handleFilterInputChange}
                placeholder="Search category or note"
                className="ui-input"
              />
            </div>

            <div>
              <label htmlFor="startDate" className="mb-1 block text-sm font-medium text-slate-700">
                Start Date
              </label>
              <input
                id="startDate"
                name="startDate"
                type="date"
                value={filters.startDate}
                onChange={handleFilterInputChange}
                className="ui-input"
              />
            </div>

            <div>
              <label htmlFor="endDate" className="mb-1 block text-sm font-medium text-slate-700">
                End Date
              </label>
              <input
                id="endDate"
                name="endDate"
                type="date"
                value={filters.endDate}
                onChange={handleFilterInputChange}
                className="ui-input"
              />
            </div>

            <div>
              <label htmlFor="limit" className="mb-1 block text-sm font-medium text-slate-700">
                Per Page
              </label>
              <select
                id="limit"
                name="limit"
                value={String(limit)}
                onChange={(event) => {
                  setLimit(Number(event.target.value))
                  setPage(1)
                }}
                className="ui-select"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
              </select>
            </div>

            <div className="xl:col-span-3 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleResetFilters}
                className="ui-button-secondary"
              >
                Reset
              </button>
            </div>
          </div>
        </section>

        {errorMessage && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-rose-50 p-4 text-sm text-rose-700 ring-1 ring-rose-100">
            <p>{errorMessage}</p>
            <button type="button" onClick={() => setRetryCount((value) => value + 1)} disabled={isLoading} className="ui-button-danger">
              Retry
            </button>
          </div>
        )}

        <section className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-slate-900">Records</h2>
            <div className="flex items-center gap-3">
              {!isAdmin && <span className="rounded bg-amber-50 px-2 py-1 text-xs text-amber-700">Read only</span>}
              <p className="text-sm text-slate-500">Total: {pagination.totalCount}</p>
            </div>
          </div>

          {isAdmin && (
            <div className="mb-4">
              <button
                type="button"
                className="ui-button-primary"
              >
                Create Record
              </button>
            </div>
          )}

          {isLoading ? (
            <p className="rounded-md bg-slate-50 p-3 text-sm text-slate-600">Loading...</p>
          ) : records.length === 0 ? (
            <p className="rounded-md bg-slate-50 p-3 text-sm text-slate-600">No records found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-slate-200 text-sm">
                <thead className="bg-slate-100">
                  <tr className="text-left text-slate-700">
                    <th className="border-b border-slate-200 px-3 py-2 font-medium text-right">Amount</th>
                    <th className="border-b border-slate-200 px-3 py-2 font-medium">Type</th>
                    <th className="border-b border-slate-200 px-3 py-2 font-medium">Category</th>
                    <th className="border-b border-slate-200 px-3 py-2 font-medium">Date</th>
                    <th className="border-b border-slate-200 px-3 py-2 font-medium">Note</th>
                    <th className="border-b border-slate-200 px-3 py-2 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record) => (
                    <tr key={record._id} className="text-slate-700 odd:bg-white even:bg-slate-50 hover:bg-slate-100/80">
                      <td className="border-b border-slate-200 px-3 py-2 font-medium text-right">{formatCurrency(record.amount)}</td>
                      <td className="border-b border-slate-200 px-3 py-2 text-left">
                        <span
                          className={
                            record.type === 'INCOME'
                              ? 'rounded bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700'
                              : 'rounded bg-rose-50 px-2 py-0.5 text-xs font-medium text-rose-700'
                          }
                        >
                          {record.type}
                        </span>
                      </td>
                      <td className="border-b border-slate-200 px-3 py-2 text-left">{record.category}</td>
                      <td className="border-b border-slate-200 px-3 py-2 text-left">{new Date(record.date).toLocaleDateString()}</td>
                      <td className="border-b border-slate-200 px-3 py-2 text-left">{record.note || '-'}</td>
                      <td className="border-b border-slate-200 px-3 py-2 text-left">
                        {isAdmin ? (
                          <div className="flex gap-2">
                            <button type="button" className="ui-button-secondary !px-2 !py-1 !text-xs">
                              Edit
                            </button>
                            <button type="button" className="ui-button-danger !px-2 !py-1 !text-xs">
                              Delete
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {hasPagination && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-slate-500">
                Page {pagination.page} of {pagination.totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPage((previous) => Math.max(previous - 1, 1))}
                  disabled={pagination.page <= 1 || isLoading}
                  className="ui-button-secondary"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => setPage((previous) => Math.min(previous + 1, pagination.totalPages))}
                  disabled={pagination.page >= pagination.totalPages || isLoading}
                  className="ui-button-secondary"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </PageContainer>
  )
}

export default Records
