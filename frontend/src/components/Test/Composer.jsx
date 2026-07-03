import { Icon } from '../Icons'

export default function Composer({ submitted, onSubmit, onNext, canSubmit, isLastQuestion, checkingAnswer }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'auto 1fr auto auto',
        gap: 10,
        alignItems: 'stretch',
        padding: '10px 10px 10px 14px',
        background: 'var(--bg-2)',
        border: '1px solid var(--hairline)',
        borderRadius: 'var(--r-lg)',
      }}
    >
      {/* 1. Prefix */}
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          color: 'var(--accent)',
          fontSize: 14,
          fontWeight: 500,
          paddingRight: 4,
        }}
      >
        &gt;
      </span>

      {/* 2. Prompt text */}
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          fontSize: 14,
          color: 'var(--muted)',
          width: '100%',
        }}
      >
        {submitted ? '' : 'Select an answer above, then submit…'}
      </span>

      {/* 3. Submit / Next button */}
      {!submitted ? (
        <button
          onClick={onSubmit}
          disabled={!canSubmit || checkingAnswer}
          style={{
            padding: '7px 16px',
            borderRadius: 'var(--r-md)',
            border: 'none',
            background: canSubmit && !checkingAnswer ? 'var(--accent)' : 'var(--hairline)',
            color: canSubmit && !checkingAnswer ? 'var(--accent-ink)' : 'var(--muted)',
            fontSize: 13,
            fontWeight: 600,
            cursor: canSubmit && !checkingAnswer ? 'pointer' : 'not-allowed',
            whiteSpace: 'nowrap',
          }}
        >
          {checkingAnswer ? 'Checking…' : 'Submit Answer'}
        </button>
      ) : (
        <button
          onClick={onNext}
          style={{
            padding: '7px 16px',
            borderRadius: 'var(--r-md)',
            border: 'none',
            background: 'var(--accent)',
            color: 'var(--accent-ink)',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          {isLastQuestion ? 'Finish' : 'Next →'}
        </button>
      )}

      {/* 4. Skip button */}
      <button
        onClick={onNext}
        disabled={submitted}
        style={{
          width: 36,
          borderRadius: 'var(--r-md)',
          border: '1px solid var(--hairline-strong)',
          background: 'transparent',
          color: 'var(--muted)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: submitted ? 'not-allowed' : 'pointer',
          opacity: submitted ? 0.4 : 1,
        }}
      >
        <Icon.ArrowRight size={15} strokeWidth={1.6} />
      </button>
    </div>
  )
}
