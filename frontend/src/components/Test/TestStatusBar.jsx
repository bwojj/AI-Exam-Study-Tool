import { Icon } from '../Icons'

export default function TestStatusBar({ q, current, total, answers, flags, setFlags }) {
  const answered = Object.keys(answers).length
  const isFlagged = !!flags[q.id]

  return (
    <div
      style={{
        background: 'var(--bg-2)',
        border: '1px solid var(--hairline)',
        borderRadius: 'var(--r-lg)',
        padding: '12px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      {/* Left: meta groups */}
      <div style={{ display: 'flex', flexDirection: 'row', gap: 0, alignItems: 'stretch' }}>
        {/* Group 1: Question */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            paddingLeft: 0,
            paddingRight: 20,
          }}
        >
          <span style={{ fontSize: 11.5, color: 'var(--muted)', whiteSpace: 'nowrap' }}>
            Question
          </span>
          <span style={{ fontSize: 14, color: 'var(--ink)', fontWeight: 500 }}>
            {current + 1} of {total}
          </span>
        </div>

        {/* Divider */}
        <div style={{ width: 1, background: 'var(--hairline)', margin: '0 4px' }} />

        {/* Group 2: Topic */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            padding: '0 20px',
          }}
        >
          <span style={{ fontSize: 11.5, color: 'var(--muted)', whiteSpace: 'nowrap' }}>
            Topic
          </span>
          <span style={{ fontSize: 14, color: 'var(--ink)', fontWeight: 500 }}>
            {q.topic}
          </span>
        </div>

        {/* Divider */}
        <div style={{ width: 1, background: 'var(--hairline)', margin: '0 4px' }} />

        {/* Group 3: Answered */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            padding: '0 20px',
          }}
        >
          <span style={{ fontSize: 11.5, color: 'var(--muted)', whiteSpace: 'nowrap' }}>
            Answered
          </span>
          <span style={{ fontSize: 14, color: 'var(--ink)', fontWeight: 500 }}>
            {answered} of {total}
          </span>
        </div>
      </div>

      {/* Right: Flag button */}
      <button
        onClick={() => setFlags(prev => ({ ...prev, [q.id]: !isFlagged }))}
        style={{
          padding: '6px 12px',
          borderRadius: 'var(--r-md)',
          fontSize: 12.5,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          ...(isFlagged
            ? {
                border: '1px solid var(--warn)',
                color: 'var(--warn)',
                background: 'oklch(80% 0.13 70 / 0.10)',
              }
            : {
                border: '1px solid var(--hairline)',
                color: 'var(--muted)',
                background: 'transparent',
              }),
        }}
      >
        <Icon.Flag size={13} />
        Mark for review
      </button>
    </div>
  )
}
