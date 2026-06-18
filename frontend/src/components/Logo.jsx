import { useId } from 'react'

export default function Logo({ variant = 'primary', showWordmark = true, size = 36 }) {
  const uid = useId().replace(/:/g, '')
  const gradId = `pxg-${uid}`

  const nameSize = Math.round(size * 0.52)
  const tagSize = Math.round(size * 0.19)
  const tagMt = Math.round(size * 0.12)

  const ink = variant === 'mono' ? 'currentColor' : 'var(--accent-ink)'
  const gradRef = `url(#${gradId})`

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 96 96"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
      >
        {variant !== 'mono' && (
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="96" y2="96" gradientUnits="userSpaceOnUse">
              <stop style={{ stopColor: 'var(--accent)' }} />
              <stop offset="1" style={{ stopColor: 'var(--accent-2)' }} />
            </linearGradient>
          </defs>
        )}

        {variant === 'primary' && (
          <rect x="2" y="2" width="92" height="92" rx="24" fill={gradRef} />
        )}
        {variant === 'line' && (
          <rect x="2" y="2" width="92" height="92" rx="24"
            fill="var(--surface)" stroke="var(--hairline-strong)" strokeWidth="1.5" />
        )}

        <polyline
          points="26,66 42,50 60,56 72,30"
          stroke={variant === 'line' ? gradRef : ink}
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.85"
        />

        {[{ cx: 26, cy: 66 }, { cx: 42, cy: 50 }, { cx: 60, cy: 56 }].map(({ cx, cy }) => (
          <circle
            key={`${cx}-${cy}`}
            cx={cx}
            cy={cy}
            r="5.5"
            fill={variant === 'primary' ? gradRef : variant === 'line' ? 'var(--surface)' : 'none'}
            stroke={variant === 'line' ? gradRef : ink}
            strokeWidth="4"
          />
        ))}

        <circle
          cx="72"
          cy="30"
          r="8"
          fill={variant === 'line' ? gradRef : ink}
        />
      </svg>

      {showWordmark && (
        <div>
          <div style={{
            fontFamily: 'var(--font-sans)',
            fontWeight: 600,
            fontSize: nameSize,
            letterSpacing: '-0.03em',
            color: 'var(--ink)',
            lineHeight: 1,
          }}>
            Praxis
          </div>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: tagSize,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'var(--muted)',
            marginTop: tagMt,
            lineHeight: 1,
          }}>
            Exam Engine
          </div>
        </div>
      )}
    </div>
  )
}
