import { useState } from 'react'
import MarkdownContent from './MarkdownContent'

const stateStyles = {
  default: {
    bg: 'var(--bg-2)',
    border: 'var(--hairline)',
    badgeBg: 'var(--bg)',
    badgeColor: 'var(--muted)',
    textColor: 'var(--ink-2)',
    shadow: 'none',
  },
  selected: {
    bg: 'var(--accent-soft)',
    border: 'var(--accent)',
    badgeBg: 'var(--accent)',
    badgeColor: 'var(--accent-ink)',
    textColor: 'var(--ink)',
    shadow: '0 0 0 1px var(--accent) inset, 0 8px 24px oklch(80% 0.115 200 / 0.08)',
  },
  correct: {
    bg: 'oklch(78% 0.13 155 / 0.08)',
    border: 'var(--good)',
    badgeBg: 'var(--good)',
    badgeColor: 'oklch(17% 0.012 240)',
    textColor: 'var(--ink)',
    shadow: 'none',
  },
  incorrect: {
    bg: 'oklch(72% 0.16 25 / 0.08)',
    border: 'var(--danger)',
    badgeBg: 'var(--danger)',
    badgeColor: 'oklch(96% 0.005 240)',
    textColor: 'var(--ink)',
    shadow: 'none',
  },
}

export default function ChoiceButton({ letter, text, state, disabled, onClick, containsMarkdown }) {
  const [hovered, setHovered] = useState(false)
  const styles = stateStyles[state] ?? stateStyles.default

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        padding: '14px 16px',
        borderRadius: 'var(--r-md)',
        border: `1px solid ${styles.border}`,
        background: hovered && state === 'default' && !disabled ? 'var(--surface)' : styles.bg,
        boxShadow: styles.shadow,
        color: styles.textColor,
        fontSize: 14,
        textAlign: 'left',
        width: '100%',
        cursor: disabled ? 'default' : 'pointer',
        transition: 'background 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease',
      }}
    >
      <span
        style={{
          width: 28,
          height: 28,
          borderRadius: 'var(--r-sm)',
          background: styles.badgeBg,
          color: styles.badgeColor,
          fontFamily: 'var(--font-mono)',
          fontSize: 12,
          fontWeight: 600,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          border: state === 'default' ? '1px solid var(--hairline-strong)' : 'none',
        }}
      >
        {letter}
      </span>
      <span style={{ lineHeight: 1.5, paddingTop: 4 }}>
        <MarkdownContent content={text} isMarkdown={containsMarkdown} />
      </span>
    </button>
  )
}
