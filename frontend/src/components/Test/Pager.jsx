export default function Pager({ questions, current, setCurrent, answers, flags }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <span style={{ fontSize: 12, color: 'var(--muted)' }}>Questions</span>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {questions.map((q, i) => {
          const isCurrent = i === current
          const isAnswered = answers[q.id] !== undefined
          const isFlagged = !!flags[q.id]
          return (
            <button
              key={q.id}
              onClick={() => setCurrent(i)}
              style={{
                position: 'relative',
                width: 30,
                height: 30,
                borderRadius: 'var(--r-sm)',
                border: isCurrent
                  ? '1px solid var(--accent)'
                  : isAnswered
                  ? '1px solid var(--accent)'
                  : '1px solid var(--hairline)',
                background: isCurrent ? 'var(--accent)' : 'var(--bg)',
                color: isCurrent
                  ? 'var(--accent-ink)'
                  : isAnswered
                  ? 'var(--accent)'
                  : 'var(--muted)',
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                fontWeight: isCurrent ? 600 : 400,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {i + 1}
              {isFlagged && (
                <span
                  style={{
                    position: 'absolute',
                    top: -2,
                    right: -2,
                    width: 5,
                    height: 5,
                    borderRadius: '50%',
                    background: 'var(--warn)',
                  }}
                />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
