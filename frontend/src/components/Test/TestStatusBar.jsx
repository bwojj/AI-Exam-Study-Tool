export default function TestStatusBar({ q, current, total, answers, correctCount }) {
  const answered = Object.keys(answers).length
  const scorePercent = total > 0 ? Math.round((correctCount / total) * 100) : 0

  return (
    <div
      className="status-bar"
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
      <div className="status-groups" style={{ display: 'flex', flexDirection: 'row', gap: 0, alignItems: 'stretch' }}>
        {/* Group 1: Question */}
        <div
          className="status-group status-group-first"
          style={{ display: 'flex', flexDirection: 'column', gap: 3, paddingLeft: 0, paddingRight: 20 }}
        >
          <span className="status-label" style={{ fontSize: 11.5, color: 'var(--muted)', whiteSpace: 'nowrap' }}>
            Question
          </span>
          <span className="status-value" style={{ fontSize: 14, color: 'var(--ink)', fontWeight: 500 }}>
            {current + 1} of {total}
          </span>
        </div>

        <div className="status-divider" style={{ width: 1, background: 'var(--hairline)', margin: '0 4px' }} />

        {/* Group 2: Topic */}
        <div
          className="status-group"
          style={{ display: 'flex', flexDirection: 'column', gap: 3, padding: '0 20px' }}
        >
          <span className="status-label" style={{ fontSize: 11.5, color: 'var(--muted)', whiteSpace: 'nowrap' }}>
            Topic
          </span>
          <span className="status-value status-topic" style={{ fontSize: 14, color: 'var(--ink)', fontWeight: 500 }}>
            {q.topic}
          </span>
        </div>

        <div className="status-divider" style={{ width: 1, background: 'var(--hairline)', margin: '0 4px' }} />

        {/* Group 3: Answered */}
        <div
          className="status-group"
          style={{ display: 'flex', flexDirection: 'column', gap: 3, padding: '0 20px' }}
        >
          <span className="status-label" style={{ fontSize: 11.5, color: 'var(--muted)', whiteSpace: 'nowrap' }}>
            Answered
          </span>
          <span className="status-value" style={{ fontSize: 14, color: 'var(--ink)', fontWeight: 500 }}>
            {answered} of {total}
          </span>
        </div>

        <div className="status-divider" style={{ width: 1, background: 'var(--hairline)', margin: '0 4px' }} />

        {/* Group 4: Score */}
        <div
          className="status-group"
          style={{ display: 'flex', flexDirection: 'column', gap: 3, padding: '0 20px' }}
        >
          <span className="status-label" style={{ fontSize: 11.5, color: 'var(--muted)', whiteSpace: 'nowrap' }}>
            Score
          </span>
          <span
            className="status-value"
            style={{
              fontSize: 14,
              fontWeight: 500,
              fontFamily: 'var(--font-mono)',
              color: correctCount > 0 ? 'var(--good)' : 'var(--ink)',
              whiteSpace: 'nowrap',
            }}
          >
            {correctCount} / {total} · {scorePercent}%
          </span>
        </div>
      </div>
    </div>
  )
}
