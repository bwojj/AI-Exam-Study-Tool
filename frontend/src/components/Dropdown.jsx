import { useEffect, useRef, useState } from 'react'
import { Icon } from './Icons'

export default function Dropdown({ value, options, onChange }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)

  useEffect(() => {
    if (!open) return
    function handleClickOutside(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  return (
    <div ref={rootRef} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '7px 10px',
          border: '1px solid var(--hairline-strong)',
          borderRadius: 'var(--r-sm)',
          background: 'var(--bg-2)',
          color: 'var(--ink)',
          fontSize: '13px',
          cursor: 'pointer',
        }}
      >
        <span>{value}</span>
        <Icon.ChevronDown
          size={14}
          color="var(--muted)"
          style={{
            flexShrink: 0,
            transform: open ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.15s ease',
          }}
        />
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            minWidth: '100%',
            background: 'var(--bg-2)',
            border: '1px solid var(--hairline-strong)',
            borderRadius: 'var(--r-sm)',
            boxShadow: '0 12px 28px rgba(0, 0, 0, 0.4)',
            overflow: 'hidden',
            zIndex: 20,
          }}
        >
          {options.map((opt) => (
            <div
              key={opt}
              onClick={() => {
                onChange(opt)
                setOpen(false)
              }}
              style={{
                padding: '8px 12px',
                fontSize: '13px',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                color: opt === value ? 'var(--accent)' : 'var(--ink)',
                background: opt === value ? 'var(--accent-soft)' : 'transparent',
              }}
              onMouseEnter={(e) => {
                if (opt !== value) e.currentTarget.style.background = 'var(--hairline)'
              }}
              onMouseLeave={(e) => {
                if (opt !== value) e.currentTarget.style.background = 'transparent'
              }}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
