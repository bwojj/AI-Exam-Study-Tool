import { Icon } from '../Icons'
import ChoiceButton from './ChoiceButton'
import MarkdownContent from './MarkdownContent'

export default function QuestionCard({
  q,
  selectedIndex,
  onSelect,
  submitted,
  answers,
  onPrev,
  onNext,
  current,
  total,
}) {
  const userPick = answers[q.id] ?? null

  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--hairline)',
        borderRadius: 'var(--r-lg)',
        padding: 32,
      }}
    >
      {/* Eyebrow */}
      <div
        style={{
          fontSize: 13,
          fontWeight: 500,
          color: 'var(--accent)',
          marginBottom: 12,
        }}
      >
        Question {q.id} &middot; {q.topic}
      </div>

      {/* Title */}
      <h2
        style={{
          fontSize: 28,
          fontWeight: 600,
          letterSpacing: '-0.025em',
          lineHeight: 1.18,
          color: 'var(--ink)',
          margin: '0 0 16px',
          textWrap: 'balance',
        }}
      >
        <MarkdownContent content={q.question} isMarkdown={q.containsMarkdown} />
      </h2>

      {/* Body */}
      {q.body && (
        <p
          style={{
            fontSize: 15,
            color: 'var(--ink-2)',
            lineHeight: 1.65,
            margin: '0 0 20px',
          }}
        >
          <MarkdownContent content={q.body} isMarkdown={q.containsMarkdown} />
        </p>
      )}

      {/* Code block */}
      {q.code && (
        <pre
          style={{
            background: 'var(--bg)',
            border: '1px solid var(--hairline)',
            borderRadius: 'var(--r-md)',
            padding: 18,
            fontFamily: 'var(--font-mono)',
            fontSize: 13,
            color: 'var(--ink-2)',
            overflowX: 'auto',
            whiteSpace: 'pre-wrap',
            marginBottom: 20,
          }}
        >
          {q.code}
        </pre>
      )}

      {/* Choices grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 14,
          marginBottom: 20,
        }}
      >
        {q.choices.map((choice, index) => {
          let state = 'default'
          if (submitted) {
            if (index === q.correctIndex) state = 'correct'
            else if (index === userPick && userPick !== q.correctIndex) state = 'incorrect'
          } else if (index === selectedIndex) {
            state = 'selected'
          }
          return (
            <ChoiceButton
              key={index}
              letter={['A', 'B', 'C', 'D'][index]}
              text={choice}
              state={state}
              disabled={submitted}
              onClick={() => onSelect(index)}
              containsMarkdown={q.containsMarkdown}
            />
          )
        })}
      </div>

      {/* Explanation card */}
      {submitted && (
        <div
          style={{
            marginTop: 4,
            padding: '20px 22px',
            borderRadius: 'var(--r-md)',
            background: 'var(--bg-2)',
            border: '1px solid var(--hairline)',
          }}
        >
          {/* Header row */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 10,
            }}
          >
            {/* Left: icon + label */}
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <Icon.Sparkles size={14} color="var(--accent)" />
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>
                Explanation
              </span>
            </div>

            {/* Right: verdict pill */}
            {userPick === q.correctIndex ? (
              <span
                style={{
                  padding: '3px 10px',
                  borderRadius: 99,
                  fontSize: 12,
                  fontWeight: 600,
                  background: 'oklch(78% 0.13 155 / 0.12)',
                  color: 'var(--good)',
                }}
              >
                Correct ✓
              </span>
            ) : (
              <span
                style={{
                  padding: '3px 10px',
                  borderRadius: 99,
                  fontSize: 12,
                  fontWeight: 600,
                  background: 'oklch(72% 0.16 25 / 0.10)',
                  color: 'var(--danger)',
                }}
              >
                Incorrect ✗
              </span>
            )}
          </div>

          {/* Body */}
          <div style={{ fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.6 }}>
            <MarkdownContent content={q.explanation} isMarkdown={q.containsMarkdown} />
          </div>
        </div>
      )}

      {/* Question footer: prev/next nav */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 8,
          marginTop: 16,
        }}
      >
        <button
          onClick={onPrev}
          disabled={current === 0}
          style={{
            width: 32,
            height: 32,
            border: '1px solid var(--hairline-strong)',
            background: 'var(--bg-2)',
            borderRadius: 'var(--r-md)',
            color: 'var(--muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: current === 0 ? 0.4 : 1,
            cursor: current === 0 ? 'not-allowed' : 'pointer',
          }}
        >
          <Icon.ArrowLeft size={14} />
        </button>
        <button
          onClick={onNext}
          style={{
            width: 32,
            height: 32,
            border: '1px solid var(--hairline-strong)',
            background: 'var(--bg-2)',
            borderRadius: 'var(--r-md)',
            color: 'var(--muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <Icon.ArrowRight size={14} />
        </button>
      </div>
    </div>
  )
}
