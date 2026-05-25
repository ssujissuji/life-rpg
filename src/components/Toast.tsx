import { useEffect, useRef, useState } from 'react'

interface ToastProps {
  message: string
  subMessage: string
  onClose: () => void
  duration?: number
}

export default function Toast({ message, subMessage, onClose, duration = 3500 }: ToastProps) {
  const [visible, setVisible] = useState(false)
  const onCloseRef = useRef(onClose)

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    const enterTimer = setTimeout(() => setVisible(true), 10)
    const exitTimer = setTimeout(() => {
      setVisible(false)
      setTimeout(() => onCloseRef.current(), 300)
    }, duration)
    return () => {
      clearTimeout(enterTimer)
      clearTimeout(exitTimer)
    }
  }, [duration])

  return (
    <div
      className={`fixed bottom-24 left-4 right-4 z-50 transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="bg-bg-card border border-purple-primary rounded-lg p-3 space-y-0.5">
        <div className="text-purple-light text-xs font-mono font-bold">{message}</div>
        <div className="text-text-sub text-xs font-mono">{subMessage}</div>
      </div>
    </div>
  )
}
