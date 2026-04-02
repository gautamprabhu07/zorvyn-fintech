import Toast from './Toast'
import { useToast } from '../context/ToastContext'

function ToastContainer() {
  const { toasts } = useToast()

  if (toasts.length === 0) {
    return null
  }

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[60] flex flex-col gap-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} message={toast.message} type={toast.type} />
      ))}
    </div>
  )
}

export default ToastContainer
