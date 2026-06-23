export default function Pager({ questions, current, setCurrent, answers, flags, corrects }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <span style={{ fontSize: 12, color: 'var(--muted)' }}>Questions</span>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {questions.map((q, i) => {
          const isCurrent = i === current
          const isAnswered = answers[q.id] !== undefined
          const isFlagged = !!flags[q.id]
          const hasResult = q.id in (corrects ?? {})
          const isCorrect = hasResult ? corrects[q.id] : null

          let borderColor, bgColor, textColor
          if (isCurrent) {
            borderColor = isCorrect === true ? 'var(--good)' : isCorrect === false ? 'var(--danger)' : 'var(--accent)'
            bgColor = isCorrect === true ? 'var(--good)' : isCorrect === false ? 'var(--danger)' : 'var(--accent)'
            textColor = 'var(--accent-ink)'
          } else if (isCorrect === true) {
            borderColor = 'var(--good)'
            bgColor = 'oklch(78% 0.13 155 / 0.12)'
            textColor = 'var(--good)'
          } else if (isCorrect === false) {
            borderColor = 'var(--danger)'
            bgColor = 'oklch(72% 0.16 25 / 0.10)'
            textColor = 'var(--danger)'
          } else if (isAnswered) {
            borderColor = 'var(--accent)'
            bgColor = 'var(--bg)'
            textColor = 'var(--accent)'
          } else {
            borderColor = 'var(--hairline)'
            bgColor = 'var(--bg)'
            textColor = 'var(--muted)'
          }

          return (
            <button
              key={q.id}
              onClick={() => setCurrent(i)}
              style={{
                position: 'relative',
                width: 30,
                height: 30,
                borderRadius: 'var(--r-sm)',
                border: `1px solid ${borderColor}`,
                background: bgColor,
                color: textColor,
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
