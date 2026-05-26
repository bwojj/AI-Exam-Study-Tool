import { useEffect, useState } from 'react'
import { Icon } from '../Icons'
import { getFileStatus } from '../../services/api'

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

function TableRow({ file, setFiles }) {
  const [hovered, setHovered] = useState(false)

  const ext = file.type
    ? file.type.includes('/')
      ? file.type.split('/').pop().toUpperCase()
      : file.type.toUpperCase()
    : file.name.split('.').pop().toUpperCase()

  return (
    <tr
      style={{
        background: hovered ? 'oklch(24% 0.016 240)' : 'transparent',
        transition: 'background 0.1s ease',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Filename */}
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
          <span style={{ color: 'var(--ink)', fontWeight: 500 }}>{file.name}</span>
        </div>
      </td>

      {/* Size */}
      <td
        style={{
          padding: '12px 20px',
          fontSize: '13.5px',
          color: 'var(--ink-2)',
          borderBottom: '1px solid var(--hairline)',
        }}
      >
        {(file.size / 1024).toFixed(1)} KB
      </td>

      {/* Type */}
      <td
        style={{
          padding: '12px 20px',
          fontSize: '13.5px',
          color: 'var(--ink-2)',
          borderBottom: '1px solid var(--hairline)',
        }}
      >
        {ext}
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
        <StatusPill status={file.status} />
      </td>

      {/* Uploaded */}
      <td
        style={{
          padding: '12px 20px',
          fontSize: '13.5px',
          color: 'var(--ink-2)',
          borderBottom: '1px solid var(--hairline)',
        }}
      >
        {file.timestamp instanceof Date
          ? file.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : new Date(file.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
        <button
          style={{
            width: '28px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 'var(--r-sm)',
            border: '1px solid var(--hairline)',
            background: 'transparent',
            color: 'var(--muted)',
            cursor: 'pointer',
          }}
        >
          <Icon.More size={14} />
        </button>
      </td>
    </tr>
  )
}

export default function UploadsTable({ files, setFiles }) {
  useEffect(() => {
    const pending = files.filter((f) => f.status !== 'analyzed')
    if (pending.length === 0) return

    const interval = setInterval(async () => {
      for (const f of pending) {
        try {
          const { status } = await getFileStatus(f.id)
          setFiles((prev) => prev.map((p) => (p.id === f.id ? { ...p, status } : p)))
        } catch {
          // backend not yet live — silently skip
        }
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [files, setFiles])

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

        <div style={{ display: 'flex', gap: '8px' }}>
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
            {['Filename', 'Size', 'Type', 'Status', 'Uploaded', ''].map((col) => (
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
          {files.length === 0 ? (
            <tr>
              <td
                colSpan={6}
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
                    No files uploaded yet
                  </p>
                </div>
              </td>
            </tr>
          ) : (
            files.map((file) => (
              <TableRow key={file.id} file={file} setFiles={setFiles} />
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
