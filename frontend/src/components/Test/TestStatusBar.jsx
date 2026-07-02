export default function TestStatusBar({ q, current, total, answers, correctCount }) {
  const answered = Object.keys(answers).length
  const scorePercent = total > 0 ? Math.round((correctCount / total) * 100) : 0

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

        {/* Divider */}
        <div style={{ width: 1, background: 'var(--hairline)', margin: '0 4px' }} />

        {/* Group 4: Score */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            padding: '0 20px',
          }}
        >
          <span style={{ fontSize: 11.5, color: 'var(--muted)', whiteSpace: 'nowrap' }}>
            Score
          </span>
          <span
            style={{
              fontSize: 14,
              fontWeight: 500,
              fontFamily: 'var(--font-mono)',
              color: correctCount > 0 ? 'var(--good)' : 'var(--ink)',
            }}
          >
            {correctCount} / {total} · {scorePercent}%
          </span>
        </div>
      </div>

    </div>
  )
}
