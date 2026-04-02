import { useEffect, useMemo, useState } from 'react'

const emptyForm = {
  amount: '',
  type: 'INCOME',
  category: '',
  date: '',
  note: '',
}

const toFormState = (data) => {
  if (!data) return emptyForm

  return {
    amount: data.amount !== undefined && data.amount !== null ? String(data.amount) : '',
    type: data.type || 'INCOME',
    category: data.category || '',
    date: data.date ? String(data.date).slice(0, 10) : '',
    note: data.note || '',
  }
}

function RecordForm({ initialData, onSubmit, onCancel, loading }) {
  const [formData, setFormData] = useState(toFormState(initialData))
  const [errors, setErrors] = useState({
    amount: '',
    type: '',
    category: '',
    date: '',
  })

  useEffect(() => {
    setFormData(toFormState(initialData))
    setErrors({
      amount: '',
      type: '',
      category: '',
      date: '',
    })
  }, [initialData])

  const isEditMode = useMemo(() => Boolean(initialData?._id), [initialData])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }))

    if (errors[name]) {
      setErrors((previous) => ({
        ...previous,
        [name]: '',
      }))
    }
  }

  const validate = () => {
    const nextErrors = {
      amount: '',
      type: '',
      category: '',
      date: '',
    }

    const amount = Number(formData.amount)
    const category = formData.category.trim()
    const date = formData.date

    if (formData.amount === '' || !Number.isFinite(amount) || amount <= 0) {
      nextErrors.amount = 'Amount must be greater than 0.'
    }

    if (!formData.type) {
      nextErrors.type = 'Type is required.'
    }

    if (!category) {
      nextErrors.category = 'Category is required.'
    }

    if (!date) {
      nextErrors.date = 'Date is required.'
    } else {
      const parsedDate = new Date(date)
      if (Number.isNaN(parsedDate.getTime())) {
        nextErrors.date = 'Date is invalid.'
      }
    }

    setErrors(nextErrors)

    return Object.values(nextErrors).every((value) => !value)
  }

  const getFieldClass = (fieldName) => {
    const base = 'ui-input'

    if (errors[fieldName]) {
      return `${base} border-rose-400 focus:border-rose-500 focus:ring-rose-100`
    }

    return base
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (loading) {
      return
    }

    if (!validate()) {
      return
    }

    const amount = Number(formData.amount)
    const category = formData.category.trim()
    const note = formData.note.trim()

    const payload = {
      amount,
      type: formData.type,
      category,
      date: formData.date,
      ...(note ? { note } : {}),
    }

    await onSubmit(payload)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">{isEditMode ? 'Edit Record' : 'Create Record'}</h3>
        <button type="button" onClick={onCancel} className="ui-button-secondary">
          Close
        </button>
      </div>

      <div>
        <label htmlFor="amount" className="mb-1 block text-sm font-medium text-slate-700">
          Amount
        </label>
        <input
          id="amount"
          name="amount"
          type="number"
          min="0"
          step="0.01"
          value={formData.amount}
          onChange={handleChange}
          className={getFieldClass('amount')}
        />
        {errors.amount && <p className="mt-1 text-xs text-rose-700">{errors.amount}</p>}
      </div>

      <div>
        <label htmlFor="type" className="mb-1 block text-sm font-medium text-slate-700">
          Type
        </label>
        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          className={errors.type ? 'ui-select border-rose-400 focus:border-rose-500 focus:ring-rose-100' : 'ui-select'}
        >
          <option value="INCOME">INCOME</option>
          <option value="EXPENSE">EXPENSE</option>
        </select>
        {errors.type && <p className="mt-1 text-xs text-rose-700">{errors.type}</p>}
      </div>

      <div>
        <label htmlFor="category" className="mb-1 block text-sm font-medium text-slate-700">
          Category
        </label>
        <input
          id="category"
          name="category"
          type="text"
          value={formData.category}
          onChange={handleChange}
          className={getFieldClass('category')}
        />
        {errors.category && <p className="mt-1 text-xs text-rose-700">{errors.category}</p>}
      </div>

      <div>
        <label htmlFor="date" className="mb-1 block text-sm font-medium text-slate-700">
          Date
        </label>
        <input
          id="date"
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          className={getFieldClass('date')}
        />
        {errors.date && <p className="mt-1 text-xs text-rose-700">{errors.date}</p>}
      </div>

      <div>
        <label htmlFor="note" className="mb-1 block text-sm font-medium text-slate-700">
          Note
        </label>
        <textarea
          id="note"
          name="note"
          rows={3}
          value={formData.note}
          onChange={handleChange}
          className="ui-input resize-none"
        />
      </div>

      <button type="submit" disabled={loading} className="ui-button-primary w-full">
        {loading ? (isEditMode ? 'Updating...' : 'Saving...') : isEditMode ? 'Update Record' : 'Create Record'}
      </button>
    </form>
  )
}

export default RecordForm
