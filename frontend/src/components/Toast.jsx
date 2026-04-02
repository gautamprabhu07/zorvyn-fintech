function Toast({ message, type }) {
  const tone =
    type === 'success'
      ? 'border-emerald-200 bg-emerald-100 text-emerald-800'
      : 'border-rose-200 bg-rose-100 text-rose-800'

  return (
    <div className={`min-w-[260px] rounded-lg border px-4 py-3 text-sm shadow-lg transition-all duration-300 animate-[toastIn_180ms_ease-out] ${tone}`}>
      {message}
    </div>
  )
}

export default Toast
