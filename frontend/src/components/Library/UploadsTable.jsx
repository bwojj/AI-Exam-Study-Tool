import { useRef, useState, useEffect } from 'react'
import { Icon } from '../Icons'

function StatusPill({ status }) {
  const styles = {
    analyzed: {
      background: 'oklch(78% 0.13 155 / 0.1)',
      color: 'var(--good)',
      dotColor: 'var(--good)',
      animate: false,
    },
    processing: {
      background: 'oklch(80% 0.115 200 / 0.1)',
      color: 'var(--accent)',
      dotColor: 'var(--accent)',
      animate: true,
    },
    queued: {
      background: 'oklch(80% 0.13 70 / 0.1)',
      color: 'var(--warn)',
      dotColor: 'var(--warn)',
      animate: false,
    },
  }

  const s = styles[status] ?? styles.queued

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '3px 9px',
        borderRadius: '99px',
        fontSize: '12px',
        fontWeight: 500,
        background: s.background,
        color: s.color,
      }}
    >
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          display: 'inline-block',
          background: s.dotColor,
          animation: s.animate ? 'pulse 1.4s ease-in-out infinite' : 'none',
        }}
      />
      {status}
    </span>
  )
}

function TestRow({ test, setTests }) {
  const [hovered, setHovered] = useState(false)
  const [menuPos, setMenuPos] = useState(null)
  const menuRef = useRef(null)

  useEffect(() => {
    if (!menuPos) return
    function onOutsideClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuPos(null)
    }
    document.addEventListener('mousedown', onOutsideClick)
    return () => document.removeEventListener('mousedown', onOutsideClick)
  }, [menuPos])

  function handleMenuToggle(e) {
    if (menuPos) {
      setMenuPos(null)
    } else {
      const rect = e.currentTarget.getBoundingClientRect()
      setMenuPos({ top: rect.bottom + 4, right: window.innerWidth - rect.right })
    }
  }

  function handleRemove() {
    setTests((prev) => prev.filter((t) => t.id !== test.id))
    setMenuPos(null)
  }

  return (
    <tr
      style={{
        background: hovered ? 'oklch(24% 0.016 240)' : 'transparent',
        transition: 'background 0.1s ease',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Name */}
      <td
        style={{
          padding: '12px 20px',
          fontSize: '13.5px',
          color: 'var(--ink-2)',
          borderBottom: '1px solid var(--hairline)',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'row', gap: '8px', alignItems: 'center' }}>
          <Icon.File size={14} color="var(--muted)" />
          <span style={{ color: 'var(--ink)', fontWeight: 500 }}>{test.name || 'Untitled'}</span>
        </div>
      </td>

      {/* Questions */}
      <td
        style={{
          padding: '12px 20px',
          fontSize: '13.5px',
          color: 'var(--ink-2)',
          borderBottom: '1px solid var(--hairline)',
        }}
      >
        {test.number_of_questions}
      </td>

      {/* Status */}
      <td
        style={{
          padding: '12px 20px',
          fontSize: '13.5px',
          color: 'var(--ink-2)',
          borderBottom: '1px solid var(--hairline)',
        }}
      >
        <StatusPill status="analyzed" />
      </td>

      {/* Date */}
      <td
        style={{
          padding: '12px 20px',
          fontSize: '13.5px',
          color: 'var(--ink-2)',
          borderBottom: '1px solid var(--hairline)',
        }}
      >
        {test.date ? new Date(test.date).toLocaleDateString() : '—'}
      </td>

      {/* Actions */}
      <td
        style={{
          padding: '12px 20px',
          fontSize: '13.5px',
          color: 'var(--ink-2)',
          borderBottom: '1px solid var(--hairline)',
        }}
      >
        <div style={{ display: 'inline-block' }}>
          <button
            onClick={handleMenuToggle}
            style={{
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 'var(--r-sm)',
              border: '1px solid var(--hairline)',
              background: menuPos ? 'var(--surface-2)' : 'transparent',
              color: 'var(--muted)',
              cursor: 'pointer',
            }}
          >
            <Icon.More size={14} />
          </button>

          {menuPos && (
            <div
              ref={menuRef}
              style={{
                position: 'fixed',
                top: menuPos.top,
                right: menuPos.right,
                background: 'var(--surface)',
                border: '1px solid var(--hairline-strong)',
                borderRadius: 'var(--r-md)',
                boxShadow: '0 8px 24px oklch(0% 0 0 / 0.3)',
                minWidth: '140px',
                zIndex: 200,
                overflow: 'hidden',
              }}
            >
              <button
                onClick={handleRemove}
                style={{
                  width: '100%',
                  padding: '9px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'transparent',
                  border: 'none',
                  color: 'oklch(65% 0.2 25)',
                  fontSize: '13px',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'oklch(65% 0.2 25 / 0.08)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <Icon.Trash size={13} />
                Remove
              </button>
            </div>
          )}
        </div>
      </td>
    </tr>
  )
}

export default function UploadsTable({ onAddFiles, tests = [], setTests }) {
  const addInputRef = useRef(null)

  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--hairline)',
        borderRadius: 'var(--r-lg)',
        overflow: 'hidden',
      }}
    >
      {/* Header row */}
      <div
        style={{
          padding: '16px 20px',
          background: 'var(--bg-2)',
          borderBottom: '1px solid var(--hairline)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--ink)' }}>
          Recent uploads
        </span>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {/* Add files button */}
          <button
            onClick={() => addInputRef.current?.click()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '5px 12px',
              border: '1px solid var(--hairline)',
              borderRadius: 'var(--r-sm)',
              background: 'transparent',
              color: 'var(--ink-2)',
              fontSize: '12.5px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            <Icon.Plus size={13} />
            Add files
          </button>
          <input
            ref={addInputRef}
            type="file"
            multiple
            style={{ display: 'none' }}
            onChange={(e) => {
              if (e.target.files?.length) {
                onAddFiles(e.target.files)
                e.target.value = ''
              }
            }}
          />

          {/* Filter button */}
          <button
            style={{
              width: '30px',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid var(--hairline)',
              borderRadius: 'var(--r-sm)',
              background: 'transparent',
              color: 'var(--muted)',
              cursor: 'pointer',
            }}
          >
            <Icon.Filter size={14} />
          </button>

          {/* Refresh button */}
          <button
            style={{
              width: '30px',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid var(--hairline)',
              borderRadius: 'var(--r-sm)',
              background: 'transparent',
              color: 'var(--muted)',
              cursor: 'pointer',
            }}
          >
            <Icon.Refresh size={14} />
          </button>
        </div>
      </div>

      {/* Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: 'var(--bg-2)' }}>
            {['Name', 'Questions', 'Status', 'Date', ''].map((col) => (
              <th
                key={col}
                style={{
                  fontSize: '11px',
                  fontWeight: 500,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  color: 'var(--muted)',
                  padding: '10px 20px',
                  textAlign: 'left',
                  borderBottom: '1px solid var(--hairline)',
                }}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {tests.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                style={{
                  padding: '48px',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0',
                  }}
                >
                  <Icon.Empty size={32} color="var(--faint)" />
                  <p
                    style={{
                      fontSize: '13.5px',
                      color: 'var(--muted)',
                      marginTop: '10px',
                      marginBottom: 0,
                    }}
                  >
                    No tests generated yet
                  </p>
                </div>
              </td>
            </tr>
          ) : (
            tests.map((test) => (
              <TestRow key={test.id} test={test} setTests={setTests} />
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
