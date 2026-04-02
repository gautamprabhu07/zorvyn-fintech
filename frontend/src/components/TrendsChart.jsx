import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

function TrendsChart({ data }) {
  if (!data || data.length === 0) {
    return <p className="text-sm text-slate-500">No trends available</p>
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip formatter={(value) => Number(value).toLocaleString('en-US')} />
          <Legend />
          <Bar dataKey="income" name="Income" fill="#16a34a" radius={[4, 4, 0, 0]} />
          <Bar dataKey="expense" name="Expense" fill="#dc2626" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default TrendsChart
