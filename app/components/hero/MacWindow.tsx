import type { ReactNode } from 'react'

interface MacWindowProps {
  title?: string
  children: ReactNode
  width?: number | string
  statusBar?: ReactNode
}

export default function MacWindow({ title = 'Mischi.app', children, width = 400, statusBar }: MacWindowProps) {
  return (
    <div className="mac-window" style={{ width, position: 'relative' }}>
      <div className="mac-titlebar">
        <div className="mac-traffic-lights" aria-hidden="true">
          <span className="mac-light mac-light-red" />
          <span className="mac-light mac-light-yellow" />
          <span className="mac-light mac-light-green" />
        </div>
        <span className="mac-title">{title}</span>
      </div>

      <div className="mac-content">{children}</div>

      {statusBar && (
        <div
          style={{
            background: 'var(--color-surface-raised)',
            borderTop: '1px solid var(--color-border)',
            padding: '7px 14px',
            fontSize: '0.7rem',
            color: 'var(--color-text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          {statusBar}
        </div>
      )}
    </div>
  )
}
