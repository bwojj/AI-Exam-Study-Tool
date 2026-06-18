import { createPortal } from 'react-dom'
import Logo from './Logo'

const STYLES = `
@keyframes px-spin {
  to { transform: rotate(360deg); }
}
@keyframes px-fade-up {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
.px-loading-inner { animation: px-fade-up .35s cubic-bezier(.3,.7,.4,1) both; }
.px-spinner       { animation: px-spin 1.1s linear infinite; }
`

export default function LoadingScreen({ message = 'Generating your exam…' }) {
  return createPortal(
    <>
      <style>{STYLES}</style>
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: 'var(--bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div className="px-loading-inner" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 28,
        }}>
          {/* Spinner ring with logo mark centred inside */}
          <div style={{ position: 'relative', width: 72, height: 72 }}>
            <svg
              className="px-spinner"
              width="72"
              height="72"
              viewBox="0 0 72 72"
              fill="none"
              style={{ position: 'absolute', inset: 0 }}
            >
              <circle cx="36" cy="36" r="32" stroke="var(--hairline)" strokeWidth="3" />
              <circle
                cx="36" cy="36" r="32"
                stroke="var(--accent)"
                strokeWidth="3"
                strokeDasharray="50 152"
                strokeLinecap="round"
              />
            </svg>
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Logo variant="primary" showWordmark={false} size={40} />
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: 17,
              fontWeight: 600,
              letterSpacing: '-0.02em',
              color: 'var(--ink)',
            }}>
              {message}
            </div>
            <div style={{
              fontSize: 13,
              color: 'var(--muted)',
              marginTop: 7,
              lineHeight: 1.5,
            }}>
              Reading your materials and synthesizing questions…
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body
  )
}
