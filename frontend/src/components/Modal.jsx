import { createPortal } from 'react-dom'

export default function Modal({ icon = '⚠️', title, message, actionLabel = 'Go Back', onClose }) {
  return createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.55)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--hairline)',
          borderRadius: 'var(--r-lg)',
          padding: '40px 48px',
          maxWidth: 460,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 32 }}>{icon}</div>
        <h2 style={{ fontSize: 22, fontWeight: 600, color: 'var(--ink)', margin: 0, letterSpacing: '-0.02em' }}>
          {title}
        </h2>
        <p style={{ fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.65, margin: 0 }}>
          {message}
        </p>
        <button
          onClick={onClose}
          style={{
            marginTop: 8,
            padding: '9px 24px',
            border: 'none',
            borderRadius: 'var(--r-md)',
            background: 'var(--accent)',
            color: 'var(--accent-ink)',
            fontSize: 13.5,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {actionLabel}
        </button>
      </div>
    </div>,
    document.body
  )
}
