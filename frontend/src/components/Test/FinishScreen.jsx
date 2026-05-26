import { useNavigate } from 'react-router-dom'

export default function FinishScreen({ questions, answers, resetTest }) {
  const navigate = useNavigate()

  const correct = questions.filter(q => answers[q.id] === q.correctIndex).length
  const incorrect = questions.filter(
    q => answers[q.id] !== undefined && answers[q.id] !== q.correctIndex
  ).length
  const skipped = questions.length - correct - incorrect
  const score = questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0

  const stats = [
    { key: 'Correct', value: correct, color: 'var(--good)' },
    { key: 'Incorrect', value: incorrect, color: 'var(--danger)' },
    { key: 'Skipped', value: skipped, color: 'var(--muted)' },
  ]

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 40px',
        minHeight: '100%',
      }}
    >
      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--hairline)',
          borderRadius: 'var(--r-lg)',
          padding: '48px 56px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 24,
          maxWidth: 520,
          width: '100%',
        }}
      >
        {/* Score */}
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 80,
            fontWeight: 400,
            letterSpacing: '-0.04em',
            color: 'var(--accent)',
            textShadow: '0 0 40px var(--accent-glow)',
            lineHeight: 1,
          }}
        >
          {score}%
        </div>

        {/* Title */}
        <h2
          style={{
            fontSize: 28,
            fontWeight: 500,
            letterSpacing: '-0.02em',
            margin: 0,
            color: 'var(--ink)',
          }}
        >
          Session complete
        </h2>

        {/* Description */}
        <p
          style={{
            fontSize: 14,
            color: 'var(--ink-2)',
            maxWidth: 460,
            lineHeight: 1.6,
            textAlign: 'center',
            margin: 0,
          }}
        >
          You answered {correct} out of {questions.length} questions correctly.
        </p>

        {/* Stat grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 14,
            width: '100%',
          }}
        >
          {stats.map(stat => (
            <div
              key={stat.key}
              style={{
                background: 'var(--bg-2)',
                border: '1px solid var(--hairline)',
                borderRadius: 'var(--r-md)',
                padding: 14,
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 9.5,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: 'var(--muted)',
                }}
              >
                {stat.key}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 22,
                  color: stat.color,
                }}
              >
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* Action row */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => navigate('/test')}
            style={{
              padding: '9px 20px',
              border: '1px solid var(--hairline-strong)',
              borderRadius: 'var(--r-md)',
              background: 'transparent',
              color: 'var(--ink-2)',
              fontSize: 13.5,
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Review Answers
          </button>
          <button
            onClick={() => { resetTest(); navigate('/') }}
            style={{
              padding: '9px 20px',
              border: 'none',
              borderRadius: 'var(--r-md)',
              background: 'var(--accent)',
              color: 'var(--accent-ink)',
              fontSize: 13.5,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            New Session →
          </button>
        </div>
      </div>
    </div>
  )
}
