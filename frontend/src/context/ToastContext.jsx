import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random()

    setToasts((previous) => [
      ...previous,
      {
        id,
        message,
        type,
      },
    ])

    window.setTimeout(() => {
      setToasts((previous) => previous.filter((toast) => toast.id !== id))
    }, 3000)
  }, [])

  const value = useMemo(
    () => ({
      toasts,
      showToast,
    }),
    [toasts, showToast],
  )

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
}

export function useToast() {
  const context = useContext(ToastContext)

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }

  return context
}
