import { useRef, useState } from 'react'
import { Icon } from '../Icons'
import { uploadFile } from '../../services/api'

export default function Dropzone({ files, setFiles }) {
  const [isOver, setIsOver] = useState(false)
  const inputRef = useRef(null)

  function handleFiles(fileList) {
    const newEntries = Array.from(fileList).map((file) => ({
      id: crypto.randomUUID(),
      name: file.name,
      size: file.size,
      type: file.type || file.name.split('.').pop(),
      status: 'queued',
      timestamp: new Date(),
    }))

    setFiles((prev) => [...prev, ...newEntries])

    Array.from(fileList).forEach((file) => {
      uploadFile(file).catch(() => {
        // backend not yet live — silently skip
      })
    })
  }

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
      onDrop={(e) => { e.preventDefault(); setIsOver(false); handleFiles(e.dataTransfer.files) }}
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
        {/* Cloud icon box */}
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

        {/* Title */}
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

        {/* Subtitle */}
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

        {/* Select files button */}
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
          }}
          onClick={() => inputRef.current?.click()}
        >
          Select files
        </button>

        {/* Hidden file input */}
        <input
          ref={inputRef}
          type="file"
          multiple
          style={{ display: 'none' }}
          onChange={(e) => {
            if (e.target.files?.length) {
              handleFiles(e.target.files)
              e.target.value = ''
            }
          }}
        />
      </div>
    </div>
  )
}
