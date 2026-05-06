import { useState, useEffect } from 'react'

export const useToast = () => {
  const [toasts, setToasts] = useState([])

  const showToast = (message, type = 'success', duration = 3000) => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, duration)
  }

  return { toasts, showToast }
}

export function Toast({ message, type }) {
  const bgColor = type === 'success' ? 'bg-[#10B981]' : type === 'error' ? 'bg-[#EF4444]' : 'bg-[#F59E0B]'
  const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : '⚠'

  return (
    <div
      className={`${bgColor} text-white px-4 py-3 rounded-lg flex items-center gap-3 shadow-lg animate-fade-in`}
    >
      <span className="text-lg font-bold">{icon}</span>
      <span>{message}</span>
    </div>
  )
}

export function ToastContainer({ toasts }) {
  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-2 pointer-events-auto z-50">
      {toasts.map((toast) => (
        <Toast key={toast.id} message={toast.message} type={toast.type} />
      ))}
    </div>
  )
}
