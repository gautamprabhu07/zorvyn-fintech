import { useEffect, useState } from 'react'
import PageContainer from '../components/PageContainer'
import TrendsChart from '../components/TrendsChart'
import {
  getCategoryBreakdown,
  getMonthlyTrends,
  getRecentActivity,
  getSummary,
} from '../api/dashboardApi'

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
})

const formatCurrency = (value) => currencyFormatter.format(Number(value) || 0)
const emptySummary = { totalIncome: 0, totalExpense: 0, netBalance: 0 }
const toUserErrorMessage = (error) => {
  const message = error?.response?.data?.message
  if (typeof message === 'string' && message.trim()) {
    return message
  }
  return 'Failed to load data. Please try again.'
}

function Dashboard() {
  const [summary, setSummary] = useState(emptySummary)
  const [categoryItems, setCategoryItems] = useState([])
  const [recentItems, setRecentItems] = useState([])
  const [trendItems, setTrendItems] = useState([])
  const [recentLimit, setRecentLimit] = useState(10)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    const loadDashboardData = async () => {
      setIsLoading(true)
      setErrorMessage('')

      try {
        const requestConfig = { signal: controller.signal }
        const [summaryData, categoryData, recentData, trendsData] = await Promise.all([
          getSummary(requestConfig),
          getCategoryBreakdown(undefined, requestConfig),
          getRecentActivity({ limit: recentLimit }, requestConfig),
          getMonthlyTrends(undefined, requestConfig),
        ])

        setSummary(summaryData || emptySummary)
        setCategoryItems(categoryData?.data || [])
        setRecentItems(recentData?.data || [])
        setTrendItems(trendsData?.data || [])
      } catch (error) {
        if (error?.code === 'ERR_CANCELED') {
          return
        }

        setSummary(emptySummary)
        setCategoryItems([])
        setRecentItems([])
        setTrendItems([])
        setErrorMessage(toUserErrorMessage(error))
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboardData()

    return () => {
      controller.abort()
    }
  }, [recentLimit, retryCount])

  const isDashboardEmpty =
    !isLoading &&
    !errorMessage &&
    categoryItems.length === 0 &&
    recentItems.length === 0 &&
    trendItems.length === 0 &&
    Number(summary.totalIncome || 0) === 0 &&
    Number(summary.totalExpense || 0) === 0 &&
    Number(summary.netBalance || 0) === 0

  return (
    <PageContainer title="Dashboard">
      <div className="space-y-6">
        {isLoading && <p className="rounded-lg bg-white p-4 text-sm text-slate-600 shadow-sm ring-1 ring-slate-200">Loading...</p>}

        {errorMessage && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-rose-50 p-4 text-sm text-rose-700 ring-1 ring-rose-100">
            <p>{errorMessage}</p>
            <button type="button" onClick={() => setRetryCount((value) => value + 1)} disabled={isLoading} className="ui-button-danger">
              Retry
            </button>
          </div>
        )}

        {isDashboardEmpty && (
          <p className="rounded-lg bg-white p-4 text-sm text-slate-600 shadow-sm ring-1 ring-slate-200">
            No dashboard data available yet.
          </p>
        )}

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">Summary</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <article className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <p className="text-sm text-slate-500">Total Income</p>
              <p className="mt-2 text-2xl font-bold text-emerald-700">{formatCurrency(summary.totalIncome)}</p>
            </article>

            <article className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <p className="text-sm text-slate-500">Total Expense</p>
              <p className="mt-2 text-2xl font-bold text-rose-700">{formatCurrency(summary.totalExpense)}</p>
            </article>

            <article className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:col-span-2 lg:col-span-1">
              <p className="text-sm text-slate-500">Net Balance</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">{formatCurrency(summary.netBalance)}</p>
            </article>
          </div>
        </section>

        <section className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Category Breakdown</h2>

          {isLoading ? (
            <p className="mt-4 text-sm text-slate-500">Loading categories...</p>
          ) : categoryItems.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">No category data available.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {categoryItems.map((item) => (
                <li key={item.category} className="rounded-lg bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-slate-900">{item.category}</p>
                    <p className="font-semibold text-slate-900">{formatCurrency(item.total)}</p>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-4 text-sm">
                    <p className="text-emerald-700">Income: {formatCurrency(item.incomeTotal)}</p>
                    <p className="text-rose-700">Expense: {formatCurrency(item.expenseTotal)}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-slate-900">Recent Activity</h2>
              <select
                value={String(recentLimit)}
                onChange={(event) => setRecentLimit(Number(event.target.value))}
                className="ui-select !w-auto !px-2 !py-1"
              >
                <option value="5">Latest 5</option>
                <option value="10">Latest 10</option>
              </select>
            </div>

            {isLoading ? (
              <p className="mt-4 text-sm text-slate-500">Loading activity...</p>
            ) : recentItems.length === 0 ? (
              <p className="mt-4 text-sm text-slate-500">No recent activity found.</p>
            ) : (
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                  <thead>
                    <tr className="text-left text-slate-600">
                      <th className="px-3 py-2 font-medium">Category</th>
                      <th className="px-3 py-2 font-medium">Amount</th>
                      <th className="px-3 py-2 font-medium">Type</th>
                      <th className="px-3 py-2 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recentItems.map((item, index) => (
                      <tr key={`${item.category}-${item.date}-${index}`} className="text-slate-700">
                        <td className="px-3 py-2">{item.category}</td>
                        <td className="px-3 py-2 font-medium">{formatCurrency(item.amount)}</td>
                        <td className="px-3 py-2">
                          <span
                            className={
                              item.type === 'INCOME'
                                ? 'rounded bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700'
                                : 'rounded bg-rose-50 px-2 py-0.5 text-xs font-medium text-rose-700'
                            }
                          >
                            {item.type}
                          </span>
                        </td>
                        <td className="px-3 py-2">{new Date(item.date).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">Monthly Trends</h2>

            {isLoading ? (
              <p className="mt-4 text-sm text-slate-500">Loading trends...</p>
            ) : trendItems.length === 0 ? (
              <p className="mt-4 text-sm text-slate-500">No trends available</p>
            ) : (
              <div className="mt-4">
                <TrendsChart data={trendItems} />
              </div>
            )}
          </section>
        </div>
      </div>
    </PageContainer>
  )
}

export default Dashboard
