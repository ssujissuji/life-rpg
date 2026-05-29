import type { ReactNode } from 'react'

interface PanelProps {
  children: ReactNode
  bracket?: boolean
  className?: string
}

export default function Panel({ children, bracket = true, className = '' }: PanelProps) {
  return (
    <div className={`t-panel ${bracket ? 't-panel--bracket' : ''} ${className}`.trim()}>
      {children}
    </div>
  )
}
