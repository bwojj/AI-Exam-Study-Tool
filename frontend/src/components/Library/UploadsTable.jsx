import { useRef } from 'react'
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

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function FileRow({ file, onRemoveFile }) {
  return (
    <tr>
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
        {formatSize(file.size)}
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
        {file.type}
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
        <StatusPill status="queued" />
      </td>

      {/* Remove */}
      <td
        style={{
          padding: '12px 20px',
          borderBottom: '1px solid var(--hairline)',
        }}
      >
        <button
          onClick={() => onRemoveFile(file.id)}
          style={{
            width: '28px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 'var(--r-sm)',
            border: '1px solid transparent',
            background: 'transparent',
            color: 'var(--muted)',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'oklch(65% 0.2 25)'
            e.currentTarget.style.background = 'oklch(65% 0.2 25 / 0.08)'
            e.currentTarget.style.borderColor = 'oklch(65% 0.2 25 / 0.2)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--muted)'
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.borderColor = 'transparent'
          }}
        >
          <Icon.Trash size={13} />
        </button>
      </td>
    </tr>
  )
}

export default function UploadsTable({ files = [], onAddFiles, onRemoveFile }) {
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
          Selected files
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
            accept=".pdf,.docx,.txt,.md,.pptx,.png,.jpg,.jpeg,.webp"
            style={{ display: 'none' }}
            onChange={(e) => {
              if (e.target.files?.length) {
                onAddFiles(e.target.files)
                e.target.value = ''
              }
            }}
          />
        </div>
      </div>

      {/* Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: 'var(--bg-2)' }}>
            {['Name', 'Size', 'Type', 'Status', ''].map((col) => (
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
                colSpan={5}
                style={{
                  padding: '48px',
                  textAlign: 'center',
                }}
              >
                <p
                  style={{
                    fontSize: '13.5px',
                    color: 'var(--muted)',
                    margin: 0,
                  }}
                >
                  No files selected
                </p>
              </td>
            </tr>
          ) : (
            files.map((file) => (
              <FileRow key={file.id} file={file} onRemoveFile={onRemoveFile} />
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
