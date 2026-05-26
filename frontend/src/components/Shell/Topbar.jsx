import { useLocation } from 'react-router-dom'
import { Icon } from '../Icons'

const TITLES = {
  '/': 'Library',
  '/test': 'Practice Test',
  '/settings': 'Settings',
}

export default function Topbar() {
  const { pathname } = useLocation()
  const title = TITLES[pathname] ?? 'Praxis'

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px',
      height: 56,
      borderBottom: '1px solid var(--hairline)',
      flexShrink: 0,
    }}>
      <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink-2)' }}>{title}</span>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button style={{
          width: 30,
          height: 30,
          borderRadius: 'var(--r-md)',
          border: '1px solid var(--hairline)',
          background: 'transparent',
          color: 'var(--muted)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Icon.Bell size={15} strokeWidth={1.6} />
        </button>

        <div style={{
          width: 30,
          height: 30,
          borderRadius: '50%',
          background: 'var(--accent-soft)',
          border: '1px solid var(--accent)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 12,
          fontWeight: 600,
          color: 'var(--accent)',
        }}>
          B
        </div>
      </div>
    </header>
  )
}
