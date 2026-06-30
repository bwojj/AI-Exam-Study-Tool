import { useRef, useEffect } from 'react'
import 'mathlive'

export default function MathInput({ value, onChange, disabled, placeholder, minHeight = 120 }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.value = value ?? ''
    // MathLive treats placeholder as LaTeX; wrap in \text{} to preserve spaces
    if (placeholder) el.placeholder = `\\text{${placeholder}}`
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // intentionally only on mount — avoids clobbering cursor position on re-renders

  useEffect(() => {
    const el = ref.current
    if (el) el.disabled = disabled
  }, [disabled])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const handle = () => onChange(el.value)
    el.addEventListener('input', handle)
    return () => el.removeEventListener('input', handle)
  }, [onChange])

  return (
    <math-field
      ref={ref}
      default-mode="math"
      style={{
        width: '100%',
        minHeight,
        padding: '12px 14px',
        border: '1px solid var(--hairline-strong)',
        borderRadius: 'var(--r-md)',
        background: 'var(--bg-2)',
        color: 'var(--ink)',
        fontSize: 14,
        lineHeight: 1.6,
        display: 'block',
        boxSizing: 'border-box',
        marginBottom: 20,
        outline: 'none',
        opacity: disabled ? 0.8 : 1,
      }}
    />
  )
}
