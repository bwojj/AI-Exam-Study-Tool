import { useRef, useState } from 'react'
import { Icon } from '../Icons'

export default function Dropzone({ onAddFiles }) {
  const [isOver, setIsOver] = useState(false)
  const inputRef = useRef(null)

  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--hairline)',
        borderRadius: 'var(--r-lg)',
        padding: '24px',
        marginBottom: 0,
      }}
      onDragOver={(e) => { e.preventDefault(); setIsOver(true) }}
      onDragLeave={() => setIsOver(false)}
      onDrop={(e) => { e.preventDefault(); setIsOver(false); onAddFiles(e.dataTransfer.files) }}
    >
      <div
        style={{
          border: `1.5px dashed ${isOver ? 'var(--accent)' : 'var(--hairline-strong)'}`,
          borderRadius: '10px',
          padding: '36px 24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
          transition: 'border-color 0.15s ease',
          background: isOver ? 'var(--accent-soft)' : 'transparent',
        }}
      >
        <div
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '16px',
            background: 'var(--accent-soft)',
            border: '1px solid var(--accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon.Cloud size={32} color="var(--accent)" strokeWidth={1.5} />
        </div>

        <p
          style={{
            fontSize: '22px',
            fontWeight: 600,
            color: 'var(--ink)',
            textAlign: 'center',
            margin: 0,
          }}
        >
          Drop your files here
        </p>

        <p
          style={{
            fontSize: '13.5px',
            color: 'var(--ink-2)',
            textAlign: 'center',
            margin: 0,
          }}
        >
          Drag and drop files, or{' '}
          <span
            style={{
              color: 'var(--accent)',
              textDecoration: 'underline',
              cursor: 'pointer',
            }}
            onClick={() => inputRef.current?.click()}
          >
            browse your computer
          </span>
        </p>

        <button
          style={{
            padding: '8px 20px',
            borderRadius: 'var(--r-md)',
            background: 'var(--accent)',
            color: 'var(--accent-ink)',
            fontSize: '13.5px',
            fontWeight: 600,
            border: 'none',
            marginTop: '4px',
            cursor: 'pointer',
          }}
          onClick={() => inputRef.current?.click()}
        >
          Select files
        </button>

        <input
          ref={inputRef}
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
      </div>
    </div>
  )
}
